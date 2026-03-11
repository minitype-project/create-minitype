import { parseArgs as nodeParseArgs } from "node:util";

export interface ParsedArgs {
  /** プロジェクト名． */
  projectName?: string;
  /** 使用するテンプレート名． */
  template?: string;
  /** 確認なしで実行するか． */
  yes: boolean;
  /** ヘルプを表示するか． */
  help: boolean;
  /** 利用可能なテンプレート一覧を表示するか． */
  listTemplates: boolean;
  /** JSON 形式で出力するか． */
  jsonOutput: boolean;
}

export const parseArgs = (): ParsedArgs => {
  const { values, positionals } = nodeParseArgs({
    args: process.argv.slice(2),
    options: {
      help: { type: "boolean", short: "h" },
      yes: { type: "boolean", short: "y" },
      template: { type: "string", short: "t" },
      "list-templates": { type: "boolean" },
      json: { type: "boolean" },
    },
    allowPositionals: true,
  });
  const jsonOutput = values.json ?? false;

  return {
    projectName: positionals[0],
    template: values.template,
    yes: (values.yes ?? false) || jsonOutput,
    help: values.help ?? false,
    listTemplates: values["list-templates"] ?? false,
    jsonOutput,
  };
};
