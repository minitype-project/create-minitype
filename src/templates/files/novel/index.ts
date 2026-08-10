import {
  type Body,
  calculatePhysicalPadding,
  type DocumentStyle,
  em,
  type Flow,
  H,
  mdFile,
  minitype,
  type PageSize,
  p,
  page,
  Q,
  type WritingMode,
} from "@minitype/minitype";

type NovelFrontmatter = Record<string, unknown> & {
  title?: unknown;
  paperSize?: unknown;
  charsPerLine?: unknown;
  lines?: unknown;
  fontSize?: unknown;
  lineHeight?: unknown;
  pillarFontSize?: unknown;
  nombreFontSize?: unknown;
  pillarOffset?: unknown;
  nombreOffset?: unknown;
  nombreStartPage?: unknown;
};

const paperSizes = new Set([
  "A0",
  "A1",
  "A2",
  "A3",
  "A4",
  "A5",
  "A6",
  "B0",
  "B1",
  "B2",
  "B3",
  "B4",
  "B5",
  "B6",
]);

const readTitle = (value: unknown): string => {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(
      "frontmatter の title には空でない文字列を指定してください．",
    );
  }
  return value.trim();
};

const readPaperSize = (value: unknown) => {
  if (typeof value !== "string" || !paperSizes.has(value.toUpperCase())) {
    throw new Error(
      "frontmatter の paperSize には A0–A6 または B0–B6 を指定してください．",
    );
  }
  return value.toUpperCase() as PageSize;
};

const readPositiveInteger = (name: string, value: unknown): number => {
  if (typeof value === "number" && Number.isInteger(value) && value > 0) {
    return value;
  }
  throw new Error(
    `frontmatter の ${name} には 0 より大きい整数を指定してください．`,
  );
};

const readFontSize = (value: unknown): number => {
  if (value === undefined) {
    return 12;
  }
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return value;
  }

  throw new Error(
    "frontmatter の fontSize には 0 より大きい数値（Q）を指定してください．",
  );
};

const readLineHeight = (value: unknown): number => {
  if (value === undefined) {
    return 19;
  }
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return value;
  }

  throw new Error(
    "frontmatter の lineHeight には 0 より大きい数値（Q）を指定してください．",
  );
};

const readPositiveQ = (name: string, value: unknown): number => {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return value;
  }
  throw new Error(
    `frontmatter の ${name} には 0 より大きい数値（Q）を指定してください．`,
  );
};

const readOffset = (name: string, value: unknown): number => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  throw new Error(`frontmatter の ${name} には数値（mm）を指定してください．`);
};

const readPillarStartPage = (value: unknown): number => {
  if (value === undefined) {
    return 1;
  }
  return readPositiveInteger("nombreStartPage", value);
};

const { blocks, frontmatter } =
  await mdFile<NovelFrontmatter>("src/document.md");
const title = readTitle(frontmatter.title);
const size = readPaperSize(frontmatter.paperSize);
const charsPerLine = readPositiveInteger(
  "charsPerLine",
  frontmatter.charsPerLine,
);
const lines = readPositiveInteger("lines", frontmatter.lines);
const fontSize = readFontSize(frontmatter.fontSize);
const lineHeight = readLineHeight(frontmatter.lineHeight);
const pillarFontSize = readPositiveQ(
  "pillarFontSize",
  frontmatter.pillarFontSize,
);
const nombreFontSize = readPositiveQ(
  "nombreFontSize",
  frontmatter.nombreFontSize,
);
const pillarOffset = readOffset("pillarOffset", frontmatter.pillarOffset);
const nombreOffset = readOffset("nombreOffset", frontmatter.nombreOffset);
const pillarStartPage = readPillarStartPage(frontmatter.pillarStartPage);

const header: Flow = {
  type: "flow",
  position: "pillar",
  writingMode: "horizontal",
  blockOffset: pillarOffset,
  blocks: [
    p(title, {
      align: "right",
      firstIndent: 0,
      size: Q(pillarFontSize),
      lineHeight: Q(pillarFontSize * 1.5),
    }),
  ],
  page: (pageIndex: number) => pageIndex >= pillarStartPage - 1,
};

const footer: Flow = {
  type: "flow",
  position: "nombre",
  writingMode: "horizontal",
  blockOffset: nombreOffset,
  blocks: [
    p([[page]], {
      align: "center",
      firstIndent: 0,
      size: Q(nombreFontSize),
      lineHeight: Q(nombreFontSize * 1.5),
    }),
  ],
};

const body: Body = [header, footer, ...blocks];
const writingMode: WritingMode = "vertical";
const paragraphFontSize = Q(fontSize);
const paragraphLineHeight = Q(lineHeight);
const padding = calculatePhysicalPadding(
  size,
  charsPerLine,
  lines,
  paragraphFontSize,
  paragraphLineHeight,
  writingMode,
);

const style: Partial<DocumentStyle> = {
  size,
  writingMode,
  padding,
  block: {
    paragraph: {
      font: "SourceHanSerifJP-Regular",
      size: paragraphFontSize,
      lineHeight: paragraphLineHeight,
      firstIndent: em(1),
    },
    h1: {
      font: "SourceHanSerifJP-Regular",
      size: Q(18),
      lineHeight: H(28),
      firstIndent: em(4),
      headingNumberFormat: () => "",
    },
    h2: {
      font: "SourceHanSerifJP-Regular",
      size: Q(13),
      lineHeight: H(22),
      firstIndent: em(4),
      headingNumberFormat: () => "",
    },
    footnote: {
      font: "SourceHanSerifJP-Regular",
      size: Q(9),
      firstIndent: 0,
    },
  },
  gaps: [
    ["h1", "h2", 6],
    ["h1", "paragraph", 4],
    ["h2", "paragraph", 2],
    ["paragraph", "h1", 16],
    ["paragraph", "h2", 8],
    ["paragraph", "paragraph", 0],
    ["fallback", "fallback", 4],
  ],
};

await minitype([{ body }], style, { fontDir: "fonts" }).save("output.pdf");
