import { describe, expect, it } from 'vitest'
import { createInitialState } from '../../src/features/editor/state/initialState'
import { getBrowserLocale, getDefaultTitle, getMessages, resolveLocale } from '../../src/shared/i18n'

describe('i18n', () => {
  describe('resolveLocale', () => {
    it('returns ja for Japanese browser locales', () => {
      expect(resolveLocale('ja')).toBe('ja')
      expect(resolveLocale('ja-JP')).toBe('ja')
    })

    it('falls back to en for unsupported locales', () => {
      expect(resolveLocale('fr-FR')).toBe('en')
      expect(resolveLocale(undefined)).toBe('en')
    })
  })

  describe('getBrowserLocale', () => {
    it('uses browser language when supported', () => {
      expect(getBrowserLocale('ja-JP')).toBe('ja')
    })

    it('falls back to en when browser language is unsupported', () => {
      expect(getBrowserLocale('de-DE')).toBe('en')
    })
  })

  describe('localized defaults', () => {
    it('returns localized default titles', () => {
      expect(getDefaultTitle('en')).toBe('New Article')
      expect(getDefaultTitle('ja')).toBe('新しい記事')
    })

    it('creates Japanese initial state when requested', () => {
      expect(createInitialState('ja').present.text.title).toBe('新しい記事')
      expect(createInitialState('en').present.text.title).toBe('New Article')
    })

    it('returns Japanese UI messages', () => {
      expect(getMessages('ja').app.sections.background).toBe('背景')
      expect(getMessages('ja').controls.download.label).toBe('画像を書き出す')
    })
  })
})
