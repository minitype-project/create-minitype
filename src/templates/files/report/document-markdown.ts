import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  type Body,
  type CodeMapper,
  cmyk,
  code,
  type Flow,
  h1,
  mdString,
  p,
  page,
  physical,
  solid,
  vspace,
} from "@minitype/minitype";
import { parse } from "yaml";

// ------
// ヘッダ・フッタ
// ------

const header: Flow = {
  type: "flow",
  position: "pillar",
  blockOffset: -10,
  blocks: [
    p("{{projectName}}", {
      align: "right",
      firstIndent: 0,
      size: 3,
      lineHeight: 4.5,
    }),
  ],
  page: (pageIndex: number) => pageIndex >= 1,
};

const footer: Flow = {
  type: "flow",
  position: "nombre",
  blockOffset: 8,
  blocks: [
    p([[page]], {
      align: "center",
      firstIndent: 0,
      size: 3,
      lineHeight: 4.5,
    }),
  ],
};

const codeMapper: CodeMapper = (_code: string, lang?: string) => {
  return [
    {
      type: "box",
      blocks: [code(_code, lang)],
      style: {
        padding: physical(3, 2),
        border: physical(solid(0.2, cmyk(0, 0, 0, 80)), undefined),
        gapRole: "code",
      },
    },
  ];
};

// ------
// 本文
// ------

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const content = readFileSync(path.join(__dirname, "document.md"), "utf-8");
const match = content.match(/^---\r?\n([\s\S]+?)\r?\n---\r?\n/);

let title = "レポートタイトル";
let author = "著者名：〇〇 〇〇";
let showDate = true;
let bodyContent = content;

if (match) {
  const frontmatter = parse(match[1]);
  title = frontmatter.title ?? title;
  author = frontmatter.author ?? author;
  showDate = frontmatter.date ?? true;
  bodyContent = content.slice(match[0].length);
}

const formatDate = (date: Date): string => {
  const weekdayLabels = ["日", "月", "火", "水", "木", "金", "土"];
  const weekday = weekdayLabels[date.getDay()];
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日（${weekday}）`;
};

const today = formatDate(new Date());

export const body: Body = [
  header,
  footer,

  // タイトル
  h1(title),
  p([[author]], {
    align: "center",
    firstIndent: 0,
  }),
  ...(showDate ? [p([[today]], { align: "center" })] : []),
  vspace(6),

  ...mdString(bodyContent, { code: codeMapper }).blocks,
];
