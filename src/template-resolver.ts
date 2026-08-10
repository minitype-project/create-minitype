/**
 * Copyright (c) 2026 Yuto Wada.
 * Released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

import type { Template } from "./templates/index.js";
import { templates } from "./templates/index.js";

const CACHE_DIR = path.join(os.homedir(), ".create-minitype", "git");
const GIT_URL_SCHEMES = ["https://", "http://", "git://", "ssh://"] as const;

/**
 * テンプレート ID が URL スキームを持つかどうかを判定する．
 */
const hasGitUrlScheme = (id: string): boolean => {
  return GIT_URL_SCHEMES.some((scheme) => id.startsWith(scheme));
};

/**
 * git テンプレートのキャッシュディレクトリを返す．
 */
const getGitCacheDir = (url: string): string => {
  // ファイルシステム上，安全な文字のみにする
  const escaped = url.replace(/[^a-zA-Z0-9@._-]/g, "_");
  return path.join(CACHE_DIR, escaped);
};

/**
 * git リポジトリをキャッシュディレクトリにクローンする．
 * キャッシュが既に存在する場合はスキップする．
 */
const cloneGitTemplate = (url: string, cacheDir: string): void => {
  if (fs.existsSync(cacheDir)) {
    return;
  }
  fs.mkdirSync(path.dirname(cacheDir), { recursive: true });

  const result = spawnSync("git", ["clone", "--depth", "1", url, cacheDir], {
    stdio: "inherit",
  });
  if (result.error) {
    throw new Error(
      `Failed to clone git repository: ${url}\n${result.error.message}`,
    );
  }
  if (result.status !== 0) {
    throw new Error(
      `Failed to clone git repository: ${url} (exit code: ${String(result.status)})`,
    );
  }
};

/**
 * ディレクトリからテンプレートを読み込む．
 * `template.ts` を優先し，なければ `template.js` を読み込む．
 */
const loadTemplateFromDir = async (
  dir: string,
): Promise<Omit<Template, "id">> => {
  // ------
  // ファイルの読込み
  // ------
  // template.ts の存在をチェックして，なければ template.js を読込み
  const tsPath = path.join(dir, "template.ts");
  const jsPath = path.join(dir, "template.js");

  let mod: unknown;
  if (fs.existsSync(tsPath)) {
    // tsx 経由で TypeScript ファイルを動的インポート
    const { tsImport } = await import("tsx/esm/api");
    mod = await tsImport(tsPath, import.meta.url);
  } else if (fs.existsSync(jsPath)) {
    mod = await import(pathToFileURL(jsPath).href);
  } else {
    throw new Error(
      `Template definition not found in: ${dir}\nExpected template.ts or template.js`,
    );
  }

  // ------
  // CJS/ESM interop の解決
  // ------
  // tsx が CJS 形式にコンパイルした場合，mod.default が
  // { __esModule: true, default: Template } の二重ネスト構造になる
  const modDefault =
    mod !== null && typeof mod === "object" && "default" in mod
      ? (mod as Record<string, unknown>).default
      : undefined;
  const raw =
    modDefault !== null &&
    typeof modDefault === "object" &&
    "__esModule" in modDefault &&
    (modDefault as Record<string, unknown>).__esModule === true &&
    "default" in modDefault
      ? (modDefault as Record<string, unknown>).default
      : modDefault;

  // --------
  // バリデーション
  // --------
  // Template 型の必須フィールドが揃っているかチェック
  const template = raw as Omit<Template, "id"> | null | undefined;
  if (
    !template ||
    typeof template.displayName !== "string" ||
    typeof template.description !== "string" ||
    typeof template.files !== "function"
  ) {
    throw new Error(
      `Invalid template: ${dir}\ntemplate.ts must default-export a Template object`,
    );
  }

  return template;
};

/**
 * テンプレート ID を解決して Template を返す．
 * 組込みテンプレート名，git URL，ローカルパスの順に判定する．
 */
export const resolveTemplate = async (id: string): Promise<Template> => {
  // 組込みテンプレート
  const builtin = templates[id];
  if (builtin) {
    return builtin;
  }

  // git URL
  if (hasGitUrlScheme(id)) {
    const cacheDir = getGitCacheDir(id);
    cloneGitTemplate(id, cacheDir);
    return { ...(await loadTemplateFromDir(cacheDir)), id };
  }

  // ローカルパス
  const dir = path.resolve(process.cwd(), id);
  if (!fs.existsSync(dir)) {
    throw new Error(`Template directory not found: ${dir}`);
  }
  return { ...(await loadTemplateFromDir(dir)), id };
};
