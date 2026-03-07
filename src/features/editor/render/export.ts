import type { EditorConfig } from '../../../shared/types/editor.js';
import { renderThumbnail, type AssetCache } from './renderer.js';
import dotPatternSvg from '../../../assets/patterns/dot.svg?raw';
import gridPatternSvg from '../../../assets/patterns/grid.svg?raw';
import noisePatternSvg from '../../../assets/patterns/noise.svg?raw';

const PATTERNS: Record<string, string> = {
  dot: dotPatternSvg,
  grid: gridPatternSvg,
  noise: noisePatternSvg,
};

export interface ExportResult {
  success: boolean;
  blob: Blob | null;
  error: string | null;
}

export interface ExportOptions {
  filename?: string;
  quality?: number;
}

function createExportCanvas(ratio: EditorConfig['ratio']): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const targetDims = {
    '16:9': { width: 1600, height: 900 },
    '5:2': { width: 1500, height: 600 },
    '1:1': { width: 1200, height: 1200 },
  }[ratio];

  canvas.width = targetDims.width;
  canvas.height = targetDims.height;

  return canvas;
}

export async function exportThumbnail(
  state: EditorConfig,
  assets: AssetCache
): Promise<ExportResult> {
  const canvas = createExportCanvas(state.ratio);
  const result = renderThumbnail(state, assets, canvas, 'export');

  if (!result.success) {
    return {
      success: false,
      blob: null,
      error: result.error ?? 'Render failed',
    };
  }

  try {
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/png', 1.0);
    });

    if (!blob) {
      return {
        success: false,
        blob: null,
        error: 'Failed to create blob from canvas',
      };
    }

    return {
      success: true,
      blob,
      error: null,
    };
  } catch (err) {
    return {
      success: false,
      blob: null,
      error: err instanceof Error ? err.message : 'Unknown export error',
    };
  }
}

export function downloadThumbnail(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.png') ? filename : `${filename}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function exportAndDownload(
  state: EditorConfig,
  assets: AssetCache,
  options: ExportOptions = {}
): Promise<ExportResult> {
  const dims = getExportDimensions(state.ratio);
  const filename = options.filename ?? `thumbnail-${dims.width}x${dims.height}`;

  const result = await exportThumbnail(state, assets);

  if (result.success && result.blob) {
    downloadThumbnail(result.blob, filename);
  }

  return result;
}

export function getExportDimensions(ratio: EditorConfig['ratio']): {
  width: number;
  height: number;
} {
  return {
    '16:9': { width: 1600, height: 900 },
    '5:2': { width: 1500, height: 600 },
    '1:1': { width: 1200, height: 1200 },
  }[ratio];
}

/**
 * Build AssetCache from EditorConfig state
 * Loads all required images for rendering
 */
export async function buildAssetCache(state: EditorConfig): Promise<AssetCache> {
  const assets: AssetCache = {
    backgroundImage: null,
    overlayImage: null,
    patternImage: null,
  };

  // Load background image if in image mode
  if (state.background.mode === 'image' && state.background.objectUrl) {
    const img = new Image();
    img.src = state.background.objectUrl;
    await new Promise<void>((resolve) => {
      img.onload = () => resolve();
      img.onerror = () => resolve();
    });
    assets.backgroundImage = img;
  }

  // Load pattern image if pattern is enabled
  if (state.pattern.type !== 'none' && PATTERNS[state.pattern.type]) {
    const rawSvg = PATTERNS[state.pattern.type];
    const coloredSvg = rawSvg.replace(/currentColor/g, state.pattern.color);
    const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(coloredSvg)}`;
    const img = new Image();
    img.src = dataUrl;
    await new Promise<void>((resolve) => {
      img.onload = () => resolve();
      img.onerror = () => resolve();
    });
    assets.patternImage = img;
  }

  // Load overlay image if set
  if (state.overlay.objectUrl) {
    const img = new Image();
    img.src = state.overlay.objectUrl;
    await new Promise<void>((resolve) => {
      img.onload = () => resolve();
      img.onerror = () => resolve();
    });
    assets.overlayImage = img;
  }

  return assets;
}

/**
 * Export and download with auto-built asset cache
 * Convenience function that builds assets automatically
 */
export async function exportAndDownloadWithAssets(
  state: EditorConfig,
  options: ExportOptions = {}
): Promise<ExportResult> {
  const assets = await buildAssetCache(state);
  return exportAndDownload(state, assets, options);
}
