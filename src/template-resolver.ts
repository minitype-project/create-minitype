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
  if (result.status !== 0) {
    throw new Error(
      `Failed to clone git repository: ${url} (exit code: ${String(result.status)})`,
    );
  }
};
};

/**
 * テンプレート ID を解決して Template を返す．
 * 組み込みテンプレート名，git URL，ローカルパスの順に判定する．
 */
export const resolveTemplate = async (id: string): Promise<Template> => {
  // 組み込みテンプレート
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
