/**
 * プレースホルダ PNG 画像を生成する
 *
 * 最小限の PNG バイナリを生成する．
 * テンプレートのサンプル figure 用に使用する．
 */

import zlib from "node:zlib";

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c;
  }
  return table;
})();

function crc32(buf: Uint8Array): number {
  let crc = 0xffffffff;
  for (const byte of buf) {
    crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function writeUint32BE(buf: Buffer, offset: number, value: number): void {
  buf[offset] = (value >>> 24) & 0xff;
  buf[offset + 1] = (value >>> 16) & 0xff;
  buf[offset + 2] = (value >>> 8) & 0xff;
  buf[offset + 3] = value & 0xff;
}

function makeChunk(type: string, data: Buffer): Buffer {
  const typeBytes = Buffer.from(type, "ascii");
  const length = data.length;
  const chunk = Buffer.allocUnsafe(4 + 4 + length + 4);
  writeUint32BE(chunk, 0, length);
  typeBytes.copy(chunk, 4);
  data.copy(chunk, 8);
  const crc = crc32(Buffer.concat([typeBytes, data]));
  writeUint32BE(chunk, 8 + length, crc);
  return chunk;
}

/**
 * グレーのプレースホルダ PNG 画像を生成する
 * @param width 画像の幅（px）
 * @param height 画像の高さ（px）
 * @param label ラベルテキスト（PNG には埋め込まれない）
 */
export function createPlaceholderPng(width = 400, height = 250): Buffer {
  // IHDR チャンク
  const ihdr = Buffer.allocUnsafe(13);
  writeUint32BE(ihdr, 0, width);
  writeUint32BE(ihdr, 4, height);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 0; // color type: grayscale
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  // IDAT チャンク: 薄いグレーのピクセルデータ
  const gray = 200; // グレー値 (0-255)
  const rowData = Buffer.allocUnsafe(width + 1); // 1 byte filter + width bytes
  rowData[0] = 0; // filter type: None
  rowData.fill(gray, 1);

  const rawData = Buffer.allocUnsafe((width + 1) * height);
  for (let row = 0; row < height; row++) {
    rowData.copy(rawData, row * (width + 1));
  }

  const compressed = zlib.deflateSync(rawData);
  const idat = compressed;

  // IEND チャンク
  const iend = Buffer.alloc(0);

  const PNG_SIG = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([
    PNG_SIG,
    makeChunk("IHDR", ihdr),
    makeChunk("IDAT", idat),
    makeChunk("IEND", iend),
  ]);
}
