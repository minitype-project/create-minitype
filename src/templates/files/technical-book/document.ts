import {
  type Body,
  bottom,
  box,
  caption,
  type Flow,
  float,
  fn,
  footnote,
  h1,
  h3,
  li1,
  math,
  newpage,
  p,
  page,
  solid,
  vspace,
} from "@minitype/minitype";

import { abstract, code, h2, keyColor } from "./utils.js";

// ------
// メタデータ
// ------

const bookTitle = "技術書タイトル";

// ------
// 柱，ノンブル
// ------

const header: Flow = {
  type: "flow",
  position: "pillar",
  blockOffset: -14,
  blocks: [
    box(
      [
        p(bookTitle, {
          align: (pageIndex: number) =>
            pageIndex % 2 === 1 ? "right" : "left",
          font: "SourceHanSansJP-Regular",
          firstIndent: 0,
          size: 3,
          lineHeight: 4.5,
        }),
      ],
      {
        padding: bottom(3),
        border: bottom(solid(0.2, keyColor)),
      },
    ),
  ],
  page: (pageIndex: number) => pageIndex >= 0,
};

const footer: Flow = {
  type: "flow",
  position: "nombre",
  blockOffset: 8,
  blocks: [
    p([[page]], {
      align: "center",
      firstIndent: 0,
      size: 3,
      lineHeight: 4.5,
    }),
  ],
};

// ------
// 本文
// ------

export const body: Body = [
  header,
  footer,

  h1`第1章 Gitとは何か`,

  abstract([p`あいうえお．`]),

  p`本書では，Gitを用いたソースコード管理の基本について説明します．Gitは，プログラムの変更履歴を記録し，過去の状態に戻したり，複数人で同じプロジェクトを編集したりするためのツールです．`,

  h2("Gitを使う理由"),
  p(
    "ソフトウェア開発では，ファイルを少しずつ変更しながら作業を進めます．その過程では，どこを変更したのか，なぜ変更したのか，いつ変更したのかを後から確認できることが重要です．Gitを使うと，変更の単位をコミットとして記録し，作業の流れを明確に残すことができます．",
  ),

  h2("本書の構成"),
  li1`第1章：Gitとは何か`,
  li1`第2章：基本的な使い方`,
  li1`第3章：ブランチを用いた作業`,
  li1`第4章：リモートリポジトリとの連携`,
  vspace(4),

  newpage(),

  h1`第2章 基本的な使い方`,

  abstract([p`あいうえお．`]),

  h2("リポジトリの作成"),
  p`Gitで管理する作業場所をリポジトリと呼びます．既存のディレクトリをGitで管理するには，対象のディレクトリで次のコマンドを実行します．`,
  code("git init", "bash"),

  p`このコマンドを実行すると，現在のディレクトリにGitの管理情報が作成されます．以後，このディレクトリ内のファイル変更をGitで記録できるようになります．`,

  h2("変更状態の確認"),
  p`作業中のファイルがどのような状態にあるかを確認するには，次のコマンドを使います．`,
  code("git status", "bash"),

  p`git statusは，変更されたファイル，まだGitに追加されていないファイル，コミット待ちのファイルなどを表示します．作業の途中でこまめに実行すると，現在の状態を把握しやすくなります．`,

  h2("変更の記録"),
  p`Gitでは，変更したファイルをすぐに履歴として記録するのではなく，まずステージング領域に追加します．たとえば，main.tsを記録対象にするには次のようにします．`,
  code("git add main.ts", "bash"),

  p`ステージングした変更は，commitコマンドによって履歴として保存します．`,
  code('git commit -m "Add main script"', "bash"),

  h3("コミットメッセージ"),
  p`コミットメッセージ${fn("commit-message")}には，その変更で何を行ったのかを短く具体的に書きます．`,
  footnote(
    "commit-message",
    "たとえば「Fix bug」だけではなく，「Fix path handling in config loader」のように対象と内容が分かる表現にするとよいです．",
  ),

  newpage(),

  h1`第3章 ブランチを用いた作業`,

  h2("ブランチの役割"),
  p`ブランチは，作業の流れを分岐させるための仕組みです．新しい機能を追加するときや，既存の処理を修正するときにブランチを作成すると，mainブランチを安定した状態に保ったまま作業できます．`,

  h2("ブランチの作成と移動"),
  p`新しいブランチを作成して，そのブランチに移動するには次のコマンドを使います．`,
  code("git switch -c feature/login", "bash"),

  p`この例では，feature/loginという名前のブランチを作成しています．ブランチ名には，作業内容が分かる名前を付けると，後から見たときに意図を理解しやすくなります．`,

  h2("差分の確認"),
  p`作業中の変更内容を確認するには，次のコマンドを使います．`,
  code("git diff", "bash"),

  p`差分を確認してからコミットすることで，意図しない変更を履歴に含めることを防げます．特に複数のファイルを同時に編集している場合は，コミット前の確認が重要です．`,

  h2("ブランチの統合"),
  p`作業ブランチでの変更をmainブランチに取り込むには，mainブランチに移動してからmergeを実行します．`,
  code("git switch main\ngit merge feature/login", "bash"),

  p`マージによって，作業ブランチで行った変更がmainブランチに統合されます．競合が発生した場合は，Gitが自動で判断できなかった箇所を手動で修正する必要があります．`,

  newpage(),

  h1`第4章 リモートリポジトリとの連携`,

  h2("リモートリポジトリとは"),
  p`リモートリポジトリは，ネットワーク上に置かれたGitリポジトリです．GitHubやGitLabなどのサービスを利用すると，ローカル環境で作成した履歴を共有し，複数人で同じプロジェクトを開発できます．`,

  h2("リモートの登録"),
  p`ローカルリポジトリにリモートリポジトリを登録するには，次のコマンドを使います．`,
  code("git remote add origin git@github.com:example/project.git", "bash"),

  h2("変更の送信"),
  p`ローカルで作成したコミットをリモートリポジトリへ送信するには，pushを使います．`,
  code("git push -u origin main", "bash"),

  p`初回のpushでは，-uオプションを付けることで，ローカルのmainブランチとリモートのmainブランチを対応付けます．次回以降は，単にgit pushと入力するだけで送信できます．`,

  h2("変更の取得"),
  p`リモートリポジトリ上の変更を取得して，現在のブランチに取り込むにはpullを使います．`,
  code("git pull", "bash"),

  h2("まとめ"),
  p`Gitの基本は，変更を確認し，必要なものをステージングし，意味のある単位でコミットすることです．さらに，ブランチを使って作業を分け，リモートリポジトリと連携することで，個人開発からチーム開発まで幅広い場面に対応できます．`,

  float("top", [
    math([
      "\\mathrm{good\\ commit} = \\mathrm{small\\ change} + \\mathrm{clear\\ message}",
    ]),
    caption("良いコミットの考え方"),
  ]),
];
