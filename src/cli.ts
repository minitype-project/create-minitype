/**
 * Copyright (c) 2026 Yuto Wada.
 * Released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import pc from "picocolors";

import { parseArgs } from "./args.js";
import { ProjectCreator } from "./create-project.js";
import { promptUser } from "./prompts.js";
import { templates } from "./templates/index.js";

const options = [
  [
    "-t, --template <name>",
    "Template to use (skips prompt). Specify a built-in template name, a git URL, or a local path.",
  ],
  ["-y, --yes", "Skip prompts (template must be specified)"],
  ["-j, --json", "Output JSON (implies --yes, for agent use)"],
  ["--markdown", "Generate a Markdown-based document when supported"],
  ["--yaml", "Generate document from YAML (cv or invoice only)"],
  ["--pm", "Install dependencies with npm or yarn"],
  ["-h, --help", "Show this help"],
  ["--list-templates", "List available templates"],
];

/**
 * ヘルプを表示する．
 */
const showHelp = () => {
  console.log(`
${pc.bold("create-minitype")} – creating a minitype document

${pc.bold("Usage:")}
  npm create minitype@latest [project-name] -- [options]

${pc.bold("Options:")}
${options
  .map(
    ([option, description]) =>
      `  ${pc.cyan(option.padEnd(24))} ${pc.dim(description)}`,
  )
  .join("\n")}

${pc.bold("Templates:")}
${Object.entries(templates)
  .map(
    ([key, tmpl]) => `  ${pc.cyan(key.padEnd(24))} ${pc.dim(tmpl.description)}`,
  )
  .join("\n")}

${pc.bold("Examples:")}
  ${pc.dim("# Interactive")}
  npm create minitype@latest

  ${pc.dim("# Specify project name")}
  npm create minitype@latest my-report

  ${pc.dim("# Non-interactive (for agents)")}
  npm create minitype@latest my-report -- --template report --yes

  ${pc.dim("# JSON output (for agents)")}
  npm create minitype@latest my-report -- --template report --json

  ${pc.dim("# Create in current directory")}
  npm create minitype@latest .
`);
};

/**
 * 利用可能なテンプレート一覧を表示する．
 */
const listTemplates = () => {
  for (const [key, tmpl] of Object.entries(templates)) {
    console.log(
      `${pc.cyan(key.padEnd(20))} ${tmpl.displayName}\t${pc.dim(tmpl.description)}`,
    );
  }
};

/**
 * エントリポイント．
 */
const main = async () => {
  try {
    const args = parseArgs();
    if (args.help) {
      showHelp();
      return;
    }
    if (args.listTemplates) {
      listTemplates();
      return;
    }
    const config = await promptUser(args);
    await new ProjectCreator(config, args.jsonOutput).create();
  } catch (e) {
    console.error(String(e));
    process.exit(1);
  }
};

main();
