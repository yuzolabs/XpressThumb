# Shared Utilities

共有型定義・ユーティリティ関数

## Structure

```
.
├── lib/           # ユーティリティ関数
│   └── fileValidation.ts   # 画像ファイル検証
├── styles/        # グローバルスタイル
│   ├── fonts.css           # フォント定義
│   └── tokens.css          # CSS変数（デザイントークン）
└── types/         # 型定義
    └── editor.ts           # エディタ関連全型定義
```

## Where to Look

| Task | Location | Notes |
|------|----------|-------|
| Editor types | `types/editor.ts` | 全型定義、定数 |
| File validation | `lib/fileValidation.ts` | 画像アップロード検証 |
| Global styles | `styles/` | fonts.css, tokens.css |

## Conventions

### Type Definitions
- Union types > Enum（`RatioPreset`, `BackgroundMode`）
- Constants: UPPER_SNAKE_CASE（`HISTORY_MAX_SIZE`）
- Default values: `DEFAULT_*` プレフィックス
- Limits: `MIN_*`, `MAX_*` プレフィックス

### File Validation
- `ValidationResult` インターフェース
- `MAX_FILE_SIZE`, `ALLOWED_IMAGE_TYPES` 定数
- Sync validation, early return

### CSS
- CSS variables: `--color-*`, `--space-*`, `--font-*`
- フォント: Noto Sans JP, M PLUS Rounded 1c

## Code Patterns

```typescript
// Union types for options
export type RatioPreset = '16:9' | '5:2' | '1:1';

// Constants with limits
export const MIN_FONT_SIZE = 45;
export const MAX_FONT_SIZE = 120;

// Validation result pattern
export interface ValidationResult {
  valid: boolean;
  error?: string;
}
```
