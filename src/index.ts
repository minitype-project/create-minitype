import pc from "picocolors";

import { parseArgs } from "./args.js";
import { createProject } from "./create-project.js";
import { promptUser } from "./prompts.js";
import { templates } from "./templates/index.js";

const options = [
  ["-t, --template <name>", "Template to use (skips prompt)"],
  ["-y, --yes", "Skip prompts, use defaults"],
  ["--json", "Output JSON (implies --yes, for agent use)"],
  ["--list-templates", "List available templates"],
  ["-h, --help", "Show this help"],
];

/**
 * ヘルプを表示する．
 */
const showHelp = () => {
  console.log(`
${pc.bold("create-minitype")} – creating a minitype document

${pc.bold("Usage:")}
  npx create minitype [project-name] [options]

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
  npx create minitype

  ${pc.dim("# Specify project name")}
  npx create minitype my-report

  ${pc.dim("# Non-interactive (for agents)")}
  npx create minitype my-report --template report --yes

  ${pc.dim("# JSON output (for agents)")}
  npx create minitype my-report --template report --json
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
      process.exit(0);
    }
    if (args.listTemplates) {
      listTemplates();
      process.exit(0);
    }
    const config = await promptUser(args);
    await createProject(config, args.jsonOutput);
  } catch (e) {
    console.error(String(e));
    process.exit(1);
  }
};

main();
