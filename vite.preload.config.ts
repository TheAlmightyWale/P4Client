import { defineConfig } from "vite";

// https://vitejs.dev/config
export default defineConfig({
  build: {
    outDir: "dist/preload",
    minify: false,
    rollupOptions: {
      external: ["electron"],
      output: {
        format: "cjs",
        entryFileNames: "[name].cjs",
        chunkFileNames: "[name]-[hash].cjs",
      },
    },
  },
});
