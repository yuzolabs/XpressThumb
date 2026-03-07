import {
  type EditorState,
  type EditorConfig,
  type TextConfig,
  type BackgroundConfig,
  type PatternConfig,
  type OverlayConfig,
  type ValidationState,
  type RatioPreset,
  type TextPosition,
  type BackgroundMode,
  type PatternType,
  type ImageBackground,
  RATIO_DIMENSIONS,
  MIN_FONT_SIZE,
  MAX_FONT_SIZE,
  MIN_OVERLAY_SIZE,
  MAX_OVERLAY_SIZE,
  MIN_OVERLAY_POSITION,
  MAX_OVERLAY_POSITION,
} from '../../../shared/types/editor.js';

// =============================================================================
// History Selectors
// =============================================================================

/**
 * Check if undo is available
 */
export const canUndo = (state: EditorState): boolean =>
  state.past.length > 0;

/**
 * Check if redo is available
 */
export const canRedo = (state: EditorState): boolean =>
  state.future.length > 0;

/**
 * Get history depth (number of past states)
 */
export const getHistoryDepth = (state: EditorState): number =>
  state.past.length;

/**
 * Get future depth (number of future states)
 */
export const getFutureDepth = (state: EditorState): number =>
  state.future.length;

// =============================================================================
// Config Selectors
// =============================================================================

/**
 * Get current editor configuration
 */
export const getConfig = (state: EditorState): EditorConfig =>
  state.present;

/**
 * Get ratio preset
 */
export const getRatio = (state: EditorState): RatioPreset =>
  state.present.ratio;

/**
 * Get canvas dimensions for current ratio
 */
export const getDimensions = (state: EditorState): { width: number; height: number } =>
  RATIO_DIMENSIONS[state.present.ratio];

// =============================================================================
// Text Selectors
// =============================================================================

/**
 * Get text configuration
 */
export const getTextConfig = (state: EditorState): TextConfig =>
  state.present.text;

/**
 * Get text title
 */
export const getTextTitle = (state: EditorState): string =>
  state.present.text.title;

/**
 * Get text position
 */
export const getTextPosition = (state: EditorState): TextPosition =>
  state.present.text.position;

/**
 * Get text font
 */
export const getTextFont = (state: EditorState): string =>
  state.present.text.font;

/**
 * Get text size
 */
export const getTextSize = (state: EditorState): number =>
  state.present.text.size;

/**
 * Get text color
 */
export const getTextColor = (state: EditorState): string =>
  state.present.text.color;

/**
 * Check if text size is at minimum
 */
export const isTextSizeMin = (state: EditorState): boolean =>
  state.present.text.size <= MIN_FONT_SIZE;

/**
 * Check if text size is at maximum
 */
export const isTextSizeMax = (state: EditorState): boolean =>
  state.present.text.size >= MAX_FONT_SIZE;

// =============================================================================
// Background Selectors
// =============================================================================

/**
 * Get background configuration
 */
export const getBackgroundConfig = (state: EditorState): BackgroundConfig =>
  state.present.background;

/**
 * Get background mode
 */
export const getBackgroundMode = (state: EditorState): BackgroundMode =>
  state.present.background.mode;

/**
 * Check if background is solid color mode
 */
export const isSolidBackground = (state: EditorState): boolean =>
  state.present.background.mode === 'solid';

/**
 * Check if background is gradient mode
 */
export const isGradientBackground = (state: EditorState): boolean =>
  state.present.background.mode === 'gradient';

/**
 * Check if background is image mode
 */
export const isImageBackground = (state: EditorState): boolean =>
  state.present.background.mode === 'image';

/**
 * Get solid background color (or null if not solid)
 */
export const getSolidBackgroundColor = (state: EditorState): string | null =>
  state.present.background.mode === 'solid'
    ? state.present.background.color
    : null;

/**
 * Get gradient background config (or null if not gradient)
 */
export const getGradientBackgroundConfig = (state: EditorState):
  | { direction: string; colors: string[] }
  | null =>
  state.present.background.mode === 'gradient'
    ? {
        direction: state.present.background.direction,
        colors: state.present.background.colors,
      }
    : null;

/**
 * Get image background config (or null if not image)
 */
export const getImageBackgroundConfig = (state: EditorState):
  | { objectUrl: string | null; fit: ImageBackground['fit'] }
  | null =>
  state.present.background.mode === 'image'
    ? {
        objectUrl: state.present.background.objectUrl,
        fit: state.present.background.fit,
      }
    : null;

/**
 * Check if background image is set
 */
export const hasBackgroundImage = (state: EditorState): boolean =>
  state.present.background.mode === 'image' &&
  state.present.background.objectUrl !== null;

// =============================================================================
// Pattern Selectors
// =============================================================================

