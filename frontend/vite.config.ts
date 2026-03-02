import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy:
      process.env.DOCKER === "true" //for docker dont need proxy
        ? undefined
        : {
            "/api": {
              target: "http://localhost:4000",
              changeOrigin: true,
            },
          },
    port: 3000,
    open: true,
  },
  build: {
    outDir: "build",
  },
});
// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
//   server: {
//     port: 3000,
//     open: true,
//   },
//   build: {
//     outDir: "build",
//   },
// });
