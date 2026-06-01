import Enquirer from "enquirer";
import pc from "picocolors";

import type { ParsedArgs } from "./args.js";
import { resolveTemplate } from "./template-loader.js";
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
  /** 解決済みのテンプレート． */
  template: Template;
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
 * プロンプトのデフォルト値を返す．
 */
const getDefaultValue = (prompt: TemplatePrompt): unknown => {
  return prompt.type === "confirm"
    ? (prompt.initial ?? false)
    : (prompt.initial ?? prompt.choices[0].name);
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

/**
 * テンプレートオプションを解決する．
 * {@link verbose} が `true` の場合，CLI フラグで指定済みのオプションを表示する．
 */
const resolveTemplateOptions = async (
  template: Template,
  overrides: Record<string, boolean>,
  resolver: (prompt: TemplatePrompt) => Promise<unknown>,
  verbose = false,
): Promise<TemplateOptions> => {
  const options: TemplateOptions = {};
  for (const prompt of buildAllPrompts(template)) {
    if (prompt.id in overrides) {
      options[prompt.id] = overrides[prompt.id];
      if (verbose && overrides[prompt.id]) {
        displayAlreadySpecified(prompt.message, "enabled");
      }
    } else {
      options[prompt.id] = await resolver(prompt);
    }
  }
  return options;
};

export const promptUser = async (args: ParsedArgs): Promise<UserConfig> => {
  // --yes
  if (args.yes) {
    const projectName = args.projectName ?? DEFAULT_PROJECT_NAME;
    if (!args.templateId) {
      throw new Error("Template is must be specified.");
    }
    const template = await resolveTemplate(args.templateId);
    const templateOptions = await resolveTemplateOptions(
      template,
      cliBuiltinOverrides(args),
      (prompt) => Promise.resolve(getDefaultValue(prompt)),
    );

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
    });
    projectName = answer.projectName;
  }

  // テンプレート
  const templateId = await (async () => {
    if (args.templateId) {
      displayAlreadySpecified("Template", args.templateId);
      return args.templateId;
    }
    const answer = await Enquirer.prompt<{ template: string }>({
      type: "select",
      name: "template",
      message: "Template",
      choices: Object.entries(templates).map(([key, tmpl]) => ({
        name: key,
        message: key,
        hint: tmpl.description,
      })),
    });
    return answer.template;
  })();

  const template = await resolveTemplate(templateId);
  const overrides = cliBuiltinOverrides(args);
  const templateOptions = await resolveTemplateOptions(
    template,
    overrides,
    askTemplatePrompt,
    true,
  );

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
    });
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
};

const displayAlreadySpecified = (key: string, value: string) => {
  console.log(
    `${pc.bold(pc.green("✔"))} ${pc.bold(key)} ${pc.dim("·")} ${pc.cyan(value)}`,
  );
};
