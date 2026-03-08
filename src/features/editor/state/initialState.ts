import {
  type EditorConfig,
  type EditorState,
  type EditorValidation,
  type TextConfig,
  type BackgroundConfig,
  type PatternConfig,
  type OverlayConfig,
  type ValidationState,
  DEFAULT_FONT,
  DEFAULT_TEXT_COLOR,
  DEFAULT_BACKGROUND_COLOR,
  DEFAULT_PATTERN_COLOR,
  DEFAULT_FONT_SIZE,
} from '../../../shared/types/editor.js';

/**
 * Default text configuration
 */
export const defaultTextConfig: TextConfig = {
  title: 'New Article',
  position: 'center',
  font: DEFAULT_FONT,
  size: DEFAULT_FONT_SIZE,
  color: DEFAULT_TEXT_COLOR,
};

/**
 * Default background configuration (solid color)
 */
export const defaultBackgroundConfig: BackgroundConfig = {
  mode: 'solid',
  color: DEFAULT_BACKGROUND_COLOR,
};

/**
 * Default pattern configuration (no pattern)
 */
export const defaultPatternConfig: PatternConfig = {
  type: 'none',
  opacity: 0.5,
  scale: 1,
  color: DEFAULT_PATTERN_COLOR,
};

/**
 * Default overlay configuration (no overlay)
 */
export const defaultOverlayConfig: OverlayConfig = {
  objectUrl: null,
  size: 40,
  positionX: 0,
  positionY: 0,
};

/**
 * Default validation state
 */
export const defaultValidationState: ValidationState = {
  textOverflow: false,
  assetDecodeError: null,
};

/**
 * Default editor configuration (without history)
 */
export const defaultEditorConfig: EditorConfig = {
  ratio: '16:9',
  text: defaultTextConfig,
  background: defaultBackgroundConfig,
  pattern: defaultPatternConfig,
  overlay: defaultOverlayConfig,
};

/**
 * Default validation wrapper
 */
export const defaultValidation: EditorValidation = {
  validation: defaultValidationState,
};

/**
 * Complete initial editor state with empty history
 */
export const initialState: EditorState = {
  past: [],
  present: defaultEditorConfig,
  future: [],
  validation: defaultValidationState,
};

/**
 * Create a fresh initial state (useful for reset)
 */
export function createInitialState(): EditorState {
  return {
    past: [],
    present: { ...defaultEditorConfig },
    future: [],
    validation: { ...defaultValidationState },
  };
}

/**
 * Check if a value is a valid EditorConfig
 */
export function isEditorConfig(value: unknown): value is EditorConfig {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const config = value as Record<string, unknown>;

  return (
    'ratio' in config &&
    'text' in config &&
    'background' in config &&
    'pattern' in config &&
    'overlay' in config
  );
}
