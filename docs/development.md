# 開発ガイド

```bash
# 依存関係のインストール
yarn

# CLI を tsx で直接実行（開発用）
yarn dev
# 配布用バンドルをビルド
yarn build
# フォーマット（biome）
yarn check

# ライセンスヘッダの付与・検証（addlicense）
yarn license        # ライセンスヘッダを付与
yarn license:check  # ライセンスヘッダの付与状況を確認

# テスト実行（Vitest）
yarn test        # 一回実行
yarn test:watch  # ウォッチモード

# サンプル PDF の生成
yarn sample              # 全テンプレート
yarn sample report       # 特定テンプレートのみ
yarn sample slide novel  # 複数指定
```

## リリース手順

### コミットメッセージ

[Conventional Commits](https://www.conventionalcommits.org/) に従ってコミットメッセージを記述する．
husky によって `git commit` 時に commitlint が実行される．フォーマットが違反している場合はコミットが拒否される．

```
<type>: <description>
```

主な type：

| type | 用途 |
| --- | --- |
| `feat` | 新機能 |
| `fix` | バグ修正 |
| `docs` | ドキュメント |
| `chore` | ビルド・設定・依存関係 |
| `refactor` | リファクタリング |
| `test` | テスト |

### CHANGELOG の生成

```bash
# 1. バージョンを上げる
# patch，minor，major のいずれか
npm version patch

# 2. 前回タグからの差分を CHANGELOG.md の先頭に追記
yarn changelog

# 3. コミット & タグを push
git add CHANGELOG.md
git commit -m "chore: release x.x.x"
git push && git push --tags
```

## アーキテクチャ

### モジュールの依存関係

```
src/cli.ts
  ├─ args.ts
  ├─ prompts.ts
  │     └─ template-resolver.ts
  └─ create-project.ts
        └─ templates/index.ts

src/index.ts
  ├─ create-project.ts
  ├─ template-resolver.ts
  └─ templates/index.ts
```

### CLI の実行フロー

```
yarn dev [project-name] [options]
   │
   ▼
args.ts: parseArgs()
   │  argv を ParsedArgs にパース
   ▼
prompts.ts: promptUser()
   │  不足している情報を対話的に収集
   │  resolveTemplate() でテンプレートオブジェクトを取得
   │  → ProjectConfig を生成
   ▼
create-project.ts: ProjectCreator.create()
   │  template.files(vars, options) でファイル内容を生成
   │  copyFonts() でフォントをコピー
   │  installPackages() で yarn/npm install を実行（任意）
   ▼
<project-name>/ を作成
```

## コーディングスタイル

### 関数定義

可能な限り `function` 宣言を使用せず，アロー関数として記述する．
トップレベルの関数は `return` 文を使った複数行形式で記述する．

```ts
// OK
const greet = (name: string) => {
  return `Hello, ${name}`;
};

// NG
function greet(name: string) {
  return `Hello, ${name}`;
}

// NG
const greet = (name: string) => `Hello, ${name}`;
```

### 制御構文

`if`・`for` の本体が 1 行でも中括弧を省略しない．

```ts
// OK
if (condition) {
  doSomething();
}

// NG
if (condition) doSomething();
```

### 変数名

慣習的なもの（`i`，`j`，`k` 等）を除き，1 文字の変数名を使用しない．

### コメント

ソースコード中のコメントおよびドキュメントの句読点はカンマ（，），ピリオド（．）を使用する．

見出しは以下の形式で記述する．

```ts
// ------
// 見出し
// ------
```

TSDoc に関しては，フィールドを除いて複数行で記述する．

```ts
/**
 * ファイルを読み込む．（動詞止め）
 * @param path ファイルパス．（体言止め）
 * @returns ファイルの内容．（体言止め）
 */
```

### エラー・ログメッセージ

`console.error`，`new Error()` 等のユーザ向けメッセージは英語で記述する．
