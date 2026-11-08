/**
 * FakeDB — in-memory SQL-like adapter for Go playground exercises.
 *
 * Supports minimal SQL: CREATE TABLE, INSERT INTO, SELECT with optional WHERE.
 * Not a real SQL engine; just enough for students to practice database concepts.
 *
 * @returns {{ Exec: Function, Query: Function, Begin: Function, Close: Function }}
 */
export function createFakeDB() {
  const tables = new Map();

  function parseCreate(sql) {
    const match = sql.match(/CREATE\s+TABLE\s+(\w+)\s*\(([^)]+)\)/i);
    if (!match) return null;
    const name = match[1];
    const cols = match[2].split(',').map((c) => c.trim().split(/\s+/)[0]);
    tables.set(name, { columns: cols, rows: [] });
    return name;
  }

  function parseInsert(sql) {
    const match = sql.match(/INSERT\s+INTO\s+(\w+)\s*VALUES\s*\(([^)]+)\)/i);
    if (!match) return null;
    const name = match[1];
    const table = tables.get(name);
    if (!table) throw new Error(`Table ${name} does not exist`);
    const values = match[2].split(',').map((v) => {
      const trimmed = v.trim();
      if (/^'.*'$/.test(trimmed)) return trimmed.slice(1, -1);
      if (/^-?\d+$/.test(trimmed)) return Number(trimmed);
      return trimmed;
    });
    const row = {};
    table.columns.forEach((col, i) => {
      row[col] = values[i] ?? null;
    });
    table.rows.push(row);
    return true;
  }

  function parseSelect(sql, args) {
    const match = sql.match(/SELECT\s+\*\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+))?/i);
    if (!match) return [];
    const name = match[1];
    const table = tables.get(name);
    if (!table) return [];
    let rows = [...table.rows];
    if (match[2]) {
      const whereMatch = match[2].match(/(\w+)\s*=\s*\?/);
      if (whereMatch && args?.length > 0) {
        const col = whereMatch[1];
        const val = args[0];
        rows = rows.filter((r) => r[col] === val);
      }
    }
    return rows;
  }

  function exec(sql, args) {
    const trimmed = sql.trim();
    if (/^CREATE\s+TABLE/i.test(trimmed)) {
      parseCreate(trimmed);
      return [];
    }
    if (/^INSERT\s+INTO/i.test(trimmed)) {
      parseInsert(trimmed);
      return [];
    }
    if (/^SELECT/i.test(trimmed)) {
      return parseSelect(trimmed, args);
    }
    return [];
  }

  function query(sql, args) {
    return exec(sql, args);
  }

  function begin() {
    const txRows = [];
    return {
      Exec(sql, _args) {
        const trimmed = sql.trim();
        if (/^INSERT\s+INTO/i.test(trimmed)) {
          const match = trimmed.match(/INSERT\s+INTO\s+(\w+)\s*VALUES\s*\(([^)]+)\)/i);
          if (match) {
            const name = match[1];
            const table = tables.get(name);
            if (table) {
              const values = match[2].split(',').map((v) => {
                const t = v.trim();
                if (/^'.*'$/.test(t)) return t.slice(1, -1);
                if (/^-?\d+$/.test(t)) return Number(t);
                return t;
              });
              const row = {};
              table.columns.forEach((col, i) => {
                row[col] = values[i] ?? null;
              });
              txRows.push({ table: name, row });
            }
          }
        }
      },
      Commit() {
        for (const { table: name, row } of txRows) {
          const table = tables.get(name);
          if (table) table.rows.push(row);
        }
        txRows.length = 0;
      },
      Rollback() {
        txRows.length = 0;
      },
    };
  }

  function close() {
    // No-op for in-memory store.
  }

  return { Exec: exec, Query: query, Begin: begin, Close: close };
}