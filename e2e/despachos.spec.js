import { test, expect } from "@playwright/test";

const API = process.env.VITE_API_URL || "http://127.0.0.1:3017";

test.describe.configure({ mode: "serial" });

test.beforeAll(async ({ request }) => {
  const health = await request.get(`${API}/health`);
  expect(health.ok(), "API debe estar en :3017").toBeTruthy();
});

test("carga la app y lista despachos", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/GCC \| Programador de Despachos/);
  await expect(
    page.getByRole("heading", { name: "Programador de Despachos" })
  ).toBeVisible();
  await expect(page.getByText("Cargando…")).toHaveCount(0, { timeout: 20_000 });
  await expect(
    page.getByRole("heading", { name: /^Despachos \(\d+\)$/ })
  ).toBeVisible();
});

test("crea, detalla, edita, filtra y elimina un despacho", async ({ page }) => {
  const stamp = Date.now();
  const cliente = `PW Cliente ${stamp}`;
  const destino = `PW Destino ${stamp}`;
  const fecha = "2026-11-10";

  await page.goto("/");
  await expect(page.getByText("Cargando…")).toHaveCount(0);

  await page.getByRole("button", { name: "Nuevo despacho" }).click();
  await expect(
    page.getByRole("heading", { name: "Nuevo despacho" })
  ).toBeVisible();

  const form = page.locator("form");
  await form.getByLabel("Cliente").fill(cliente);
  await form.getByLabel("Destino").fill(destino);
  await form.getByLabel("Fecha").fill(fecha);
  await form.getByLabel("Hora").fill("14:30");
  await form.getByLabel("Notas").fill("prueba playwright");
  await form.getByRole("button", { name: "Guardar" }).click();

  await expect(page.getByText(cliente)).toBeVisible({ timeout: 20_000 });
  await expect(page.getByText(destino)).toBeVisible();

  await page.getByText(cliente).click();
  await expect(page.getByRole("heading", { name: /^D-/ })).toBeVisible();
  await expect(page.getByText("prueba playwright")).toBeVisible();
  await page.getByRole("button", { name: "Cerrar" }).click();

  const row = page.locator("li").filter({ hasText: cliente });
  await row.getByRole("button", { name: "Editar" }).click();
  await expect(
    page.getByRole("heading", { name: "Editar despacho" })
  ).toBeVisible();
  await form
    .getByLabel("Estado del despacho")
    .selectOption("en_ruta");
  await form.getByRole("button", { name: "Guardar" }).click();
  await expect(row.getByText("en_ruta")).toBeVisible({ timeout: 20_000 });

  await page.getByLabel("Filtrar por estado").selectOption("en_ruta");
  await expect(page.getByText("Cargando…")).toHaveCount(0);
  await expect(page.getByText(cliente)).toBeVisible();

  await page.getByLabel("Filtrar por estado").selectOption("entregado");
  await expect(page.getByText("Cargando…")).toHaveCount(0);
  await expect(page.getByText(cliente)).toHaveCount(0);

  await page.getByLabel("Filtrar por estado").selectOption("");
  await expect(page.getByText(cliente)).toBeVisible();

  page.once("dialog", (d) => d.accept());
  await row.getByRole("button", { name: "Eliminar" }).click();
  await expect(page.getByText(cliente)).toHaveCount(0, { timeout: 20_000 });
});
