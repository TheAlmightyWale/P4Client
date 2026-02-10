import { defineConfig } from "vite";

// https://vitejs.dev/config
export default defineConfig({
  build: {
    sourcemap: true,
    rollupOptions: {
      external: [
        "electron",
        "@zubridge/electron",
        "@zubridge/electron/main",
        "@zubridge/types",
        "zustand",
      ],
    },
  },
});
