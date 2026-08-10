import {
  type Body,
  cmyk,
  figure,
  float,
  li1,
  li2,
  p,
  ratio,
} from "@minitype/minitype";

// ------
// 定数
// ------
export const accentColor = cmyk(80, 40, 0, 15);
export const whiteColor = cmyk(0, 0, 0, 0);
export const whiteDimColor = cmyk(0, 0, 0, 20);

// ------
// メタデータ
// ------
export const title = "minitype 入門";
export const subtitle = "TypeScript で組版を始めよう";
export const date = "2026年4月22日";
export const author = "minitype 開発チーム";

// ------
// スライド内容
// ------
export const main: [string, Body][] = [
  [
    "アジェンダ",
    [
      li1("minitype とは"),
      li1("基本的な使い方"),
      li1("スタイルのカスタマイズ"),
      li1("まとめ"),
    ],
  ],
  [
    "minitype とは",
    [
      p(
        "minitype は TypeScript で組版ドキュメントを記述するためのライブラリです．" +
          "PDF 出力に対応しており，日本語組版にも対応しています．",
      ),
      li1("TypeScript で文書構造を記述できる"),
      li1("日本語・欧文の混植に対応"),
      li1("数式・コード・図表の埋め込みをサポート"),
      li1("Vite プラグインでブラウザプレビューが可能"),
    ],
  ],
  [
    "基本的な使い方",
    [
      p("以下のブロック要素を組み合わせてドキュメントを構成します．"),
      li1("p()  — 段落"),
      li2("firstIndent で字下げ，align で揃えを指定する"),
      li1("h1() / h2() / h3()  — 見出し"),
      li1("li1() / li2()  — 箇条書き"),
      li1("code()  — コードブロック（シンタックスハイライト対応）"),
      li1("figure()  — 画像の埋め込み"),
      li1("math()  — 数式（LaTeX 記法）"),
    ],
  ],
  [
    "スタイルのカスタマイズ",
    [
      p("index.ts の DocumentStyle でドキュメント全体のスタイルを定義します．"),
      li1("size  — ページサイズ（A4, B5, カスタム等）"),
      li1("writingMode  — 横組・縦組の切り替え"),
      li1("padding  — ページ余白"),
      li1("block  — 各ブロック要素のフォント・サイズ・行送り"),
      li1("gaps  — ブロック間の空き量"),
    ],
  ],
  [
    "図の埋め込み",
    [
      float("top", [
        figure("src/sample.png", "figure() で画像を埋め込める", {
          width: ratio(0.45),
          align: "center",
        }),
      ]),
      p(
        "figure() に画像ファイルパスを渡すと PDF に埋め込まれます．" +
          "width に ratio() を渡すと，コンテンツ幅に対する比率で指定できます．",
      ),
    ],
  ],
  [
    "まとめ",
    [
      p(
        "minitype を使うと TypeScript だけで本格的な PDF ドキュメントを生成できます．",
      ),
      li1("ブロック要素の組み合わせでドキュメント構造を表現"),
      li1("DocumentStyle でデザインを一元管理"),
      li1("日本語組版・数式・コードに標準対応"),
      li1("今後：テンプレートを起点に自分のドキュメントを作ろう"),
    ],
  ],
];
