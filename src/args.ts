import { parseArgs as nodeParseArgs } from "node:util";

export interface ParsedArgs {
  /** プロジェクト名． */
  projectName?: string;
  /** 使用するテンプレート名． */
  template?: string;
  /** 確認なしで実行するか． */
  yes: boolean;
  /** JSON 形式で出力するか． */
  jsonOutput: boolean;
  /** Markdown から文章を生成するか（report テンプレートのみ）． */
  markdown: boolean | undefined;
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
      help: { type: "boolean", short: "h" },
      "list-templates": { type: "boolean" },
    },
    allowPositionals: true,
  });

  return {
    projectName: positionals[0],
    template: values.template,
    yes: values.yes ?? false,
    jsonOutput: values.json ?? false,
    markdown: values.markdown,
    help: values.help ?? false,
    listTemplates: values["list-templates"] ?? false,
  };
};
