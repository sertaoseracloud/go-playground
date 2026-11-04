/**
 * FakeRedis — in-memory Redis-like adapter for Go playground exercises.
 *
 * Mirrors the official Go Redis client API surface (SET, GET, DEL, INCR,
 * EXPIRE, TTL, Keys) closely enough that skills transfer to real code.
 *
 * @returns {{ SET: Function, GET: Function, DEL: Function, INCR: Function, EXPIRE: Function, TTL: Function, Keys: Function }}
 */
export function createFakeRedis() {
  const store = new Map();
  const expiries = new Map();

  function isExpired(key) {
    const expiry = expiries.get(key);
    if (!expiry) return false;
    if (Date.now() >= expiry) {
      store.delete(key);
      expiries.delete(key);
      return true;
    }
    return false;
  }

  function set(key, value) {
    store.set(key, String(value));
  }

  function get(key) {
    if (isExpired(key)) return null;
    const val = store.get(key);
    return val === undefined ? null : val;
  }

  function del(...keys) {
    let count = 0;
    for (const key of keys) {
      if (store.delete(key)) {
        expiries.delete(key);
        count++;
      }
    }
    return count;
  }

  function incr(key) {
    if (isExpired(key)) {
      store.set(key, '1');
      return 1;
    }
    const current = store.get(key);
    const num = current === undefined ? 0 : parseInt(current, 10);
    if (isNaN(num)) throw new Error(`ERR value is not an integer or out of range`);
    const next = num + 1;
    store.set(key, String(next));
    return next;
  }

  function expire(key, seconds) {
    if (!store.has(key)) return 0;
    expiries.set(key, Date.now() + seconds * 1000);
    return 1;
  }

  function ttl(key) {
    if (!store.has(key)) return -2;
    const expiry = expiries.get(key);
    if (!expiry) return -1;
    const remaining = Math.ceil((expiry - Date.now()) / 1000);
    return remaining > 0 ? remaining : -2;
  }

  function keys(pattern) {
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*').replace(/\?/g, '.') + '$');
    const result = [];
    for (const key of store.keys()) {
      if (!isExpired(key) && regex.test(key)) {
        result.push(key);
      }
    }
    return result;
  }

  return { SET: set, GET: get, DEL: del, INCR: incr, EXPIRE: expire, TTL: ttl, Keys: keys };
}