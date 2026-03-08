import { useEffect, useMemo, useReducer } from 'react'
import './App.css'
import '../shared/styles/tokens.css'
import { editorReducer } from '../features/editor/state/reducer'
import { createInitialState } from '../features/editor/state/initialState'
import { TextPosition } from '../shared/types/editor'
import { exportAndDownloadWithAssets } from '../features/editor/render/export'
import { I18nContext, getBrowserLocale, getMessages } from '../shared/i18n'
import {
  RatioSelect,
  TextInput,
  FontSelect,
  FontSizeSlider,
  ColorSelect,
  PositionSelect,
  BackgroundModeSelect,
  PatternSelect,
  ImageUpload,
  DownloadButton,
  SolidBackgroundPicker,
  GradientBackgroundPicker,
  OverlayUpload,
  SliderControl
} from '../features/editor/components/Controls'
import { PreviewCanvasHost } from '../features/editor/components/PreviewCanvasHost'

function App() {
  const locale = useMemo(() => getBrowserLocale(), [])
  const messages = useMemo(() => getMessages(locale), [locale])
  const [state, dispatch] = useReducer(editorReducer, locale, createInitialState)

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const updateText = (key: string, value: any) => {
    switch (key) {
      case 'title': dispatch({ type: 'SET_TEXT_TITLE', payload: value }); break;
      case 'position': dispatch({ type: 'SET_TEXT_POSITION', payload: value as TextPosition }); break;
      case 'font': dispatch({ type: 'SET_TEXT_FONT', payload: value }); break;
      case 'size': dispatch({ type: 'SET_TEXT_SIZE', payload: value }); break;
      case 'color': dispatch({ type: 'SET_TEXT_COLOR', payload: value }); break;
    }
  };

  const current = state.present;

  const handleDownload = async () => {
    if (state.validation.textOverflow) {
      alert(messages.app.alerts.textOverflow);
      return;
    }
    const result = await exportAndDownloadWithAssets(current);
    if (!result.success) {
      alert(messages.app.alerts.exportFailed(result.error ?? messages.app.alerts.unknownError));
    }
  };

  return (
    <I18nContext.Provider value={messages}>
      <div className="app-shell" data-testid="app-shell">
        <header className="app-header">
          <div className="app-header-content">
            <h1 className="app-title">XpressThumb</h1>
            <p className="app-subtitle">{messages.app.subtitle}</p>
          </div>
        </header>

        <main className="app-main">
          <aside className="control-panel" data-testid="control-panel">
            <div className="control-panel-content">
              <section className="control-section">
                <h2 className="section-title">{messages.app.sections.canvas}</h2>
                <RatioSelect value={current.ratio} onChange={v => dispatch({ type: 'SET_RATIO', payload: v as any })} />
              </section>

              <section className="control-section">
                <h2 className="section-title">{messages.app.sections.text}</h2>
                <TextInput value={current.text.title} onChange={v => updateText('title', v)} />

                <div className="control-row">
                  <FontSelect value={current.text.font} onChange={v => updateText('font', v)} />
                  <FontSizeSlider value={current.text.size} onChange={v => updateText('size', v)} />
                </div>

                <div className="control-row">
                  <ColorSelect value={current.text.color} onChange={v => updateText('color', v)} />
                  <PositionSelect value={current.text.position} onChange={v => updateText('position', v)} />
                </div>
              </section>

              <section className="control-section">
                <h2 className="section-title">{messages.app.sections.background}</h2>
                <BackgroundModeSelect value={current.background.mode} onChange={v => dispatch({ type: 'SET_BACKGROUND_MODE', payload: v as any })} />

                {current.background.mode === 'solid' && (
                  <SolidBackgroundPicker
                    value={current.background.mode === 'solid' ? current.background.color : '#1a1a2e'}
                    onChange={v => dispatch({ type: 'SET_BACKGROUND_SOLID_COLOR', payload: v })}
                  />
                )}

                {current.background.mode === 'gradient' && (
                  <GradientBackgroundPicker
                    value={{
                      direction: current.background.mode === 'gradient' ? current.background.direction : 'to right',
                      colors: current.background.mode === 'gradient' ? current.background.colors : ['#f8049c', '#fdd54f']
                    }}
                    onChange={v => {
                      dispatch({ type: 'SET_BACKGROUND_GRADIENT_DIRECTION', payload: v.direction });
                      dispatch({ type: 'SET_BACKGROUND_GRADIENT_COLORS', payload: v.colors });
                    }}
                  />
                )}

                {current.background.mode === 'image' && (
                  <ImageUpload onUpload={v => dispatch({ type: 'SET_BACKGROUND_IMAGE_OBJECT_URL', payload: v })} />
                )}
              </section>

              <section className="control-section">
                <h2 className="section-title">{messages.app.sections.pattern}</h2>
                <PatternSelect value={current.pattern.type} onChange={v => dispatch({ type: 'SET_PATTERN_TYPE', payload: v as any })} />

                {current.pattern.type !== 'none' && (
                  <SliderControl
                    label={messages.controls.pattern.opacityLabel}
                    value={Math.round(current.pattern.opacity * 100)}
                    min={0}
                    max={100}
                    unit="%"
                    onChange={v => dispatch({ type: 'SET_PATTERN_OPACITY', payload: v / 100 })}
                    testId="pattern-opacity-slider"
                  />
                )}
              </section>

              <section className="control-section">
                <h2 className="section-title">{messages.app.sections.overlay}</h2>
                <OverlayUpload
                  hasOverlay={!!current.overlay.objectUrl}
                  onUpload={v => dispatch({ type: 'SET_OVERLAY_OBJECT_URL', payload: v })}
                  onRemove={() => dispatch({ type: 'SET_OVERLAY_OBJECT_URL', payload: null })}
                />

                {current.overlay.objectUrl && (
                  <div className="overlay-controls">
                    <SliderControl
                      label={messages.controls.overlayControls.size}
                      value={current.overlay.size}
                      min={10}
                      max={80}
                      unit="%"
                      onChange={v => dispatch({ type: 'SET_OVERLAY_SIZE', payload: v })}
                      testId="overlay-size-slider"
                    />
                    <div className="control-row">
                      <SliderControl
                        label={messages.controls.overlayControls.positionX}
                        value={current.overlay.positionX}
                        min={-100}
                        max={100}
                        onChange={v => dispatch({ type: 'SET_OVERLAY_POSITION_X', payload: v })}
                        testId="overlay-pos-x-slider"
                      />
                      <SliderControl
                        label={messages.controls.overlayControls.positionY}
                        value={current.overlay.positionY}
                        min={-100}
                        max={100}
                        onChange={v => dispatch({ type: 'SET_OVERLAY_POSITION_Y', payload: v })}
                        testId="overlay-pos-y-slider"
                      />
                    </div>
                  </div>
                )}
              </section>

              <div className="control-footer">
                <DownloadButton onClick={handleDownload} disabled={state.validation.textOverflow} />
              </div>
            </div>
          </aside>

          <section className="preview-panel" data-testid="preview-panel">
            <PreviewCanvasHost state={current} onOverflowChange={v => dispatch({ type: 'SET_VALIDATION_TEXT_OVERFLOW', payload: v })} />
          </section>
        </main>
      </div>
    </I18nContext.Provider>
  )
}

export default App
