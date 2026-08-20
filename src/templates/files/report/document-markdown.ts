import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  type Block,
  type BlockExtender,
  type CodeMapper,
  figure,
  type ImageMapper,
  lstlisting,
  mdString,
  ratio,
} from "@minitype/minitype";
import { parse } from "yaml";

const codeMapper: CodeMapper = (_code: string, lang?: string) => {
  return [lstlisting(_code.split("\n"), { lang })];
};

const imageMapper: ImageMapper = (src: string, alt: string) => {
  return [figure(src, alt, { width: ratio(0.6), align: "center" })];
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const content = readFileSync(path.join(__dirname, "document.md"), "utf-8");
const match = content.match(/^---\r?\n([\s\S]+?)\r?\n---\r?\n/);

let title = "レポートタイトル";
let author = "〇〇 〇〇";
let date: boolean | string = true;
let bodyContent = content;

if (match) {
  const frontmatter = parse(match[1]);
  title = frontmatter.title ?? title;
  author = frontmatter.author ?? author;
  date = frontmatter.date ?? true;
  bodyContent = content.slice(match[0].length);
}

export { author, date, title };

export const mainContent: (Block | BlockExtender)[] = [
  ...mdString(bodyContent, { code: codeMapper, image: imageMapper }).blocks,
];
