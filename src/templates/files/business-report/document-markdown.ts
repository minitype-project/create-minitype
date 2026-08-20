import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  all,
  type Block,
  type Body,
  bottom,
  box,
  cmyk,
  command,
  em,
  fill,
  h1,
  type InlineOrExtender,
  type MarkdownMapping,
  mdFile,
  newpage,
  p,
  physical,
  Q,
  solid,
  type Text,
  vspace,
  type YamlParseResult,
} from "@minitype/minitype";

import {
  background,
  callout,
  coverBackground,
  cyan,
  disclaimer,
  footer,
  h2 as h2Styled,
  header,
  metric,
  panel,
  visual,
  white,
} from "./utils.js";

// ------
// 表紙
// ------

interface CoverMeta {
  title: string[];
  subtitle: string;
  date: string;
  disclaimer: string;
  coverNote: string;
}

const buildCoverBlocks = (coverMeta: CoverMeta): Block[] => {
  return [
    box(
      [
        p("BUSINESS REPORT", {
          firstIndent: 0,
          size: 4,
          lineHeight: 6,
          effects: [fill(cyan)],
        }),
        vspace(4),
        h1(
          coverMeta.title.map((line) => [line]),
          {
            effects: [fill(white)],
            size: Q(44),
            lineHeight: em(1.4),
          },
        ),
        p(coverMeta.subtitle, {
          firstIndent: 0,
          size: Q(22),
          lineHeight: em(1.5),
          effects: [fill(white)],
        }),
        vspace(8),
        p(coverMeta.date, {
          firstIndent: 0,
          size: Q(20),
          lineHeight: 6,
          effects: [fill(cyan)],
        }),
      ],
      { padding: physical(24, 0, 10, 0), margin: bottom(32) },
    ),
    box([p(coverMeta.disclaimer, { firstIndent: 0, effects: [fill(white)] })], {
      padding: physical(4, 5),
      margin: bottom(5),
      background: [fill(cmyk(100, 100, 100, 100, 0.2))],
      border: all(solid(0.35, cyan)),
      borderRadius: 2,
    }),
    p(coverMeta.coverNote, { firstIndent: 0, effects: [fill(white)] }),
  ];
};

// ------
// テキスト抽出
// ------

const inlineToText = (inline: InlineOrExtender): string => {
  if (typeof inline === "string") {
    return inline;
  }
  if (typeof inline === "object" && "body" in inline) {
    return (inline.body as InlineOrExtender[]).map(inlineToText).join("");
  }
  return "";
};

const blockToText = (block: Block): string => {
  if (block.type !== "text") {
    return "";
  }
  return (block as Text).lines.flat().map(inlineToText).join("");
};

// ------
// カスタムマッパー
// ------

interface MetricData {
  label: string;
  value: string;
  note: string;
}

const metricMapper = (result: YamlParseResult): Block => {
  if (!result.ok) {
    return p("", { firstIndent: 0 });
  }
  const data = result.data as MetricData;
  const { label = "", value = "", note = "" } = data ?? {};
  return metric(String(label), String(value), String(note));
};

const mapping: MarkdownMapping = {
  h2: (inlines) => h2Styled(inlines.map(inlineToText).join("")),

  strong: (inlines) =>
    command(inlines, {
      name: "b",
      style: { font: "SourceHanSansJP-Bold" },
    }),

  image: (src) => visual(src),

  hr: () => newpage(),

  yaml: {
    metric: metricMapper,
  },

  containers: {
    callout: (innerBlocks) => {
      const titleIdx = innerBlocks.findIndex(
        (blk) => blk.type === "text" && (blk as Text).textType === "h3",
      );
      const title = titleIdx >= 0 ? blockToText(innerBlocks[titleIdx]) : "";
      const bodyBlocks = innerBlocks.filter((_, index) => index !== titleIdx);
      return callout(title, bodyBlocks.map(blockToText).join(""));
    },
    panel: (innerBlocks) => panel(innerBlocks),
    disclaimer: (innerBlocks) => disclaimer(innerBlocks),
    newpage: () => newpage(),
  },
};

// ------
// ドキュメント生成
// ------

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { blocks, frontmatter } = await mdFile(
  path.join(__dirname, "document.md"),
  mapping,
);

const defaultMeta: CoverMeta = {
  title: ["ドキュメントタイトル"],
  subtitle: "",
  date: "",
  disclaimer: "",
  coverNote: "",
};
const meta = { ...defaultMeta, ...frontmatter } as CoverMeta;

export const body: Body = [
  background,
  coverBackground,
  header,
  footer,
  ...buildCoverBlocks(meta),
  ...blocks,
];
