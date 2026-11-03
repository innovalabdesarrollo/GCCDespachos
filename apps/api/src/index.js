import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import express from "express";
import { connectDb } from "./db.js";
import despachosRouter from "./routes/despachos.js";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
dotenv.config({ path: path.join(rootDir, ".env") });
dotenv.config({ path: path.join(rootDir, "apps/api/.env") });

const PORT = Number(process.env.PORT || 3017);
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Falta MONGODB_URI en .env (raíz del monorepo)");
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "gcc-despachos-api" });
});

app.use("/api/despachos", despachosRouter);

async function start() {
  await connectDb(MONGODB_URI);

  const server = app.listen(PORT, () => {
    console.log(`API GCC Despachos en http://localhost:${PORT}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(
        `Puerto ${PORT} en uso. No se mató ningún proceso. Cambia PORT en apps/api/.env o libera el puerto.`
      );
      process.exit(1);
    }
    throw err;
  });
}

start().catch((err) => {
  console.error("No se pudo iniciar la API:", err);
  process.exit(1);
});
