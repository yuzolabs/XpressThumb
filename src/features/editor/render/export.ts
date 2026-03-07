import type { EditorConfig } from '../../../shared/types/editor.js';
import { renderThumbnail, type AssetCache } from './renderer.js';

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
  const { filename = 'thumbnail' } = options;

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
