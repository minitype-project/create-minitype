/**
 * Copyright (c) 2026 Yuto Wada.
 * Released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { describe, expect, it } from "vitest";

import { sanitizePackageName } from "./prompts.js";

describe("sanitizePackageName", () => {
  it("有効な名前はそのまま返す", () => {
    expect(sanitizePackageName("my-project")).toBe("my-project");
  });

  it("大文字を小文字に変換する", () => {
    expect(sanitizePackageName("MyProject")).toBe("myproject");
  });

  it("スペースをハイフンに置換する", () => {
    expect(sanitizePackageName("my project")).toBe("my-project");
  });

  it("パス区切り文字をハイフンに置換する", () => {
    expect(sanitizePackageName("my/project")).toBe("my-project");
  });

  it("先頭の無効な文字を除去する", () => {
    expect(sanitizePackageName("---abc")).toBe("abc");
  });

  it("末尾の無効な文字を除去する", () => {
    expect(sanitizePackageName("abc---")).toBe("abc");
  });

  it("ドットとアンダースコアを保持する", () => {
    expect(sanitizePackageName("my.project_1")).toBe("my.project_1");
  });

  it("大文字・特殊文字が混在する名前を変換する", () => {
    expect(sanitizePackageName("Hello World!")).toBe("hello-world");
  });

  it("全て無効な文字の場合はデフォルト名を返す", () => {
    expect(sanitizePackageName("---")).toBe("my-document");
  });

  it("空文字列の場合はデフォルト名を返す", () => {
    expect(sanitizePackageName("")).toBe("my-document");
  });

  it("数字始まりの名前を保持する", () => {
    expect(sanitizePackageName("123abc")).toBe("123abc");
  });
});
