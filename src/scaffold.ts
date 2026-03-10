import fs from "node:fs";
import path from "node:path";

import { bold, dim, error, green, info, success, yellow } from "./colors.js";
import { TEMPLATES } from "./templates/index.js";
import type { TemplateVars } from "./templates/types.js";
import type { UserConfig } from "./prompts.js";

export interface ScaffoldResult {
  projectName: string;
  template: string;
  targetDir: string;
  files: string[];
}

export async function scaffold(
  config: UserConfig,
  jsonOutput = false,
): Promise<ScaffoldResult> {
  const template = TEMPLATES[config.template];
  if (!template) {
    console.error(error(`Unknown template: ${config.template}`));
    process.exit(1);
  }

  const targetDir = path.resolve(process.cwd(), config.projectName);

  // Check if directory exists
  if (fs.existsSync(targetDir)) {
    if (!jsonOutput) {
      console.error(error(`Directory already exists: ${config.projectName}`));
      console.error(dim(`  Remove it or choose a different project name.`));
    }
    process.exit(1);
  }

  const vars: TemplateVars = {
    projectName: config.projectName,
    author: config.author,
    minitypePath: config.minitypePath,
    year: new Date().getFullYear().toString(),
  };

  const files = template.files(vars);
  const createdFiles: string[] = [];

  // Create directory and write files
  for (const [filePath, content] of Object.entries(files)) {
    const fullPath = path.join(targetDir, filePath);
    const dir = path.dirname(fullPath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (Buffer.isBuffer(content)) {
      fs.writeFileSync(fullPath, content);
    } else {
      fs.writeFileSync(fullPath, content, "utf-8");
    }
    createdFiles.push(filePath);
  }

  const result: ScaffoldResult = {
    projectName: config.projectName,
    template: config.template,
    targetDir,
    files: createdFiles,
  };

  if (jsonOutput) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    printSuccess(config, targetDir, createdFiles);
  }

  return result;
}

function printSuccess(config: UserConfig, targetDir: string, files: string[]) {
  console.log();
  console.log(success(bold(`Project created: ${config.projectName}`)));
  console.log();
  console.log(dim("  Files created:"));
  for (const file of files) {
    console.log(`    ${dim("·")} ${file}`);
  }
  console.log();
  console.log(bold("  Next steps:"));
  console.log();
  console.log(`    ${dim("$")} ${green(`cd ${config.projectName}`)}`);
  console.log(`    ${dim("$")} ${green("npm install")}`);
  console.log(
    `    ${dim("→")} ${dim("fonts/ にフォントファイルを配置する（fonts/README.md 参照）")}`,
  );
  console.log(`    ${dim("$")} ${green("npm run build")}`);
  console.log();
  console.log(
    `  ${dim("Document:")} ${yellow("document.ts")} ${dim("を編集して文書の内容を変更できます")}`,
  );
  console.log(
    `  ${dim("Style:")}    ${yellow("index.ts")} ${dim("を編集してスタイルを変更できます")}`,
  );
  console.log(
    `  ${dim("Fonts:")}    ${yellow("fonts/")} ${dim("ディレクトリにフォントを配置します")}`,
  );
  console.log();
  console.log(info(`Output will be saved as ${bold("output.pdf")}`));
  console.log();
}
