# create-minitype

[minitype](https://typesetting.jp) の文書プロジェクトをセットアップするツールです．
コマンドラインまたは API 経由でテンプレートを選択して，必要なソースファイル一式を自動生成します．

create-minitype is a tool to set up the documentation project for [minitype](https://typesetting.jp).  
Users can select a template via the command line or API to automatically generates all the necessary source files.

[テンプレート](./template) – [開発ガイド](./template)

## コマンドラインから使用する

コマンドラインインタフェース（CLI）から実行する場合，以下のコマンドを実行します．

```bash
# npm
npm create minitype [project-name] [options]

# Yarn
yarn create minitype
```

### オプション

| オプション | 短縮形 | 説明 |
| --- | --- | --- |
| `--template <name>` | `-t` | 使用するテンプレート（省略した場合プロンプトで選択） |
| `--yes` | `-y` | プロンプトをスキップ（`--template` と併用） |
| `--json` | `-j` | 結果を JSON で出力（AI エージェント向け） |
| `--markdown` | | Markdown からドキュメントを生成 |
| `--yaml` | | YAML からドキュメントを生成 |
| `--pm <npm\|yarn>` | | 依存関係のインストールに使用するパッケージマネージャ |
| `--list-templates` | | 利用可能なテンプレート一覧を表示 |
| `--help` | `-h` | ヘルプを表示 |

### 使用例

```bash
# プロジェクト名を指定して対話形式で実行
yarn create minitype my-report

# テンプレートを指定して非対話で実行
yarn create minitype my-report --template report --yes

# Markdown モードで report テンプレートを生成し，依存関係もインストール
yarn create minitype my-report --template report --markdown --pm yarn

# JSON 出力（CI・エージェント向け）
yarn create minitype my-report --template report --json
```

## ライブラリとして使用する

Node.js スクリプトやエージェントからプログラムで呼び出すことも可能です．

```bash
npm install create-minitype
```

```ts
import { createProject } from "create-minitype";

const result = await createProject({
  projectName: "my-report",
  templateId: "report",
  templateOptions: { markdown: true },
  packageManager: "npm",
  outputDir: "./projects",
});

console.log(result.files); // 生成されたファイル一覧
```

### `createProject(options)`

| フィールド | 型 | 説明 |
| --- | --- | --- |
| `projectName` | `string` | プロジェクト名（サブディレクトリ名になる） |
| `templateId` | `string` | テンプレート ID，git URL，またはローカルパス |
| `templateOptions` | `TemplateOptions` | テンプレート固有のオプション |
| `packageManager` | `"npm" \| "yarn"` | 依存関係インストールに使用する PM（省略時はスキップ） |
| `outputDir` | `string` | プロジェクトを作成するディレクトリ（省略時はカレントディレクトリ） |
| `json` | `boolean` | 結果を JSON で `stdout` に出力するか |

戻り値は `CreateProjectResult`（`projectName`，`templateId`，`targetDir`，`files` を持つオブジェクト）です．

### 組込みオプション

一部のテンプレートはオプションを持ちます．対話形式で選択するか，CLI フラグで指定できます．

- **`--markdown`**：ドキュメントの本文を TypeScript ではなく Markdown で記述する．
- **`--yaml`**：入力データを TypeScript ではなく YAML で記述する．

## 外部テンプレート

組込みテンプレート以外に，git リポジトリやローカルディレクトリをテンプレートとして指定できます．

```bash
# git リポジトリ（初回実行時にキャッシュされる）
yarn create minitype my-project --template https://github.com/user/my-template

# ローカルパス
yarn create minitype my-project --template ./path/to/template
```

外部テンプレートのリポジトリには `template.ts`（または `template.js`）を配置し，`Template` 型のオブジェクトをデフォルトエクスポートします．

```ts
import type { Template } from "create-minitype";

const template: Omit<Template, "id"> = {
  displayName: "My Template",
  description: "カスタムテンプレートの説明",
  files: (vars) => ({
    "src/index.ts": `// generated for ${vars.projectName}`,
  }),
};

export default template;
```

## 生成されるプロジェクト構成

```
<project-name>/
├── src/
│   ├── index.ts       # スタイル・レイアウト定義
│   └── document.ts    # ドキュメントの内容（テンプレートによっては .md / .yaml）
├── fonts/             # 使用フォント（自動コピー）
├── vite.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

生成後は以下のコマンドでビルドできます．

```bash
cd <project-name>
npm install   # または yarn install
npm run build # output.pdf が生成される
```
