import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Proxy API calls al backend in sviluppo
    proxy: {
      "/records": "http://localhost:8000",
      "/tags":    "http://localhost:8000",
      "/backup":  "http://localhost:8000",
      "/restore": "http://localhost:8000",
    }
  }
});
