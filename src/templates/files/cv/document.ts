import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Body } from "minitype";
import {
  box,
  cmyk,
  easytable,
  flexbox,
  fr,
  H,
  h1,
  h2,
  li1,
  p,
  physical,
  Q,
  ratio,
  solid,
  url,
  vspace,
} from "minitype";
import { parse } from "yaml";

// ------
// 型定義
// ------
interface Profile {
  name: string;
  nameEn: string;
  birthDate: string;
  email: string;
  github: string;
  website: string;
  summary: string;
}

interface EducationItem {
  period: string;
  event: string;
}

interface WorkItem {
  period: string;
  company: string;
  role: string;
  description: string;
}

interface SkillItem {
  category: string;
  items: string[];
}

interface CvData {
  profile: Profile;
  education: EducationItem[];
  work: WorkItem[];
  skills: SkillItem[];
  publications: string[];
}

// ------
// YAML データの読み込み
// ------
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { profile, education, work, skills, publications } = parse(
  readFileSync(path.join(__dirname, "document.yaml"), "utf-8"),
) as CvData;

// ------
// レイアウト
// ------
const sectionHeader = (title: string) => {
  return box([h2(title)], {
    margin: physical(0, 0, 0, 1),
    padding: physical(2, 0, 2, 4),
    border: {
      type: "physical",
      left: solid(2, cmyk(100, 0, 0, 0)),
    },
    background: cmyk(5, 0, 0, 0),
    gapRole: "h2",
  });
};

const timelineRow = (period: string, content: string) => {
  return flexbox([
    box([p(period)], {
      flexBasis: 35,
    }),
    box([p(content)], { flexBasis: fr(1) }),
  ]);
};

export const body: Body = [
  // プロフィール
  flexbox([
    box(
      [
        h1(profile.name),
        p(profile.nameEn, { firstIndent: 0, size: Q(12), lineHeight: H(20) }),
        vspace(4),
        li1(profile.birthDate),
        li1([[url(profile.website, profile.website)]]),
        li1(profile.github),
        li1(profile.email),
      ],
      { flexBasis: ratio(0.6) },
    ),
    box(
      [
        // 写真
        box([p("写真", { align: "center" as const, firstIndent: 0 })], {
          padding: physical(20, 0),
          background: cmyk(0, 0, 0, 5),
          border: {
            type: "physical" as const,
            ...Object.fromEntries(
              (["top", "right", "bottom", "left"] as const).map((dir) => [
                dir,
                solid(0.2, cmyk(0, 0, 0, 30)),
              ]),
            ),
          },
        }),
      ],
      { flexBasis: ratio(0.4), padding: physical(0, 0, 0, 10) },
    ),
  ]),
  vspace(4),

  // 概要
  box([p(profile.summary, { firstIndent: 0 })], {
    padding: physical(5, 6),
    background: cmyk(5, 0, 0, 5),
  }),
  vspace(8),

  // 学歴
  sectionHeader("学歴"),
  ...education.map((item) => timelineRow(item.period, item.event)),
  vspace(8),

  // 職歴
  sectionHeader("職歴・経験"),
  ...work.map((item) =>
    box([
      flexbox([
        box(
          [
            p(item.period, {
              firstIndent: 0,
              lineHeight: H(16),
            }),
          ],
          { flexBasis: 45 },
        ),
        box(
          [
            p(`${item.company}  ${item.role}`, {
              firstIndent: 0,
              font: "SourceHanSansJP-Bold",
            }),
            p(item.description, {
              firstIndent: 0,
              lineHeight: H(17),
            }),
          ],
          { flexBasis: fr(1) },
        ),
      ]),
    ]),
  ),
  vspace(8),

  // スキル
  sectionHeader("スキル"),
  easytable(
    skills.map(({ category, items }) => [
      p(category, { font: "SourceHanSansJP-Bold" }),
      p(items.join("，")),
    ]),
    {
      columnWidths: [50, fr(1)],
      horizontalBorders: (_rowIndex: number, _rowCount: number) =>
        solid(0.3, cmyk(0, 0, 0, 20)),
    },
  ),
  vspace(8),

  // 発表・出版物
  ...(publications.length > 0
    ? [
        sectionHeader("発表・出版物"),
        ...publications.map((pub, i) =>
          p(`[${i + 1}] ${pub}`, { firstIndent: 0 }),
        ),
      ]
    : []),
];
