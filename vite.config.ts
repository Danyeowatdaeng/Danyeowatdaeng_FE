import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    tanstackRouter({
      routesDirectory: "src/routes", // __root.tsx가 있는 폴더
      generatedRouteTree: "src/routeTree.gen.ts",
    }),
  ],
  server: {
    port: 3000,
  },
});
