import { H, minitype, physical, Q } from "minitype";
import { body } from "./document.js";

await minitype(
  [{ body }],
  {
    size: "A4" as const,
    writingMode: "horizontal" as const,
    padding: physical(25),
    block: {
      paragraph: {
        font: "SourceHanSansJP-Regular",
        size: Q(12),
        lineHeight: H(18),
        firstIndent: 0,
      },
      headings: [
        {
          font: "SourceHanSansJP-Bold",
          size: Q(32),
          lineHeight: H(30),
          firstIndent: 0,
        },
        {
          font: "SourceHanSansJP-Bold",
          size: Q(16),
          lineHeight: H(20),
          firstIndent: 0,
          needspace: Q(40),
        },
      ],
      list: {
        indent: 0,
      },
    },
    command: {
      b: { font: "SourceHanSansJP-Bold" },
    },
    gaps: [
      ["h2", "fallback", 4],
      ["list1", "list1", 1],
      ["paragraph", "h2", 6],
      ["paragraph", "paragraph", 2],
      ["fallback", "fallback", 4],
    ],
  },
  { fontDir: "fonts" },
).save("output.pdf");
