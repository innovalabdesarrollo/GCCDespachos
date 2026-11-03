# Checklist MVP — GCC | Programador de Despachos

Marca con `[x]` lo terminado. Fuente: `gcc-programador-de-despachos-spec-mvp.md` + alcance mínimo usable acordado (el .spec es draft y no detalla pantallas/modelos).

---

## Stack (Hoja de Verdad del .spec)

- [x] Frontend React + HTML/CSS
- [x] Backend Express + Node.js
- [x] Monorepo pnpm (`apps/web` + `apps/api`)
- [x] MongoDB Atlas (DB `gcc_despachos` en la URI)
- [x] Tailwind UI responsive (prioridad móvil)
- [x] `.env` / `.env.example` con `MONGODB_URI`, `PORT`, `VITE_PORT`
- [x] Conexión Atlas verificada (`ping` OK)

---

## Características del .spec (declaradas / inferidas)

- [x] App web con título **“GCC | Programador de Despachos”**
- [x] Orientada a **programación de despachos**
- [x] Punto de trabajo para organizar **salidas / entregas / envíos**
- [x] Punto de entrada frontend (`index.html` + `App` + `main`)

---

## Funcionalidad MVP (mínimo usable — no estaba detallado en el .spec)

### Modelo `despachos`
- [x] Campos: folio, cliente, destino, fechaProgramada, hora, estado, notas, timestamps
- [x] Estados: `programado` | `en_ruta` | `entregado` | `cancelado`

### API
- [x] `GET /api/despachos` (filtros estado / fecha)
- [x] `GET /api/despachos/:id`
- [x] `POST /api/despachos`
- [x] `PUT /api/despachos/:id`
- [x] `DELETE /api/despachos/:id`
- [x] `GET /health`
- [x] Probar CRUD end-to-end contra Atlas desde la UI

### UI
- [x] Lista de despachos
- [x] Crear despacho
- [x] Editar despacho
- [x] Ver detalle
- [x] Eliminar despacho
- [x] Filtros por estado y fecha
- [x] Smoke test manual en móvil / desktop con API levantada

### Ops local
- [x] Scripts `pnpm dev` / `dev:web` / `dev:api`
- [x] Puertos fijos desde `.env` (API `3017`, web `5177`); no matar procesos ajenos
- [x] README de arranque local
- [x] Corrida conjunta web+api validada por el equipo
- [x] Un solo `.env` en la raíz (solo completar `MONGODB_URI`)

---

## Fuera de alcance (explícito / no declarado en el .spec)

No integrar en este MVP:

- [ ] Auth (Google u otro login)
- [ ] Envío de correo / notificaciones
- [ ] Gestión de pedidos como módulo aparte
- [ ] Rutas / optimización de rutas
- [ ] Vehículos y conductores como catálogos
- [ ] Destinatarios como entidad separada
- [ ] Seguimiento en tiempo real / GPS
- [ ] Reportes / dashboards analíticos
- [ ] Integraciones con otros sistemas
- [ ] Perfiles de usuario / roles / permisos
- [ ] Flujo de “confirmación” o ejecución operativa más allá de cambiar estado
- [ ] Features no mencionadas en el .spec

---

## Pendiente de confirmar con el negocio (ambiguedades del .spec)

- [ ] Qué significa exactamente “GCC”
- [ ] Quiénes son los usuarios / actores
- [ ] Si el producto solo planifica o también ejecuta/supervisa despachos
- [ ] Campos adicionales del despacho (si aplica)
- [ ] Reglas de negocio (folios, cancelaciones, etc.)

---

_Última actualización: 2 nov 2026 (CRUD e2e UI↔Atlas OK; D-0001/D-0002)_
