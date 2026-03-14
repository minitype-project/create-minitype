import Enquirer from "enquirer";
import pc from "picocolors";

import type { ParsedArgs } from "./args.js";
import { templates } from "./templates/index.js";

const DEFAULT_PROJECT_NAME = "my-document";

export interface UserConfig {
  projectName: string;
  template: string;
}

export const promptUser = async (args: ParsedArgs): Promise<UserConfig> => {
  // --yes
  if (args.yes) {
    const projectName = args.projectName ?? DEFAULT_PROJECT_NAME;
    const template = args.template;
    if (!template) {
      console.error("Template is must be specified.");
      process.exit(1);
    }
    return { projectName, template };
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

  return { projectName, template };
};

const displayAlreadySpecified = (key: string, value: string) => {
  console.log(
    `${pc.bold(pc.green("✔"))} ${pc.bold(key)} ${pc.dim("·")} ${pc.cyan(value)}`,
  );
};
