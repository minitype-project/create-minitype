import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  type Block,
  type Body,
  command,
  type InlineOrExtender,
  type MarkdownMapping,
  mdFile,
  newpage,
  p,
  type Text,
  type YamlParseResult,
} from "@minitype/minitype";

import {
  callout,
  disclaimer,
  h2 as h2Styled,
  metric,
  panel,
  visual,
} from "./helper.js";

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

const defaultMeta = {
  label: "BUSINESS REPORT",
  title: ["ドキュメントタイトル"],
  subtitle: "",
  date: "",
  disclaimer: "",
  coverNote: "",
};
const meta = { ...defaultMeta, ...frontmatter };

export const coverLabel = String(meta.label);
export const coverTitle = meta.title as string[];
export const coverDate = String(meta.date);
export const coverSubtitle = String(meta.subtitle);
export const coverDisclaimer = String(meta.disclaimer);
export const coverNote = String(meta.coverNote);
export const sections: Body = blocks;
