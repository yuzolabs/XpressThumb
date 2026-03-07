const fs = require('fs');
let code = fs.readFileSync('src/features/editor/render/renderer.ts', 'utf8');

code = code.replace(
  /function measureText\(\n  ctx: CanvasRenderingContext2D,\n  config: TextConfig,\n  canvasWidth: number\n\): \{ lines: string\[\]; width: number; height: number; overflow: boolean \} \{/g,
  'function measureText(\n  ctx: CanvasRenderingContext2D,\n  config: TextConfig,\n  canvasWidth: number,\n  canvasHeight: number\n): { lines: string[]; width: number; height: number; overflow: boolean } {'
);

code = code.replace(
  /const overflow = maxLineWidth > maxWidth \|\| lines\.length > Math\.floor\(\(canvasWidth \* 0\.8\) \/ lineHeight\);/g,
  'const maxHeight = canvasHeight - TEXT_PADDING * 2;\n  const overflow = maxLineWidth > maxWidth || totalHeight > maxHeight;'
);

code = code.replace(
  /function renderText\(\n  ctx: CanvasRenderingContext2D,\n  config: TextConfig,\n  width: number,\n  height: number\n\): boolean \{/g,
  'function renderText(\n  ctx: CanvasRenderingContext2D,\n  config: TextConfig,\n  width: number,\n  height: number\n): boolean {'
);

code = code.replace(
  /const \{ lines, width: textWidth, height: textHeight, overflow \} = measureText\(ctx, config, width\);/g,
  'const { lines, width: textWidth, height: textHeight, overflow } = measureText(ctx, config, width, height);'
);

code = code.replace(
  /ctx\.font = `bold \$\{config\.size\}px \$\{config\.font\}`;/g,
  'ctx.font = `bold ${config.size}px "${config.font}"`;'
);

code = code.replace(
  /ctx\.font = `bold \$\{fontSize\}px \$\{config\.font\}`;/g,
  'ctx.font = `bold ${fontSize}px "${config.font}"`;'
);

code = code.replace(
  /ctx\.textBaseline = 'alphabetic';/g,
  'ctx.textBaseline = \'top\';'
);

code = code.replace(
  /const position = calculateTextPosition\(/g,
  'const position = calculateTextPosition('
);

fs.writeFileSync('src/features/editor/render/renderer.ts', code);
