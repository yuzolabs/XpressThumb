import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  renderThumbnail,
  getCanvasDimensions,
  setupCanvas,
  waitForFonts,
  areFontsReady,
  type AssetCache,
  type RenderMode,
} from '../../src/features/editor/render/renderer.js';
import type { EditorConfig, RatioPreset } from '../../src/shared/types/editor.js';

describe('Renderer', () => {
  let canvas: HTMLCanvasElement;
  let mockContext: CanvasRenderingContext2D;

  const createMockContext = () => {
    return {
      fillRect: vi.fn(),
      clearRect: vi.fn(),
      fillText: vi.fn(),
      drawImage: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      createLinearGradient: vi.fn(() => ({
        addColorStop: vi.fn(),
      })),
      measureText: vi.fn(() => ({ width: 100 })),
      fillStyle: '',
      strokeStyle: '',
      globalAlpha: 1,
      font: '',
      textBaseline: '',
      lineWidth: 1,
    } as unknown as CanvasRenderingContext2D;
  };

  const createMockCanvas = () => {
    const ctx = createMockContext();
    return {
      getContext: vi.fn(() => ctx),
      width: 0,
      height: 0,
      toBlob: vi.fn(),
    } as unknown as HTMLCanvasElement;
  };

  const defaultConfig: EditorConfig = {
    ratio: '16:9',
    text: {
      title: 'Test Article',
      position: 'center',
      font: 'Arial',
      size: 72,
      color: '#ffffff',
    },
    background: {
      mode: 'solid',
      color: '#1a1a2e',
    },
    pattern: {
      type: 'none',
      opacity: 0.5,
      scale: 1,
      color: '#ffffff',
    },
    overlay: {
      objectUrl: null,
      size: 40,
      positionX: 0,
      positionY: 0,
    },
  };

  const emptyAssets: AssetCache = {
    backgroundImage: null,
    overlayImage: null,
    patternImage: null,
  };

  beforeEach(() => {
    canvas = createMockCanvas();
    mockContext = canvas.getContext('2d') as CanvasRenderingContext2D;
  });

  describe('getCanvasDimensions', () => {
    it.each([
      ['16:9', 'export', 1600, 900, 1],
      ['5:2', 'export', 1500, 600, 1],
      ['1:1', 'export', 1200, 1200, 1],
      ['16:9', 'preview', 800, 450, 0.5],
      ['5:2', 'preview', 800, 320, 0.5333333333333333],
      ['1:1', 'preview', 800, 800, 0.6666666666666666],
    ] as [RatioPreset, RenderMode, number, number, number][]) (
      'should return correct dimensions for %s in %s mode',
      (ratio, mode, expectedWidth, expectedHeight, expectedScale) => {
        const dims = getCanvasDimensions(ratio, mode);
        expect(dims.width).toBe(expectedWidth);
        expect(dims.height).toBe(expectedHeight);
        expect(dims.scale).toBeCloseTo(expectedScale, 5);
      }
    );
  });

  describe('setupCanvas', () => {
    it('should set canvas dimensions', () => {
      const canvas = document.createElement('canvas');
      setupCanvas(canvas, '16:9', 'export');
      expect(canvas.width).toBe(1600);
      expect(canvas.height).toBe(900);
    });

    it('should return dimensions with scale', () => {
      const canvas = document.createElement('canvas');
      const result = setupCanvas(canvas, '16:9', 'preview');
      expect(result.width).toBe(800);
      expect(result.height).toBe(450);
      expect(result.scale).toBe(0.5);
    });
  });

  describe('renderThumbnail', () => {
    it('should return error when context is null', () => {
      const canvas = { getContext: () => null } as unknown as HTMLCanvasElement;
      const result = renderThumbnail(defaultConfig, emptyAssets, canvas, 'preview');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to get 2D context from canvas');
    });

    it('should render successfully with solid background', () => {
      const result = renderThumbnail(defaultConfig, emptyAssets, canvas, 'preview');
      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should clear canvas before rendering', () => {
      renderThumbnail(defaultConfig, emptyAssets, canvas, 'preview');
      expect(mockContext.clearRect).toHaveBeenCalled();
    });

    it('should return text overflow flag', () => {
      const config: EditorConfig = {
        ...defaultConfig,
        text: {
          ...defaultConfig.text,
          title: 'A'.repeat(1000),
        },
      };
      const result = renderThumbnail(config, emptyAssets, canvas, 'preview');
      expect(typeof result.textOverflow).toBe('boolean');
    });

    it('should handle gradient background', () => {
      const config: EditorConfig = {
        ...defaultConfig,
        background: {
          mode: 'gradient',
          direction: 'to right',
          colors: ['#ff0000', '#00ff00'],
        },
      };
      const result = renderThumbnail(config, emptyAssets, canvas, 'preview');
      expect(result.success).toBe(true);
      expect(mockContext.createLinearGradient).toHaveBeenCalled();
    });

    it('should handle image background when image is not loaded', () => {
      const config: EditorConfig = {
        ...defaultConfig,
        background: {
          mode: 'image',
          objectUrl: 'blob:test',
          fit: 'cover',
        },
      };
      const result = renderThumbnail(config, emptyAssets, canvas, 'preview');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Background image not loaded');
    });

    it('should handle pattern rendering', () => {
      const config: EditorConfig = {
        ...defaultConfig,
        pattern: {
          type: 'dot',
          opacity: 0.5,
          scale: 1,
          color: '#ffffff',
        },
      };
      const result = renderThumbnail(config, emptyAssets, canvas, 'preview');
      expect(result.success).toBe(true);
    });

    it('should handle overlay rendering when image is loaded', () => {
      const mockImage = {
        complete: true,
        width: 100,
        height: 100,
      } as HTMLImageElement;

      const config: EditorConfig = {
        ...defaultConfig,
        overlay: {
          objectUrl: 'blob:overlay',
          size: 50,
          positionX: 10,
          positionY: -10,
        },
      };

      const assets: AssetCache = {
        backgroundImage: null,
        overlayImage: mockImage,
        patternImage: null,
      };

      const result = renderThumbnail(config, assets, canvas, 'preview');
      expect(result.success).toBe(true);
      expect(mockContext.drawImage).toHaveBeenCalled();
    });

    it('should skip overlay when image is not loaded', () => {
      const config: EditorConfig = {
        ...defaultConfig,
        overlay: {
          objectUrl: 'blob:overlay',
          size: 50,
          positionX: 0,
          positionY: 0,
        },
      };

      const result = renderThumbnail(config, emptyAssets, canvas, 'preview');
      expect(result.success).toBe(true);
    });
  });

  describe('font utilities', () => {
    it('areFontsReady should return true in non-browser environment', () => {
      const result = areFontsReady(['Arial', 'Times']);
      expect(result).toBe(true);
    });

    it('waitForFonts should resolve in non-browser environment', async () => {
      await expect(waitForFonts(['Arial'])).resolves.toBeUndefined();
    });
  });
});
