/**
 * 各テンプレートのサンプル PDF を生成するスクリプト．
 * tmp/ にプロジェクトを作成してビルドし，samples/ に PDF を保存する．
 * 引数にテンプレート ID を指定すると対象を絞り込める．
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createProject, templates } from "../src/index.js";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(SCRIPT_DIR, "..");
const TMP_DIR = path.join(ROOT_DIR, "tmp");
const SAMPLE_DIR = path.join(ROOT_DIR, "samples");

/**
 * コマンドライン引数を解析してビルド対象のテンプレート ID 一覧を返す．
 */
const parseArgs = (): string[] => {
  // 引数未指定の場合は全テンプレートを対象とする
  const args = process.argv.slice(2);
  const targetIds = args.length > 0 ? args : Object.keys(templates);
  const unknownIds = targetIds.filter((id) => !(id in templates));

  if (unknownIds.length > 0) {
    console.error(`Unknown template IDs: ${unknownIds.join(", ")}`);
    console.error(`Available: ${Object.keys(templates).join(", ")}`);
    process.exit(1);
  }

  return targetIds;
};

/**
 * 指定されたテンプレート ID のサンプル PDF を生成する．
 */
const generateSamples = async (targetIds: string[]): Promise<void> => {
  if (!fs.existsSync(SAMPLE_DIR)) {
    fs.mkdirSync(SAMPLE_DIR, { recursive: true });
  }

  for (const id of targetIds) {
    const template = templates[id];
    const sampleConfigs = template.samples
      ? template.samples.map(({ suffix, options }) => ({
          label: `${id}-${suffix}`,
          options: options ?? {},
        }))
      : [{ label: id, options: {} }];

    for (const { label, options } of sampleConfigs) {
      const tmpProjectDir = path.join(TMP_DIR, label);

      console.log(`\n[${label}] Creating project...`);

      // 前回の残骸が残っている場合は削除する
      if (fs.existsSync(tmpProjectDir)) {
        fs.rmSync(tmpProjectDir, { recursive: true, force: true });
      }

      await createProject({
        projectName: label,
        templateId: id,
        packageManager: "yarn",
        outputDir: TMP_DIR,
        templateOptions: options,
      });

      console.log(`[${label}] Building PDF...`);

      const buildResult = spawnSync("yarn", ["build"], {
        cwd: tmpProjectDir,
        stdio: "inherit",
      });

      if (buildResult.status !== 0) {
        console.error(
          `[${label}] Build failed (exit code: ${String(buildResult.status)})`,
        );
        fs.rmSync(tmpProjectDir, { recursive: true, force: true });
        continue;
      }

      const pdfSrc = path.join(tmpProjectDir, "output.pdf");
      const pdfDst = path.join(SAMPLE_DIR, `${label}.pdf`);

      if (!fs.existsSync(pdfSrc)) {
        console.error(`[${label}] output.pdf not found after build`);
        fs.rmSync(tmpProjectDir, { recursive: true, force: true });
        continue;
      }

      fs.copyFileSync(pdfSrc, pdfDst);
      fs.rmSync(tmpProjectDir, { recursive: true, force: true });

      console.log(`[${label}] Saved to samples/${label}.pdf`);
    }
  }
};

await generateSamples(parseArgs());
