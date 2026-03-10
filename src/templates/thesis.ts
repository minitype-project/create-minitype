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
import { titleGroup, mainGroup } from "./document.js";

const block: DocumentStyle["block"] = {
  paragraph: {
    font: "SourceHanSerifJP-Regular",
    size: Q(13),
    lineHeight: H(23),
    firstIndent: em(1),
    effects: [{ type: "fill" as const, color: cmyk(0, 0, 0, 100) }],
  },
  headings: [
    { font: "SourceHanSansJP-Bold", size: Q(22), lineHeight: H(34), firstIndent: 0 },
    { font: "SourceHanSansJP-Bold", size: Q(18), lineHeight: H(28), firstIndent: 0 },
    { font: "SourceHanSansJP-Bold", size: Q(15), lineHeight: H(24), firstIndent: 0 },
    { font: "SourceHanSansJP-Regular", size: Q(13), lineHeight: H(23), firstIndent: 0 },
  ],
  list: {
    font: "SourceHanSerifJP-Regular",
    size: Q(13),
    lineHeight: H(23),
    firstIndent: em(-1),
  },
  code: {
    font: "SourceCodePro-Regular",
    size: Q(11),
    lineHeight: H(18),
    firstIndent: 0,
  },
  caption: {
    font: "SourceHanSansJP-Regular",
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
};

const gaps: [string, string, number][] = [
  ["h1", "paragraph", 10],
  ["h2", "paragraph", 6],
  ["h3", "paragraph", 4],
  ["h4", "paragraph", 2],
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
];

await minitype(
  [titleGroup, mainGroup],
  "output.pdf",
  {
    size: "A4" as const,
    writingMode: "horizontal" as const,
    padding: physical(30, 30, 30, 35),
    block,
    command: {
      b: { font: "SourceHanSerifJP-Bold" },
      c: { font: "SourceCodePro-Regular", background: cmyk(0, 0, 0, 8) },
    },
    gaps,
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
  h3,
  h4,
  li1,
  li2,
  math,
  newpage,
  p,
  page,
  physical,
  Q,
  H,
  ratio,
  vspace,
  cmyk,
  em,
} from "minitype";

// ------
// タイトルページ
// ------
export const titleGroup: Group = {
  body: [
    {
      type: "flow" as const,
      position: "page" as const,
      inlineOffset: 0,
      blockOffset: 0,
      zIndex: -1,
      blocks: [],
    },
    {
      type: "flow" as const,
      position: "page" as const,
      inlineOffset: 35,
      blockOffset: 100,
      inlineSize: 140,
      blocks: [
        p("${vars.year}年度 卒業論文", {
          align: "center" as const,
          firstIndent: 0,
          size: Q(14),
          lineHeight: H(22),
        }),
        vspace(10),
        p("論文タイトル", {
          align: "center" as const,
          firstIndent: 0,
          font: "SourceHanSansJP-Bold",
          size: Q(22),
          lineHeight: H(34),
        }),
        p("Thesis Title in English", {
          align: "center" as const,
          firstIndent: 0,
          size: Q(14),
          lineHeight: H(22),
        }),
        vspace(20),
        p("所属機関名", { align: "center" as const, firstIndent: 0, size: Q(13), lineHeight: H(22) }),
        p("学科・専攻名", { align: "center" as const, firstIndent: 0, size: Q(13), lineHeight: H(22) }),
        vspace(6),
        p("${vars.author || "著者 氏名"}", {
          align: "center" as const,
          firstIndent: 0,
          font: "SourceHanSansJP-Bold",
          size: Q(16),
          lineHeight: H(26),
        }),
        vspace(6),
        p("指導教員：教授 〇〇 〇〇", { align: "center" as const, firstIndent: 0, size: Q(12), lineHeight: H(20) }),
        vspace(6),
        p("提出日：${vars.year}年 月 日", { align: "center" as const, firstIndent: 0, size: Q(12), lineHeight: H(20) }),
      ],
    },
  ],
};

// ------
// ヘッダ・フッタ
// ------
const header = {
  type: "flow" as const,
  position: "pillar" as const,
  blockOffset: -12,
  blocks: [
    box(
      [p("論文タイトル", { align: "right" as const, firstIndent: 0, size: 3, lineHeight: 4.5 })],
      { padding: physical(0, 0, 2, 0) },
    ),
  ],
  page: (pageIndex: number) => pageIndex >= 1,
};

const footer = {
  type: "flow" as const,
  position: "nombre" as const,
  blockOffset: 10,
  blocks: [p([[page]], { align: "center" as const, firstIndent: 0, size: 3, lineHeight: 4.5 })],
  page: (pageIndex: number) => pageIndex >= 1,
};

// ------
// 本文
// ------
const mainBody: Body = [
  header,
  footer,

  // 概要
  h1("概要"),
  p(
    "本論文では，〜について研究しました．" +
    "〜の問題に対して，〜手法を提案しました．" +
    "実験により，〜であることを確認しました．",
  ),
  newpage(),

  // 目次ページ（内容は手動で記述）
  h1("目次"),
  p("1. はじめに　…　1"),
  p("2. 関連研究　…　3"),
  p("3. 提案手法　…　7"),
  p("4. 実験と評価　…　12"),
  p("5. 考察　…　18"),
  p("6. おわりに　…　20"),
  p("参考文献　…　21"),
  newpage(),

  // 本文章
  h1("はじめに"),
  p("研究の背景と動機を説明します．"),

  h2("研究背景"),
  p([["〜という問題が存在します", fn("bg-note"), "．"]]),
  footnote("bg-note", "この問題の詳細は文献 [1] を参照してください．"),

  h2("研究目的"),
  p("本研究の目的は，〜です．"),
  li1("目的1：〜"),
  li1("目的2：〜"),
  li1("目的3：〜"),
  vspace(4),

  h2("本論文の構成"),
  p("本論文は以下のように構成されます．"),

  newpage(),

  h1("関連研究"),
  p("関連研究を概観します．"),

  h2("先行研究A"),
  p("先行研究Aについての説明．"),

  h2("先行研究B"),
  p("先行研究Bについての説明と本研究との差別化．"),

  newpage(),

  h1("提案手法"),
  p("提案手法の詳細を説明します．"),

  h2("概要"),
  p("提案手法の全体的な流れを説明します．"),

  h2("詳細"),
  h3("ステップ1"),
  p("ステップ1の詳細説明．"),
  math(["\\\\hat{y} = \\\\text{argmax}_{y \\\\in Y} P(y | x)"]),

  h3("ステップ2"),
  p("ステップ2の詳細説明．"),
  code(
    [
      "def propose(x):",
      "    # 提案手法の実装",
      "    return result",
    ],
    "python",
  ),

  newpage(),

  h1("実験と評価"),
  p("実験設定と結果について述べます．"),

  h2("実験設定"),
  p("実験の設定を説明します．"),

  h2("実験結果"),
  box(
    [
      figure("result.png", { width: ratio(0.9), align: "center" }),
      caption("実験結果のグラフ"),
    ],
    { float: "top" as const },
  ),
  p("実験結果について説明します．"),

  newpage(),

  h1("考察"),
  p("実験結果の考察を述べます．"),

  newpage(),

  h1("おわりに"),
  p("本研究のまとめと今後の課題を述べます．"),

  h2("まとめ"),
  p("本論文では，〜を提案しました．"),

  h2("今後の課題"),
  p("今後は〜を検討する予定です．"),

  newpage(),

  h1("参考文献"),
  li1('[1] 著者名, "論文タイトル," 学会名, vol. 1, pp. 1-10, 2024.'),
  li1('[2] Author Name, "Paper Title," Conference Name, pp. 1-10, 2024.'),
];

export const mainGroup: Group = {
  body: mainBody,
  pageIndex: 1,
};
`;

export const thesis: Template = {
  displayName: "卒業論文/修士論文",
  description: "学位論文（A4, 横組，タイトルページあり）",
  files: (vars) => ({
    "package.json": packageJson(vars),
    "tsconfig.json": tsconfigJson(),
    "index.ts": indexTs(vars),
    "document.ts": documentTs(vars),
    ".gitignore": gitignore(),
    "CLAUDE.md": claudeMd(vars, "thesis"),
    "fonts/README.md": fontsReadme(),
    "result.png": createPlaceholderPng(400, 250),
  }),
};
