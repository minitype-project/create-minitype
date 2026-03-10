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
import { abstractGroup, mainGroup } from "./document.js";

// ------
// 共通スタイル
// ------
const sharedBlock: DocumentStyle["block"] = {
  paragraph: {
    font: "SourceHanSerifJP-Regular",
    size: Q(10),
    lineHeight: H(17),
    firstIndent: em(1),
  },
  headings: [
    {
      font: "SourceHanSansJP-Bold",
      size: Q(10),
      lineHeight: H(17),
      firstIndent: 0,
    },
    {
      font: "SourceHanSansJP-Bold",
      size: Q(10),
      lineHeight: H(17),
      firstIndent: 0,
    },
  ],
  list: {
    font: "SourceHanSerifJP-Regular",
    size: Q(10),
    lineHeight: H(17),
    firstIndent: em(-1),
  },
  code: {
    font: "SourceCodePro-Regular",
    size: Q(9),
    lineHeight: H(15),
    firstIndent: 0,
  },
  caption: {
    font: "SourceHanSansJP-Regular",
    size: Q(9),
    lineHeight: H(15),
    align: "center" as const,
    firstIndent: 0,
  },
};

const sharedCommand = {
  b: { font: "SourceHanSerifJP-Bold" },
  c: { font: "SourceCodePro-Regular", background: cmyk(0, 0, 0, 8) },
};

const sharedGaps: [string, string, number][] = [
  ["h1", "paragraph", 3],
  ["h2", "paragraph", 2],
  ["paragraph", "h1", 8],
  ["paragraph", "h2", 5],
  ["paragraph", "paragraph", 0],
  ["code", "paragraph", 3],
  ["paragraph", "code", 3],
  ["figure", "caption", 1],
  ["caption", "paragraph", 4],
  ["fallback", "fallback", 3],
];

// ------
// 組版実行（2グループ: タイトル+概要, 本文）
// ------
await minitype(
  [abstractGroup, mainGroup],
  "output.pdf",
  {
    size: "A4" as const,
    writingMode: "horizontal" as const,
    padding: physical(20, 20, 22, 20),
    block: sharedBlock,
    command: sharedCommand,
    gaps: sharedGaps,
  },
  {
    blockTransformers: [captionTransformer, footnoteTransformer()],
    fontDir: "fonts",
    outline: true,
  },
);
`;

const documentTs = (vars: TemplateVars) => `\
import type { Body, Group } from "minitype";
import {
  box,
  caption,
  code,
  figure,
  fn,
  footnote,
  h1,
  h2,
  li1,
  math,
  p,
  page,
  physical,
  ratio,
  vspace,
  cmyk,
  em,
  Q,
  H,
} from "minitype";

// ------
// タイトル・概要ページ
// ------
const titleBlock: Body = [
  // タイトル
  {
    type: "flow" as const,
    position: "page" as const,
    inlineOffset: 20,
    blockOffset: 25,
    blocks: [
      p("論文タイトル（日本語）", {
        align: "center" as const,
        firstIndent: 0,
        font: "SourceHanSansJP-Bold",
        size: Q(18),
        lineHeight: H(28),
      }),
      p("Paper Title (English)", {
        align: "center" as const,
        firstIndent: 0,
        font: "SourceHanSerifJP-Regular",
        size: Q(14),
        lineHeight: H(22),
      }),
      vspace(4),
      p("${vars.author || "著者名 氏名"}1, 共著者 氏名2", {
        align: "center" as const,
        firstIndent: 0,
        size: Q(11),
        lineHeight: H(18),
      }),
      p("1 所属機関名，2 別の所属機関名", {
        align: "center" as const,
        firstIndent: 0,
        size: Q(10),
        lineHeight: H(17),
      }),
    ],
    inlineSize: 170,
  },
  vspace(85),
];

const abstractBody: Body = [
  box(
    [
      p("概要", { font: "SourceHanSansJP-Bold", firstIndent: 0 }),
      p(
        "ここに概要（アブストラクト）を書きます．" +
        "本稿では，〜について提案する．" +
        "実験の結果，〜であることが確認された．",
      ),
      vspace(3),
      p("キーワード：キーワード1，キーワード2，キーワード3", {
        firstIndent: 0,
        size: Q(10),
        lineHeight: H(17),
      }),
    ],
    {
      padding: physical(4, 6, 4, 6),
      background: cmyk(0, 0, 0, 5),
    },
  ),
];

export const abstractGroup: Group = {
  body: [...titleBlock, ...abstractBody],
};

// ------
// フッタ（ページ番号）
// ------
const footer = {
  type: "flow" as const,
  position: "nombre" as const,
  blockOffset: 8,
  blocks: [p([[page]], { align: "center" as const, firstIndent: 0, size: 3, lineHeight: 4.5 })],
};

// ------
// 本文（2段組）
// ------
const mainContent: Body = [
  h1("はじめに"),
  p([["本稿の背景と目的について説明します．〜の問題を解決するため，本稿では〜を提案します", fn("intro-note"), "．"]]),
  footnote("intro-note", "本稿は〇〇学会論文誌に投稿予定です．"),

  h1("関連研究"),
  p("関連する先行研究について述べます．"),

  h2("1.1 先行研究A"),
  p("先行研究Aの説明．"),

  h2("1.2 先行研究B"),
  p("先行研究Bの説明と本研究との違い．"),

  h1("提案手法"),
  p("提案手法の詳細を説明します．"),
  math(["y = f(x) = \\\\sum_{i=1}^{n} w_i x_i + b"]),

  h1("実験"),
  p("実験の設定と結果を述べます．"),
  box(
    [
      figure("result.png", { width: ratio(0.95), align: "center" }),
      caption("実験結果"),
    ],
    { float: "top" as const },
  ),

  h1("おわりに"),
  p("本稿では〜を提案しました．今後の課題として〜が挙げられます．"),

  h1("参考文献"),
  li1('[1] 著者名, "論文タイトル," 学会名, pp. 1-10, 2024.'),
  li1('[2] 著者名, "論文タイトル," 学会名, pp. 1-10, 2024.'),
];

// 2段組ボックスで本文をラップ
const twoColumnBody = box(mainContent, { columns: 2, columnGap: 6 });

export const mainGroup: Group = {
  body: [footer, twoColumnBody],
};
`;

export const conferencePaper: Template = {
  displayName: "学会論文",
  description: "学会論文・会議論文（A4, 2段組）",
  files: (vars) => ({
    "package.json": packageJson(vars),
    "tsconfig.json": tsconfigJson(),
    "index.ts": indexTs(vars),
    "document.ts": documentTs(vars),
    ".gitignore": gitignore(),
    "CLAUDE.md": claudeMd(vars, "conference-paper"),
    "fonts/README.md": fontsReadme(),
    "result.png": createPlaceholderPng(400, 250),
  }),
};
