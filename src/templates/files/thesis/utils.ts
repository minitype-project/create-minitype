import type { HeadingLevel, Text } from "@minitype/minitype";

export const regularFont = "SourceHanSerifJP-Regular";
export const boldFont = "SourceHanSansJP-Bold";

const heading = (
  level: HeadingLevel,
  text: string,
  id: string,
  unnumbered?: boolean,
): Text => {
  return {
    type: "text",
    textType: level === 1 ? "h1" : level === 2 ? "h2" : "h3",
    lines: [[text]],
    id,
    unnumbered,
  };
};

export const H1 = (text: string, id: string, unnumbered?: boolean): Text => {
  return heading(1, text, id, unnumbered);
};

export const H2 = (text: string, id: string, unnumbered?: boolean): Text => {
  return heading(2, text, id, unnumbered);
};

export const H3 = (text: string, id: string, unnumbered?: boolean): Text => {
  return heading(3, text, id, unnumbered);
};
