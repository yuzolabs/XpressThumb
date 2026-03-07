import {
  type EditorConfig,
  type TextPosition,
  type BackgroundConfig,
  type PatternConfig,
  type TextConfig,
  type OverlayConfig,
  type RatioPreset,
  RATIO_DIMENSIONS,
} from '../../../shared/types/editor.js';

export type RenderMode = 'preview' | 'export';

export interface AssetCache {
  backgroundImage: HTMLImageElement | null;
  overlayImage: HTMLImageElement | null;
}

export interface RenderResult {
  success: boolean;
  error: string | null;
  textOverflow: boolean;
}

interface Position {
  x: number;
  y: number;
}

const PREVIEW_MAX_WIDTH = 800;
const TEXT_PADDING = 40;
const LINE_HEIGHT = 1.2;

export function getCanvasDimensions(
  ratio: RatioPreset,
  mode: RenderMode
): { width: number; height: number; scale: number } {
  const fullDims = RATIO_DIMENSIONS[ratio];

  if (mode === 'export') {
    return {
      width: fullDims.width,
      height: fullDims.height,
      scale: 1,
    };
  }

  const scale = Math.min(1, PREVIEW_MAX_WIDTH / fullDims.width);
  return {
    width: Math.round(fullDims.width * scale),
    height: Math.round(fullDims.height * scale),
    scale,
  };
}

export function setupCanvas(
  canvas: HTMLCanvasElement,
  ratio: RatioPreset,
  mode: RenderMode
): { width: number; height: number; scale: number } {
  const dims = getCanvasDimensions(ratio, mode);
  canvas.width = dims.width;
  canvas.height = dims.height;
  return dims;
}

function renderSolidBackground(
  ctx: CanvasRenderingContext2D,
  color: string,
  width: number,
  height: number
): void {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
}

function renderGradientBackground(
  ctx: CanvasRenderingContext2D,
  direction: string,
  colors: string[],
  width: number,
  height: number
): void {
  let gradient: CanvasGradient;

  switch (direction) {
    case 'to right':
      gradient = ctx.createLinearGradient(0, 0, width, 0);
      break;
    case 'to left':
      gradient = ctx.createLinearGradient(width, 0, 0, 0);
      break;
    case 'to bottom':
      gradient = ctx.createLinearGradient(0, 0, 0, height);
      break;
    case 'to top':
      gradient = ctx.createLinearGradient(0, height, 0, 0);
      break;
    case 'to bottom right':
    case 'to right bottom':
      gradient = ctx.createLinearGradient(0, 0, width, height);
      break;
    case 'to bottom left':
    case 'to left bottom':
      gradient = ctx.createLinearGradient(width, 0, 0, height);
      break;
    case 'to top right':
    case 'to right top':
      gradient = ctx.createLinearGradient(0, height, width, 0);
      break;
    case 'to top left':
    case 'to left top':
      gradient = ctx.createLinearGradient(width, height, 0, 0);
      break;
    default:
      gradient = ctx.createLinearGradient(0, 0, width, 0);
  }

  if (colors.length === 0) {
    colors = ['#1a1a2e', '#16213e'];
  }

  colors.forEach((color, index) => {
    gradient.addColorStop(index / Math.max(1, colors.length - 1), color);
  });

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function renderImageBackground(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  fit: 'cover' | 'contain' | 'stretch',
  width: number,
  height: number
): void {
  if (fit === 'stretch') {
    ctx.drawImage(image, 0, 0, width, height);
    return;
  }

  const imgRatio = image.width / image.height;
  const canvasRatio = width / height;

  let drawWidth: number;
  let drawHeight: number;
  let drawX: number;
  let drawY: number;

  if (fit === 'cover') {
    if (imgRatio > canvasRatio) {
      drawHeight = height;
      drawWidth = height * imgRatio;
      drawX = (width - drawWidth) / 2;
      drawY = 0;
    } else {
      drawWidth = width;
      drawHeight = width / imgRatio;
      drawX = 0;
      drawY = (height - drawHeight) / 2;
    }
  } else {
    if (imgRatio > canvasRatio) {
      drawWidth = width;
      drawHeight = width / imgRatio;
      drawX = 0;
      drawY = (height - drawHeight) / 2;
    } else {
      drawHeight = height;
      drawWidth = height * imgRatio;
      drawX = (width - drawWidth) / 2;
      drawY = 0;
    }
  }

  ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
}

function renderBackground(
  ctx: CanvasRenderingContext2D,
  config: BackgroundConfig,
  assets: AssetCache,
  width: number,
  height: number
): string | null {
  switch (config.mode) {
    case 'solid':
      renderSolidBackground(ctx, config.color, width, height);
      return null;

    case 'gradient':
      renderGradientBackground(ctx, config.direction, config.colors, width, height);
      return null;

    case 'image':
      if (assets.backgroundImage?.complete) {
        renderImageBackground(ctx, assets.backgroundImage, config.fit, width, height);
        return null;
      }
      renderSolidBackground(ctx, '#1a1a2e', width, height);
      return config.objectUrl && !assets.backgroundImage
        ? 'Background image not loaded'
        : null;

    default:
      renderSolidBackground(ctx, '#1a1a2e', width, height);
      return null;
  }
}

function renderNoisePattern(
  ctx: CanvasRenderingContext2D,
  opacity: number,
  scale: number,
  color: string,
  width: number,
  height: number
): void {
  ctx.save();
  ctx.globalAlpha = opacity;

  const baseSize = 2 * scale;
  const cols = Math.ceil(width / baseSize);
  const rows = Math.ceil(height / baseSize);

  ctx.fillStyle = color;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (Math.random() > 0.5) {
        const x = col * baseSize;
        const y = row * baseSize;
        ctx.fillRect(x, y, baseSize, baseSize);
      }
    }
  }

  ctx.restore();
}

