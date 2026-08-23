import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  type Block,
  type Body,
  easytable,
  figure,
  float,
  type InlineOrExtender,
  lstlisting,
  type MarkdownMapping,
  math,
  mdFile,
  p,
  physical,
  ratio,
  type YamlParseResult,
} from "@minitype/minitype";

import { c, code as codeStyled, h2, h3 } from "./helper.js";

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

// ------
// カスタムマッパ
// ------

interface LstlistingData {
  title: string;
  lang: string;
  content: string;
}

const lstlistingMapper = (result: YamlParseResult): Block => {
  if (!result.ok) {
    return p("", { firstIndent: 0 });
  }
  const {
    title = "",
    lang = "text",
    content = "",
  } = result.data as LstlistingData;
  const lines = content.split("\n");
  if (lines.at(-1) === "") {
    lines.pop();
  }
  return lstlisting(lines, { lang, title });
};

interface MathData {
  formula: string;
}

const mathMapper = (result: YamlParseResult): Block | Block[] => {
  if (!result.ok) {
    return p("", { firstIndent: 0 });
  }
  const { formula = "" } = result.data as MathData;
  return float("top", [math([formula])]);
};

const mapping: MarkdownMapping = {
  h2: (inlines) => h2(inlines.map(inlineToText).join("")),
  h3: (inlines) => h3(inlines.map(inlineToText).join("")),
  code: (codeStr, lang) => codeStyled(codeStr, lang),
  codespan: (text) => c(text),
  image: (src, alt, title) =>
    figure(src, title ?? alt, { width: ratio(0.85), align: "center" }),
  table: (header, rows) =>
    easytable([header, ...rows], {
      style: {
        cellPadding: physical(2, 3),
        textStyle: (rowIndex) => ({
          font:
            rowIndex === 0
              ? "SourceHanSansJP-Regular"
              : "SourceHanSerifJP-Regular",
        }),
      },
    }),
  yaml: {
    lstlisting: lstlistingMapper,
    math: mathMapper,
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
  title: "{{projectName}}",
  lead: "",
};
const meta = { ...defaultMeta, ...frontmatter };

export const bookTitle = String(meta.title);
export const leadText = String(meta.lead);
export const sections: Body = blocks;
