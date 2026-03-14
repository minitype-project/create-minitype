import readline from "node:readline";
import pc from "picocolors";

import type { ParsedArgs } from "./args.js";
import { templates } from "./templates/index.js";

const DEFAULT_PROJECT_NAME = "my-document";

export interface UserConfig {
  projectName: string;
  template: string;
  author: string;
  minitypePath: string;
}

function createPrompt(): readline.Interface {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

async function ask(rl: readline.Interface, question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

function printTemplateList() {
  console.log();
  console.log(bold("Available templates:"));
  console.log();
  for (const [key, tmpl] of Object.entries(TEMPLATES)) {
    console.log(`  ${cyan(key.padEnd(20))} ${dim(tmpl.description)}`);
  }
  console.log();
}

export async function promptUser(args: ParsedArgs): Promise<UserConfig> {
  const templateKeys = Object.keys(TEMPLATES);

  // Print banner (suppressed in JSON mode)
  if (!args.jsonOutput) {
    console.log();
    console.log(
      bold("  create-minitype") + dim(" – minitype document scaffolding"),
    );
    console.log();
  }

  // If non-interactive (--yes), fill defaults
  if (args.yes) {
    const projectName = args.projectName ?? "my-document";
    const template = args.template ?? "report";
    const author = args.author ?? "";
    const minitypePath = args.minitypePath ?? "file:../minitype-test";

    if (!TEMPLATES[template]) {
      console.error(`Unknown template: ${template}`);
      console.error(`Available: ${templateKeys.join(", ")}`);
      process.exit(1);
    }

    return { projectName, template, author, minitypePath };
  }

  const rl = createPrompt();

  try {
    // Project name
    let projectName = args.projectName;
    if (!projectName) {
      const answer = await ask(
        rl,
        `  ${bold("Project name:")} ${dim("(my-document)")} `,
      );
      projectName = answer || "my-document";
    } else {
      console.log(`  ${bold("Project name:")} ${green(projectName)}`);
    }


/**
 * 質問を表示して回答を取得する．
 */
const ask = (rl: readline.Interface, question: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
};

