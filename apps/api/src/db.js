import { MongoClient } from "mongodb";

let client;
let db;

export async function connectDb(uri) {
  if (db) return db;
  client = new MongoClient(uri);
  await client.connect();
  db = client.db();
  await db.collection("despachos").createIndex({ fechaProgramada: 1 });
  await db.collection("despachos").createIndex({ estado: 1 });
  return db;
}

export function getDb() {
  if (!db) throw new Error("DB no conectada");
  return db;
}
