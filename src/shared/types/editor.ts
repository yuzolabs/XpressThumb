/**
 * Editor Domain Types
 *
 * All types are JSON serializable (no File, ImageBitmap, HTMLImageElement)
 * Ephemeral assets are stored separately in a cache
 */

// =============================================================================
// Ratio Presets
// =============================================================================

export type RatioPreset = '16:9' | '5:2' | '1:1';

export interface Dimensions {
  width: number;
  height: number;
}

export const RATIO_DIMENSIONS: Record<RatioPreset, Dimensions> = {
  '16:9': { width: 1600, height: 900 },
  '5:2': { width: 1500, height: 600 },
  '1:1': { width: 1200, height: 1200 },
};

// =============================================================================
// Text Configuration
// =============================================================================

/**
 * 9-direction position grid:
 * ┌─────────┬─────────┬─────────┐
 * │top-left │  top    │top-right│
 * ├─────────┼─────────┼─────────┤
 * │  left   │ center  │  right  │
 * ├─────────┼─────────┼─────────┤
 * │bottom-  │ bottom  │bottom-  │
 * │ left    │         │ right   │
 * └─────────┴─────────┴─────────┘
 */
export type TextPosition =
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'left'
  | 'center'
  | 'right'
  | 'bottom-left'
  | 'bottom'
  | 'bottom-right';

export const TEXT_POSITIONS: TextPosition[] = [
  'top-left',
  'top',
  'top-right',
  'left',
  'center',
  'right',
  'bottom-left',
  'bottom',
  'bottom-right',
];

export const MIN_FONT_SIZE = 45;
export const MAX_FONT_SIZE = 120;
export const DEFAULT_FONT_SIZE = 72;

export interface TextConfig {
  /** Article title text */
  title: string;
  /** Position on the 9-direction grid */
  position: TextPosition;
  /** Font family name */
  font: string;
  /** Font size in pixels (45-120) */
  size: number;
  /** Text color (hex format) */
  color: string;
}

// =============================================================================
// Background Configuration
// =============================================================================

export type BackgroundMode = 'solid' | 'gradient' | 'image';

export interface SolidBackground {
  mode: 'solid';
  color: string;
}

export interface GradientBackground {
  mode: 'gradient';
  /** CSS linear-gradient direction */
  direction: string;
  /** Array of color stops */
  colors: string[];
}

export interface ImageBackground {
  mode: 'image';
  /** Object URL reference (stored in cache, not state) */
  objectUrl: string | null;
  /** Image fit mode */
  fit: 'cover' | 'contain' | 'stretch';
}

export type BackgroundConfig =
  | SolidBackground
  | GradientBackground
  | ImageBackground;

// =============================================================================
// Pattern Configuration
// =============================================================================

export type PatternType = 'none' | 'noise' | 'dot' | 'grid';

export interface PatternConfig {
  type: PatternType;
  /** Pattern opacity (0-1) */
  opacity: number;
  /** Pattern scale factor */
  scale: number;
  /** Pattern color */
  color: string;
}

// =============================================================================
// Overlay Configuration
// =============================================================================

export const MIN_OVERLAY_SIZE = 10;
export const MAX_OVERLAY_SIZE = 80;
export const MIN_OVERLAY_POSITION = -100;
export const MAX_OVERLAY_POSITION = 100;

export interface OverlayConfig {
  /** Object URL reference (stored in cache, not state) */
  objectUrl: string | null;
  /** Size percentage (10-80%) */
  size: number;
  /** X position offset (-100 to 100) */
  positionX: number;
  /** Y position offset (-100 to 100) */
  positionY: number;
}

// =============================================================================
// Validation State
// =============================================================================

export interface ValidationState {
  /** True if title text overflows available space */
  textOverflow: boolean;
  /** Error message if image asset fails to decode */
  assetDecodeError: string | null;
}

// =============================================================================
// Editor State
// =============================================================================

export interface EditorConfig {
  /** Canvas ratio preset */
  ratio: RatioPreset;
  /** Text configuration */
  text: TextConfig;
  /** Background configuration */
  background: BackgroundConfig;
  /** Pattern overlay configuration */
  pattern: PatternConfig;
  /** Image/emoji overlay configuration */
  overlay: OverlayConfig;
}

export interface EditorValidation {
  /** Validation state flags */
  validation: ValidationState;
}

export interface EditorHistory {
  /** Past states for undo (max 10) */
  past: EditorConfig[];
  /** Current state */
  present: EditorConfig;
  /** Future states for redo */
  future: EditorConfig[];
}

/** Complete editor state including history */
export type EditorState = EditorHistory & EditorValidation;

// =============================================================================
// Action Types
// =============================================================================

export type EditorAction =
  | { type: 'SET_RATIO'; payload: RatioPreset }
  | { type: 'SET_TEXT_TITLE'; payload: string }
  | { type: 'SET_TEXT_POSITION'; payload: TextPosition }
  | { type: 'SET_TEXT_FONT'; payload: string }
  | { type: 'SET_TEXT_SIZE'; payload: number }
  | { type: 'SET_TEXT_COLOR'; payload: string }
  | { type: 'SET_BACKGROUND_MODE'; payload: BackgroundMode }
  | { type: 'SET_BACKGROUND_SOLID_COLOR'; payload: string }
  | { type: 'SET_BACKGROUND_GRADIENT_DIRECTION'; payload: string }
  | { type: 'SET_BACKGROUND_GRADIENT_COLORS'; payload: string[] }
  | { type: 'SET_BACKGROUND_IMAGE_OBJECT_URL'; payload: string | null }
  | { type: 'SET_BACKGROUND_IMAGE_FIT'; payload: ImageBackground['fit'] }
  | { type: 'SET_PATTERN_TYPE'; payload: PatternType }
  | { type: 'SET_PATTERN_OPACITY'; payload: number }
  | { type: 'SET_PATTERN_SCALE'; payload: number }
  | { type: 'SET_PATTERN_COLOR'; payload: string }
  | { type: 'SET_OVERLAY_OBJECT_URL'; payload: string | null }
  | { type: 'SET_OVERLAY_SIZE'; payload: number }
  | { type: 'SET_OVERLAY_POSITION_X'; payload: number }
  | { type: 'SET_OVERLAY_POSITION_Y'; payload: number }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'RESET' }
  | { type: 'SET_VALIDATION_TEXT_OVERFLOW'; payload: boolean }
  | { type: 'SET_VALIDATION_ASSET_DECODE_ERROR'; payload: string | null };

// =============================================================================
// Constants
// =============================================================================

export const HISTORY_MAX_SIZE = 10;

export const DEFAULT_FONT = 'Noto Sans JP';
export const DEFAULT_TEXT_COLOR = '#ffffff';
export const DEFAULT_BACKGROUND_COLOR = '#1a1a2e';
export const DEFAULT_PATTERN_COLOR = '#ffffff';
