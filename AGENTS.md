# Agent Instructions

**Think in English, output in Japanese.**

## Overview

XpressThumb - X（旧 Twitter）向けサムネイル画像ジェネレーター
React 19 + TypeScript + Vite による PWA アプリケーション

## Structure

```
.
├── src/
│   ├── app/              # アプリケーションエントリーポイント
│   ├── features/editor/  # サムネイルエディタ機能
│   ├── shared/           # 共有型定義・ユーティリティ
│   └── assets/           # フォント・パターンアセット
├── tests/
│   ├── unit/             # Vitest ユニットテスト
│   └── e2e/              # Playwright E2Eテスト
└── .github/workflows/    # CI設定
```

## Where to Look

| Task | Location | Notes |
|------|----------|-------|
| Entry point | `src/app/main.tsx` | React root + PWA SW登録 |
| Root component | `src/app/App.tsx` | useReducer統合、Controls統合 |
| State types | `src/shared/types/editor.ts` | EditorState, EditorConfig, Actions |
| State logic | `src/features/editor/state/` | Reducer, selectors, initialState |
| Canvas render | `src/features/editor/render/` | renderer.ts, export.ts |
| Offline assets | `src/features/editor/offline/` | Service Worker, fontLoader |
| UI Controls | `src/features/editor/components/` | Controls.tsx, PreviewCanvasHost.tsx |
| File validation | `src/shared/lib/fileValidation.ts` | 画像アップロード検証 |
| Unit tests | `tests/unit/` | `*.spec.ts` Vitest |
| E2E tests | `tests/e2e/` | `*.spec.ts` Playwright |

## Code Map

| Symbol | Type | Location | Role |
|--------|------|----------|------|
| `App` | Component | `src/app/App.tsx` | Root UI, reducer統合 |
| `editorReducer` | Function | `src/features/editor/state/reducer.ts` | History付きreducer |
| `createInitialState` | Function | `src/features/editor/state/initialState.ts` | 初期状態生成 |
| `renderThumbnail` | Function | `src/features/editor/render/renderer.ts` | Canvas描画 |
| `exportAndDownload` | Function | `src/features/editor/render/export.ts` | PNG出力 |
| `validateImageFile` | Function | `src/shared/lib/fileValidation.ts` | 画像検証 |

## Conventions

### State Management
- React `useReducer` + 独自Historyパターン
- State types: `src/shared/types/editor.ts`
- Actions: `SET_*`, `UNDO`, `REDO`, `RESET`
- Validation actions: `SET_VALIDATION_*`（Historyに記録しない）

### File Naming
- Components: PascalCase (e.g., `Controls.tsx`)
- Utilities: camelCase (e.g., `fileValidation.ts`)
- Barrel file: `index.ts`（state moduleのみ使用）

### Import Patterns
- 型: `import type { X } from '...'`
- 相対パス: `../../../shared/types`（深い階層）
- Vite特別 import: `*.svg?raw`（SVG文字列として）

### Type Safety
- 厳格 TypeScript: `strict: true`
- 未使用変数禁止: `noUnusedLocals: true`
- Enum なし: Union types 使用 (`RatioPreset`, `BackgroundMode`)

### Constants
- 命名: UPPER_SNAKE_CASE
- 場所: 型定義ファイルまたは使用箇所の近く
- 例: `HISTORY_MAX_SIZE`, `MIN_FONT_SIZE`

## Anti-Patterns

- `any` 型の使用
- `console.log` 本番残留（PWA SW登録は例外）
- Direct state mutation（immer未使用、スプレッド構文必須）

## Commands

```bash
# 開発
bun run dev              # localhost:5173

# ビルド
bun run build            # dist/ に出力
bun run preview          # ビルド済みプレビュー

# テスト
bun run test:unit        # Vitest
bun run test:e2e         # Playwright
bun run test:offline     # オフラインE2Eのみ

# 型チェック
bun run typecheck        # tsc --noEmit
```

## Tools Selection

- **Find files**: `fd --exclude node_modules "pattern" src`
- **Find text**: `rg -n "pattern" -g "!node_modules" src`
- **Find code**: `ast-grep --lang ts -p 'export function $F'`
- **JSON**: `jq`

## Notes

- PWA対応: `vite-plugin-pwa` 使用、Service Worker自動登録
- フォント: Noto Sans JP, M PLUS Rounded 1c（ローカル配置）
- 履歴: JSONシリアライズ可能な状態のみ、max 10件
- エクスポート: Canvas → PNG ダウンロード
- Package manager: Bun (`bun install --frozen-lockfile`)
