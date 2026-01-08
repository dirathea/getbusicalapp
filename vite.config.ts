import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { cloudflare } from "@cloudflare/vite-plugin";
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), cloudflare()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // Proxy /proxy requests to Cloudflare Worker running on port 8787
      '/proxy': {
        target: 'http://localhost:8787',
        changeOrigin: true,
      },
      // Health check endpoint
      '/health': {
        target: 'http://localhost:8787',
        changeOrigin: true,
      },
    },
  },
})
