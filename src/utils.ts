import sharp from "sharp";

/**
 * プレースホルダの PNG 画像を生成する．
 * @param width 画像の幅（px）
 * @param height 画像の高さ（px）
 */
export const createPlaceholderPng = (width: number, height: number) => {
  const gray = 200;
  return sharp({
    create: {
      width,
      height,
      channels: 3,
      background: { r: gray, g: gray, b: gray },
    },
  })
    .png()
    .toBuffer();
};
