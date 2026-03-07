import {
  type EditorState,
  type EditorConfig,
  type EditorAction,
  type BackgroundConfig,
  HISTORY_MAX_SIZE,
  MAX_FONT_SIZE,
  MIN_FONT_SIZE,
  MAX_OVERLAY_SIZE,
  MIN_OVERLAY_SIZE,
  MAX_OVERLAY_POSITION,
  MIN_OVERLAY_POSITION,
} from '../../../shared/types/editor.js';
import { defaultEditorConfig } from './initialState.js';

/**
 * Push current present to past history with max size limit
 */
function pushToHistory(past: EditorConfig[], present: EditorConfig): EditorConfig[] {
  // Deep clone to ensure immutability
  const clonedPresent = JSON.parse(JSON.stringify(present)) as EditorConfig;
  const newPast = [...past, clonedPresent];
  if (newPast.length > HISTORY_MAX_SIZE) {
    return newPast.slice(newPast.length - HISTORY_MAX_SIZE);
  }
  return newPast;
}


/**
 * Clamp a number between min and max values
 */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Apply an action to the editor state without history tracking
 * Used internally by the main reducer
 */
function applyAction(state: EditorConfig, action: EditorAction): EditorConfig {
  switch (action.type) {
    case 'SET_RATIO':
      return { ...state, ratio: action.payload };

    case 'SET_TEXT_TITLE':
      return {
        ...state,
        text: { ...state.text, title: action.payload },
      };

    case 'SET_TEXT_POSITION':
      return {
        ...state,
        text: { ...state.text, position: action.payload },
      };

    case 'SET_TEXT_FONT':
      return {
        ...state,
        text: { ...state.text, font: action.payload },
      };

    case 'SET_TEXT_SIZE':
      return {
        ...state,
        text: {
          ...state.text,
          size: clamp(action.payload, MIN_FONT_SIZE, MAX_FONT_SIZE),
        },
      };

    case 'SET_TEXT_COLOR':
      return {
        ...state,
        text: { ...state.text, color: action.payload },
      };

    case 'SET_BACKGROUND_MODE': {
      const mode = action.payload;
      let background: BackgroundConfig;

      switch (mode) {
        case 'solid':
          background = {
            mode: 'solid',
            color: state.background.mode === 'solid'
              ? state.background.color
              : '#1a1a2e',
          };
          break;
        case 'gradient':
          background = {
            mode: 'gradient',
            direction: 'to right',
            colors: ['#1a1a2e', '#16213e'],
          };
          break;
        case 'image':
          background = {
            mode: 'image',
            objectUrl: '',
            fit: 'cover',
          };
          break;
      }

      return { ...state, background };
    }

    case 'SET_BACKGROUND_SOLID_COLOR':
      if (state.background.mode !== 'solid') return state;
      return {
        ...state,
        background: { ...state.background, color: action.payload },
      };

    case 'SET_BACKGROUND_GRADIENT_DIRECTION':
      if (state.background.mode !== 'gradient') return state;
      return {
        ...state,
        background: { ...state.background, direction: action.payload },
      };

    case 'SET_BACKGROUND_GRADIENT_COLORS':
      if (state.background.mode !== 'gradient') return state;
      return {
        ...state,
        background: { ...state.background, colors: action.payload },
      };

    case 'SET_BACKGROUND_IMAGE_OBJECT_URL':
      if (state.background.mode !== 'image') return state;
      return {
        ...state,
        background: { ...state.background, objectUrl: action.payload || '' },
      };

    case 'SET_BACKGROUND_IMAGE_FIT':
      if (state.background.mode !== 'image') return state;
      return {
        ...state,
        background: { ...state.background, fit: action.payload },
      };

    case 'SET_PATTERN_TYPE':
      return {
        ...state,
        pattern: { ...state.pattern, type: action.payload },
      };

    case 'SET_PATTERN_OPACITY':
      return {
        ...state,
        pattern: {
          ...state.pattern,
          opacity: clamp(action.payload, 0, 1),
        },
      };

    case 'SET_PATTERN_SCALE':
      return {
        ...state,
        pattern: {
          ...state.pattern,
          scale: Math.max(0.1, action.payload),
        },
      };

    case 'SET_PATTERN_COLOR':
      return {
        ...state,
        pattern: { ...state.pattern, color: action.payload },
      };

    case 'SET_OVERLAY_OBJECT_URL':
      return {
        ...state,
        overlay: { ...state.overlay, objectUrl: action.payload || '' },
      };

    case 'SET_OVERLAY_SIZE':
      return {
        ...state,
        overlay: {
          ...state.overlay,
          size: clamp(action.payload, MIN_OVERLAY_SIZE, MAX_OVERLAY_SIZE),
        },
      };

    case 'SET_OVERLAY_POSITION_X':
      return {
        ...state,
        overlay: {
          ...state.overlay,
          positionX: clamp(action.payload, MIN_OVERLAY_POSITION, MAX_OVERLAY_POSITION),
        },
      };

    case 'SET_OVERLAY_POSITION_Y':
      return {
        ...state,
        overlay: {
          ...state.overlay,
          positionY: clamp(action.payload, MIN_OVERLAY_POSITION, MAX_OVERLAY_POSITION),
        },
      };

    case 'RESET':
      return { ...defaultEditorConfig };
      return { ...defaultEditorConfig };

    default:
      return state;
  }
}

