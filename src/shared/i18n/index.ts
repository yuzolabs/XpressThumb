import { createContext, useContext } from 'react'

export type SupportedLocale = 'en' | 'ja'

const MESSAGE_CATALOGS = {
  en: {
    defaults: {
      title: 'New Article',
    },
    app: {
      subtitle: 'Express thumbnail creation for X articles',
      sections: {
        canvas: 'Canvas',
        text: 'Text',
        background: 'Background',
        pattern: 'Pattern',
        overlay: 'Overlay',
      },
      alerts: {
        textOverflow: 'Cannot export: Text exceeds canvas boundaries',
        unknownError: 'Unknown error',
        exportFailed: (error: string) => `Export failed: ${error}`,
      },
    },
    controls: {
      ratio: {
        label: 'Aspect Ratio',
        ariaLabel: 'Select aspect ratio',
      },
      text: {
        label: 'Headline',
        placeholder: 'Enter your headline here...',
        helper: 'Headline appears live on the canvas',
      },
      font: {
        label: 'Typography',
      },
      fontSize: {
        label: 'Size',
        ariaLabel: 'Font size',
      },
      color: {
        label: 'Text Color',
        ariaLabel: 'Select text color',
        options: {
          white: 'White',
          dark: 'Dark',
          cream: 'Cream',
        },
      },
      position: {
        label: 'Alignment',
        ariaLabel: 'Select text position',
        options: {
          'top-left': 'top left',
          top: 'top',
          'top-right': 'top right',
          left: 'left',
          center: 'center',
          right: 'right',
          'bottom-left': 'bottom left',
          bottom: 'bottom',
          'bottom-right': 'bottom right',
        },
      },
      backgroundMode: {
        label: 'Mode',
        ariaLabel: 'Select background mode',
        options: {
          solid: 'Solid',
          gradient: 'Gradient',
          image: 'Image',
        },
      },
      pattern: {
        label: 'Texture',
        ariaLabel: 'Select pattern',
        opacityLabel: 'Opacity',
        options: {
          none: 'None',
          noise: 'Noise',
          dot: 'Dot',
          grid: 'Grid',
        },
      },
      backgroundImage: {
        label: 'Background Image',
        inputAriaLabel: 'Upload background image',
        uploadTitle: 'Add background image',
        uploadHint: 'PNG or JPG',
      },
      download: {
        label: 'Export Image',
      },
      solidBackground: {
        label: 'Color',
        ariaLabel: 'Select background color',
        colors: {
          darkVoid: 'Dark Void',
          crimson: 'Crimson',
          royalBlue: 'Royal Blue',
          forest: 'Forest',
          golden: 'Golden',
          white: 'White',
        },
      },
      gradient: {
        label: 'Preset',
        ariaLabel: 'Select gradient preset',
        presets: {
          cyberpunk: 'Cyberpunk',
          ocean: 'Deep Ocean',
          sunset: 'Sunset',
          aurora: 'Aurora',
          neon: 'Neon City',
        },
      },
      overlay: {
        label: 'Image Overlay',
        inputAriaLabel: 'Upload overlay image',
        uploadTitle: 'Add overlay image',
        uploadHint: 'PNG or JPG',
        active: 'Overlay active',
        remove: 'Remove',
      },
      overlayControls: {
        size: 'Size',
        positionX: 'Position X',
        positionY: 'Position Y',
      },
    },
    preview: {
      canvasAriaLabel: 'Thumbnail preview',
      overflowWarning: 'Text exceeds canvas boundaries. Please reduce font size or text length.',
      statusNeedsAttention: 'Needs attention',
      statusReady: 'Ready to export',
    },
  },
  ja: {
    defaults: {
      title: '新しい記事',
    },
    app: {
      subtitle: 'X 向けの記事サムネイルをすばやく作成',
      sections: {
        canvas: 'キャンバス',
        text: 'テキスト',
        background: '背景',
        pattern: 'パターン',
        overlay: 'オーバーレイ',
      },
      alerts: {
        textOverflow: '書き出せません: テキストがキャンバスの範囲を超えています',
        unknownError: '不明なエラー',
        exportFailed: (error: string) => `書き出しに失敗しました: ${error}`,
      },
    },
    controls: {
      ratio: {
        label: 'アスペクト比',
        ariaLabel: 'アスペクト比を選択',
      },
      text: {
        label: '見出し',
        placeholder: '見出しを入力してください...',
        helper: '見出しはキャンバスにリアルタイムで反映されます',
      },
      font: {
        label: 'フォント',
      },
      fontSize: {
        label: 'サイズ',
        ariaLabel: 'フォントサイズ',
      },
      color: {
        label: '文字色',
        ariaLabel: '文字色を選択',
        options: {
          white: '白',
          dark: '濃色',
          cream: 'クリーム',
        },
      },
      position: {
        label: '配置',
        ariaLabel: 'テキストの配置を選択',
        options: {
          'top-left': '左上',
          top: '上',
          'top-right': '右上',
          left: '左',
          center: '中央',
          right: '右',
          'bottom-left': '左下',
          bottom: '下',
          'bottom-right': '右下',
        },
      },
      backgroundMode: {
        label: 'モード',
        ariaLabel: '背景モードを選択',
        options: {
          solid: '単色',
          gradient: 'グラデーション',
          image: '画像',
        },
      },
      pattern: {
        label: 'テクスチャ',
        ariaLabel: 'パターンを選択',
        opacityLabel: '不透明度',
        options: {
          none: 'なし',
          noise: 'ノイズ',
          dot: 'ドット',
          grid: 'グリッド',
        },
      },
      backgroundImage: {
        label: '背景画像',
        inputAriaLabel: '背景画像をアップロード',
        uploadTitle: '背景画像を追加',
        uploadHint: 'PNG または JPG',
      },
      download: {
        label: '画像を書き出す',
      },
      solidBackground: {
        label: '色',
        ariaLabel: '背景色を選択',
        colors: {
          darkVoid: 'ダークボイド',
          crimson: 'クリムゾン',
          royalBlue: 'ロイヤルブルー',
          forest: 'フォレスト',
          golden: 'ゴールド',
          white: '白',
        },
      },
      gradient: {
        label: 'プリセット',
        ariaLabel: 'グラデーションプリセットを選択',
        presets: {
          cyberpunk: 'サイバーパンク',
          ocean: 'ディープオーシャン',
          sunset: 'サンセット',
          aurora: 'オーロラ',
          neon: 'ネオンシティ',
        },
      },
      overlay: {
        label: '画像オーバーレイ',
        inputAriaLabel: 'オーバーレイ画像をアップロード',
        uploadTitle: 'オーバーレイ画像を追加',
        uploadHint: 'PNG または JPG',
        active: 'オーバーレイ使用中',
        remove: '削除',
      },
      overlayControls: {
        size: 'サイズ',
        positionX: 'X 位置',
        positionY: 'Y 位置',
      },
    },
    preview: {
      canvasAriaLabel: 'サムネイルプレビュー',
      overflowWarning: 'テキストがキャンバスの範囲を超えています。フォントサイズまたは文字数を減らしてください。',
      statusNeedsAttention: '要確認',
      statusReady: '書き出し可能',
    },
  },
} as const

export type MessageCatalog = (typeof MESSAGE_CATALOGS)[SupportedLocale]

export function resolveLocale(language: string | null | undefined): SupportedLocale {
  if (language?.toLowerCase().startsWith('ja')) {
    return 'ja'
  }

  return 'en'
}

/**
 * Resolve the browser locale.
 * The optional language argument exists to make locale detection easy to test.
 */
export function getBrowserLocale(language?: string): SupportedLocale {
  const browserLanguage = language ?? (typeof navigator === 'undefined' ? undefined : navigator.language)

  return resolveLocale(browserLanguage)
}

export function getMessages(locale: SupportedLocale): MessageCatalog {
  return MESSAGE_CATALOGS[locale]
}

export function getDefaultTitle(locale: SupportedLocale): string {
  return getMessages(locale).defaults.title
}

export const I18nContext = createContext<MessageCatalog>(MESSAGE_CATALOGS.en)

export function useMessages(): MessageCatalog {
  return useContext(I18nContext)
}
