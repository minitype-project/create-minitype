import type { Template, TemplateVars } from "./types.js";
import {
  claudeMd,
  fontsReadme,
  gitignore,
  packageJson,
  tsconfigJson,
} from "./common.js";

const indexTs = (vars: TemplateVars) => `\
import {
  type DocumentStyle,
  captionTransformer,
  footnoteTransformer,
  minitype,
  physical,
  Q,
  H,
  em,
} from "minitype";
import { body } from "./document.js";

// ------
// スタイル定義
// ------
const style: Partial<DocumentStyle> = {
  size: "A4" as const,
  writingMode: "horizontal" as const,
  padding: physical(25, 25, 25, 30),
  block: {
    paragraph: {
      font: "SourceHanSerifJP-Regular",
      size: Q(13),
      lineHeight: H(22),
      firstIndent: em(1),
    },
    headings: [
      {
        font: "SourceHanSerifJP-Bold",
        size: Q(20),
        lineHeight: H(30),
        firstIndent: 0,
      },
      {
        font: "SourceHanSerifJP-Bold",
        size: Q(16),
        lineHeight: H(26),
        firstIndent: 0,
      },
      {
        font: "SourceHanSerifJP-Bold",
        size: Q(14),
        lineHeight: H(24),
        firstIndent: 0,
      },
    ],
    list: {
      font: "SourceHanSerifJP-Regular",
      size: Q(13),
      lineHeight: H(22),
      firstIndent: em(-1),
    },
    code: {
      font: "SourceCodePro-Regular",
      size: Q(11),
      lineHeight: H(18),
      firstIndent: 0,
    },
    caption: {
      font: "SourceHanSerifJP-Regular",
      size: Q(11),
      lineHeight: H(18),
      align: "center" as const,
      firstIndent: 0,
    },
    footnote: {
      font: "SourceHanSerifJP-Regular",
      size: Q(10),
      lineHeight: H(17),
      firstIndent: 0,
    },
  },
  command: {
    b: { font: "SourceHanSerifJP-Bold" },
    c: { font: "SourceCodePro-Regular" },
  },
  gaps: [
    ["h1", "paragraph", 6],
    ["h2", "paragraph", 4],
    ["h3", "paragraph", 3],
    ["paragraph", "h1", 14],
    ["paragraph", "h2", 10],
    ["paragraph", "h3", 6],
    ["paragraph", "paragraph", 0],
    ["paragraph", "list1", 2],
    ["list1", "paragraph", 4],
    ["code", "paragraph", 6],
    ["paragraph", "code", 4],
    ["figure", "caption", 2],
    ["caption", "paragraph", 6],
    ["fallback", "fallback", 4],
  ],
};

// ------
// 組版実行
// ------
await minitype([{ body }], "output.pdf", style, {
  blockTransformers: [captionTransformer, footnoteTransformer()],
  fontDir: "fonts",
  outline: true,
});
`;

const documentTs = (vars: TemplateVars) => `\
import type { Body } from "minitype";
import {
  fn,
  footnote,
  h1,
  h2,
  h3,
  li1,
  li2,
  p,
  figure,
  caption,
  code,
  math,
  vspace,
  page,
} from "minitype";

// ------
// ヘッダ・フッタ
// ------
const header = {
  type: "flow" as const,
  position: "pillar" as const,
  blockOffset: -10,
  blocks: [
    p("${vars.projectName}", {
      align: "right" as const,
      firstIndent: 0,
      size: 3,
      lineHeight: 4.5,
    }),
  ],
  page: (pageIndex: number) => pageIndex >= 1,
};

const footer = {
  type: "flow" as const,
  position: "nombre" as const,
  blockOffset: 8,
  blocks: [
    p([[page]], {
      align: "center" as const,
      firstIndent: 0,
      size: 3,
      lineHeight: 4.5,
    }),
  ],
};

// ------
// 本文
// ------
export const body: Body = [
  header,
  footer,

  // タイトル
  h1("レポートタイトル"),
  p([["著者名：${vars.author || "著者名"}"]]),
  p([["提出日：${vars.year}年月日"]]),
  vspace(6),

  // はじめに
  h2("はじめに"),
  p(
    "ここに序論を書きます．" +
    "本レポートでは，〜について述べます．",
  ),

  // 本論
  h2("本論"),
  h3("背景"),
  p([["ここに背景を書きます．脚注の例", fn("note1"), "も示します．"]]),
  footnote("note1", "これは脚注の例です．"),

  h3("方法"),
  p("実験の方法を説明します．"),
  // 箇条書き
  li1("手順 1：〜を行う"),
  li1("手順 2：〜を行う"),
  li2("詳細：〜"),
  li1("手順 3：〜を行う"),
  vspace(4),

  // コードの例
  h3("実装"),
  p("実装のコード例を示します．"),
  code(
    [
      "function hello(): void {",
      '  console.log("Hello, minitype!");',
      "}",
    ],
    "typescript",
  ),

  // 数式の例
  h3("数式"),
  p("数式の例を示します．"),
  math(["E = mc^2"]),

  // まとめ
  h2("まとめ"),
  p(
    "本レポートでは，〜について述べました．" +
    "今後の課題として，〜が挙げられます．",
  ),
];
`;

export const report: Template = {
  displayName: "レポート",
  description: "一般的なレポート・報告書（A4, 横組）",
  files: (vars) => ({
    "package.json": packageJson(vars),
    "tsconfig.json": tsconfigJson(),
    "index.ts": indexTs(vars),
    "document.ts": documentTs(vars),
    ".gitignore": gitignore(),
    "CLAUDE.md": claudeMd(vars, "report"),
    "fonts/README.md": fontsReadme(),
  }),
};