function renderDotPattern(
  ctx: CanvasRenderingContext2D,
  opacity: number,
  scale: number,
  color: string,
  width: number,
  height: number
): void {
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.fillStyle = color;

  const spacing = 20 * scale;
  const dotSize = 3 * scale;

  for (let y = spacing / 2; y < height; y += spacing) {
    for (let x = spacing / 2; x < width; x += spacing) {
      ctx.beginPath();
      ctx.arc(x, y, dotSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

function renderGridPattern(
  ctx: CanvasRenderingContext2D,
  opacity: number,
  scale: number,
  color: string,
  width: number,
  height: number
): void {
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1 * scale;

  const spacing = 40 * scale;

  for (let x = 0; x <= width; x += spacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for (let y = 0; y <= height; y += spacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  ctx.restore();
}

function renderPattern(
  ctx: CanvasRenderingContext2D,
  config: PatternConfig,
  width: number,
  height: number
): void {
  if (config.type === 'none') {
    return;
  }

  switch (config.type) {
    case 'noise':
      renderNoisePattern(ctx, config.opacity, config.scale, config.color, width, height);
      break;
    case 'dot':
      renderDotPattern(ctx, config.opacity, config.scale, config.color, width, height);
      break;
    case 'grid':
      renderGridPattern(ctx, config.opacity, config.scale, config.color, width, height);
      break;
  }
}

function calculateTextPosition(
  position: TextPosition,
  textWidth: number,
  textHeight: number,
  canvasWidth: number,
  canvasHeight: number,
  padding: number
): Position {
  let x: number;
  let y: number;

  switch (position) {
    case 'top-left':
    case 'left':
    case 'bottom-left':
      x = padding;
      break;
    case 'top':
    case 'center':
    case 'bottom':
      x = (canvasWidth - textWidth) / 2;
      break;
    case 'top-right':
    case 'right':
    case 'bottom-right':
      x = canvasWidth - textWidth - padding;
      break;
    default:
      x = (canvasWidth - textWidth) / 2;
  }

  switch (position) {
    case 'top-left':
    case 'top':
    case 'top-right':
      y = padding + textHeight;
      break;
    case 'left':
    case 'center':
    case 'right':
      y = (canvasHeight + textHeight) / 2;
      break;
    case 'bottom-left':
    case 'bottom':
    case 'bottom-right':
      y = canvasHeight - padding;
      break;
    default:
      y = (canvasHeight + textHeight) / 2;
  }

  return { x, y };
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): { lines: string[]; maxLineWidth: number } {
  const chars = text.split('');
  const lines: string[] = [];
  let currentLine = '';
  let maxLineWidth = 0;

  for (const char of chars) {
    const testLine = currentLine + char;
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && currentLine.length > 0) {
      lines.push(currentLine);
      maxLineWidth = Math.max(maxLineWidth, ctx.measureText(currentLine).width);
      currentLine = char;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine.length > 0) {
    lines.push(currentLine);
    maxLineWidth = Math.max(maxLineWidth, ctx.measureText(currentLine).width);
  }

  return { lines, maxLineWidth };
}

function measureText(
  ctx: CanvasRenderingContext2D,
  config: TextConfig,
  canvasWidth: number
): { lines: string[]; width: number; height: number; overflow: boolean } {
  const fontSize = config.size;
  ctx.font = `bold ${fontSize}px ${config.font}`;
  ctx.textBaseline = 'middle';

  const maxWidth = canvasWidth - TEXT_PADDING * 2;
  const { lines, maxLineWidth } = wrapText(ctx, config.title, maxWidth);

  const lineHeight = fontSize * LINE_HEIGHT;
  const totalHeight = lines.length * lineHeight;
  const overflow = maxLineWidth > maxWidth || lines.length > Math.floor((canvasWidth * 0.8) / lineHeight);

  return {
    lines,
    width: maxLineWidth,
    height: totalHeight,
    overflow,
  };
}

function renderText(
  ctx: CanvasRenderingContext2D,
  config: TextConfig,
  width: number,
  height: number
): boolean {
  const { lines, width: textWidth, height: textHeight, overflow } = measureText(ctx, config, width);

  const position = calculateTextPosition(
    config.position,
    textWidth,
    textHeight,
    width,
    height,
    TEXT_PADDING
  );

  ctx.save();
  ctx.fillStyle = config.color;
  ctx.font = `bold ${config.size}px ${config.font}`;
  ctx.textBaseline = 'alphabetic';

  const lineHeight = config.size * LINE_HEIGHT;

  lines.forEach((line, index) => {
    const y = position.y + index * lineHeight;
    ctx.fillText(line, position.x, y);
  });

  ctx.restore();

  return overflow;
}

function renderOverlay(
  ctx: CanvasRenderingContext2D,
  config: OverlayConfig,
  assets: AssetCache,
  width: number,
  height: number
): void {
  if (!assets.overlayImage?.complete || !config.objectUrl) {
    return;
  }

  const image = assets.overlayImage;
  const maxDimension = Math.min(width, height);
  const size = (config.size / 100) * maxDimension;

  const imgRatio = image.width / image.height;
  let drawWidth: number;
  let drawHeight: number;

  if (imgRatio >= 1) {
    drawWidth = size;
    drawHeight = size / imgRatio;
  } else {
    drawHeight = size;
    drawWidth = size * imgRatio;
  }

  const centerX = width / 2;
  const centerY = height / 2;
  const offsetX = (config.positionX / 100) * (width / 2);
  const offsetY = (config.positionY / 100) * (height / 2);

  const x = centerX + offsetX - drawWidth / 2;
  const y = centerY + offsetY - drawHeight / 2;

  ctx.drawImage(image, x, y, drawWidth, drawHeight);
}

export function renderThumbnail(
  state: EditorConfig,
  assets: AssetCache,
  canvas: HTMLCanvasElement,
  mode: RenderMode
): RenderResult {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return {
      success: false,
      error: 'Failed to get 2D context from canvas',
      textOverflow: false,
    };
  }

  const { width, height } = setupCanvas(canvas, state.ratio, mode);
  ctx.clearRect(0, 0, width, height);

  let error: string | null = null;

  const bgError = renderBackground(ctx, state.background, assets, width, height);
  if (bgError) {
    error = bgError;
  }

  renderPattern(ctx, state.pattern, width, height);
  const textOverflow = renderText(ctx, state.text, width, height);
  renderOverlay(ctx, state.overlay, assets, width, height);

  return {
    success: !error,
    error,
    textOverflow,
  };
}

export async function waitForFonts(fonts: string[]): Promise<void> {
  if (typeof document === 'undefined' || !document.fonts) {
    return;
  }

  const fontPromises = fonts.map(async (font) => {
    try {
      await document.fonts.load(`16px "${font}"`);
      await document.fonts.load(`bold 16px "${font}"`);
    } catch {
      // Ignore font load errors
    }
  });

  await Promise.all(fontPromises);
  await document.fonts.ready;
}

export function areFontsReady(fonts: string[]): boolean {
  if (typeof document === 'undefined' || !document.fonts) {
    return true;
  }

  return fonts.every((font) => {
    const testFont = `16px "${font}"`;
    return document.fonts.check(testFont);
  });
}