/**
 * Check if an action should be recorded in history
 */
function isHistoryAction(action: EditorAction): boolean {
  // Validation actions don't affect history
  if (action.type.startsWith('SET_VALIDATION_')) {
    return false;
  }
  // Undo/Redo don't create history entries
  if (['UNDO', 'REDO'].includes(action.type)) {
    return false;
  }
  if (['UNDO', 'REDO'].includes(action.type)) {
    return false;
  }
  return true;
}

/**
 * Main editor reducer with history support
 */
export function editorReducer(
  state: EditorState,
  action: EditorAction
): EditorState {
  // Handle undo
  if (action.type === 'UNDO') {
    if (state.past.length === 0) {
      return state; // Nothing to undo
    }
    const previous = state.past[state.past.length - 1];
    const newPast = state.past.slice(0, -1);
    return {
      ...state,
      past: newPast,
      present: previous,
      future: [state.present, ...state.future],
    };
  }

  // Handle redo
  if (action.type === 'REDO') {
    if (state.future.length === 0) {
      return state; // Nothing to redo
    }
    const next = state.future[0];
    const newFuture = state.future.slice(1);
    return {
      ...state,
      past: pushToHistory(state.past, state.present),
      present: next,
      future: newFuture,
    };
  }

  // Handle validation actions (don't affect history)
  if (action.type === 'SET_VALIDATION_TEXT_OVERFLOW') {
    return {
      ...state,
      validation: {
        ...state.validation,
        textOverflow: action.payload,
      },
    };
  }

  if (action.type === 'SET_VALIDATION_ASSET_DECODE_ERROR') {
    return {
      ...state,
      validation: {
        ...state.validation,
        assetDecodeError: action.payload,
      },
    };
  }
  // Handle reset specially - it creates history but clears future
  if (action.type === 'RESET') {
    const newPresent = applyAction(state.present, action);
    if (JSON.stringify(newPresent) === JSON.stringify(state.present)) {
      return state;
    }
    return {
      past: pushToHistory(state.past, state.present),
      present: newPresent,
      future: [], // Clear future on reset
      validation: state.validation,
    };
  }

  // Apply the action to get new present state
  const newPresent = applyAction(state.present, action);

  // If state didn't change, don't add to history
  if (JSON.stringify(newPresent) === JSON.stringify(state.present)) {
    return state;
  }

  // Update state with history
  const newState: EditorState = {
    past: isHistoryAction(action)
      ? pushToHistory(state.past, state.present)
      : state.past,
    present: newPresent,
    future: [], // Clear future on any new action (except undo/redo/reset handled above)
    validation: state.validation,
  };

  return newState;
}

