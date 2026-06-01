import { parseArgs as nodeParseArgs } from "node:util";

export interface ParsedArgs {
  /** プロジェクト名． */
  projectName?: string;
  /** 使用するテンプレート名． */
  templateId?: string;
  /** 確認なしで実行するか． */
  yes: boolean;
  /** JSON 形式で出力するか． */
  jsonOutput: boolean;
  /** Markdown から文章を生成するか． */
  markdown: boolean | undefined;
  /** YAML から文章を生成するか． */
  yaml: boolean | undefined;
  /** 依存関係をインストールするパッケージマネージャ．`undefined` の場合はインストールを行わない． */
  packageManager: "npm" | "yarn" | undefined;
  /** ヘルプを表示するか． */
  help: boolean;
  /** 利用可能なテンプレート一覧を表示するか． */
  listTemplates: boolean;
}

export const parseArgs = (): ParsedArgs => {
  const { values, positionals } = nodeParseArgs({
    args: process.argv.slice(2),
    options: {
      template: { type: "string", short: "t" },
      yes: { type: "boolean", short: "y", default: false },
      json: { type: "boolean", short: "j" },
      markdown: { type: "boolean" },
      yaml: { type: "boolean" },
      pm: { type: "string" },
      help: { type: "boolean", short: "h" },
      "list-templates": { type: "boolean" },
    },
    allowPositionals: true,
  });

  const pm = values.pm;
  if (pm !== undefined && pm !== "npm" && pm !== "yarn") {
    console.error(`Invalid package manager: ${pm}. Use "npm" or "yarn".`);
    process.exit(1);
  }

  return {
    projectName: positionals[0],
    templateId: values.template,
    yes: values.yes ?? false,
    jsonOutput: values.json ?? false,
    markdown: values.markdown,
    yaml: values.yaml,
    packageManager: pm,
    help: values.help ?? false,
    listTemplates: values["list-templates"] ?? false,
  };
};
