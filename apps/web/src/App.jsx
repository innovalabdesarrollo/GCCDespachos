import { useEffect, useState } from "react";
import {
  createDespacho,
  deleteDespacho,
  listDespachos,
  updateDespacho,
} from "./api.js";

const ESTADOS = [
  { value: "", label: "Todos" },
  { value: "programado", label: "Programado" },
  { value: "en_ruta", label: "En ruta" },
  { value: "entregado", label: "Entregado" },
  { value: "cancelado", label: "Cancelado" },
];

const emptyForm = {
  cliente: "",
  destino: "",
  fechaProgramada: "",
  hora: "",
  estado: "programado",
  notas: "",
};

function estadoClass(estado) {
  if (estado === "en_ruta") return "bg-amber-100 text-amber-900";
  if (estado === "entregado") return "bg-emerald-100 text-emerald-900";
  if (estado === "cancelado") return "bg-rose-100 text-rose-900";
  return "bg-slate-100 text-slate-800";
}

export default function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await listDespachos({
        estado: filtroEstado || undefined,
        fecha: filtroFecha || undefined,
      });
      setItems(data);
    } catch (err) {
      setError(err.message || "No se pudo cargar");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [filtroEstado, filtroFecha]);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
    setSelected(null);
  }

  function openEdit(item) {
    setEditingId(item.id);
    setForm({
      cliente: item.cliente,
      destino: item.destino,
      fechaProgramada: item.fechaProgramada,
      hora: item.hora || "",
      estado: item.estado,
      notas: item.notas || "",
    });
    setShowForm(true);
    setSelected(null);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editingId) {
        await updateDespacho(editingId, form);
      } else {
        await createDespacho(form);
      }
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      await load();
    } catch (err) {
      setError(err.message || "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id) {
    if (!confirm("¿Eliminar este despacho?")) return;
    setError("");
    try {
      await deleteDespacho(id);
      if (selected?.id === id) setSelected(null);
      await load();
    } catch (err) {
      setError(err.message || "No se pudo eliminar");
    }
  }

  return (
    <div className="mx-auto min-h-screen max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
      <header className="mb-6 border-b border-[var(--line)] pb-5">
        <p className="text-xs font-semibold tracking-[0.14em] text-[var(--accent)] uppercase">
          GCC
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          Programador de Despachos
        </h1>
        <p className="mt-2 max-w-xl text-sm text-[var(--muted)]">
          Organiza salidas y entregas: crea, edita y da seguimiento al estado de
          cada despacho.
        </p>
      </header>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3">
          <label className="block text-sm">
            <span className="mb-1 block text-[var(--muted)]">Estado</span>
            <select
              aria-label="Filtrar por estado"
              className="w-full rounded-md border border-[var(--line)] bg-white px-3 py-2"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              {ESTADOS.map((e) => (
                <option key={e.value || "all"} value={e.value}>
                  {e.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-[var(--muted)]">Fecha</span>
            <input
              type="date"
              aria-label="Filtrar por fecha"
              className="w-full rounded-md border border-[var(--line)] bg-white px-3 py-2"
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
            />
          </label>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-md bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          Nuevo despacho
        </button>
      </div>

      {error && (
        <p className="mb-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
          {error}
        </p>
      )}

      {showForm && (
        <section className="mb-6 rounded-lg border border-[var(--line)] bg-[var(--card)] p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-medium">
            {editingId ? "Editar despacho" : "Nuevo despacho"}
          </h2>
          <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm sm:col-span-1">
              <span className="mb-1 block text-[var(--muted)]">Cliente</span>
              <input
                required
                className="w-full rounded-md border border-[var(--line)] px-3 py-2"
                value={form.cliente}
                onChange={(e) => setForm({ ...form, cliente: e.target.value })}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-[var(--muted)]">Destino</span>
              <input
                required
                className="w-full rounded-md border border-[var(--line)] px-3 py-2"
                value={form.destino}
                onChange={(e) => setForm({ ...form, destino: e.target.value })}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-[var(--muted)]">Fecha</span>
              <input
                required
                type="date"
                className="w-full rounded-md border border-[var(--line)] px-3 py-2"
                value={form.fechaProgramada}
                onChange={(e) =>
                  setForm({ ...form, fechaProgramada: e.target.value })
                }
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-[var(--muted)]">Hora</span>
              <input
                type="time"
                className="w-full rounded-md border border-[var(--line)] px-3 py-2"
                value={form.hora}
                onChange={(e) => setForm({ ...form, hora: e.target.value })}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-[var(--muted)]">Estado</span>
              <select
                aria-label="Estado del despacho"
                className="w-full rounded-md border border-[var(--line)] px-3 py-2"
                value={form.estado}
                onChange={(e) => setForm({ ...form, estado: e.target.value })}
              >
                {ESTADOS.filter((e) => e.value).map((e) => (
                  <option key={e.value} value={e.value}>
                    {e.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="mb-1 block text-[var(--muted)]">Notas</span>
              <textarea
                rows={2}
                className="w-full rounded-md border border-[var(--line)] px-3 py-2"
                value={form.notas}
                onChange={(e) => setForm({ ...form, notas: e.target.value })}
              />
            </label>
            <div className="flex gap-2 sm:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
              >
                {saving ? "Guardando…" : "Guardar"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-md border border-[var(--line)] bg-white px-4 py-2 text-sm"
              >
                Cancelar
              </button>
            </div>
          </form>
        </section>
      )}

      {selected && (
        <section className="mb-6 rounded-lg border border-[var(--line)] bg-[var(--accent-soft)] p-4">
          <div className="mb-2 flex items-start justify-between gap-3">
            <h2 className="text-lg font-medium">{selected.folio}</h2>
            <button
              type="button"
              className="text-sm text-[var(--muted)] underline"
              onClick={() => setSelected(null)}
            >
              Cerrar
            </button>
          </div>
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-[var(--muted)]">Cliente</dt>
              <dd>{selected.cliente}</dd>
            </div>
            <div>
              <dt className="text-[var(--muted)]">Destino</dt>
              <dd>{selected.destino}</dd>
            </div>
            <div>
              <dt className="text-[var(--muted)]">Fecha</dt>
              <dd>
                {selected.fechaProgramada}
                {selected.hora ? ` · ${selected.hora}` : ""}
              </dd>
            </div>
            <div>
              <dt className="text-[var(--muted)]">Estado</dt>
              <dd>
                <span
                  className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${estadoClass(selected.estado)}`}
                >
                  {selected.estado}
                </span>
              </dd>
            </div>
            {selected.notas && (
              <div className="sm:col-span-2">
                <dt className="text-[var(--muted)]">Notas</dt>
                <dd>{selected.notas}</dd>
              </div>
            )}
          </dl>
        </section>
      )}

      <section>
        <h2 className="mb-3 text-base font-medium">
          Despachos {loading ? "" : `(${items.length})`}
        </h2>
        {loading ? (
          <p className="text-sm text-[var(--muted)]">Cargando…</p>
        ) : items.length === 0 ? (
          <p className="rounded-md border border-dashed border-[var(--line)] bg-white/70 px-4 py-8 text-center text-sm text-[var(--muted)]">
            No hay despachos con estos filtros. Crea el primero.
          </p>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item.id}
                className="rounded-lg border border-[var(--line)] bg-[var(--card)] p-4 shadow-sm"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    className="min-w-0 flex-1 text-left"
                    onClick={() => setSelected(item)}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{item.folio}</span>
                      <span
                        className={`rounded px-2 py-0.5 text-xs font-medium ${estadoClass(item.estado)}`}
                      >
                        {item.estado}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-sm">{item.cliente}</p>
                    <p className="truncate text-sm text-[var(--muted)]">
                      {item.destino} · {item.fechaProgramada}
                      {item.hora ? ` ${item.hora}` : ""}
                    </p>
                  </button>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(item)}
                      className="rounded-md border border-[var(--line)] px-3 py-1.5 text-sm"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(item.id)}
                      className="rounded-md border border-rose-200 px-3 py-1.5 text-sm text-rose-800"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