/**
 * Action creators for convenience
 */
export const editorActions = {
  setRatio: (payload: Parameters<typeof editorReducer>[1] extends { type: 'SET_RATIO'; payload: infer P } ? P : never) =>
    ({ type: 'SET_RATIO' as const, payload }),
  setTextTitle: (payload: string) =>
    ({ type: 'SET_TEXT_TITLE' as const, payload }),
  setTextPosition: (payload: Parameters<typeof editorReducer>[1] extends { type: 'SET_TEXT_POSITION'; payload: infer P } ? P : never) =>
    ({ type: 'SET_TEXT_POSITION' as const, payload }),
  setTextFont: (payload: string) =>
    ({ type: 'SET_TEXT_FONT' as const, payload }),
  setTextSize: (payload: number) =>
    ({ type: 'SET_TEXT_SIZE' as const, payload }),
  setTextColor: (payload: string) =>
    ({ type: 'SET_TEXT_COLOR' as const, payload }),
  setBackgroundMode: (payload: Parameters<typeof editorReducer>[1] extends { type: 'SET_BACKGROUND_MODE'; payload: infer P } ? P : never) =>
    ({ type: 'SET_BACKGROUND_MODE' as const, payload }),
  setBackgroundSolidColor: (payload: string) =>
    ({ type: 'SET_BACKGROUND_SOLID_COLOR' as const, payload }),
  setBackgroundGradientDirection: (payload: string) =>
    ({ type: 'SET_BACKGROUND_GRADIENT_DIRECTION' as const, payload }),
  setBackgroundGradientColors: (payload: string[]) =>
    ({ type: 'SET_BACKGROUND_GRADIENT_COLORS' as const, payload }),
  setBackgroundImageObjectUrl: (payload: string | null) =>
    ({ type: 'SET_BACKGROUND_IMAGE_OBJECT_URL' as const, payload }),
  setBackgroundImageFit: (payload: Parameters<typeof editorReducer>[1] extends { type: 'SET_BACKGROUND_IMAGE_FIT'; payload: infer P } ? P : never) =>
    ({ type: 'SET_BACKGROUND_IMAGE_FIT' as const, payload }),
  setPatternType: (payload: Parameters<typeof editorReducer>[1] extends { type: 'SET_PATTERN_TYPE'; payload: infer P } ? P : never) =>
    ({ type: 'SET_PATTERN_TYPE' as const, payload }),
  setPatternOpacity: (payload: number) =>
    ({ type: 'SET_PATTERN_OPACITY' as const, payload }),
  setPatternScale: (payload: number) =>
    ({ type: 'SET_PATTERN_SCALE' as const, payload }),
  setPatternColor: (payload: string) =>
    ({ type: 'SET_PATTERN_COLOR' as const, payload }),
  setOverlayObjectUrl: (payload: string | null) =>
    ({ type: 'SET_OVERLAY_OBJECT_URL' as const, payload }),
  setOverlaySize: (payload: number) =>
    ({ type: 'SET_OVERLAY_SIZE' as const, payload }),
  setOverlayPositionX: (payload: number) =>
    ({ type: 'SET_OVERLAY_POSITION_X' as const, payload }),
  setOverlayPositionY: (payload: number) =>
    ({ type: 'SET_OVERLAY_POSITION_Y' as const, payload }),
  undo: () => ({ type: 'UNDO' as const }),
  redo: () => ({ type: 'REDO' as const }),
  reset: () => ({ type: 'RESET' as const }),
  setValidationTextOverflow: (payload: boolean) =>
    ({ type: 'SET_VALIDATION_TEXT_OVERFLOW' as const, payload }),
  setValidationAssetDecodeError: (payload: string | null) =>
    ({ type: 'SET_VALIDATION_ASSET_DECODE_ERROR' as const, payload }),
} as const;
