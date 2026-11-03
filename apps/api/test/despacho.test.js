import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { ObjectId } from "mongodb";
import { parseBody, serialize, ESTADOS } from "../src/despacho.js";

describe("parseBody", () => {
  it("acepta despacho válido y aplica default de estado", () => {
    const result = parseBody({
      cliente: "  Acme  ",
      destino: "CDMX",
      fechaProgramada: "2026-11-05",
      hora: "09:00",
      notas: "ok",
    });
    assert.equal(result.error, undefined);
    assert.deepEqual(result.data, {
      cliente: "Acme",
      destino: "CDMX",
      fechaProgramada: "2026-11-05",
      hora: "09:00",
      estado: "programado",
      notas: "ok",
    });
  });

  it("rechaza campos requeridos vacíos", () => {
    assert.equal(parseBody({}).error, "cliente es requerido");
    assert.equal(
      parseBody({ cliente: "A" }).error,
      "destino es requerido"
    );
    assert.equal(
      parseBody({ cliente: "A", destino: "B" }).error,
      "fechaProgramada es requerida"
    );
  });

  it("rechaza estado inválido", () => {
    const result = parseBody({
      cliente: "A",
      destino: "B",
      fechaProgramada: "2026-11-05",
      estado: "volando",
    });
    assert.equal(result.error, "estado inválido");
  });

  it("solo permite estados conocidos", () => {
    for (const estado of ESTADOS) {
      const result = parseBody({
        cliente: "A",
        destino: "B",
        fechaProgramada: "2026-11-05",
        estado,
      });
      assert.equal(result.data.estado, estado);
    }
  });
});

describe("serialize", () => {
  it("expone id string y campos del despacho", () => {
    const _id = new ObjectId();
    const out = serialize({
      _id,
      folio: "D-0001",
      cliente: "Acme",
      destino: "GDL",
      fechaProgramada: "2026-11-04",
      hora: "09:00",
      estado: "programado",
      notas: "",
      createdAt: "t1",
      updatedAt: "t2",
    });
    assert.equal(out.id, String(_id));
    assert.equal(out.folio, "D-0001");
    assert.equal(out.estado, "programado");
    assert.equal(out._id, undefined);
  });
});
