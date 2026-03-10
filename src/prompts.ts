import readline from "node:readline";

import { bold, cyan, dim, green, yellow } from "./colors.js";
import { TEMPLATES } from "./templates/index.js";
import type { ParsedArgs } from "./args.js";

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

    // Template
    let template = args.template;
    if (!template) {
      printTemplateList();
      const answer = await ask(
        rl,
        `  ${bold("Template:")} ${dim("(report)")} `,
      );
      template = answer || "report";
    } else {
      console.log(`  ${bold("Template:")} ${green(template)}`);
    }

    if (!TEMPLATES[template]) {
      console.error();
      console.error(`  Unknown template: ${yellow(template)}`);
      printTemplateList();
      rl.close();
      process.exit(1);
    }

    // Author
    const author =
      args.author ??
      (await ask(rl, `  ${bold("Author:")} ${dim("(optional)")} `));

    // minitype path
    const defaultPath = "file:../minitype-test";
    const minitypeAnswer =
      args.minitypePath ??
      (await ask(
        rl,
        `  ${bold("minitype path:")} ${dim(`(${defaultPath})`)} `,
      ));
    const minitypePath = minitypeAnswer || defaultPath;

    console.log();

    return { projectName, template, author, minitypePath };
  } finally {
    rl.close();
  }
}
