ci: GitHub Pages への自動デプロイメントを追加

## 概要

XpressThumb アプリケーションを GitHub Pages でホスティングできるようにするため、自動デプロイメントワークフローを追加します。
現在はローカル開発環境でのみ動作しており、本番環境への展開方法がありませんでした。

## 修正事項

- `.github/workflows/deploy.yml` を新規作成し、GitHub Pages への自動デプロイメントワークフローを追加
  - main ブランチへのプッシュ時に自動的にビルド・デプロイが実行される
  - Bun 1.3.6 を使用して依存関係のインストールとビルドを実行
  - GitHub Pages 用の公式アクション（configure-pages, upload-pages-artifact, deploy-pages）を使用
- `vite.config.ts` に `base` オプションを追加し、サブディレクトリ（`/XpressThumb/`）でのホスティングに対応
- `playwright.config.ts` の baseURL をサブディレクトリパスに更新し、E2E テストが正しく動作するように修正
- `public/manifest.webmanifest` のパスを相対パス（`./`）に変更し、PWA がサブディレクトリ配置でも正常に機能するように修正

## 備考

- GitHub Pages の environment は `github-pages` に設定済み
- 同時実行を制御するため `concurrency` を設定（グループ: `github-pages`）
- 必要な権限（pages: write, id-token: write）をワークフローに付与済み
