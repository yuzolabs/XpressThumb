/**
 * Editor History Unit Tests
 *
 * Tests undo/redo functionality and history bounds (max 10 entries)
 */

import { describe, it, expect } from 'vitest';
import { initialState } from '../../src/features/editor/state/initialState.js';
import { editorReducer, editorActions } from '../../src/features/editor/state/reducer.js';
import * as selectors from '../../src/features/editor/state/selectors.js';
import { HISTORY_MAX_SIZE } from '../../src/shared/types/editor.js';
import type { EditorState, EditorConfig } from '../../src/shared/types/editor.js';

describe('Editor History', () => {
  describe('Undo Functionality', () => {
    it('should not undo when history is empty', () => {
      const state = editorReducer(initialState, editorActions.undo());
      expect(state).toEqual(initialState);
    });

    it('should undo a single action', () => {
      const modified = editorReducer(
        initialState,
        editorActions.setTextTitle('Modified')
      );
      expect(selectors.canUndo(modified)).toBe(true);

      const undone = editorReducer(modified, editorActions.undo());
      expect(undone.present.text.title).toBe('New Article');
      expect(selectors.canUndo(undone)).toBe(false);
    });

    it('should restore previous state on undo', () => {
      const state1 = editorReducer(initialState, editorActions.setTextTitle('First'));
      const state2 = editorReducer(state1, editorActions.setTextTitle('Second'));
      const state3 = editorReducer(state2, editorActions.setTextTitle('Third'));

      expect(state3.present.text.title).toBe('Third');
      expect(selectors.getHistoryDepth(state3)).toBe(3);

      const undone1 = editorReducer(state3, editorActions.undo());
      expect(undone1.present.text.title).toBe('Second');

      const undone2 = editorReducer(undone1, editorActions.undo());
      expect(undone2.present.text.title).toBe('First');

      const undone3 = editorReducer(undone2, editorActions.undo());
      expect(undone3.present.text.title).toBe('New Article');
    });

    it('should move undone state to future', () => {
      const modified = editorReducer(
        initialState,
        editorActions.setTextTitle('Modified')
      );
      const undone = editorReducer(modified, editorActions.undo());

      expect(undone.future.length).toBe(1);
      expect(selectors.canRedo(undone)).toBe(true);
    });

    it('should preserve validation state on undo', () => {
      const stateWithError = editorReducer(
        initialState,
        editorActions.setValidationTextOverflow(true)
      );
      const modified = editorReducer(
        stateWithError,
        editorActions.setTextTitle('Modified')
      );
      const undone = editorReducer(modified, editorActions.undo());

      expect(undone.validation.textOverflow).toBe(true);
    });
  });

  describe('Redo Functionality', () => {
    it('should not redo when future is empty', () => {
      const state = editorReducer(initialState, editorActions.redo());
      expect(state).toEqual(initialState);
    });

    it('should redo a single undone action', () => {
      const modified = editorReducer(
        initialState,
        editorActions.setTextTitle('Modified')
      );
      const undone = editorReducer(modified, editorActions.undo());
      const redone = editorReducer(undone, editorActions.redo());

      expect(redone.present.text.title).toBe('Modified');
      expect(selectors.canRedo(redone)).toBe(false);
    });

    it('should restore multiple undone states on redo', () => {
      const state1 = editorReducer(initialState, editorActions.setTextTitle('First'));
      const state2 = editorReducer(state1, editorActions.setTextTitle('Second'));
      const undone = editorReducer(state2, editorActions.undo());

      expect(selectors.getFutureDepth(undone)).toBe(1);

      const redone = editorReducer(undone, editorActions.redo());
      expect(redone.present.text.title).toBe('Second');
      expect(selectors.canRedo(redone)).toBe(false);
    });

    it('should clear future when new action is dispatched', () => {
      const state1 = editorReducer(initialState, editorActions.setTextTitle('First'));
      const state2 = editorReducer(state1, editorActions.setTextTitle('Second'));
      const undone = editorReducer(state2, editorActions.undo());

      expect(selectors.canRedo(undone)).toBe(true);

      const newAction = editorReducer(
        undone,
        editorActions.setTextTitle('New Branch')
      );

      expect(selectors.canRedo(newAction)).toBe(false);
      expect(newAction.future).toEqual([]);
    });
  });

  describe('History Bounds (Max 10 Entries)', () => {
    it('should respect HISTORY_MAX_SIZE constant', () => {
      expect(HISTORY_MAX_SIZE).toBe(10);
    });

    it('should limit past history to 10 entries', () => {
      let state = initialState;

      // Perform 15 actions (more than max)
      for (let i = 0; i < 15; i++) {
        state = editorReducer(state, editorActions.setTextTitle(`Title ${i}`));
      }

      expect(selectors.getHistoryDepth(state)).toBe(10);
    });

    it('should keep the most recent 10 entries when limit exceeded', () => {
      let state = initialState;

      // Perform 12 actions
      for (let i = 0; i < 12; i++) {
        state = editorReducer(state, editorActions.setTextTitle(`Title ${i}`));
      }

      // Current title should be 'Title 11'
      expect(state.present.text.title).toBe('Title 11');

      // Undo 10 times should take us back to 'Title 1'
      for (let i = 0; i < 10; i++) {
        state = editorReducer(state, editorActions.undo());
      }

      // After 10 undos, we should be at 'Title 1'
      // (because 'Title 0' was pushed out of history)
      expect(state.present.text.title).toBe('Title 1');
    });

    it('should handle exactly 10 history entries', () => {
      let state = initialState;

      // Perform exactly 10 actions
      for (let i = 0; i < 10; i++) {
        state = editorReducer(state, editorActions.setTextTitle(`Title ${i}`));
      }

      expect(selectors.getHistoryDepth(state)).toBe(10);

      // Should be able to undo all 10
      for (let i = 0; i < 10; i++) {
        expect(selectors.canUndo(state)).toBe(true);
        state = editorReducer(state, editorActions.undo());
      }

      expect(selectors.canUndo(state)).toBe(false);
    });
  });

  describe('History with Mixed Actions', () => {
    it('should track different action types in history', () => {
      const state1 = editorReducer(initialState, editorActions.setTextTitle('Title'));
      const state2 = editorReducer(state1, editorActions.setTextColor('#ff0000'));
      const state3 = editorReducer(state2, editorActions.setTextSize(80));

      expect(selectors.getHistoryDepth(state3)).toBe(3);

      const undone = editorReducer(state3, editorActions.undo());
      expect(undone.present.text.size).toBe(72); // back to default
      expect(undone.present.text.color).toBe('#ff0000'); // preserved

      const undone2 = editorReducer(undone, editorActions.undo());

      expect(undone2.present.text.title).toBe('Title'); // back to first change
      expect(undone2.present.text.color).toBe('#ffffff'); // back to default
    });

    it('should not track validation actions in history', () => {
      const state1 = editorReducer(
        initialState,
        editorActions.setValidationTextOverflow(true)
      );
      const state2 = editorReducer(
        state1,
        editorActions.setTextTitle('Title')
      );
      const state3 = editorReducer(
        state2,
        editorActions.setValidationAssetDecodeError('error')
      );

      // Only the text title change should be in history
      expect(selectors.getHistoryDepth(state3)).toBe(1);

      // Undo should not affect validation flags
      const undone = editorReducer(state3, editorActions.undo());
      expect(undone.validation.textOverflow).toBe(true);
      expect(undone.validation.assetDecodeError).toBe('error');
    });
  });

  describe('Reset Action History', () => {
    it('should clear future on reset', () => {
      const state1 = editorReducer(initialState, editorActions.setTextTitle('First'));
      const state2 = editorReducer(state1, editorActions.setTextTitle('Second'));
      const undone = editorReducer(state2, editorActions.undo());

      expect(selectors.canRedo(undone)).toBe(true);

      const reset = editorReducer(undone, editorActions.reset());
      // Reset clears future when state actually changes
      expect(selectors.canRedo(reset)).toBe(false);
    });

    it('should add reset to history when not from initial state', () => {
      const modified = editorReducer(
        initialState,
        editorActions.setTextTitle('Modified')
      );
      const reset = editorReducer(modified, editorActions.reset());

      // Modified -> Reset, so history depth is 1
      expect(selectors.canUndo(reset)).toBe(true);
    });

    it('should not add redundant reset to history', () => {
      // Reset from default state should not create history entry if state unchanged
      const reset1 = editorReducer(initialState, editorActions.reset());
      expect(selectors.getHistoryDepth(reset1)).toBe(0);
    });
  });

  describe('Complex History Scenarios', () => {
    it('should handle undo/redo with multiple branches', () => {
      // Create a chain of actions
      let state = initialState;
      state = editorReducer(state, editorActions.setTextTitle('A'));
      state = editorReducer(state, editorActions.setTextTitle('B'));
      state = editorReducer(state, editorActions.setTextTitle('C'));

      // Undo twice
      state = editorReducer(state, editorActions.undo());
      state = editorReducer(state, editorActions.undo());
      expect(state.present.text.title).toBe('A');

      // New action should clear future and create branch
      state = editorReducer(state, editorActions.setTextTitle('X'));
      expect(state.present.text.title).toBe('X');
      expect(selectors.canRedo(state)).toBe(false);
      expect(selectors.getHistoryDepth(state)).toBe(2);
    });

    it('should maintain correct history after many undos and redos', () => {
      let state = initialState;

      // Build up history
      for (let i = 0; i < 5; i++) {
        state = editorReducer(state, editorActions.setTextTitle(`Step ${i}`));
      }

      // Undo all
      for (let i = 0; i < 5; i++) {
        state = editorReducer(state, editorActions.undo());
      }

      expect(state.present.text.title).toBe('New Article');
      expect(selectors.getFutureDepth(state)).toBe(5);

      // Redo all
      for (let i = 0; i < 5; i++) {
        state = editorReducer(state, editorActions.redo());
      }

      expect(state.present.text.title).toBe('Step 4');
      expect(selectors.canRedo(state)).toBe(false);
    });

    it('should handle rapid action sequences', () => {
      let state = initialState;

      // Rapid text size changes
      for (let i = 45; i <= 120; i += 5) {
        state = editorReducer(state, editorActions.setTextSize(i));
      }

      // Should have max 10 entries, but all were valid changes
      expect(selectors.getHistoryDepth(state)).toBe(10);

      // Should be able to undo back
      while (selectors.canUndo(state)) {
        state = editorReducer(state, editorActions.undo());
      }

      expect(selectors.canUndo(state)).toBe(false);
    });
  });

  describe('State Immutability', () => {
    it('should not mutate past states', () => {
      const originalPast = [...initialState.past];
      const modified = editorReducer(
        initialState,
        editorActions.setTextTitle('Modified')
      );

      expect(initialState.past).toEqual(originalPast);
      expect(modified.past[0]).not.toBe(initialState.present);
      // Verify it's a deep copy by checking content is equal but not same reference
    });

    it('should create new objects for each state transition', () => {
      const state1 = editorReducer(initialState, editorActions.setTextTitle('A'));
      const state2 = editorReducer(state1, editorActions.setTextTitle('B'));

      expect(state1).not.toBe(state2);
      expect(state1.present).not.toBe(state2.present);
      expect(state1.present.text).not.toBe(state2.present.text);
    });
  });

  describe('JSON Serialization with History', () => {
    it('should serialize state with history', () => {
      let state = initialState;
      state = editorReducer(state, editorActions.setTextTitle('First'));
      state = editorReducer(state, editorActions.setTextTitle('Second'));

      expect(() => JSON.stringify(state)).not.toThrow();
      const serialized = JSON.stringify(state);
      const parsed = JSON.parse(serialized) as EditorState;

      expect(parsed.past.length).toBe(2);
      expect(parsed.present.text.title).toBe('Second');
    });

    it('should not contain non-serializable objects', () => {
      const serialized = JSON.stringify(initialState);
      // Check for common non-serializable patterns
      expect(serialized).not.toContain('ImageBitmap');
      expect(serialized).not.toContain('HTMLImageElement');
      expect(serialized).not.toContain('File {');
      expect(serialized).not.toContain('function');
    });
  });
});
