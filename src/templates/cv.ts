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
  minitype,
  physical,
  Q,
  H,
} from "minitype";
import { body } from "./document.js";

await minitype(
  [{ body }],
  "output.pdf",
  {
    size: "A4" as const,
    writingMode: "horizontal" as const,
    padding: physical(20, 20, 20, 20),
    block: {
      paragraph: {
        font: "SourceHanSansJP-Regular",
        size: Q(11),
        lineHeight: H(18),
        firstIndent: 0,
      },
      headings: [
        { font: "SourceHanSansJP-Bold", size: Q(20), lineHeight: H(30), firstIndent: 0 },
        { font: "SourceHanSansJP-Bold", size: Q(13), lineHeight: H(20), firstIndent: 0 },
      ],
    },
    command: {
      b: { font: "SourceHanSansJP-Bold" },
    },
    gaps: [
      ["h2", "paragraph", 2],
      ["paragraph", "h2", 6],
      ["paragraph", "paragraph", 2],
      ["fallback", "fallback", 4],
    ] as [string, string, number][],
  },
  { fontDir: "fonts" },
);
`;

const documentTs = (vars: TemplateVars) => `\
import type { Body } from "minitype";
import {
  box,
  cmyk,
  easytable,
  flexbox,
  fr,
  h1,
  h2,
  li1,
  p,
  physical,
  Q,
  H,
  ratio,
  solid,
  vspace,
  url,
} from "minitype";

// ------
// 履歴書の設定（ここを編集してください）
// ------
const profile = {
  name: "${vars.author || "氏名"}",
  nameEn: "Your Name",
  birthDate: "19XX年XX月XX日生",
  email: "your.email@example.com",
  github: "github.com/yourname",
  website: "https://yourwebsite.com",
  summary: "〜に関する研究開発に携わってきました．特に〜の分野で〜の実績があります．",
};

const education = [
  { period: "${vars.year}年3月", event: "〇〇大学 〇〇学部 卒業" },
  { period: "${vars.year}年4月", event: "〇〇大学大学院 〇〇専攻 入学" },
  { period: "${vars.year}年3月", event: "〇〇大学大学院 〇〇専攻 修了" },
];

const work = [
  {
    period: "${vars.year}年4月 〜 現在",
    company: "株式会社〇〇",
    role: "エンジニア",
    description: "〜の開発を担当．〜を実現し，〜の効率が〇〇%向上した．",
  },
  {
    period: "${vars.year}年 〜 ${vars.year}年",
    company: "〇〇（インターン）",
    role: "ソフトウェアエンジニアインターン",
    description: "〜の機能開発を担当．",
  },
];

const skills = {
  "プログラミング言語": ["TypeScript", "Python", "Rust", "Go"],
  "フレームワーク・ライブラリ": ["React", "Node.js", "FastAPI"],
  "ツール・インフラ": ["Git", "Docker", "AWS", "Linux"],
  "言語": ["日本語（母語）", "英語（TOEIC 000点）"],
};

const publications = [
  "著者名, \\"論文タイトル,\\" 学会名, ${vars.year}.",
];

// ------
// レイアウト
// ------
const sectionHeader = (title: string) =>
  box(
    [h2(title)],
    {
      padding: physical(2, 0, 2, 4),
      background: cmyk(0, 0, 0, 8),
      border: {
        type: "physical" as const,
        left: solid(3, cmyk(0, 0, 0, 60)),
      },
      margin: physical(0, 0, 4, 0),
    },
  );

const timelineRow = (period: string, content: string) =>
  flexbox([
    box(
      [p(period, { firstIndent: 0, size: Q(10), lineHeight: H(16) })],
      { flexBasis: 35 },
    ),
    box(
      [p(content, { firstIndent: 0 })],
      { flexBasis: fr(1) },
    ),
  ]);

export const body: Body = [
  // ------
  // 名前・プロフィール
  // ------
  flexbox([
    box(
      [
        h1(profile.name),
        p(profile.nameEn, { firstIndent: 0, size: Q(12), lineHeight: H(20) }),
        vspace(4),
        p(profile.birthDate, { firstIndent: 0, size: Q(10), lineHeight: H(16) }),
        p([[url(profile.website, profile.website)]], { firstIndent: 0, size: Q(10), lineHeight: H(16) }),
        p(profile.github, { firstIndent: 0, size: Q(10), lineHeight: H(16) }),
        p(profile.email, { firstIndent: 0, size: Q(10), lineHeight: H(16) }),
      ],
      { flexBasis: ratio(0.6) },
    ),
    box(
      [
        // プロフィール写真のプレースホルダ
        box(
          [p("写真", { align: "center" as const, firstIndent: 0 })],
          {
            padding: physical(20, 0),
            background: cmyk(0, 0, 0, 5),
            border: { type: "physical" as const, ...Object.fromEntries(
              (["top", "right", "bottom", "left"] as const).map((dir) => [
                dir,
                solid(0.5, cmyk(0, 0, 0, 30)),
              ]),
            )},
          },
        ),
      ],
      { flexBasis: ratio(0.4), padding: physical(0, 0, 0, 10) },
    ),
  ]),
  vspace(4),

  // 概要
  box(
    [p(profile.summary, { firstIndent: 0 })],
    {
      padding: physical(4, 6),
      background: cmyk(0, 0, 0, 5),
    },
  ),
  vspace(8),

  // ------
  // 学歴
  // ------
  sectionHeader("学歴"),
  ...education.map((item) => timelineRow(item.period, item.event)),
  vspace(8),

  // ------
  // 職歴
  // ------
  sectionHeader("職歴・経験"),
  ...work.map((item) =>
    box(
      [
        flexbox([
          box(
            [p(item.period, { firstIndent: 0, size: Q(10), lineHeight: H(16) })],
            { flexBasis: 45 },
          ),
          box(
            [
              p(\`\${item.company}  \${item.role}\`, {
                firstIndent: 0,
                font: "SourceHanSansJP-Bold",
              }),
              p(item.description, { firstIndent: 0, size: Q(10), lineHeight: H(17) }),
            ],
            { flexBasis: fr(1) },
          ),
        ]),
      ],
      { margin: physical(0, 0, 4, 0) },
    ),
  ),
  vspace(8),

  // ------
  // スキル
  // ------
  sectionHeader("スキル"),
  easytable(
    Object.entries(skills).map(([category, items]) => [
      p(category, { firstIndent: 0, font: "SourceHanSansJP-Bold" }),
      p(items.join("，"), { firstIndent: 0 }),
    ]),
    {
      columnWidths: [50, fr(1)],
      horizontalBorders: (_rowIndex: number, _rowCount: number) =>
        (solid(0.3, cmyk(0, 0, 0, 20))),
    },
  ),
  vspace(8),

  // ------
  // 発表・出版物
  // ------
  ...(publications.length > 0
    ? [
        sectionHeader("発表・出版物"),
        ...publications.map((pub, i) => p(\`[\${i + 1}] \${pub}\`, { firstIndent: 0 })),
      ]
    : []),
];
`;

export const cv: Template = {
  displayName: "履歴書",
  description: "履歴書・CV（A4, 横組）",
  files: (vars) => ({
    "package.json": packageJson(vars),
    "tsconfig.json": tsconfigJson(),
    "index.ts": indexTs(vars),
    "document.ts": documentTs(vars),
    ".gitignore": gitignore(),
    "CLAUDE.md": claudeMd(vars, "cv"),
    "fonts/README.md": fontsReadme(),
  }),
};
