import { chmodSync, cpSync, rmSync } from "node:fs";
import { build } from "esbuild";

rmSync("./dist", { force: true, recursive: true });

const baseSettings = {
  bundle: true,
  minify: true,
  sourcemap: true,
  target: ["es2022"],
  platform: "node" as const,
};

const importMetaUrlPolyfill =
  "const __importMetaUrl = require('url').pathToFileURL(__filename).href;";
const importMetaUrlDefine = { "import.meta.url": "__importMetaUrl" };

// CLI バイナリ
await build({
  ...baseSettings,
  // CLI はすべての依存をバンドルするが，tsx は動的 import のため外出し
  external: ["tsx"],
  entryPoints: ["./src/cli.ts"],
  format: "cjs",
  outfile: "./dist/cli.cjs",
  banner: { js: ["#!/usr/bin/env node", importMetaUrlPolyfill].join("\n") },
  define: importMetaUrlDefine,
});

// 実行可能にする
chmodSync("dist/cli.cjs", 0o755);

const libBaseSettings = {
  ...baseSettings,
  // ライブラリでは runtime deps を外出しにして node_modules から解決させる
  external: ["tsx", "sharp", "picocolors", "enquirer"],
  entryPoints: ["./src/index.ts"],
};

// ライブラリ（ESM）
await build({
  ...libBaseSettings,
  format: "esm",
  outfile: "./dist/index.js",
});

// ライブラリ（CJS）
await build({
  ...libBaseSettings,
  format: "cjs",
  outfile: "./dist/index.cjs",
  banner: { js: importMetaUrlPolyfill },
  define: importMetaUrlDefine,
});

// テンプレートファイルおよびフォントをコピー
cpSync("./src/templates/files", "./dist/files", { recursive: true });
cpSync("./fonts", "./dist/fonts", { recursive: true });
