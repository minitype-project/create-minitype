# テンプレート

create-minitype では，組込みテンプレートまたはカスタムテンプレートを指定できます．

## 組込みテンプレート

以下の組込みテンプレートを使用できます．

| テンプレート ID | 表示名 | 説明 | フォーマット |
| --- | --- | --- | --- |
| `report` | レポート | 一般的なレポート・報告書（A4，横組） | TypeScript/Markdown |
| `technical-book` | 技術書 | 技術書・マニュアル（B5，横組） | TypeScript |
| `conference-paper` | 会議論文 | 会議論文（A4，2段組） | TypeScript |
| `thesis` | 学位論文 | 学位論文（A4，横組） | TypeScript |
| `invoice` | 請求書 | 請求書（A4，横組） | YAML |
| `cv` | 履歴書 | 履歴書（A4，横組） | YAML |
| `slide` | スライド | プレゼンテーション用スライド（16:9，横組） | TypeScript |
| `novel` | 小説 | 小説（縦組） | Markdown |
| `business-report` | 事業報告書 | 事業報告書・ビジネスレポート（B5，横組） | TypeScript/Markdown |

## カスタムテンプレート

カスタムテンプレートとして，ローカルディレクトリまたは git リポジトリ上のテンプレートを使用できます．

git URL を指定した場合，`~/.create-minitype/git/` 以下にテンプレートがキャッシュされます．
2 回目以降の実行ではキャッシュが再利用されるため，テンプレートを更新した場合にはキャッシュディレクトリを手動で削除してください．

```bash
# ローカルディレクトリ
yarn create minitype project-name --template ./path/to/my-template

# git リポジトリ
yarn create minitype project-name --template https://github.com/user/my-template
```

```ts
import { createProject } from "create-minitype";

await createProject({
  projectName: "my-project",
  templateId: "./path/to/my-template", // ローカルディレクトリまたは git URL
  templateOptions: { foo: true },
  ...
});
```

### テンプレートの定義

テンプレートのディレクトリ（またはリポジトリのルート）に `template.ts` を配置し，`CustomTemplate` 型のオブジェクトをデフォルトエクスポートします．
TypeScript が利用できない環境では `template.js` にフォールバックします．

```
my-template/
├── template.ts     # テンプレートの定義（必須）
└── ...             # 任意のファイル（template.ts から参照）
```

#### `template.ts` の記述

```ts
import type { CustomTemplate } from "create-minitype";

const template: CustomTemplate = {
  displayName: "テンプレート名",
  description: "カスタムテンプレートの説明",
  files: (vars) => ({
    "src/index.ts": `// generated for ${vars.projectName}`,
    "src/document.md": `# ${vars.projectName}`,
  }),
};

export default template;
```

`CustomTemplate` のフィールドには以下を指定します．

| フィールド | 型 | 説明 |
| --- | --- | --- |
| `displayName` | `string` | テンプレートの表示名 |
| `description` | `string` | テンプレートの説明 |
| `builtinOptions?` | `("markdown" \| "yaml")[]` | 使用する組込みオプション |
| `prompts?` | `TemplatePrompt[]` | テンプレート固有のプロンプト定義 |
| `files` | `(vars, options?) => Record<string, string \| Buffer>` | ファイルを生成する関数 |

#### `files` 関数

`files` 関数はファイルパスをキー，ファイルの内容（文字列または `Buffer`）を値とするオブジェクトを返します．
非同期処理が必要な場合は `async` 関数として定義できます．

```ts
files: async (vars, options) => ({
  "src/index.ts": "...",
  "src/cover.png": await generateImage(), // Buffer も返せる
}),
```

`vars` には以下の値が含まれます．

| 変数 | 説明 |
| --- | --- |
| `vars.projectName` | プロジェクト名（サブディレクトリ名） |
| `vars.minitypePath` | `@minitype/minitype` への相対パス |
| `vars.minitypeVitePluginPath` | `@minitype/vite-plugin` への相対パス |

#### 組込みオプション

`builtinOptions` に以下の値を指定することで，フレームワークが CLI フラグと対話プロンプトを自動的に提供します．

| 値 | CLI フラグ | 説明 |
| --- | --- | --- |
| `"markdown"` | `--markdown` | Markdown からドキュメントを生成するオプションを追加する |
| `"yaml"` | `--yaml` | YAML からドキュメントを生成するオプションを追加する |

```ts
const template: CustomTemplate = {
  displayName: "My Template",
  description: "...",
  builtinOptions: ["markdown"],
  files: (vars, options) => {
    if (options?.markdown) {
      return {
        "src/index.ts": "...",
        "src/document.md": "# Hello",
      };
    }
    return {
      "src/index.ts": "...",
      "src/document.ts": "...",
    };
  },
};
```

#### テンプレート固有のプロンプト

組込みオプションでは賄えない独自の設定項目は，`prompts` フィールドで定義できます．
`prompts` に定義したプロンプトの回答は，`files` 関数の第 2 引数 `options` から取得できます．

#### `confirm` 型（Yes/No）

```ts
prompts: [
  {
    id: "useColor",
    type: "confirm",
    message: "Use color theme?",
    initial: false, // デフォルト値（省略時は false）
  },
],
files: (vars, options) => ({
  "src/index.ts": options?.useColor ? "/* color */" : "/* monochrome */",
}),
```

#### `select` 型（選択肢）

```ts
prompts: [
  {
    id: "layout",
    type: "select",
    message: "Select layout",
    choices: [
      { name: "single", message: "1段組" },
      { name: "double", message: "2段組" },
    ],
    initial: "single", // デフォルト値（省略時は最初の選択肢）
  },
],
files: (vars, options) => ({
  "src/index.ts": `const layout = "${options?.layout ?? "single"}";`,
}),
```

プロンプトのフィールドには，以下を設定できます．

| フィールド | 型 | 説明 |
| --- | --- | --- |
| `id` | `string` | プロンプトの識別子（`options` のキーとして使用） |
| `message` | `string` | ユーザに表示するメッセージ |
| `type` | `"confirm" \| "select"` | プロンプトの種類 |
| `initial?` | `boolean \| string` | デフォルト値 |
| `choices?` | `{ name: string; message: string }[]` | 選択肢のリスト（`select` のみ） |
