import { useReducer } from 'react'
import './App.css'
import { editorReducer } from '../features/editor/state/reducer'
import { createInitialState } from '../features/editor/state/initialState'
import { TextPosition } from '../shared/types/editor'
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
  GradientBackgroundPicker
} from '../features/editor/components/Controls'
import { PreviewCanvasHost } from '../features/editor/components/PreviewCanvasHost'

function App() {
  const [state, dispatch] = useReducer(editorReducer, createInitialState());

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

  const handleDownload = () => {
    if (state.validation.textOverflow) {
      alert('Cannot export: Text exceeds canvas boundaries');
      return;
    }
    console.log('Downloading canvas...', state);
    alert('Canvas generation pending (Task 6)');
  };

  return (
    <div className="app-shell" data-testid="app-shell">
      <header className="app-header">
        <div className="header-glitch" data-text="X_THUMBNAIL_GEN">X_THUMBNAIL_GEN</div>
      </header>
      
      <main className="app-main">
        <section className="control-panel" data-testid="control-panel">
          <div className="control-panel-inner">
            <RatioSelect value={current.ratio} onChange={v => dispatch({ type: 'SET_RATIO', payload: v as any })} />
            <TextInput value={current.text.title} onChange={v => updateText('title', v)} />
            
            <div className="grid-controls">
              <FontSelect value={current.text.font} onChange={v => updateText('font', v)} />
              <FontSizeSlider value={current.text.size} onChange={v => updateText('size', v)} />
            </div>

            <ColorSelect value={current.text.color} onChange={v => updateText('color', v)} />
            <PositionSelect value={current.text.position} onChange={v => updateText('position', v)} />
            
            <div className="grid-controls">
              <BackgroundModeSelect value={current.background.mode} onChange={v => dispatch({ type: 'SET_BACKGROUND_MODE', payload: v as any })} />
              <PatternSelect value={current.pattern.type} onChange={v => dispatch({ type: 'SET_PATTERN_TYPE', payload: v as any })} />
            </div>

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

            <DownloadButton onClick={handleDownload} disabled={state.validation.textOverflow} />
          </div>
        </section>

        <section className="preview-panel" data-testid="preview-panel">
          <PreviewCanvasHost state={current} onOverflowChange={v => dispatch({ type: 'SET_VALIDATION_TEXT_OVERFLOW', payload: v })} />
        </section>
      </main>
    </div>
  )
}

export default App
