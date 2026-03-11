import { chmodSync, cpSync } from "node:fs";
import { build } from "esbuild";

const entry = "./src/index.ts";

const settings = {
  bundle: true,
  entryPoints: [entry],
  external: [],
  minify: true,
  sourcemap: true,
};

await build({
  ...settings,
  format: "esm",
  outfile: "./dist/index.esm.js",
  target: ["es2022"],
  platform: "node",
});

// 実行可能にする
chmodSync("dist/index.esm.js", 0o755);

// テンプレートファイルをコピー
cpSync("./src/templates/files", "./dist/files", { recursive: true });
