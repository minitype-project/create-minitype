import {
  all,
  type Block,
  type Body,
  b,
  bottom,
  box,
  cmyk,
  type Flow,
  fill,
  h1,
  h2 as h2Inner,
  imageFill,
  left,
  p,
  page,
  physical,
  Q,
  rect,
  solid,
} from "@minitype/minitype";

// ------
// サイズ
// ------

export const pageWidth = 182;
export const pageHeight = 257;

// ------
// 色定数
// ------

export const keyColor = cmyk(100, 72, 18, 45);
export const pale = cmyk(8, 2, 0, 0);
export const navy = cmyk(100, 72, 18, 45);
export const cyan = cmyk(64, 6, 0, 0);
export const white = cmyk(0, 0, 0, 0);
export const muted = cmyk(58, 35, 24, 20);

const blue = cmyk(88, 48, 0, 12);
const line = cmyk(42, 12, 0, 0);

// ------
// ブロック定数
// ------

export const header: Flow = {
  type: "flow",
  position: "pillar",
  blockOffset: -16,
  blocks: [
    box(
      [
        p("{{projectName}}", {
          align: (pageIndex: number) =>
            pageIndex % 2 === 1 ? "right" : "left",
          font: "SourceHanSansJP-Regular",
          firstIndent: 0,
          size: 3,
          lineHeight: 4.5,
          effects: [fill(cyan)],
        }),
      ],
      {
        padding: bottom(3),
        border: bottom(solid(0.2, cyan)),
      },
    ),
  ],
  page: (pageIndex: number) => pageIndex > 0,
};

export const footer: Flow = {
  type: "flow",
  position: "nombre",
  blockOffset: 8,
  blocks: [
    p([[page]], {
      align: "center",
      firstIndent: 0,
      size: 3,
      lineHeight: 4.5,
      effects: [fill(muted)],
    }),
  ],
  page: (pageIndex: number) => pageIndex > 0,
};

export const background: Flow = {
  type: "flow",
  position: "page",
  blockOffset: 0,
  blocks: [
    rect(pageWidth, pageHeight, { background: [fill(white)] }),
    rect(pageWidth, 22, { background: [fill(navy)] }),
    rect(pageWidth, 5, { background: [fill(cyan)] }),
    rect(9, pageHeight, { background: [fill(pale)] }),
  ],
  page: () => true,
  zIndex: -30,
};

export const coverBackground: Flow = {
  type: "flow",
  position: "page",
  blockOffset: 0,
  blocks: [
    rect(pageWidth, pageHeight, {
      background: [
        imageFill("src/assets/cover.jpg", "cover", ["middle", "center"]),
      ],
    }),
  ],
  page: (pageIndex: number) => pageIndex === 0,
  zIndex: -20,
};

// ------
// ブロックヘルパ関数
// ------

export const h2 = (title: string) => {
  return box([h2Inner(title)], {
    padding: physical(2, 4),
    border: left(solid(1, keyColor)),
  });
};

export const visual = (src: string): Block => {
  return box(
    [
      rect(Q(14) * 38, 24, {
        background: [imageFill(src, "cover", ["middle", "center"])],
      }),
    ],
    {
      margin: bottom(4),
    },
  );
};

export const panel = (blocks: Block[], _accent = blue): Block => {
  return box(blocks, {
    padding: physical(4, 5),
    margin: bottom(5),
    border: all(solid(0.25, line)),
    background: [fill(cmyk(4, 1, 0, 0))],
    borderRadius: 2,
  });
};

export const callout = (title: string, text: string): Block => {
  return box(
    [
      p([[b(title)]], { firstIndent: 0, effects: [fill(navy)] }),
      p(text, { firstIndent: 0 }),
    ],
    {
      padding: physical(3, 4),
      margin: bottom(5),
      border: all(solid(0.35, cyan)),
      background: [fill(cmyk(12, 2, 0, 0))],
      borderRadius: 2,
    },
  );
};

export const metric = (label: string, value: string, note: string): Block => {
  return box(
    [
      p(label, {
        firstIndent: 0,
        size: 3,
        lineHeight: 5,
        effects: [fill(muted)],
      }),
      p([[b(value)]], {
        firstIndent: 0,
        size: 6,
        lineHeight: 8,
        effects: [fill(navy)],
      }),
      p(note, {
        firstIndent: 0,
        size: 3,
        lineHeight: 5,
        effects: [fill(muted)],
      }),
    ],
    {
      padding: physical(3, 4),
      margin: bottom(3),
      border: all(solid(0.25, line)),
      background: [fill(white)],
      borderRadius: 2,
    },
  );
};

export const section = (title: string, blocks: Block[]): Body => {
  return [h1(title), ...blocks];
};

export const disclaimer = (blocks: Block[]): Block => {
  return box(blocks, {
    padding: physical(4, 5),
    margin: bottom(5),
    border: all(solid(0.25, cmyk(0, 0, 0, 50))),
    background: [fill(cmyk(0, 0, 0, 5))],
    borderRadius: 2,
  });
};
