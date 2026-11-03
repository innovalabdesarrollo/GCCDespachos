import { describe, it } from "node:test";
import assert from "node:assert/strict";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { parseBody } from "../src/despacho.js";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
dotenv.config({ path: path.join(rootDir, ".env") });
dotenv.config({ path: path.join(rootDir, "apps/api/.env") });

const uri = process.env.MONGODB_URI;
const hasUri = Boolean(uri && !uri.includes("USER:PASS"));

describe("Atlas smoke (CRUD mínimo)", { skip: !hasUri }, () => {
  it("inserta, lee y borra un despacho de prueba", async () => {
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });
    await client.connect();
    const db = client.db();
    const col = db.collection("despachos");

    const parsed = parseBody({
      cliente: "Test Unitario",
      destino: "QA",
      fechaProgramada: "2026-11-06",
      hora: "12:00",
      estado: "programado",
      notas: "borrar-automatico",
    });
    assert.equal(parsed.error, undefined);

    const now = new Date().toISOString();
    const doc = {
      folio: `T-TEST-${Date.now()}`,
      ...parsed.data,
      createdAt: now,
      updatedAt: now,
    };

    const { insertedId } = await col.insertOne(doc);
    const found = await col.findOne({ _id: insertedId });
    assert.equal(found.cliente, "Test Unitario");

    const del = await col.deleteOne({ _id: insertedId });
    assert.equal(del.deletedCount, 1);

    await client.close();
  });
});
