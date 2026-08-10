import { H, minitype, physical, Q } from "@minitype/minitype";
import { body } from "./document.js";

await minitype(
  [{ body }],
  {
    size: "A4",
    writingMode: "horizontal",
    padding: physical(25),
    block: {
      paragraph: {
        font: "SourceHanSansJP-Regular",
        size: Q(12),
        lineHeight: H(18),
        firstIndent: 0,
      },
      h1: {
        font: "SourceHanSansJP-Bold",
        size: Q(32),
        lineHeight: H(30),
      },
      h2: {
        font: "SourceHanSansJP-Bold",
        size: Q(16),
        lineHeight: H(20),
        needspace: Q(40),
      },
      li1: {
        indent: 0,
      },
    },
    command: {
      b: { font: "SourceHanSansJP-Bold" },
    },
    gaps: [
      ["h2", "fallback", 4],
      ["li1", "li1", 1],
      ["paragraph", "h2", 6],
      ["paragraph", "paragraph", 2],
      ["fallback", "fallback", 4],
    ],
  },
  { fontDir: "fonts" },
).save("output.pdf");
