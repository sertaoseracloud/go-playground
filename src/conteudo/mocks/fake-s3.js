/**
 * FakeS3 — in-memory S3-like adapter for Go playground exercises.
 *
 * Mirrors the AWS SDK v2 PutObject/GetObject/DeleteObject/ListObjects API surface
 * closely enough that skills transfer to real code.
 *
 * @returns {{ PutObject: Function, GetObject: Function, DeleteObject: Function, ListObjects: Function }}
 */
export function createFakeS3() {
  const buckets = new Map();

  function getBucket(bucket) {
    if (!buckets.has(bucket)) buckets.set(bucket, new Map());
    return buckets.get(bucket);
  }

  function putObject(bucket, key, body) {
    getBucket(bucket).set(key, { Body: body, Key: key });
  }

  function getObject(bucket, key) {
    const obj = getBucket(bucket).get(key);
    if (!obj) throw new Error(`NoSuchKey: ${key}`);
    return { ...obj };
  }

  function deleteObject(bucket, key) {
    getBucket(bucket).delete(key);
  }

  function listObjects(bucket) {
    return [...getBucket(bucket).values()].map((o) => ({ ...o }));
  }

  return {
    PutObject: putObject,
    GetObject: getObject,
    DeleteObject: deleteObject,
    ListObjects: listObjects,
  };
}