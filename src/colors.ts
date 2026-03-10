const isColorSupported =
  process.stdout.isTTY && process.env.NO_COLOR === undefined;

const wrap = (code: number, endCode: number) => (text: string) =>
  isColorSupported ? `\x1b[${code}m${text}\x1b[${endCode}m` : text;

export const bold = wrap(1, 22);
export const dim = wrap(2, 22);
export const green = wrap(32, 39);
export const cyan = wrap(36, 39);
export const yellow = wrap(33, 39);
export const red = wrap(31, 39);
export const blue = wrap(34, 39);
export const magenta = wrap(35, 39);
export const gray = wrap(90, 39);

export const success = (text: string) => green("✓ ") + text;
export const warn = (text: string) => yellow("⚠ ") + text;
export const error = (text: string) => red("✗ ") + text;
export const info = (text: string) => cyan("→ ") + text;
