/**
 * Editor State Module
 *
 * Provides state management for the thumbnail editor using React useReducer.
 * All state is JSON serializable - ephemeral assets are managed separately.
 */

export type {
  EditorState,
  EditorConfig,
  EditorAction,
  TextConfig,
  BackgroundConfig,
  PatternConfig,
  OverlayConfig,
  ValidationState,
} from '../../../shared/types/editor.js';

export {
  initialState,
  defaultEditorConfig,
  defaultTextConfig,
  defaultBackgroundConfig,
  defaultPatternConfig,
  defaultOverlayConfig,
  createInitialState,
  isEditorConfig,
} from './initialState.js';

export { editorReducer, editorActions } from './reducer.js';

export * as selectors from './selectors.js';
