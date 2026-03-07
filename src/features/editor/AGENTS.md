# Editor Feature

XpressThumb サムネイルエディタ機能モジュール

## Structure

```
.
├── components/           # React UI コンポーネント
│   ├── Controls.tsx      # コントロールパネル（全コントロール統合）
│   └── PreviewCanvasHost.tsx  # Canvasプレビュー表示
├── offline/              # PWAオフライン機能
│   ├── assetCatalog.ts   # アセットカタログ
│   └── fontLoader.ts     # フォントローダー
├── render/               # Canvas描画・エクスポート
│   ├── renderer.ts       # サムネイル描画ロジック
│   └── export.ts         # PNG出力
└── state/                # 状態管理（バレルファイル）
    ├── index.ts          # 公開APIエクスポート
    ├── initialState.ts   # 初期状態生成
    ├── reducer.ts        # History付きreducer
    └── selectors.ts      # 状態選択関数
```

## Where to Look

| Task | Location | Notes |
|------|----------|-------|
| UI Controls | `components/Controls.tsx` | 全コントロールコンポーネント統合 |
| Canvas preview | `components/PreviewCanvasHost.tsx` | リアルタイムプレビュー |
| State management | `state/` | useReducer + Historyパターン |
| Canvas rendering | `render/renderer.ts` | 描画ロジック、500+行 |
| Export PNG | `render/export.ts` | ダウンロード処理 |
| Offline fonts | `offline/fontLoader.ts` | フォントプリロード |

## Conventions

### State Management
- Historyパターン: `past`, `present`, `future`
- Actions: `SET_*`（設定）、`UNDO`/`REDO`（履歴操作）、`RESET`（初期化）
- Validation actions: `SET_VALIDATION_*`（履歴に記録しない）
- Immutability: immer未使用、スプレッド構文必須

### Component Patterns
- Controls: 単一ファイルに複数コンポーネント（コロケーション）
- Props: `value`/`onChange` パターン
- Test IDs: `data-testid` 属性付与

### Canvas Rendering
- 2D Context API 使用
- Font loading: `document.fonts.load()`
- Pattern: SVG文字列 → Blob → Image

## Anti-Patterns

- State mutation（immer未使用）
- `any` 型使用
- History外の副作用アクション
