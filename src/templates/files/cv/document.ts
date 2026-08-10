import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  type Body,
  box,
  type Command,
  cmyk,
  fill,
  flexbox,
  fr,
  H,
  h1,
  h2,
  hbox,
  image,
  li1,
  p,
  physical,
  Q,
  ratio,
  solid,
  url,
  vspace,
} from "@minitype/minitype";
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
  photo?: string;
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
  settings: {
    "key-cmyk": [number, number, number, number];
    "sub-cmyk": [number, number, number, number];
  };
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
const { settings, profile, education, work, skills, publications } = parse(
  readFileSync(path.join(__dirname, "document.yaml"), "utf-8"),
) as CvData;

const keyColor = cmyk(...settings["key-cmyk"]);
const subColor = cmyk(...settings["sub-cmyk"]);

// ------
// レイアウト
// ------
const sectionHeader = (title: string) => {
  return box([h2(title)], {
    margin: physical(0, 0, 0, 1),
    padding: physical(2, 0, 2, 4),
    border: {
      type: "physical",
      left: solid(2, keyColor),
    },
    background: [fill(subColor)],
    gapRole: "h2",
  });
};

const timelineRow = (period: string, content: string) => {
  return flexbox([
    box([p(period)], {
      inlineSize: 35,
    }),
    box([p(content)], { inlineSize: fr(1) }),
  ]);
};

const b = (content: string): Command => {
  return { type: "command", name: "b", body: [content] };
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
      { inlineSize: ratio(0.6) },
    ),
    box(
      [
        // 写真
        profile.photo && existsSync(profile.photo)
          ? image(profile.photo, { height: 35, align: "right" })
          : box([p("写真", { align: "center", firstIndent: 0 })], {
              padding: physical(20, 0),
              background: [fill(cmyk(0, 0, 0, 5))],
              border: {
                type: "physical",
                ...Object.fromEntries(
                  ["top", "right", "bottom", "left"].map((dir) => [
                    dir,
                    solid(0.2, cmyk(0, 0, 0, 30)),
                  ]),
                ),
              },
            }),
      ],
      { inlineSize: ratio(0.4), padding: physical(0, 0, 0, 10) },
    ),
  ]),
  vspace(4),

  // 概要
  box([p(profile.summary, { firstIndent: 0 })], {
    padding: physical(5, 6),
    background: [fill(subColor)],
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
        box([p(item.period)], { inlineSize: 45 }),
        box([p([[b(`${item.company}  ${item.role}`)], [item.description]])], {
          inlineSize: fr(1),
        }),
      ]),
    ]),
  ),
  vspace(8),

  // スキル
  sectionHeader("スキル"),
  ...skills.map(({ category, items }) =>
    box([
      flexbox([
        box([p([[b(category)]])], { inlineSize: 35 }),
        box([p(items.join("，"))], { inlineSize: fr(1) }),
      ]),
    ]),
  ),
  vspace(8),

  // 発表・出版物
  ...(publications.length > 0
    ? [
        sectionHeader("発表・出版物"),
        ...publications.map((pub, i) =>
          p([[hbox(Q(24), [`[${i + 1}]`]), pub]], {
            indent: Q(24),
            firstIndent: Q(-24),
          }),
        ),
      ]
    : []),
];
