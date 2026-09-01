/**
 * Copyright (c) 2026 Yuto Wada.
 * Released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import path from "node:path";
import Enquirer from "enquirer";
import pc from "picocolors";

import type { ParsedArgs } from "./args.js";
import type { ProjectConfig } from "./create-project.js";
import { resolveTemplate } from "./template-resolver.js";
import type {
  Template,
  TemplateBuiltInOptions,
  TemplateOptions,
  TemplatePrompt,
} from "./templates/index.js";
import { templates } from "./templates/index.js";

const DEFAULT_PROJECT_NAME = "my-document";

const CURRENT_DIRECTORY_SENTINEL = ".";

/**
 * ディレクトリ名を npm パッケージ名として使用できるようにサニタイズする．
 * 変換後も無効な場合は {@link DEFAULT_PROJECT_NAME} を返す．
 */
export const sanitizePackageName = (name: string): string => {
  const sanitized = name
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/^[^a-z0-9]+/, "")
    .replace(/[^a-z0-9]+$/, "");
  return /^[a-z0-9][a-z0-9._-]*$/.test(sanitized)
    ? sanitized
    : DEFAULT_PROJECT_NAME;
};

/**
 * 組込みオプションに対するプロンプト．
 */
const BUILTIN_OPTION_CONFIG: Record<
  keyof TemplateBuiltInOptions,
  { message: string; initial: boolean }
> = {
  markdown: { message: "Use Markdown?", initial: false },
  yaml: { message: "Use YAML?", initial: false },
};

/**
 * CLI フラグから組込みオプション値を取り出す．
 */
const cliBuiltinOverrides = (args: ParsedArgs) => {
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
const getDefaultValue = (prompt: TemplatePrompt) => {
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
) => {
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

/**
 * プロジェクト名の入力からプロジェクト名およびカレントディレクトリのフラグを解決する．
 * `.` が入力された場合，カレントディレクトリのベース名をサニタイズしてパッケージ名として使用する．
 */
const resolveProjectName = (
  input: string,
): { projectName: string; useCurrentDir: boolean } => {
  if (input === CURRENT_DIRECTORY_SENTINEL) {
    const derived = sanitizePackageName(path.basename(process.cwd()));
    if (derived !== path.basename(process.cwd()).toLowerCase()) {
      console.log(
        pc.yellow(`Package name derived from directory: ${pc.cyan(derived)}`),
      );
    }
    return { projectName: derived, useCurrentDir: true };
  }
  return { projectName: input, useCurrentDir: false };
};

export const promptUser = async (args: ParsedArgs): Promise<ProjectConfig> => {
  // --yes
  if (args.yes) {
    const rawName = args.projectName ?? DEFAULT_PROJECT_NAME;
    if (!args.templateId) {
      throw new Error("A template must be specified.");
    }
    const { projectName, useCurrentDir } = resolveProjectName(rawName);
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
      useCurrentDir,
    };
  }

  // プロジェクト名
  let projectName: string;
  let useCurrentDir: boolean;
  if (args.projectName) {
    ({ projectName, useCurrentDir } = resolveProjectName(args.projectName));
    displayAlreadySpecified(
      "Project name",
      useCurrentDir ? `. (${projectName})` : projectName,
    );
  } else {
    const answer = await Enquirer.prompt<{ projectName: string }>({
      type: "input",
      name: "projectName",
      message: 'Project name (or "." for current directory)',
      initial: DEFAULT_PROJECT_NAME,
    });
    ({ projectName, useCurrentDir } = resolveProjectName(answer.projectName));
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
      message:
        "Template. Specify a built-in template name, a git URL, or a local path.",
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
    useCurrentDir,
  };
};

/**
 * プロンプトを表示してユーザの回答を取得する．
 */
const askTemplatePrompt = async (prompt: TemplatePrompt) => {
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
