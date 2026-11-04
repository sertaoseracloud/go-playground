/**
 * FakeMongo — in-memory MongoDB-like adapter for Go playground exercises.
 *
 * Mirrors the official Go MongoDB driver API surface (InsertOne, Find,
 * UpdateOne, DeleteOne) closely enough that skills transfer to real code.
 *
 * @returns {{ InsertOne: Function, Find: Function, UpdateOne: Function, DeleteOne: Function }}
 */
export function createFakeMongo() {
  const collections = new Map();

  function getCollection(name) {
    if (!collections.has(name)) collections.set(name, []);
    return collections.get(name);
  }

  function matchesFilter(doc, filter) {
    for (const [key, value] of Object.entries(filter)) {
      if (doc[key] !== value) return false;
    }
    return true;
  }

  function insertOne(collection, doc) {
    const col = getCollection(collection);
    const stored = { ...doc, _id: doc._id ?? `oid_${col.length}` };
    col.push(stored);
    return { InsertedID: stored._id };
  }

  function find(collection, filter) {
    const col = getCollection(collection);
    if (!filter || Object.keys(filter).length === 0) return [...col];
    return col.filter((doc) => matchesFilter(doc, filter));
  }

  function updateOne(collection, filter, update) {
    const col = getCollection(collection);
    const idx = col.findIndex((doc) => matchesFilter(doc, filter));
    if (idx === -1) return { MatchedCount: 0, ModifiedCount: 0 };
    Object.assign(col[idx], update);
    return { MatchedCount: 1, ModifiedCount: 1 };
  }

  function deleteOne(collection, filter) {
    const col = getCollection(collection);
    const idx = col.findIndex((doc) => matchesFilter(doc, filter));
    if (idx === -1) return { DeletedCount: 0 };
    col.splice(idx, 1);
    return { DeletedCount: 1 };
  }

  return {
    InsertOne: insertOne,
    Find: find,
    UpdateOne: updateOne,
    DeleteOne: deleteOne,
  };
}