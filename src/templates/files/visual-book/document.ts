import {
  autoref,
  type Block,
  easytable,
  figure,
  float,
  fn,
  footnote,
  H,
  il,
  li1,
  li2,
  lstlisting,
  math,
  p,
  physical,
  Q,
  ratio,
} from "@minitype/minitype";

import { c, code, h2, h3 } from "./helper.js";

// ------
// メタデータ
// ------

/** 文書タイトル． */
export const bookTitle = "{{projectName}}";

/** 表紙に表示するリードテキスト（空文字列で非表示）． */
export const leadText =
  "本書はバージョン管理システム Git の基本的な使い方を解説します．初めて Git を使う方から，チーム開発に活用したい方まで幅広く対応しています．";

// ------
// 本文
// ------

export const sections: Block[] = [
  h2("第1章 Gitとは何か"),

  p`Git は，ファイルの変更履歴を記録・管理するための分散型バージョン管理システムです${fn("what-is-vcs")}．プログラムの変更内容をコミットという単位で保存し，過去の任意の時点の状態に戻したり，複数の作業を並行して進めたりすることができます．`,
  footnote(
    "what-is-vcs",
    "バージョン管理システムとは，ファイルの変更履歴を記録・追跡するためのソフトウェアです．Git 以外にも Subversion や Mercurial などがあります．",
  ),

  h3("本書の構成"),
  p`本書は以下の4章から構成されます．`,
  li1`第1章：Gitとは何か`,
  li2`バージョン管理の基本概念`,
  li2`Gitを使う理由`,
  li1`第2章：基本的な使い方`,
  li2`リポジトリの作成とコミット`,
  li2`設定ファイルの記述方法`,
  li1`第3章：ブランチを用いた作業`,
  li2`ブランチの作成・統合`,
  li1`第4章：リモートリポジトリとの連携`,
  li2`GitHubを用いたチーム開発`,

  h3("Gitを使う理由"),
  p`ソフトウェア開発では，ファイルを少しずつ変更しながら作業を進めます．Gitを使うと，変更の単位をコミットとして記録し，作業の流れを明確に残すことができます．また，ブランチ機能を活用することで，複数の作業を独立して進めることができます．`,

  h2("第2章 基本的な使い方"),

  h3("Gitの設定"),
  p`Gitを初めて使う際には，ユーザ名とメールアドレスを設定します．これらの情報は，コミットに記録される著者情報として使われます．設定はホームディレクトリの${fn("gitconfig-path")}${il`${c(".gitconfig")}`}ファイルに保存されます．`,
  footnote(
    "gitconfig-path",
    "macOS・Linux では ~/.gitconfig，Windows では %USERPROFILE%\\.gitconfig に保存されます．",
  ),
  lstlisting(
    [
      "[user]",
      "  name  = Your Name",
      "  email = you@example.com",
      "",
      "[core]",
      "  editor = vim",
      "",
      "[alias]",
      "  st = status",
      "  co = checkout",
      "  br = branch",
      "  lg = log --oneline --graph",
    ],
    { lang: "ini", title: ".gitconfig", label: "lst:gitconfig" },
  ),

  h3("リポジトリの作成"),
  p`Gitで管理する作業場所をリポジトリと呼びます．既存のディレクトリをGitで管理するには，次のコマンドを実行します．`,
  code("git init", "bash"),
  p`このコマンドを実行すると，現在のディレクトリにGitの管理情報が格納された${il`${c(".git")}`}ディレクトリが作成されます．`,

  h3("変更の記録"),
  p`Gitでは，変更したファイルをすぐに履歴として記録するのではなく，まずステージング領域に追加します．その後，コミットによって履歴として保存します．`,
  code('git add main.ts\ngit commit -m "Add main script"', "bash"),
  p`${autoref("table:commands")}に，頻繁に使用する主なGitコマンドをまとめます．`,
  easytable(
    [
      ["コマンド", "説明"],
      ["git status", "作業ツリーの状態を確認する"],
      ["git add <file>", "変更をステージングに追加する"],
      ["git commit", "ステージングの内容を履歴に保存する"],
      ["git log", "コミット履歴を一覧表示する"],
      ["git diff", "作業ツリーとステージングの差分を確認する"],
    ],
    {
      caption: "頻繁に使用するGitコマンド",
      label: "table:commands",
      style: {
        cellPadding: physical(2, 3),
        textStyle: (rowIndex) => ({
          lineHeight: H(16),
          font:
            rowIndex === 0
              ? "SourceHanSansJP-Regular"
              : "SourceHanSerifJP-Regular",
          size: Q(10),
        }),
      },
    },
  ),

  h3("コミットメッセージ"),
  p`コミットメッセージには，その変更で何を行ったのかを短く具体的に書きます．たとえば「Fix bug」だけではなく，「Fix path handling in config loader」のように対象と内容が分かる表現にするとよいです．`,

  h2("第3章 ブランチを用いた作業"),

  float("top", [
    figure("src/sample.png", "ブランチを用いた開発フロー", {
      width: ratio(0.85),
      align: "center",
      label: "figure:workflow",
    }),
  ]),

  h3("ブランチの役割"),
  p`ブランチは，作業の流れを分岐させるための仕組みです．${autoref("figure:workflow")}に示すように，新しい機能を追加するときや既存の処理を修正するときにブランチを作成すると，mainブランチを安定した状態に保ったまま作業できます．`,

  h3("ブランチの作成と移動"),
  p`新しいブランチを作成してそのブランチに移動するには，次のコマンドを使います．`,
  code("git switch -c feature/login", "bash"),
  p`この例では，${il`${c("feature/login")}`}という名前のブランチを作成しています．ブランチ名には，作業内容が分かる名前を付けると，後から見たときに意図を理解しやすくなります．`,

  h3("差分の確認"),
  p`作業中の変更内容を確認するには，次のコマンドを使います．差分を確認してからコミットすることで，意図しない変更を履歴に含めることを防げます．`,
  code("git diff", "bash"),

  h3("ブランチの統合"),
  p`作業ブランチでの変更をmainブランチに取り込むには，mainブランチに移動してからmergeを実行します．`,
  code("git switch main\ngit merge feature/login", "bash"),
  p`マージによって，作業ブランチで行った変更がmainブランチに統合されます．競合が発生した場合は，Gitが自動で判断できなかった箇所を手動で修正する必要があります．`,

  h2("第4章 リモートリポジトリとの連携"),

  h3("リモートリポジトリとは"),
  p`リモートリポジトリは，ネットワーク上に置かれたGitリポジトリです．GitHubやGitLabなどのサービスを利用すると，ローカル環境で作成した履歴を共有し，複数人で同じプロジェクトを開発できます．`,

  h3("リモートの登録と変更の送信"),
  p`ローカルリポジトリにリモートリポジトリを登録して，コミットを送信するまでの流れを示します．`,
  code(
    "git remote add origin git@github.com:example/project.git\ngit push -u origin main",
    "bash",
  ),
  p`初回のpushでは，${il`${c("-u")}`}オプションを付けることで，ローカルのmainブランチとリモートのmainブランチを対応付けます．次回以降は，単に${il`${c("git push")}`}と入力するだけで送信できます．`,

  h3("変更の取得"),
  p`リモートリポジトリ上の変更を取得して現在のブランチに取り込むには，pullを使います．`,
  code("git pull", "bash"),

  h3("まとめ"),
  p`Gitの基本は，変更を確認し，必要なものをステージングし，意味のある単位でコミットすることです．ブランチを使って作業を分け，リモートリポジトリと連携することで，個人開発からチーム開発まで幅広い場面に対応できます．`,

  float("top", [
    math([
      "\\mathrm{good\\ commit} = \\mathrm{small\\ change} + \\mathrm{clear\\ message}",
    ]),
  ]),
];
