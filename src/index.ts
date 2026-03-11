import pc from "picocolors";

import { parseArgs } from "./args.js";
import { promptUser } from "./prompts.js";
import { scaffold } from "./scaffold.js";
import { templates } from "./templates/index.js";

const options = [
  ["-t, --template <name>", "Template to use (skips prompt)"],
  ["-y, --yes", "Skip prompts, use defaults"],
  ["--json", "Output JSON (implies --yes, for agent use)"],
  ["--list-templates", "List available templates"],
  ["-h, --help", "Show this help"],
];

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

const listTemplates = () => {
  for (const [key, tmpl] of Object.entries(templates)) {
    console.log(
      `${pc.cyan(key.padEnd(20))} ${tmpl.displayName}\t${pc.dim(tmpl.description)}`,
    );
  }
};

const main = async () => {
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
};

main().catch((err) => {
  console.error(String(err));
  process.exit(1);
});
