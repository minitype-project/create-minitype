import { type Gap, H, minitype, physical, Q } from "@minitype/minitype";
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
        size: Q(13),
        lineHeight: H(18),
        firstIndent: 0,
      },
      h1: {
        font: "SourceHanSansJP-Bold",
        size: Q(20),
        lineHeight: H(28),
      },
      h2: {
        font: "SourceHanSansJP-Bold",
        size: Q(16),
        lineHeight: H(24),
      },
    },
    command: {
      b: { font: "SourceHanSansJP-Bold" },
    },
    gaps: [
      ["paragraph", "paragraph", 2],
      ["fallback", "fallback", 2],
    ] as Gap[],
  },
  {
    fontDir: "fonts",
    disableDefaultTransformers: true,
  },
).save("output.pdf");
