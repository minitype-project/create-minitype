import Enquirer from "enquirer";
import pc from "picocolors";

import type { ParsedArgs } from "./args.js";
import type {
  Template,
  TemplateBuiltInOptions,
  TemplateOptions,
  TemplatePrompt,
} from "./templates/index.js";
import { templates } from "./templates/index.js";

const DEFAULT_PROJECT_NAME = "my-document";

export interface UserConfig {
  projectName: string;
  template: string;
  /** テンプレートのオプション． */
  templateOptions: TemplateOptions;
  /** 依存関係をインストールするパッケージマネージャ．`undefined` の場合はインストールを行わない． */
  packageManager: "npm" | "yarn" | undefined;
}

/**
 * 組み込みオプションに対するプロンプト．
 */
const BUILTIN_OPTION_CONFIG: Record<
  keyof TemplateBuiltInOptions,
  { message: string; initial: boolean }
> = {
  markdown: { message: "Use Markdown?", initial: true },
  yaml: { message: "Use YAML?", initial: false },
};

/**
 * CLI フラグから組み込みオプション値を取り出す．
 */
const cliBuiltinOverrides = (args: ParsedArgs): Record<string, boolean> => {
  const overrides: Record<string, boolean> = {};
  if (args.markdown !== undefined) {
    overrides.markdown = args.markdown;
  }
  if (args.yaml !== undefined) {
    overrides.yaml = args.yaml;
  }
  return overrides;
};

/**
 * `builtinOptions` と `prompts` を統合したプロンプト配列を生成する．
 */
const buildAllPrompts = (template: Template): TemplatePrompt[] => {
  const builtinPrompts: TemplatePrompt[] = (template.builtinOptions ?? []).map(
    (key) => ({
      id: key,
      type: "confirm",
      ...BUILTIN_OPTION_CONFIG[key],
    }),
  );
  return [...builtinPrompts, ...(template.prompts ?? [])];
};

export const promptUser = async (args: ParsedArgs): Promise<UserConfig> => {
  // --yes
  if (args.yes) {
    const projectName = args.projectName ?? DEFAULT_PROJECT_NAME;
    const template = args.template;
    if (!template) {
      throw new Error("Template is must be specified.");
    }
    const selectedTemplate = templates[template];
    if (!selectedTemplate) {
      throw new Error("Template not found.");
    }
    const overrides = cliBuiltinOverrides(args);
    const templateOptions: TemplateOptions = {};

    for (const prompt of buildAllPrompts(selectedTemplate)) {
      if (prompt.id in overrides) {
        templateOptions[prompt.id] = overrides[prompt.id];
      } else {
        templateOptions[prompt.id] =
          prompt.type === "confirm"
            ? (prompt.initial ?? false)
            : (prompt.initial ?? prompt.choices[0].name);
      }
    }

    return {
      projectName,
      template,
      templateOptions,
      packageManager: args.packageManager,
    };
  }

  // プロジェクト名
  let projectName: string;
  if (args.projectName) {
    projectName = args.projectName;
    displayAlreadySpecified("Project name", projectName);
  } else {
    const answer = await Enquirer.prompt<{ projectName: string }>({
      type: "input",
      name: "projectName",
      message: "Project name",
      initial: DEFAULT_PROJECT_NAME,
    }).catch(() => process.exit(0));
    projectName = answer.projectName;
  }

  // テンプレート
  let template: string;
  if (args.template) {
    template = args.template;
    displayAlreadySpecified("Template", template);
  } else {
    const answer = await Enquirer.prompt<{ template: string }>({
      type: "select",
      name: "template",
      message: "Template",
      choices: Object.entries(templates).map(([key, tmpl]) => ({
        name: key,
        message: key,
        hint: tmpl.description,
      })),
    }).catch(() => process.exit(0));
    template = answer.template;
  }

  const selectedTemplate = templates[template];
  if (!selectedTemplate) {
    throw new Error("Template not found.");
  }
  const overrides = cliBuiltinOverrides(args);
  const templateOptions: TemplateOptions = {};

  // プロンプトを処理
  for (const prompt of buildAllPrompts(selectedTemplate)) {
    if (prompt.id in overrides) {
      templateOptions[prompt.id] = overrides[prompt.id];
      if (overrides[prompt.id]) {
        displayAlreadySpecified(prompt.message, "enabled");
      }
    } else {
      templateOptions[prompt.id] = await askTemplatePrompt(prompt);
    }
  }

  // パッケージマネージャ
  let packageManager = args.packageManager;
  if (packageManager) {
    displayAlreadySpecified("Package manager", packageManager);
  } else {
    const answer = await Enquirer.prompt<{ packageManager: string }>({
      type: "select",
      name: "packageManager",
      message: "Install packages?",
      choices: [
        { name: "none", message: "No" },
        { name: "npm", message: "npm" },
        { name: "yarn", message: "yarn" },
      ],
    }).catch(() => process.exit(0));
    packageManager =
      answer.packageManager !== "none"
        ? (answer.packageManager as "npm" | "yarn")
        : undefined;
  }

  return {
    projectName,
    template,
    templateOptions,
    packageManager,
  };
};

/**
 * プロンプトを表示してユーザの回答を取得する．
 */
const askTemplatePrompt = async (prompt: TemplatePrompt): Promise<unknown> => {
  try {
    if (prompt.type === "confirm") {
      const answer = await Enquirer.prompt<Record<string, boolean>>({
        type: "confirm",
        name: prompt.id,
        message: prompt.message,
        initial: prompt.initial ?? false,
      });
      return answer[prompt.id];
    }
    const answer = await Enquirer.prompt<Record<string, string>>({
      type: "select",
      name: prompt.id,
      message: prompt.message,
      choices: prompt.choices,
    });
    return answer[prompt.id];
  } catch {
    process.exit(0);
  }
};

const displayAlreadySpecified = (key: string, value: string) => {
  console.log(
    `${pc.bold(pc.green("✔"))} ${pc.bold(key)} ${pc.dim("·")} ${pc.cyan(value)}`,
  );
};
