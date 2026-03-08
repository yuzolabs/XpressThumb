# XpressThumb

X（旧 Twitter）向けの美しいサムネイル画像を生成するアプリケーションです。

## 機能

- 🎨 カスタマイズ可能なサムネイルデザイン
- タイトル、サブタイトル、アイコンの設定
- 🖼️ アップロード画像のプレビューと調整
- 💾 ローカルストレージによる自動保存
- 📱 PWA 対応（オフライン利用可能）
- 🔄 編集履歴の管理（Undo/Redo）

## 技術スタック

- Framework: React 19 + TypeScript
- Build Tool: Vite 6
- Testing: Vitest（Unit）+ Playwright（E2E）
- Package Manager: Bun
- PWA: vite-plugin-pwa

## 必要条件

- [Bun](https://bun.sh) 1.3.6以上
- Node.js 18以上（Bun のバックエンドとして）

## インストール

```bash
# リポジトリのクローン
git clone <repository-url>
cd xpress-thumb

# 依存関係のインストール
bun install --frozen-lockfile
```

## 開発

### 開発サーバーの起動

```bash
bun run dev
```

Vite の開発サーバーが起動し、<http://localhost:5173> でアプリケーションにアクセスできます。

### 利用可能なスクリプト

| スクリプト | 説明 |
|-----------|------|
| `bun run dev` | 開発サーバーを起動 |
| `bun run build` | プロダクションビルドを作成 |
| `bun run preview` | ビルド済みアプリケーションをプレビュー |
| `bun run typecheck` | TypeScriptの型チェックを実行 |
| `bun run test:unit` | ユニットテストを実行 |
| `bun run test:e2e` | E2Eテストを実行 |
| `bun run test:all` | 全テスト（Unit + E2E）を実行 |
| `bun run test:offline` | オフライン機能のE2Eテストを実行 |

## テスト

### ユニットテスト

Vitest でユニットテストを実行します。

```bash
# 一度だけ実行
bun run test:unit

# ウォッチモードで実行
bunx vitest
```

テストファイルは `tests/unit/` ディレクトリに配置されています。

### E2Eテスト

Playwright で E2E テストを実行します。

```bash
# 全てのE2Eテストを実行
bun run test:e2e

# オフライン機能のみテスト
bun run test:offline

# UIモードで実行
bunx playwright test --ui
```

テストファイルは `tests/e2e/` ディレクトリに配置されています。

初回実行時は Playwright のブラウザをインストールしてください。

```bash
bunx playwright install
```

## CI/CD

GitHub Actions を使用して継続的インテグレーションを設定しています。

### ワークフロー

`.github/workflows/ci.yml` には以下のジョブが定義されています。

1. **Lint & Typecheck**: TypeScript の型チェック
2. **Build**: プロダクションビルドの作成
3. **Unit Tests**: ユニットテストの実行
4. **E2E Tests**: Playwright による E2E テスト

### CIステータスバッジ

メインブランチの CI ステータスは README に表示されます。

## プロジェクト構造

```
.
├── .github/
│   └── workflows/
│       └── ci.yml          # GitHub Actions CI設定
├── .husky/
│   └── pre-commit          # プリコミットフック
├── src/
│   ├── features/           # 機能別モジュール
│   ├── shared/             # 共有コンポーネント・ユーティリティ
│   ├── main.tsx            # アプリケーションエントリーポイント
│   └── App.tsx             # ルートコンポーネント
├── tests/
│   ├── unit/               # ユニットテスト
│   └── e2e/                # E2Eテスト
├── .lintstagedrc.json      # lint-staged設定
├── playwright.config.ts    # Playwright設定
├── vite.config.ts          # Vite設定
├── vitest.config.ts        # Vitest設定
└── package.json
```

## プリコミットフック（オプション）

lint-staged と husky を使用して、コミット前に自動的に型チェックとテストを実行できます。

### セットアップ

```bash
# lint-stagedとhuskyのインストール
bun add -d lint-staged husky

# huskyの初期化
bunx husky install
```

`.lintstagedrc.json` はすでに設定済みです。

- `*.ts, *.tsx`: TypeScript の型チェック + ユニットテスト
- `*.{js,ts,tsx,json,md}`: Prettier によるフォーマット

## PWA設定

`vite-plugin-pwa` を使用して PWA 機能を提供しています。

- Service Worker によるオフライン対応
- アセットのキャッシュ戦略
- マニフェストファイルの生成

## 環境変数

必要な環境変数：

| 変数名 | 説明 | 必須 |
|--------|------|------|
| `CONTEXT7_API_KEY` | Context7 APIキー | MCPサーバー使用時 |

## Dev Container

Dev Container を使用した開発環境の構築に対応しています。

### 必要要件

- Docker
- VSCode + Remote Containers 拡張機能
- OpenCode 認証（`$HOME/.local/share/opencode/auth.json`）

### git worktree対応

以下のディレクトリ構造で worktree を使用できます。

```
..
├── xpress-thumb
└── xpress-thumb.worktrees
    ├── feat-branch1
    └── fix-branch2
```

## ライセンス

MIT License

## コントリビューション

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチをプッシュ (`git push origin feature/amazing-feature`)
5. Pull Request を作成

## サポート

問題や質問がある場合は、GitHub Issues を作成してください。
