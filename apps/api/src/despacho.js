export const ESTADOS = ["programado", "en_ruta", "entregado", "cancelado"];

export function parseBody(body = {}) {
  const cliente = String(body.cliente ?? "").trim();
  const destino = String(body.destino ?? "").trim();
  const fechaProgramada = String(body.fechaProgramada ?? "").trim();
  const hora = String(body.hora ?? "").trim();
  const estado = String(body.estado ?? "programado").trim();
  const notas = String(body.notas ?? "").trim();

  if (!cliente) return { error: "cliente es requerido" };
  if (!destino) return { error: "destino es requerido" };
  if (!fechaProgramada) return { error: "fechaProgramada es requerida" };
  if (!ESTADOS.includes(estado)) return { error: "estado inválido" };

  return {
    data: {
      cliente,
      destino,
      fechaProgramada,
      hora,
      estado,
      notas,
    },
  };
}

export function serialize(doc) {
  return {
    id: String(doc._id),
    folio: doc.folio,
    cliente: doc.cliente,
    destino: doc.destino,
    fechaProgramada: doc.fechaProgramada,
    hora: doc.hora,
    estado: doc.estado,
    notas: doc.notas,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}
