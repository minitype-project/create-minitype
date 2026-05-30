import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pc from "picocolors";

import type { UserConfig } from "./prompts.js";
import type { TemplateVars } from "./templates/index.js";
import { templates } from "./templates/index.js";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const MINITYPE_ABS = path.resolve(SCRIPT_DIR, "../../minitype");
const MINITYPE_VITE_PLUGIN_ABS = path.resolve(SCRIPT_DIR, "../../vite-plugin");

interface CreateProjectResult {
  projectName: string;
  template: string;
  targetDir: string;
  files: string[];
}

export class ProjectCreator {
  private createdFiles: string[] = [];
  private targetDir: string;

  constructor(
    private readonly config: UserConfig,
    private readonly jsonOutput: boolean,
  ) {
    this.targetDir = path.resolve(process.cwd(), this.config.projectName);
  }

  async create() {
    // ディレクトリが既に存在する場合はエラー
    if (fs.existsSync(this.targetDir)) {
      if (!this.jsonOutput) {
        console.error(`Directory already exists: ${this.config.projectName}
Remove it or choose a different project name.`);
      }
      process.exit(1);
    }

    await this.createTemplates();
    this.copyFonts();
    this.installPackages();

    if (this.jsonOutput) {
      const result: CreateProjectResult = {
        projectName: this.config.projectName,
        template: this.config.template,
        targetDir: this.targetDir,
        files: this.createdFiles,
      };
      console.log(JSON.stringify(result, null, 2));
    } else {
      this.printSuccess();
    }
  }

  /**
   * テンプレートを作成する．
   */
  private async createTemplates() {
    const template = templates[this.config.template];
    if (!template) {
      console.error(`Unknown template: ${this.config.template}`);
      process.exit(1);
    }

    const vars: TemplateVars = {
      projectName: this.config.projectName,
      minitypePath: path.relative(this.targetDir, MINITYPE_ABS),
      minitypeVitePluginPath: path.relative(
        this.targetDir,
        MINITYPE_VITE_PLUGIN_ABS,
      ),
    };
    const files = await template.files(vars, this.config.templateOptions);

    for (const [filePath, content] of Object.entries(files)) {
      const fullPath = path.join(this.targetDir, filePath);
      const dir = path.dirname(fullPath);

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      if (Buffer.isBuffer(content)) {
        fs.writeFileSync(fullPath, content);
      } else {
        fs.writeFileSync(fullPath, content, "utf-8");
      }
      this.createdFiles.push(filePath);
    }
  }

  /**
   * フォントをコピーする．
   */
  private copyFonts() {
    // /dist/fonts からコピー
    // dev時は ../fonts/ にフォールバック
    const fontsDirCandidates = [
      fileURLToPath(new URL("./fonts", import.meta.url)),
      fileURLToPath(new URL("../fonts", import.meta.url)),
    ];
    const fontsDir = fontsDirCandidates.find(fs.existsSync);
    if (!fontsDir) {
      return;
    }

    // ディレクトリを作成
    const targetFontsDir = path.join(this.targetDir, "fonts");
    if (!fs.existsSync(targetFontsDir)) {
      fs.mkdirSync(targetFontsDir, { recursive: true });
    }

    for (const file of fs.readdirSync(fontsDir)) {
      if ([".otf", ".ttf"].includes(path.extname(file))) {
        fs.copyFileSync(
          path.join(fontsDir, file),
          path.join(targetFontsDir, file),
        );
        this.createdFiles.push(`fonts/${file}`);
      }
    }
  }

  /**
   * パッケージをインストールする．
   */
  private installPackages() {
    const pm = this.config.packageManager;
    if (!pm) {
      return;
    }
    if (!this.jsonOutput) {
      console.log(`\nInstalling packages with ${pm}...`);
    }

    const result = spawnSync(pm, ["install"], {
      cwd: this.targetDir,
      stdio: this.jsonOutput ? "pipe" : "inherit",
    });

    if (result.status !== 0) {
      const message = `Package installation failed (exit code: ${String(result.status)}).`;
      if (this.jsonOutput) {
        console.error(message);
      } else {
        console.error(`\n${pc.red(message)}`);
      }
      process.exit(1);
    }
  }

  /**
   * 成功メッセージを表示する．
   */
  private printSuccess() {
    const pm = this.config.packageManager;
    const installStep = pm
      ? ""
      : `  ${pc.dim("$")} ${pc.green("npm install")}\n`;
    console.log(`
${pc.bold(`Project created: ${this.config.projectName}`)}
${this.createdFiles.map((file) => `  ${pc.dim("- ")} ${file}`).join("\n")}

${pc.bold("Next steps:")}
  ${pc.dim("$")} ${pc.green(`cd ${this.config.projectName}`)}
${installStep}  ${pc.dim("$")} ${pc.green(`${pm ?? "npm"} run build`)}

  - You can edit ${pc.cyan("document.ts")} for the content or
    edit ${pc.cyan("index.ts")} for the style.
  - Output will be saved as ${pc.cyan("output.pdf")}.`);
  }
}
