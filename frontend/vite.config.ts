import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 3000,
    // Allow Railway hosts for deployment
    strictPort: false,
    cors: true,
  },
  preview: {
    host: "0.0.0.0", // Changed from "::" to "0.0.0.0" for better compatibility
    port: 3000,
    // Allow Railway hosts for deployment
    strictPort: false,
    cors: true,
    // Allow the Railway domain
    allowedHosts: [
      "appliance-buddy-production.up.railway.app",
      "localhost"
    ],
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));