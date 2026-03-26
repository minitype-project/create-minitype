import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createPlaceholderPng } from "../utils.js";

// テンプレートの内容は ./files 配下に配置される
const FILES_DIR = fileURLToPath(new URL("./files", import.meta.url));

/**
 * テンプレートの変数．
 */
export interface TemplateVars {
  projectName: string;
  minitypePath: string;
}

/**
 * テンプレートのオプション．
 */
export interface TemplateOptions {
  /** Markdown から文章を生成するか（report テンプレートのみ）． */
  markdown?: boolean;
  /** YAML から文章を生成するか（cv・invoice テンプレートのみ）． */
  yaml?: boolean;
}

/**
 * テンプレート．
 */
export interface Template {
  displayName: string;
  description: string;
  files: (
    vars: TemplateVars,
    options?: TemplateOptions,
  ) =>
    | Record<string, string | Buffer>
    | Promise<Record<string, string | Buffer>>;
}

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
    templateName,
  };
  const filenames = [
    ".gitignore",
    "README.md",
    "package.json",
    "tsconfig.json",
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
  displayName: "レポート",
  description: "一般的なレポート，報告書（A4，横組）",
  files: (vars, options) => {
    if (options?.markdown) {
      return {
        ...commonFiles(vars, "report"),
        "index.ts": renderFile("report/index.ts", vars),
        "document.ts": renderFile("report/document-markdown.ts", vars),
        "document.md": renderFile("report/document.md", vars),
      };
    }
    return {
      ...commonFiles(vars, "report"),
      "index.ts": renderFile("report/index.ts", vars),
      "document.ts": renderFile("report/document.ts", vars),
    };
  },
};

const technicalBook: Template = {
  displayName: "技術書",
  description: "技術書，マニュアル（B5，横組）",
  files: async (vars) => ({
    ...commonFiles(vars, "technical-book"),
    "index.ts": renderFile("technical-book/index.ts", vars),
    "document.ts": renderFile("technical-book/document.ts", vars),
    "example.png": await createPlaceholderPng(400, 250),
  }),
};

const conferencePaper: Template = {
  displayName: "会議論文",
  description: "会議論文（A4，2段組）",
  files: async (vars) => ({
    ...commonFiles(vars, "conference-paper"),
    "index.ts": renderFile("conference-paper/index.ts", vars),
    "document.ts": renderFile("conference-paper/document.ts", vars),
    "result.png": await createPlaceholderPng(400, 250),
  }),
};

const thesis: Template = {
  displayName: "学位論文",
  description: "学位論文（A4, 横組）",
  files: async (vars) => ({
    ...commonFiles(vars, "thesis"),
    "index.ts": renderFile("thesis/index.ts", vars),
    "document.ts": renderFile("thesis/document.ts", vars),
    "result.png": await createPlaceholderPng(400, 250),
  }),
};

const invoice: Template = {
  displayName: "請求書",
  description: "請求書（A4, 横組）",
  files: (vars, options) => {
    if (options?.yaml) {
      return {
        ...commonFiles(vars, "invoice"),
        "package.json": renderFile("common/package-yaml.json", vars),
        "index.ts": renderFile("invoice/index.ts", vars),
        "document.ts": renderFile("invoice/document-yaml.ts", vars),
        "document.yaml": renderFile("invoice/document.yaml", vars),
      };
    }
    return {
      ...commonFiles(vars, "invoice"),
      "index.ts": renderFile("invoice/index.ts", vars),
      "document.ts": renderFile("invoice/document.ts", vars),
    };
  },
};

const cv: Template = {
  displayName: "履歴書",
  description: "履歴書（A4, 横組）",
  files: (vars) => {
    return {
      ...commonFiles(vars, "cv"),
      "package.json": renderFile("common/package-yaml.json", vars),
      "index.ts": renderFile("cv/index.ts", vars),
      "document.ts": renderFile("cv/document.ts", vars),
      "document.yaml": renderFile("cv/document.yaml", vars),
    };
  },
};

export const templates: Record<string, Template> = {
  report,
  "technical-book": technicalBook,
  "conference-paper": conferencePaper,
  thesis,
  invoice,
  cv,
};
