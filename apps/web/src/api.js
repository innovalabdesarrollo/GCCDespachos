const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3017";

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  if (res.status === 204) return null;

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Error de red");
  return data;
}

export function listDespachos(params = {}) {
  const q = new URLSearchParams();
  if (params.estado) q.set("estado", params.estado);
  if (params.fecha) q.set("fecha", params.fecha);
  const qs = q.toString();
  return request(`/api/despachos${qs ? `?${qs}` : ""}`);
}

export function getDespacho(id) {
  return request(`/api/despachos/${id}`);
}

export function createDespacho(body) {
  return request("/api/despachos", { method: "POST", body: JSON.stringify(body) });
}

export function updateDespacho(id, body) {
  return request(`/api/despachos/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function deleteDespacho(id) {
  return request(`/api/despachos/${id}`, { method: "DELETE" });
}
