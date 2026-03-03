import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/records": "http://localhost:8000",
      "/tags":    "http://localhost:8000",
      "/backup":  "http://localhost:8000",
      "/restore": "http://localhost:8000",
    }
  },
  build: {
    // Compila direttamente nella root del progetto
    // così server.js trova dist/ senza cp
    outDir: "../../dist",
    emptyOutDir: true
  }
});
