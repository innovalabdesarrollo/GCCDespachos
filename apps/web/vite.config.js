import path from "path";
import { fileURLToPath } from "url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, rootDir, "");
  const port = Number(env.VITE_PORT || 5177);

  return {
    envDir: rootDir,
    plugins: [react(), tailwindcss()],
    server: {
      port,
      strictPort: true,
      watch: {
        usePolling: true,
        interval: 1000,
        ignored: ["**/node_modules/**", "**/dist/**", "**/.git/**"],
      },
    },
  };
});
