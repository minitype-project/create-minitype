/**
 * Copyright (c) 2026 Yuto Wada.
 * Released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ProjectCreator } from "./create-project.js";
import type { Template } from "./templates/index.js";

const minimalTemplate: Template = {
  id: "test",
  displayName: "Test",
  description: "Test template",
  files: () => ({ "test.txt": "test content" }),
};

describe("ProjectCreator", () => {
  describe("constructor", () => {
    it("大文字を含むプロジェクト名はエラーになる", () => {
      expect(
        () =>
          new ProjectCreator(
            { projectName: "InvalidName", template: minimalTemplate },
            false,
          ),
      ).toThrow("Invalid project name");
    });

    it("ハイフン始まりのプロジェクト名はエラーになる", () => {
      expect(
        () =>
          new ProjectCreator(
            { projectName: "-invalid", template: minimalTemplate },
            false,
          ),
      ).toThrow("Invalid project name");
    });

    it("パス区切り文字を含むプロジェクト名はエラーになる", () => {
      expect(
        () =>
          new ProjectCreator(
            { projectName: "my/project", template: minimalTemplate },
            false,
          ),
      ).toThrow("Invalid project name");
    });

    it("有効なプロジェクト名はエラーにならない", () => {
      expect(
        () =>
          new ProjectCreator(
            { projectName: "valid-name", template: minimalTemplate },
            false,
          ),
      ).not.toThrow();
    });
  });

  describe("create()", () => {
    describe("useCurrentDir: false の場合", () => {
      let tmpDir: string;

      beforeEach(() => {
        tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "minitype-test-"));
      });

      afterEach(() => {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      });

      it("ターゲットディレクトリが既に存在する場合はエラーになる", async () => {
        const existingDir = path.join(tmpDir, "my-project");
        fs.mkdirSync(existingDir);

        const creator = new ProjectCreator(
          {
            projectName: "my-project",
            template: minimalTemplate,
            outputDir: tmpDir,
            useCurrentDir: false,
          },
          true,
        );
        await expect(creator.create()).rejects.toThrow(
          "Directory already exists: my-project",
        );
      });

      it("サブディレクトリを作成してファイルを生成する", async () => {
        const creator = new ProjectCreator(
          {
            projectName: "new-project",
            template: minimalTemplate,
            outputDir: tmpDir,
            useCurrentDir: false,
          },
          true,
        );
        const result = await creator.create();

        expect(result.targetDir).toBe(path.join(tmpDir, "new-project"));
        expect(result.files).toContain("test.txt");
        expect(
          fs.existsSync(path.join(tmpDir, "new-project", "test.txt")),
        ).toBe(true);
      });
    });

    describe("useCurrentDir: true の場合", () => {
      let tmpDir: string;

      beforeEach(() => {
        tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "minitype-test-"));
        vi.spyOn(process, "cwd").mockReturnValue(tmpDir);
      });

      afterEach(() => {
        vi.restoreAllMocks();
        fs.rmSync(tmpDir, { recursive: true, force: true });
      });

      it("競合するファイルが存在する場合はエラーになる", async () => {
        fs.writeFileSync(path.join(tmpDir, "test.txt"), "existing content");

        const creator = new ProjectCreator(
          {
            projectName: "my-project",
            template: minimalTemplate,
            useCurrentDir: true,
          },
          true,
        );
        await expect(creator.create()).rejects.toThrow(
          "already exist in the current directory",
        );
      });

      it("競合がない場合はカレントディレクトリにファイルを生成する", async () => {
        const creator = new ProjectCreator(
          {
            projectName: "my-project",
            template: minimalTemplate,
            useCurrentDir: true,
          },
          true,
        );
        const result = await creator.create();

        expect(result.targetDir).toBe(tmpDir);
        expect(result.files).toContain("test.txt");
        expect(fs.existsSync(path.join(tmpDir, "test.txt"))).toBe(true);
      });

      it("カレントディレクトリが既に存在していてもエラーにならない", async () => {
        const creator = new ProjectCreator(
          {
            projectName: "my-project",
            template: minimalTemplate,
            useCurrentDir: true,
          },
          true,
        );
        await expect(creator.create()).resolves.toBeDefined();
      });
    });
  });
});
