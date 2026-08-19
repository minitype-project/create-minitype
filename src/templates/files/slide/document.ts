import {
  b,
  figure,
  flexbox,
  h2,
  li1,
  p,
  ratio,
  vspace,
} from "@minitype/minitype";
import {
  bgBox,
  codeBox,
  key,
  type SlideFactory,
  s,
  slidePage,
} from "./helper.js";

// ------
// メタデータ
// ------

export const title = "プレゼンテーションタイトル";
export const subtitle = "サブタイトル";
export const date = "2026年X月X日";
export const author = "発表者名";

// ------
// スライド内容
// ------

const slideAgenda: SlideFactory = () =>
  slidePage("アジェンダ", () => [
    vspace(4),
    li1`minitype とは`,
    li1`基本的な使い方`,
    li1`スタイルのカスタマイズ`,
    li1`コードブロックと図`,
    li1`まとめ`,
  ]);

const slideAbout: SlideFactory = () =>
  slidePage("minitype とは", () => [
    h2`TypeScript で PDF ドキュメントを生成するライブラリ`,
    vspace(4),
    flexbox(
      [
        bgBox([
          p`${b("特徴")}`,
          vspace(2),
          li1`TypeScript でドキュメント構造を記述`,
          li1`日本語・欧文の混植に対応`,
          li1`数式・コード・図表の埋め込みをサポート`,
          li1`${key("Vite プラグイン")}でブラウザプレビューが可能`,
        ]),
        bgBox([
          p`${b("使用例")}`,
          vspace(2),
          li1`学術論文・レポート`,
          li1`プレゼンテーション`,
          li1`書籍・マニュアル`,
          li1`請求書・履歴書`,
        ]),
      ],
      { gap: 5 },
    ),
  ]);

const slideBasic: SlideFactory = () =>
  slidePage("基本的な使い方", () => [
    h2`ブロック要素を組み合わせてドキュメントを構成する`,
    vspace(4),
    bgBox([
      li1`${b("p()")}${s("  — 段落")}`,
      li1`${b("h1()")} / ${b("h2()")}${s("  — 見出し")}`,
      li1`${b("li1()")} / ${b("li2()")}${s("  — 箇条書き")}`,
      li1`${b("code()")}${s("  — コードブロック（シンタックスハイライト対応）")}`,
      li1`${b("figure()")}${s("  — 画像の埋め込み")}`,
      li1`${b("flexbox()")} / ${b("box()")}${s("  — レイアウト")}`,
      li1`${b("vspace()")}${s("  — 垂直方向の余白")}`,
    ]),
  ]);

const slideCustom: SlideFactory = () =>
  slidePage("スタイルのカスタマイズ", () => [
    h2`index.ts の DocumentStyle でドキュメント全体のスタイルを定義する`,
    vspace(4),
    bgBox([
      li1`${b("size")}${s("  — ページサイズ（A4, B5, カスタム等）")}`,
      li1`${b("writingMode")}${s("  — 横組・縦組の切り替え")}`,
      li1`${b("padding")}${s("  — ページ余白")}`,
      li1`${b("block")}${s("  — 各ブロック要素のフォント・サイズ・行送り")}`,
      li1`${b("gaps")}${s("  — ブロック間の空き量")}`,
    ]),
  ]);

const slideCodeAndFigure: SlideFactory = () =>
  slidePage("コードブロックと図", () => [
    h2`code() でコードブロック，figure() で画像をスライドに配置できる`,
    vspace(4),
    flexbox(
      [
        bgBox([
          p`${b("コードブロック")}`,
          vspace(3),
          codeBox(
            [
              `import { figure } from "@minitype/minitype";`,
              ``,
              `// キャプション付きで画像を配置`,
              `figure("src/sample.png", "サンプル画像", {`,
              `  width: ratio(0.8),`,
              `  align: "center",`,
              `})`,
            ],
            "typescript",
          ),
        ]),
        bgBox([
          p`${b("画像の埋め込み")}`,
          vspace(3),
          figure("src/sample.png", "サンプル画像", {
            width: ratio(0.8),
            align: "center",
          }),
        ]),
      ],
      { gap: 5 },
    ),
  ]);

const slideSummary: SlideFactory = () =>
  slidePage("まとめ", () => [
    h2`minitype を使うと TypeScript だけで本格的な PDF を生成できる`,
    vspace(4),
    bgBox([
      li1`ブロック要素の組み合わせでドキュメント構造を表現`,
      li1`DocumentStyle でデザインを一元管理`,
      li1`日本語組版・数式・コードに標準対応`,
      li1`今後：このテンプレートを起点に自分のドキュメントを作ろう`,
    ]),
  ]);

// ------
// スライド一覧
// ------

export const slidePages: SlideFactory[] = [
  slideAgenda,
  slideAbout,
  slideBasic,
  slideCustom,
  slideCodeAndFigure,
  slideSummary,
];
