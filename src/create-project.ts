/**
 * Copyright (c) 2026 Yuto Wada.
 * Released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pc from "picocolors";

import type {
  Template,
  TemplateOptions,
  TemplateVars,
} from "./templates/index.js";

export interface ProjectConfig {
  /** プロジェクト名． */
  projectName: string;
  /** 解決済みのテンプレート． */
  template: Template;
  /** テンプレートのオプション．未指定の場合はデフォルト値が使用される． */
  templateOptions?: TemplateOptions;
  /** 依存関係をインストールするパッケージマネージャ．未指定の場合はインストールしない． */
  packageManager?: "npm" | "yarn";
  /**
   * プロジェクトを作成するディレクトリ．
   * @default カレントディレクトリ
   */
  outputDir?: string;
}

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const MINITYPE_ABS = path.resolve(SCRIPT_DIR, "../../minitype");
const MINITYPE_VITE_PLUGIN_ABS = path.resolve(SCRIPT_DIR, "../../vite-plugin");

export interface CreateProjectResult {
  /** プロジェクト名． */
  projectName: string;
  /** テンプレート ID． */
  templateId: string;
  /** ターゲットディレクトリ． */
  targetDir: string;
  /** 生成されたファイル群のパス． */
  files: string[];
}

export class ProjectCreator {
  private createdFiles: string[] = [];
  private targetDir: string;

  constructor(
    private readonly config: ProjectConfig,
    private readonly jsonOutput: boolean,
  ) {
    this.targetDir = path.resolve(
      this.config.outputDir ?? process.cwd(),
      this.config.projectName,
    );
  }

  async create() {
    // ディレクトリが既に存在する場合はエラー
    if (fs.existsSync(this.targetDir)) {
      throw new Error(
        `Directory already exists: ${this.config.projectName}\nRemove it or choose a different project name.`,
      );
    }

    await this.createTemplateFiles();
    this.copyFonts();
    this.installPackages();

    const result: CreateProjectResult = {
      projectName: this.config.projectName,
      templateId: this.config.template.id,
      targetDir: this.targetDir,
      files: this.createdFiles,
    };

    if (this.jsonOutput) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      this.printSuccess();
    }

    return result;
  }

  /**
   * テンプレートからファイルを生成する．
   */
  private async createTemplateFiles() {
    const vars: TemplateVars = {
      projectName: this.config.projectName,
      minitypePath: path.relative(this.targetDir, MINITYPE_ABS),
      minitypeVitePluginPath: path.relative(
        this.targetDir,
        MINITYPE_VITE_PLUGIN_ABS,
      ),
    };
    const files = await this.config.template.files(
      vars,
      this.config.templateOptions,
    );

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
    fs.copyFileSync(
      path.join(fontsDir, "LICENSE.txt"),
      path.join(targetFontsDir, "LICENSE.txt"),
    );
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
      throw new Error(
        `Package installation failed (exit code: ${String(result.status)}).`,
      );
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
    const cdPath = this.config.outputDir
      ? this.targetDir
      : this.config.projectName;
    console.log(`
${pc.bold(`Project created: ${this.config.projectName}`)}
${this.createdFiles.map((file) => `  ${pc.dim("- ")} ${file}`).join("\n")}

${pc.bold("Next steps:")}
  ${pc.dim("$")} ${pc.green(`cd ${cdPath}`)}
${installStep}  ${pc.dim("$")} ${pc.green(`${pm ?? "npm"} run build`)}

  - You can edit ${pc.cyan("src/document.ts")} for the content or
    edit ${pc.cyan("src/index.ts")} for the style.
  - Output will be saved as ${pc.cyan("output.pdf")}.`);
  }
}
