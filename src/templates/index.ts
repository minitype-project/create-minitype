/**
 * Copyright (c) 2026 Yuto Wada.
 * Released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createPlaceholderPng } from "../utils.js";

// テンプレートの内容は ./files 配下に配置される
const FILES_DIR = fileURLToPath(new URL("./files", import.meta.url));

// ------
// 型定義
// ------
/**
 * テンプレート．
 */
export interface Template {
  /** テンプレートの ID．組込みの場合はキー名，外部の場合は URL． */
  id: string;
  displayName: string;
  description: string;
  /**
   * 使用する組込みオプションのリスト．
   * フレームワークが CLI フラグと対話プロンプトを自動的に提供する．
   */
  builtinOptions?: ReadonlyArray<keyof TemplateBuiltInOptions>;
  /** 組込みオプションでは賄えない，テンプレート固有の追加プロンプト定義． */
  prompts?: TemplatePrompt[];
  files: (
    vars: TemplateVars,
    options?: TemplateOptions,
  ) =>
    | Record<string, string | Buffer>
    | Promise<Record<string, string | Buffer>>;
}

/**
 * カスタムテンプレートの定義．
 * {@link Template} から `id` を除いたもので，`template.ts` のデフォルトエクスポートに使用する．
 */
export type CustomTemplate = Omit<Template, "id">;

/**
 * テンプレートの変数．
 */
export interface TemplateVars {
  projectName: string;
  minitypePath: string;
  minitypeVitePluginPath: string;
}

/**
 * フレームワークが提供する組込みオプション．
 */
export interface TemplateBuiltInOptions {
  /** Markdown から文章を生成するか（report テンプレートのみ）． */
  markdown?: boolean;
  /** YAML から文章を生成するか（cv・invoice テンプレートのみ）． */
  yaml?: boolean;
}

/**
 * 組込みオプションとテンプレート固有のオプションを統合したオプション．
 */
export type TemplateOptions = TemplateBuiltInOptions & Record<string, unknown>;

/**
 * オプションに対するプロンプト（質問文）．
 */
export type TemplatePrompt =
  | {
      /** プロンプトの識別子．{@link TemplateOptions} のキーとして使用される． */
      id: string;
      /** ユーザに表示するメッセージ． */
      message: string;
      /** プロンプトの種類． */
      type: "confirm";
      /** デフォルト値． @default false */
      initial?: boolean;
    }
  | {
      /** プロンプトの識別子．{@link TemplateOptions} のキーとして使用される． */
      id: string;
      /** ユーザに表示するメッセージ． */
      message: string;
      /** プロンプトの種類． */
      type: "select";
      /** 選択肢のリスト． */
      choices: { name: string; message: string }[];
      /**
       * デフォルト値．
       * @default 最初の選択肢の {@link id}
       */
      initial?: string;
    };

// ------
// ユーティリティ関数
// ------
/**
 * ファイルを読み込んで変数で置換した文字列を返す．
 * @param relativePath ファイルの相対パス．
 * @param vars テンプレートの変数．
 * @returns 読み込まれたファイルの内容を示す文字列．
 */
const renderFile = (relativePath: string, vars: TemplateVars): string => {
  const template = readFileSync(path.join(FILES_DIR, relativePath), "utf-8");
  return template.replace(
    /\{\{(\w+)\}\}/g,
    (_, key) => vars[key as keyof TemplateVars] ?? `{{${key}}}`,
  );
};

/**
 * 共通ファイルを読み込む．
 * @param vars テンプレートの変数．
 * @param templateName テンプレートの名前．
 * @returns 共通ファイルのオブジェクト．
 */
const commonFiles = (
  vars: TemplateVars,
  templateName: string,
): Record<string, string> => {
  const renderVars = {
    projectName: vars.projectName,
    minitypePath: vars.minitypePath,
    minitypeVitePluginPath: vars.minitypeVitePluginPath,
    templateName,
  };
  const filenames = [
    ".gitignore",
    "README.md",
    "package.json",
    "tsconfig.json",
    "vite.config.ts",
  ];
  const objs: Record<string, string> = {};
  for (const filename of filenames) {
    objs[filename] = renderFile(`common/${filename}`, renderVars);
  }
  return objs;
};

// ------
// テンプレート
// ------
const report: Template = {
  id: "report",
  displayName: "レポート",
  description: "一般的なレポート，報告書（A4，横組）",
  builtinOptions: ["markdown"],
  files: async (vars, options) => {
    if (options?.markdown) {
      return {
        ...commonFiles(vars, "report"),
        "package.json": renderFile("common/package-yaml.json", vars),
        "src/index.ts": renderFile("report/index.ts", vars),
        "src/document.ts": renderFile("report/document-markdown.ts", vars),
        "src/document.md": renderFile("report/document.md", vars),
        "src/sample.png": await createPlaceholderPng(400, 300),
      };
    }
    return {
      ...commonFiles(vars, "report"),
      "src/index.ts": renderFile("report/index.ts", vars),
      "src/document.ts": renderFile("report/document.ts", vars),
    };
  },
};

