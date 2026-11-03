import { Router } from "express";
import { ObjectId } from "mongodb";
import { getDb } from "../db.js";
import { parseBody, serialize } from "../despacho.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.estado) filter.estado = String(req.query.estado);
    if (req.query.fecha) filter.fechaProgramada = String(req.query.fecha);

    const docs = await getDb()
      .collection("despachos")
      .find(filter)
      .sort({ fechaProgramada: 1, hora: 1 })
      .toArray();

    res.json(docs.map(serialize));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al listar despachos" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "id inválido" });
    }
    const doc = await getDb()
      .collection("despachos")
      .findOne({ _id: new ObjectId(req.params.id) });
    if (!doc) return res.status(404).json({ error: "No encontrado" });
    res.json(serialize(doc));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener despacho" });
  }
});

router.post("/", async (req, res) => {
  try {
    const parsed = parseBody(req.body);
    if (parsed.error) return res.status(400).json({ error: parsed.error });

    const now = new Date().toISOString();
    const count = await getDb().collection("despachos").countDocuments();
    const folio = `D-${String(count + 1).padStart(4, "0")}`;

    const doc = {
      folio,
      ...parsed.data,
      createdAt: now,
      updatedAt: now,
    };

    const result = await getDb().collection("despachos").insertOne(doc);
    res.status(201).json(serialize({ ...doc, _id: result.insertedId }));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear despacho" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "id inválido" });
    }
    const parsed = parseBody(req.body);
    if (parsed.error) return res.status(400).json({ error: parsed.error });

    const updatedAt = new Date().toISOString();
    const result = await getDb()
      .collection("despachos")
      .findOneAndUpdate(
        { _id: new ObjectId(req.params.id) },
        { $set: { ...parsed.data, updatedAt } },
        { returnDocument: "after" }
      );

    if (!result) return res.status(404).json({ error: "No encontrado" });
    res.json(serialize(result));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar despacho" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "id inválido" });
    }
    const result = await getDb()
      .collection("despachos")
      .deleteOne({ _id: new ObjectId(req.params.id) });
    if (!result.deletedCount) {
      return res.status(404).json({ error: "No encontrado" });
    }
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar despacho" });
  }
});

export default router;
