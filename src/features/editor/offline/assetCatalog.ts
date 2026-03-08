/**
 * Asset Catalog for Offline PWA
 * Lists all assets that should be precached for offline functionality
 */

export type AssetCategory = 'font' | 'pattern';

export interface Asset {
  path: string;
  category: AssetCategory;
}

export const ASSET_CATALOG: Asset[] = [
  // Fonts - Noto Sans JP
  {
    path: '/src/assets/fonts/noto-sans-jp/NotoSansJP-Regular.woff2',
    category: 'font',
  },
  {
    path: '/src/assets/fonts/noto-sans-jp/NotoSansJP-Bold.woff2',
    category: 'font',
  },
  // Fonts - M Plus Rounded 1c
  {
    path: '/src/assets/fonts/m-plus-rounded-1c/MPLUSRounded1c-Regular.woff2',
    category: 'font',
  },
  {
    path: '/src/assets/fonts/m-plus-rounded-1c/MPLUSRounded1c-Bold.woff2',
    category: 'font',
  },
  // Patterns
  {
    path: '/src/assets/patterns/noise.svg',
    category: 'pattern',
  },
  {
    path: '/src/assets/patterns/dot.svg',
    category: 'pattern',
  },
  {
    path: '/src/assets/patterns/grid.svg',
    category: 'pattern',
  },
];

export const FONT_ASSETS = ASSET_CATALOG.filter(
  (asset) => asset.category === 'font'
);

export const PATTERN_ASSETS = ASSET_CATALOG.filter(
  (asset) => asset.category === 'pattern'
);

export const ALL_ASSET_PATHS = ASSET_CATALOG.map((asset) => asset.path);
