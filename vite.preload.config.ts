import { defineConfig } from "vite";

// https://vitejs.dev/config
export default defineConfig({
  build: {
    minify: false,
    rollupOptions: {
      external: [
        "electron",
        // Externalize optional logging dependencies (they'll be loaded dynamically if available)
        "@wdio/logger",
        "weald",
      ],
      output: {
        format: "cjs",
        entryFileNames: "[name].cjs",
        chunkFileNames: "[name]-[hash].cjs",
      },
    },
  },
});
