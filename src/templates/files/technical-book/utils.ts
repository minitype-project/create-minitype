import {
  all,
  type Block,
  bottom,
  box,
  cmyk,
  code as codeInner,
  fill,
  h2 as h2Inner,
  left,
  physical,
  solid,
} from "@minitype/minitype";

export const keyColor = cmyk(85, 55, 0, 20);
export const subColor = cmyk(5, 0, 0, 0);

export const h2 = (title: string) => {
  return box([h2Inner(title)], {
    padding: physical(2, 4),
    border: left(solid(1, keyColor)),
  });
};

export const code = (lines: string, lang: string) => {
  return box([codeInner(lines, lang)], {
    padding: physical(3.5, 4),
    borderRadius: 2,
    background: [fill(subColor)],
  });
};

export const abstract = (inner: Block[]) => {
  return box(inner, {
    margin: bottom(2),
    padding: physical(3, 4),
    border: all(solid(0.2, keyColor)),
    borderRadius: 2,
  });
};
