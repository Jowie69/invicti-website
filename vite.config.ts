import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { sites } from "@openai/sites-vite-plugin";

export default defineConfig({
  plugins: [react(), sites()],
  resolve: {
    alias: [
      {
        find: "@designcodeio/threeui/style.css",
        replacement: fileURLToPath(new URL("./src/shaders/threeui.css", import.meta.url)),
      },
      {
        find: "@designcodeio/threeui",
        replacement: fileURLToPath(new URL("./src/threeui.ts", import.meta.url)),
      },
    ],
  },
});
