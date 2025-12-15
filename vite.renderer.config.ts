import { defineConfig } from "vite";

// https://vitejs.dev/config
export default defineConfig({
  build: {
    rollupOptions: {
      external: (id) =>
        id === "electron" || id.startsWith("@oxc-project/runtime"),
    },
  },
});
