import { defineConfig } from "vite";

export default defineConfig({
  base: "/",
  server: { port: 8765 },
  preview: { port: 8765 },
  build: { target: "es2022" },
});
