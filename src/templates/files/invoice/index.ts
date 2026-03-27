import { type Gap, H, minitype, physical, Q } from "minitype";
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
        size: Q(13),
        lineHeight: H(18),
        firstIndent: 0,
      },
      headings: [
        {
          font: "SourceHanSansJP-Bold",
          size: Q(20),
          lineHeight: H(28),
        },
        {
          font: "SourceHanSansJP-Bold",
          size: Q(16),
          lineHeight: H(24),
        },
      ],
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
