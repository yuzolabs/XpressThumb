/**
 * Load required fonts for offline editor
 */
export async function loadFonts(): Promise<void> {
  // Load Noto Sans JP
  await document.fonts.load('16px "Noto Sans JP"');
  await document.fonts.load('bold 16px "Noto Sans JP"');

  // Load M PLUS Rounded 1c
  await document.fonts.load('16px "M PLUS Rounded 1c"');
  await document.fonts.load('bold 16px "M PLUS Rounded 1c"');

  // Wait for fonts to be ready
  await document.fonts.ready;
}
