import { parseArgs } from "./args.js";
import { bold, cyan, dim, error } from "./colors.js";
import { promptUser } from "./prompts.js";
import { scaffold } from "./scaffold.js";
import { TEMPLATES } from "./templates/index.js";

function showHelp() {
  console.log(`
${bold("create-minitype")} – minitype document scaffolding

${bold("Usage:")}
  npx create minitype [project-name] [options]

${bold("Options:")}
  ${cyan("-t, --template <name>")}    Template to use (skips prompt)
  ${cyan("-a, --author <name>")}      Author name
  ${cyan("--minitype-path <path>")}   Path to minitype package ${dim("(default: file:../minitype-test)")}
  ${cyan("-y, --yes")}                Skip prompts, use defaults
  ${cyan("--json")}                   Output JSON (implies --yes, for agent use)
  ${cyan("--list-templates")}         List available templates
  ${cyan("-h, --help")}               Show this help

${bold("Templates:")}
${Object.entries(TEMPLATES)
  .map(([key, tmpl]) => `  ${cyan(key.padEnd(22))} ${dim(tmpl.description)}`)
  .join("\n")}

${bold("Examples:")}
  ${dim("# Interactive")}
  npx create minitype

  ${dim("# Specify project name")}
  npx create minitype my-report

  ${dim("# Non-interactive (for agents)")}
  npx create minitype my-report --template report --yes

  ${dim("# JSON output (for agents)")}
  npx create minitype my-report --template report --json
`);
}

function listTemplates() {
  const templates = Object.entries(TEMPLATES);
  for (const [key, tmpl] of templates) {
    console.log(`${key}\t${tmpl.displayName}\t${tmpl.description}`);
  }
}

async function main() {
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
  await scaffold(config, args.jsonOutput);
}

main().catch((err) => {
  console.error(error(String(err)));
  process.exit(1);
});
