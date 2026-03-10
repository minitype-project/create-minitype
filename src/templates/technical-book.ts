import type { Template, TemplateVars } from "./types.js";
import {
  claudeMd,
  fontsReadme,
  gitignore,
  packageJson,
  tsconfigJson,
} from "./common.js";
import { createPlaceholderPng } from "../placeholder-png.js";

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
  cmyk,
} from "minitype";
import { body } from "./document.js";

const style: Partial<DocumentStyle> = {
  size: "B5" as const,
  writingMode: "horizontal" as const,
  padding: physical(20, 20, 22, 22),
  block: {
    paragraph: {
      font: "SourceHanSerifJP-Regular",
      size: Q(13),
      lineHeight: H(22),
      firstIndent: em(1),
      effects: [{ type: "fill" as const, color: cmyk(0, 0, 0, 100) }],
    },
    headings: [
      {
        font: "SourceHanSansJP-Bold",
        size: Q(24),
        lineHeight: H(36),
        firstIndent: 0,
      },
      {
        font: "SourceHanSansJP-Bold",
        size: Q(18),
        lineHeight: H(28),
        firstIndent: 0,
      },
      {
        font: "SourceHanSansJP-Bold",
        size: Q(15),
        lineHeight: H(24),
        firstIndent: 0,
      },
      {
        font: "SourceHanSansJP-Regular",
        size: Q(13),
        lineHeight: H(22),
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
      size: Q(10),
      lineHeight: H(17),
      firstIndent: 0,
    },
    caption: {
      font: "SourceHanSansJP-Regular",
      size: Q(10),
      lineHeight: H(17),
      align: "center" as const,
      firstIndent: 0,
    },
    footnote: {
      font: "SourceHanSerifJP-Regular",
      size: Q(10),
      lineHeight: H(16),
      firstIndent: 0,
    },
  },
  command: {
    b: { font: "SourceHanSerifJP-Bold" },
    c: {
      font: "SourceCodePro-Regular",
      background: cmyk(0, 0, 0, 8),
      padding: physical(0.5, 1, 0.5, 1),
    },
    kw: { font: "SourceHanSansJP-Bold" },
  },
  gaps: [
    ["h1", "h2", 10],
    ["h1", "paragraph", 8],
    ["h2", "paragraph", 6],
    ["h2", "h3", 4],
    ["h3", "paragraph", 3],
    ["paragraph", "h1", 20],
    ["paragraph", "h2", 14],
    ["paragraph", "h3", 8],
    ["paragraph", "h4", 6],
    ["paragraph", "paragraph", 0],
    ["paragraph", "code", 4],
    ["code", "paragraph", 6],
    ["figure", "caption", 2],
    ["caption", "paragraph", 8],
    ["fallback", "fallback", 4],
  ],
};

await minitype([{ body }], "output.pdf", style, {
  blockTransformers: [captionTransformer, footnoteTransformer()],
  fontDir: "fonts",
  outline: true,
});
`;

const documentTs = (vars: TemplateVars) => `\
import type { Body } from "minitype";
import {
  box,
  caption,
  code,
  figure,
  fn,
  footnote,
  h1,
  h2,
  h3,
  h4,
  li1,
  li2,
  math,
  newpage,
  p,
  page,
  physical,
  ratio,
  vspace,
} from "minitype";

const header = {
  type: "flow" as const,
  position: "pillar" as const,
  blockOffset: -10,
  blocks: [p("${vars.projectName}", { align: "right" as const, firstIndent: 0, size: 3, lineHeight: 4.5 })],
  page: (pageIndex: number) => pageIndex >= 1,
};

const footer = {
  type: "flow" as const,
  position: "nombre" as const,
  blockOffset: 8,
  blocks: [p([[page]], { align: "center" as const, firstIndent: 0, size: 3, lineHeight: 4.5 })],
};

export const body: Body = [
  header,
  footer,

  h1("第1章 はじめに"),
  p("本書では，〜について説明します．"),

  h2("1.1 背景"),
  p("背景の説明を書きます．"),

  h2("1.2 本書の構成"),
  li1("第1章：はじめに"),
  li1("第2章：基本的な使い方"),
  li1("第3章：応用"),
  vspace(4),

  newpage(),

  h1("第2章 基本的な使い方"),

  h2("2.1 インストール"),
  p("以下のコマンドでインストールします："),
  code("npm install ${vars.projectName}", "bash"),

  h2("2.2 基本的な例"),
  p("最も単純な例を示します："),
  code(
    [
      'import { hello } from "${vars.projectName}";',
      "",
      "hello();",
    ],
    "typescript",
  ),

  h3("2.2.1 詳細な設定"),
  p([["詳細な設定方法", fn("config-note"), "を説明します．"]]),
  footnote("config-note", "設定の詳細については付録を参照してください．"),

  h2("2.3 数式"),
  math(["\\\\sum_{i=0}^{n} i = \\\\frac{n(n+1)}{2}"]),

  h2("2.4 図表"),
  box(
    [
      figure("example.png", { width: ratio(0.8), align: "center" }),
      caption("サンプル図"),
    ],
    { float: "top" as const },
  ),
  p("図表の説明を書きます．"),
];
`;

export const technicalBook: Template = {
  displayName: "技術書",
  description: "技術書・マニュアル（B5, 横組）",
  files: (vars) => ({
    "package.json": packageJson(vars),
    "tsconfig.json": tsconfigJson(),
    "index.ts": indexTs(vars),
    "document.ts": documentTs(vars),
    ".gitignore": gitignore(),
    "CLAUDE.md": claudeMd(vars, "technical-book"),
    "fonts/README.md": fontsReadme(),
    "example.png": createPlaceholderPng(400, 250),
  }),
};
