import { chmodSync, cpSync } from "node:fs";
import { build } from "esbuild";

const baseSettings = {
  bundle: true,
  minify: true,
  sourcemap: true,
  target: ["es2022"],
  platform: "node" as const,
};

// CLI バイナリ
await build({
  ...baseSettings,
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
  banner: {
    js: "const __importMetaUrl = require('url').pathToFileURL(__filename).href;",
  },
  define: { "import.meta.url": "__importMetaUrl" },
});

// テンプレートファイルおよびフォントをコピー
cpSync("./src/templates/files", "./dist/files", { recursive: true });
cpSync("./fonts", "./dist/fonts", { recursive: true });