/**
 * Get pattern configuration
 */
export const getPatternConfig = (state: EditorState): PatternConfig =>
  state.present.pattern;

/**
 * Get pattern type
 */
export const getPatternType = (state: EditorState): PatternType =>
  state.present.pattern.type;

/**
 * Check if pattern is enabled
 */
export const isPatternEnabled = (state: EditorState): boolean =>
  state.present.pattern.type !== 'none';

/**
 * Get pattern opacity
 */
export const getPatternOpacity = (state: EditorState): number =>
  state.present.pattern.opacity;

/**
 * Get pattern scale
 */
export const getPatternScale = (state: EditorState): number =>
  state.present.pattern.scale;

/**
 * Get pattern color
 */
export const getPatternColor = (state: EditorState): string =>
  state.present.pattern.color;

// =============================================================================
// Overlay Selectors
// =============================================================================

/**
 * Get overlay configuration
 */
export const getOverlayConfig = (state: EditorState): OverlayConfig =>
  state.present.overlay;

/**
 * Get overlay object URL
 */
export const getOverlayObjectUrl = (state: EditorState): string | null =>
  state.present.overlay.objectUrl;

/**
 * Check if overlay image is set
 */
export const hasOverlay = (state: EditorState): boolean =>
  state.present.overlay.objectUrl !== null;

/**
 * Get overlay size
 */
export const getOverlaySize = (state: EditorState): number =>
  state.present.overlay.size;

/**
 * Get overlay X position
 */
export const getOverlayPositionX = (state: EditorState): number =>
  state.present.overlay.positionX;

/**
 * Get overlay Y position
 */
export const getOverlayPositionY = (state: EditorState): number =>
  state.present.overlay.positionY;

/**
 * Check if overlay size is at minimum
 */
export const isOverlaySizeMin = (state: EditorState): boolean =>
  state.present.overlay.size <= MIN_OVERLAY_SIZE;

/**
 * Check if overlay size is at maximum
 */
export const isOverlaySizeMax = (state: EditorState): boolean =>
  state.present.overlay.size >= MAX_OVERLAY_SIZE;

/**
 * Check if overlay X position is at minimum
 */
export const isOverlayPositionXMin = (state: EditorState): boolean =>
  state.present.overlay.positionX <= MIN_OVERLAY_POSITION;

/**
 * Check if overlay X position is at maximum
 */
export const isOverlayPositionXMax = (state: EditorState): boolean =>
  state.present.overlay.positionX >= MAX_OVERLAY_POSITION;

/**
 * Check if overlay Y position is at minimum
 */
export const isOverlayPositionYMin = (state: EditorState): boolean =>
  state.present.overlay.positionY <= MIN_OVERLAY_POSITION;

/**
 * Check if overlay Y position is at maximum
 */
export const isOverlayPositionYMax = (state: EditorState): boolean =>
  state.present.overlay.positionY >= MAX_OVERLAY_POSITION;

// =============================================================================
// Validation Selectors
// =============================================================================

/**
 * Get validation state
 */
export const getValidation = (state: EditorState): ValidationState =>
  state.validation;

/**
 * Check if text overflows
 */
export const hasTextOverflow = (state: EditorState): boolean =>
  state.validation.textOverflow;

/**
 * Get asset decode error (if any)
 */
export const getAssetDecodeError = (state: EditorState): string | null =>
  state.validation.assetDecodeError;

/**
 * Check if there's any validation error
 */
export const hasValidationError = (state: EditorState): boolean =>
  state.validation.textOverflow || state.validation.assetDecodeError !== null;

/**
 * Check if export should be blocked
 */
export const isExportBlocked = (state: EditorState): boolean =>
  state.validation.textOverflow || state.validation.assetDecodeError !== null;

// =============================================================================
// Derived State Selectors
// =============================================================================

/**
 * Get CSS-ready gradient string (if gradient mode)
 */
export const getGradientCss = (state: EditorState): string | null => {
  if (state.present.background.mode !== 'gradient') {
    return null;
  }
  const { direction, colors } = state.present.background;
  return `linear-gradient(${direction}, ${colors.join(', ')})`;
};

/**
 * Get background CSS value for canvas
 */
export const getBackgroundCss = (state: EditorState): string => {
  const bg = state.present.background;
  switch (bg.mode) {
    case 'solid':
      return bg.color;
    case 'gradient':
      return `linear-gradient(${bg.direction}, ${bg.colors.join(', ')})`;
    case 'image':
      return bg.objectUrl ? `url(${bg.objectUrl})` : 'transparent';
    default:
      return 'transparent';
  }
};

/**
 * Get complete editor state for export/serialization
 */
export const getSerializableState = (state: EditorState): EditorState =>
  state;
