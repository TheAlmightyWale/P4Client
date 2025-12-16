import { defineConfig } from "vite";
import { resolve } from "node:path";

// https://vitejs.dev/config
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "src/render/index.html"),
      },
      external: (id) =>
        id === "electron" || id.startsWith("@oxc-project/runtime"),
    },
  },
});
