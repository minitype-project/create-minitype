import minitype from "@minitype/vite-plugin";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    minitype({
      entry: "index.ts",
    }),
  ],
});