const technicalBook: Template = {
  id: "technical-book",
  displayName: "技術書",
  description: "技術書，マニュアル（B5，横組）",
  files: async (vars) => ({
    ...commonFiles(vars, "technical-book"),
    "src/index.ts": renderFile("technical-book/index.ts", vars),
    "src/document.ts": renderFile("technical-book/document.ts", vars),
    "src/utils.ts": renderFile("technical-book/utils.ts", vars),
    "src/example.png": await createPlaceholderPng(400, 250),
  }),
};

const conferencePaper: Template = {
  id: "conference-paper",
  displayName: "会議論文",
  description: "会議論文（B5，2段組）",
  files: async (vars) => ({
    ...commonFiles(vars, "conference-paper"),
    "src/index.ts": renderFile("conference-paper/index.ts", vars),
    "src/document.ts": renderFile("conference-paper/document.ts", vars),
    "src/refs.ts": renderFile("conference-paper/refs.ts", vars),
    "src/helper.ts": renderFile("conference-paper/helper.ts", vars),
    "src/result.png": await createPlaceholderPng(400, 250),
  }),
};

const thesis: Template = {
  id: "thesis",
  displayName: "学位論文",
  description: "学位論文（A4, 横組）",
  files: async (vars) => ({
    ...commonFiles(vars, "thesis"),
    "src/index.ts": renderFile("thesis/index.ts", vars),
    "src/document.ts": renderFile("thesis/document.ts", vars),
    "src/utils.ts": renderFile("thesis/utils.ts", vars),
    "src/refs.ts": renderFile("thesis/refs.ts", vars),
    "src/result.png": await createPlaceholderPng(400, 250),
  }),
};

const invoice: Template = {
  id: "invoice",
  displayName: "請求書",
  description: "請求書（A4, 横組）です．",
  files: (vars) => {
    return {
      ...commonFiles(vars, "invoice"),
      "package.json": renderFile("common/package-yaml.json", vars),
      "src/index.ts": renderFile("invoice/index.ts", vars),
      "src/document.ts": renderFile("invoice/document.ts", vars),
      "src/document.yaml": renderFile("invoice/document.yaml", vars),
    };
  },
};

const cv: Template = {
  id: "cv",
  displayName: "履歴書",
  description: "履歴書（A4, 横組）です．",
  files: async (vars) => {
    return {
      ...commonFiles(vars, "cv"),
      "package.json": renderFile("common/package-yaml.json", vars),
      "src/index.ts": renderFile("cv/index.ts", vars),
      "src/document.ts": renderFile("cv/document.ts", vars),
      "src/document.yaml": renderFile("cv/document.yaml", vars),
      "src/photo.png": await createPlaceholderPng(300, 400),
    };
  },
};

const slide: Template = {
  id: "slide",
  displayName: "スライド",
  description: "プレゼンテーション用スライド（16:9, 横組）です．",
  files: async (vars) => {
    return {
      ...commonFiles(vars, "slide"),
      "src/index.ts": renderFile("slide/index.ts", vars),
      "src/document.ts": renderFile("slide/document.ts", vars),
      "src/helper.ts": renderFile("slide/helper.ts", vars),
      "src/sample.png": await createPlaceholderPng(400, 250),
    };
  },
};

const novel: Template = {
  id: "novel",
  displayName: "小説",
  description: "小説（縦組）です．用紙サイズを調整することができます．",
  files: (vars) => {
    return {
      ...commonFiles(vars, "novel"),
      "src/index.ts": renderFile("novel/index.ts", vars),
      "src/document.md": renderFile("novel/document.md", vars),
    };
  },
};

const businessReport: Template = {
  id: "business-report",
  displayName: "事業報告書",
  description: "事業報告書・ビジネスレポート（B5，横組）",
  builtinOptions: ["markdown"],
  files: async (vars, options) => {
    const assets = {
      "src/assets/cover.png": await createPlaceholderPng(1280, 900),
      "src/assets/sample.png": await createPlaceholderPng(800, 300),
    };
    if (options?.markdown) {
      return {
        ...commonFiles(vars, "business-report"),
        "src/index.ts": renderFile("business-report/index.ts", vars),
        "src/document.ts": renderFile(
          "business-report/document-markdown.ts",
          vars,
        ),
        "src/utils.ts": renderFile("business-report/utils.ts", vars),
        "src/document.md": renderFile("business-report/document.md", vars),
        ...assets,
      };
    }
    return {
      ...commonFiles(vars, "business-report"),
      "src/index.ts": renderFile("business-report/index.ts", vars),
      "src/document.ts": renderFile("business-report/document.ts", vars),
      "src/utils.ts": renderFile("business-report/utils.ts", vars),
      ...assets,
    };
  },
};

export const templates: Record<string, Template> = [
  report,
  technicalBook,
  conferencePaper,
  thesis,
  invoice,
  cv,
  slide,
  novel,
  businessReport,
].reduce(
  (acc, tmpl) => {
    acc[tmpl.id] = tmpl;
    return acc;
  },
  {} as Record<string, Template>,
);
