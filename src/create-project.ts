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
  /** プロジェクト名．npm パッケージ名として使用される． */
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
  /**
   * カレントディレクトリにプロジェクトを作成するか．
   * @default false
   */
  useCurrentDir?: boolean;
}

const PROJECT_NAME_PATTERN = /^[a-z0-9][a-z0-9._-]*$/;

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
    if (
      this.config.projectName.length > 214 ||
      !PROJECT_NAME_PATTERN.test(this.config.projectName)
    ) {
      throw new Error(
        `Invalid project name: ${this.config.projectName}
Use a lowercase npm package name without path separators.`,
      );
    }
    this.targetDir = this.config.useCurrentDir
      ? process.cwd()
      : path.resolve(
          this.config.outputDir ?? process.cwd(),
          this.config.projectName,
        );
  }

  async create() {
    if (!this.config.useCurrentDir && fs.existsSync(this.targetDir)) {
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
    };
    const files = await this.config.template.files(
      vars,
      this.config.templateOptions,
    );

    // ファイルを書き込む前にすべての出力先を解決
    const resolvedFiles = Object.entries(files).map(([filePath, content]) => {
      const fullPath = path.resolve(this.targetDir, filePath);
      const relativePath = path.relative(this.targetDir, fullPath);

      // 空のパス，絶対パス，プロジェクト外を指す相対パスを拒否
      if (
        !filePath ||
        path.isAbsolute(filePath) ||
        relativePath === ".." ||
        relativePath.startsWith(`..${path.sep}`)
      ) {
        throw new Error(
          `Template file path is outside the project: ${filePath}`,
        );
      }
      return { content, filePath, fullPath };
    });

    // カレントディレクトリの場合は競合チェックを実施
    if (this.config.useCurrentDir) {
      const conflicts = resolvedFiles
        .filter(({ fullPath }) => fs.existsSync(fullPath))
        .map(({ filePath }) => filePath);
      if (conflicts.length > 0) {
        throw new Error(
          `The following files already exist in the current directory:\n${conflicts.map((f) => `  ${f}`).join("\n")}\nRemove them or choose a different directory.`,
        );
      }
    }

    for (const { content, filePath, fullPath } of resolvedFiles) {
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
    this.createdFiles.push("fonts/LICENSE.txt");
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
    const cdStep = this.config.useCurrentDir
      ? ""
      : `  ${pc.dim("$")} ${pc.green(`cd ${cdPath}`)}\n`;
    const contentFile = [
      "src/document.md",
      "src/document.yaml",
      "src/document.ts",
    ].find((file) => this.createdFiles.includes(file));
    const contentMessage = contentFile
      ? `  - You can edit ${pc.cyan(contentFile)} for the content or\n`
      : "";
    console.log(`
${pc.bold(`Project created: ${this.config.projectName}`)}
${this.createdFiles.map((file) => `  ${pc.dim("- ")} ${file}`).join("\n")}

${pc.bold("Next steps:")}
${cdStep}${installStep}  ${pc.dim("$")} ${pc.green(`${pm ?? "npm"} run build`)}

${contentMessage}    edit ${pc.cyan("src/index.ts")} for the style.
  - Output will be saved as ${pc.cyan("output.pdf")}.`);
  }
}
