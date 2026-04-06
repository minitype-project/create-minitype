import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pc from "picocolors";

import type { UserConfig } from "./prompts.js";
import type { TemplateVars } from "./templates/index.js";
import { templates } from "./templates/index.js";

const MINITYPE_PATH = "../../minitype";
const MINITYPE_VITE_PLUGIN_PATH = "../../vite-plugin";

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
      minitypePath: MINITYPE_PATH,
      minitypeVitePluginPath: MINITYPE_VITE_PLUGIN_PATH,
    };
    const files = await template.files(vars, {
      markdown: this.config.markdown,
    });

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
   * 成功メッセージを表示する．
   */
  private printSuccess() {
    console.log(`
${pc.bold(`Project created: ${this.config.projectName}`)}  
${this.createdFiles.map((file) => `  ${pc.dim("- ")} ${file}`).join("\n")}

${pc.bold("Next steps:")}
  ${pc.dim("$")} ${pc.green(`cd ${this.config.projectName}`)}
  ${pc.dim("$")} ${pc.green("npm install")}
  ${pc.dim("$")} ${pc.green("npm run build")}
  
  - You can edit ${pc.cyan("document.ts")} for the content or
    edit ${pc.cyan("index.ts")} for the style.
  - Output will be saved as ${pc.cyan("output.pdf")}.`);
  }
}
