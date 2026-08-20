# TODO

## テンプレート整備

TODO

- thesis
  bachelor を参考に
- technical-book
  見た目を改善
- グラフィカルドキュメントテンプレートを追加

OK

- novel
- invoice
- cv
- slide
- conference-paper
- report
- business-report

## 必須

- [ ] `@minitype/minitype` を npm に公開する
- [ ] `@minitype/vite-plugin` を npm に公開する
- [ ] `src/create-project.ts:36-37` のパス解決を修正する
  - 現状はローカルパス (`../../minitype`, `../../vite-plugin`) を前提としているため，npm インストール後の環境で生成プロジェクトの `package.json` に不正なパスが書き込まれる
  - ローカルパスが存在しない場合は npm パッケージ名・バージョンを使うよう切り替える
- [ ] `src/templates/files/common/package.json` の依存関係指定を修正する
  - `"@minitype/minitype": "link:{{minitypePath}}"` を，上記修正に合わせて npm バージョン形式 (`"@minitype/minitype": "^x.y.z"`) にも対応させる
