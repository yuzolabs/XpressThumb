/**
 * Editor State Unit Tests
 *
 * Tests all reducer actions and selector functions
 */

import { describe, it, expect } from 'vitest';
import {
  initialState,
  defaultEditorConfig,
  createInitialState,
} from '../../src/features/editor/state/initialState.js';
import { editorReducer, editorActions } from '../../src/features/editor/state/reducer.js';
import * as selectors from '../../src/features/editor/state/selectors.js';
import type { EditorState, TextPosition } from '../../src/shared/types/editor.js';

describe('Editor State', () => {
  describe('Initial State', () => {
    it('should have correct initial values', () => {
      expect(initialState.past).toEqual([]);
      expect(initialState.future).toEqual([]);
      expect(initialState.validation.textOverflow).toBe(false);
      expect(initialState.validation.assetDecodeError).toBeNull();
    });

    it('should have default ratio 16:9', () => {
      expect(initialState.present.ratio).toBe('16:9');
    });

    it('should have default text config', () => {
      expect(initialState.present.text.title).toBe('New Article');
      expect(initialState.present.text.position).toBe('center');
      expect(initialState.present.text.size).toBe(72);
      expect(initialState.present.text.color).toBe('#ffffff');
    });

    it('should be JSON serializable', () => {
      expect(() => JSON.stringify(initialState)).not.toThrow();
      const parsed = JSON.parse(JSON.stringify(initialState));
      expect(parsed).toEqual(initialState);
    });

    it('createInitialState should return fresh state', () => {
      const state1 = createInitialState();
      const state2 = createInitialState();
      expect(state1).toEqual(state2);
      expect(state1).not.toBe(state2);
    });
  });

  describe('Ratio Actions', () => {
    it('should set ratio to 1:1', () => {
      const action = editorActions.setRatio('1:1');
      const state = editorReducer(initialState, action);
      expect(state.present.ratio).toBe('1:1');
    });

    it('should set ratio to 5:2', () => {
      const action = editorActions.setRatio('5:2');
      const state = editorReducer(initialState, action);
      expect(state.present.ratio).toBe('5:2');
    });
  });

  describe('Text Actions', () => {
    it('should set text title', () => {
      const action = editorActions.setTextTitle('Test Article');
      const state = editorReducer(initialState, action);
      expect(state.present.text.title).toBe('Test Article');
    });

    it('should set text position to all 9 directions', () => {
      const positions: TextPosition[] = [
        'top-left', 'top', 'top-right',
        'left', 'center', 'right',
        'bottom-left', 'bottom', 'bottom-right',
      ];

      for (const position of positions) {
        const action = editorActions.setTextPosition(position);
        const state = editorReducer(initialState, action);
        expect(state.present.text.position).toBe(position);
      }
    });

    it('should set text font', () => {
      const action = editorActions.setTextFont('Arial');
      const state = editorReducer(initialState, action);
      expect(state.present.text.font).toBe('Arial');
    });

    it('should set text size within bounds', () => {
      const action = editorActions.setTextSize(60);
      const state = editorReducer(initialState, action);
      expect(state.present.text.size).toBe(60);
    });

    it('should clamp text size to minimum', () => {
      const action = editorActions.setTextSize(10);
      const state = editorReducer(initialState, action);
      expect(state.present.text.size).toBe(45);
    });

    it('should clamp text size to maximum', () => {
      const action = editorActions.setTextSize(200);
      const state = editorReducer(initialState, action);
      expect(state.present.text.size).toBe(120);
    });

    it('should set text color', () => {
      const action = editorActions.setTextColor('#ff0000');
      const state = editorReducer(initialState, action);
      expect(state.present.text.color).toBe('#ff0000');
    });
  });

  describe('Background Actions', () => {
    it('should switch to solid background mode', () => {
      const action = editorActions.setBackgroundMode('solid');
      const state = editorReducer(initialState, action);
      expect(state.present.background.mode).toBe('solid');
    });

    it('should switch to gradient background mode', () => {
      const action = editorActions.setBackgroundMode('gradient');
      const state = editorReducer(initialState, action);
      expect(state.present.background.mode).toBe('gradient');
      expect(state.present.background).toHaveProperty('direction');
      expect(state.present.background).toHaveProperty('colors');
    });

    it('should switch to image background mode', () => {
      const action = editorActions.setBackgroundMode('image');
      const state = editorReducer(initialState, action);
      expect(state.present.background.mode).toBe('image');
      expect(state.present.background).toHaveProperty('objectUrl');
      expect(state.present.background).toHaveProperty('fit');
    });

    it('should set solid background color', () => {
      const solidState = editorReducer(
        initialState,
        editorActions.setBackgroundMode('solid')
      );
      const action = editorActions.setBackgroundSolidColor('#123456');
      const state = editorReducer(solidState, action);
      if (state.present.background.mode === 'solid') {
        expect(state.present.background.color).toBe('#123456');
      }
    });

    it('should set gradient direction', () => {
      const gradientState = editorReducer(
        initialState,
        editorActions.setBackgroundMode('gradient')
      );
      const action = editorActions.setBackgroundGradientDirection('to bottom');
      const state = editorReducer(gradientState, action);
      if (state.present.background.mode === 'gradient') {
        expect(state.present.background.direction).toBe('to bottom');
      }
    });

    it('should set gradient colors', () => {
      const gradientState = editorReducer(
        initialState,
        editorActions.setBackgroundMode('gradient')
      );
      const colors = ['#ff0000', '#00ff00', '#0000ff'];
      const action = editorActions.setBackgroundGradientColors(colors);
      const state = editorReducer(gradientState, action);
      if (state.present.background.mode === 'gradient') {
        expect(state.present.background.colors).toEqual(colors);
      }
    });

    it('should set image object URL', () => {
      const imageState = editorReducer(
        initialState,
        editorActions.setBackgroundMode('image')
      );
      const action = editorActions.setBackgroundImageObjectUrl('blob:123');
      const state = editorReducer(imageState, action);
      if (state.present.background.mode === 'image') {
        expect(state.present.background.objectUrl).toBe('blob:123');
      }
    });

    it('should set image fit', () => {
      const imageState = editorReducer(
        initialState,
        editorActions.setBackgroundMode('image')
      );
      const fits = ['cover', 'contain', 'stretch'] as const;
      for (const fit of fits) {
        const action = editorActions.setBackgroundImageFit(fit);
        const state = editorReducer(imageState, action);
        if (state.present.background.mode === 'image') {
          expect(state.present.background.fit).toBe(fit);
        }
      }
    });
  });

  describe('Pattern Actions', () => {
    it('should set pattern type', () => {
      const types = ['none', 'noise', 'dot', 'grid'] as const;
      for (const type of types) {
        const action = editorActions.setPatternType(type);
        const state = editorReducer(initialState, action);
        expect(state.present.pattern.type).toBe(type);
      }
    });

    it('should set pattern opacity within bounds', () => {
      const action = editorActions.setPatternOpacity(0.75);
      const state = editorReducer(initialState, action);
      expect(state.present.pattern.opacity).toBe(0.75);
    });

    it('should clamp pattern opacity to minimum 0', () => {
      const action = editorActions.setPatternOpacity(-0.5);
      const state = editorReducer(initialState, action);
      expect(state.present.pattern.opacity).toBe(0);
    });

    it('should clamp pattern opacity to maximum 1', () => {
      const action = editorActions.setPatternOpacity(1.5);
      const state = editorReducer(initialState, action);
      expect(state.present.pattern.opacity).toBe(1);
    });

    it('should set pattern scale', () => {
      const action = editorActions.setPatternScale(2);
      const state = editorReducer(initialState, action);
      expect(state.present.pattern.scale).toBe(2);
    });

    it('should clamp pattern scale to minimum 0.1', () => {
      const action = editorActions.setPatternScale(0.01);
      const state = editorReducer(initialState, action);
      expect(state.present.pattern.scale).toBe(0.1);
    });

    it('should set pattern color', () => {
      const action = editorActions.setPatternColor('#00ff00');
      const state = editorReducer(initialState, action);
      expect(state.present.pattern.color).toBe('#00ff00');
    });
  });

  describe('Overlay Actions', () => {
    it('should set overlay object URL', () => {
      const action = editorActions.setOverlayObjectUrl('blob:overlay');
      const state = editorReducer(initialState, action);
      expect(state.present.overlay.objectUrl).toBe('blob:overlay');
    });

    it('should set overlay size within bounds', () => {
      const action = editorActions.setOverlaySize(50);
      const state = editorReducer(initialState, action);
      expect(state.present.overlay.size).toBe(50);
    });

    it('should clamp overlay size to minimum 10', () => {
      const action = editorActions.setOverlaySize(5);
      const state = editorReducer(initialState, action);
      expect(state.present.overlay.size).toBe(10);
    });

    it('should clamp overlay size to maximum 80', () => {
      const action = editorActions.setOverlaySize(100);
      const state = editorReducer(initialState, action);
      expect(state.present.overlay.size).toBe(80);
    });

    it('should set overlay X position within bounds', () => {
      const action = editorActions.setOverlayPositionX(50);
      const state = editorReducer(initialState, action);
      expect(state.present.overlay.positionX).toBe(50);
    });

    it('should clamp overlay X position to minimum -100', () => {
      const action = editorActions.setOverlayPositionX(-150);
      const state = editorReducer(initialState, action);
      expect(state.present.overlay.positionX).toBe(-100);
    });

    it('should clamp overlay X position to maximum 100', () => {
      const action = editorActions.setOverlayPositionX(150);
      const state = editorReducer(initialState, action);
      expect(state.present.overlay.positionX).toBe(100);
    });

    it('should set overlay Y position within bounds', () => {
      const action = editorActions.setOverlayPositionY(-50);
      const state = editorReducer(initialState, action);
      expect(state.present.overlay.positionY).toBe(-50);
    });

    it('should clamp overlay Y position to minimum -100', () => {
      const action = editorActions.setOverlayPositionY(-200);
      const state = editorReducer(initialState, action);
      expect(state.present.overlay.positionY).toBe(-100);
    });

    it('should clamp overlay Y position to maximum 100', () => {
      const action = editorActions.setOverlayPositionY(200);
      const state = editorReducer(initialState, action);
      expect(state.present.overlay.positionY).toBe(100);
    });
  });

  describe('Validation Actions', () => {
    it('should set text overflow flag', () => {
      const action = editorActions.setValidationTextOverflow(true);
      const state = editorReducer(initialState, action);
      expect(state.validation.textOverflow).toBe(true);
    });

    it('should set asset decode error', () => {
      const error = 'Failed to decode image';
      const action = editorActions.setValidationAssetDecodeError(error);
      const state = editorReducer(initialState, action);
      expect(state.validation.assetDecodeError).toBe(error);
    });

    it('should clear asset decode error', () => {
      const errorState = editorReducer(
        initialState,
        editorActions.setValidationAssetDecodeError('error')
      );
      const action = editorActions.setValidationAssetDecodeError(null);
      const state = editorReducer(errorState, action);
      expect(state.validation.assetDecodeError).toBeNull();
    });
  });

  describe('Reset Action', () => {
    it('should reset to default config', () => {
      const modifiedState = editorReducer(
        initialState,
        editorActions.setTextTitle('Modified')
      );
      const resetState = editorReducer(modifiedState, editorActions.reset());
      expect(resetState.present).toEqual(defaultEditorConfig);
    });

    it('should preserve validation state on reset', () => {
      const stateWithError = editorReducer(
        initialState,
        editorActions.setValidationTextOverflow(true)
      );
      const resetState = editorReducer(stateWithError, editorActions.reset());
      expect(resetState.validation.textOverflow).toBe(true);
    });
  });

  describe('Selectors', () => {
    const testState: EditorState = {
      past: [],
      present: {
        ratio: '5:2',
        text: {
          title: 'Test Title',
          position: 'top-left',
          font: 'Arial',
          size: 60,
          color: '#ff0000',
        },
        background: {
          mode: 'gradient',
          direction: 'to right',
          colors: ['#000', '#fff'],
        },
        pattern: {
          type: 'dot',
          opacity: 0.5,
          scale: 1.5,
          color: '#00ff00',
        },
        overlay: {
          objectUrl: 'blob:test',
          size: 30,
          positionX: 50,
          positionY: -50,
        },
      },
      future: [],
      validation: {
        textOverflow: true,
        assetDecodeError: 'test error',
      },
    };

    describe('History Selectors', () => {
      it('should check canUndo', () => {
        expect(selectors.canUndo(initialState)).toBe(false);
        expect(selectors.canUndo({ ...testState, past: [defaultEditorConfig] })).toBe(true);
      });

      it('should check canRedo', () => {
        expect(selectors.canRedo(initialState)).toBe(false);
        expect(selectors.canRedo({ ...testState, future: [defaultEditorConfig] })).toBe(true);
      });

      it('should get history depth', () => {
        expect(selectors.getHistoryDepth(initialState)).toBe(0);
        expect(selectors.getHistoryDepth({ ...testState, past: [defaultEditorConfig, defaultEditorConfig] })).toBe(2);
      });
    });

    describe('Config Selectors', () => {
      it('should get config', () => {
        expect(selectors.getConfig(testState)).toBe(testState.present);
      });

      it('should get ratio', () => {
        expect(selectors.getRatio(testState)).toBe('5:2');
      });

      it('should get dimensions', () => {
        const dims = selectors.getDimensions(testState);
        expect(dims).toEqual({ width: 1500, height: 600 });
      });
    });

    describe('Text Selectors', () => {
      it('should get text config', () => {
        expect(selectors.getTextConfig(testState)).toEqual(testState.present.text);
      });

      it('should get text title', () => {
        expect(selectors.getTextTitle(testState)).toBe('Test Title');
      });

      it('should get text position', () => {
        expect(selectors.getTextPosition(testState)).toBe('top-left');
      });

      it('should check text size bounds', () => {
        const minState = editorReducer(initialState, editorActions.setTextSize(45));
        const maxState = editorReducer(initialState, editorActions.setTextSize(120));
        expect(selectors.isTextSizeMin(minState)).toBe(true);
        expect(selectors.isTextSizeMin(initialState)).toBe(false);
        expect(selectors.isTextSizeMax(maxState)).toBe(true);
        expect(selectors.isTextSizeMax(initialState)).toBe(false);
      });
    });

    describe('Background Selectors', () => {
      it('should get background config', () => {
        expect(selectors.getBackgroundConfig(testState)).toEqual(testState.present.background);
      });

      it('should check background mode', () => {
        expect(selectors.isSolidBackground(initialState)).toBe(true);
        expect(selectors.isGradientBackground(testState)).toBe(true);
        expect(selectors.isImageBackground(initialState)).toBe(false);
      });

      it('should get gradient CSS', () => {
        const css = selectors.getGradientCss(testState);
        expect(css).toBe('linear-gradient(to right, #000, #fff)');
      });
    });

    describe('Pattern Selectors', () => {
      it('should check if pattern is enabled', () => {
        expect(selectors.isPatternEnabled(testState)).toBe(true);
        expect(selectors.isPatternEnabled(initialState)).toBe(false);
      });

      it('should get pattern opacity', () => {
        expect(selectors.getPatternOpacity(testState)).toBe(0.5);
      });
    });

    describe('Overlay Selectors', () => {
      it('should check if overlay exists', () => {
        expect(selectors.hasOverlay(testState)).toBe(true);
        expect(selectors.hasOverlay(initialState)).toBe(false);
      });

      it('should get overlay position', () => {
        expect(selectors.getOverlayPositionX(testState)).toBe(50);
        expect(selectors.getOverlayPositionY(testState)).toBe(-50);
      });
    });

    describe('Validation Selectors', () => {
      it('should check export blocked', () => {
        expect(selectors.isExportBlocked(testState)).toBe(true);
        expect(selectors.isExportBlocked(initialState)).toBe(false);
      });

      it('should get validation error', () => {
        expect(selectors.getAssetDecodeError(testState)).toBe('test error');
      });
    });
  });
});
