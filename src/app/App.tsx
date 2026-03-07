import { useState } from 'react'
import './App.css'
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
  DownloadButton
} from '../features/editor/components/Controls'
import { PreviewCanvasHost } from '../features/editor/components/PreviewCanvasHost'

function App() {
  const [state, setState] = useState({
    ratio: '16:9',
    text: '',
    font: 'Noto Sans JP',
    fontSize: 60,
    color: 'White',
    position: 'middle-center',
    backgroundMode: 'solid',
    pattern: 'none',
    backgroundImage: null as string | null
  });

  const updateState = (key: keyof typeof state, value: any) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  const handleDownload = () => {
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
            <RatioSelect value={state.ratio} onChange={v => updateState('ratio', v)} />
            <TextInput value={state.text} onChange={v => updateState('text', v)} />
            
            <div className="grid-controls">
              <FontSelect value={state.font} onChange={v => updateState('font', v)} />
              <FontSizeSlider value={state.fontSize} onChange={v => updateState('fontSize', v)} />
            </div>

            <ColorSelect value={state.color} onChange={v => updateState('color', v)} />
            <PositionSelect value={state.position} onChange={v => updateState('position', v)} />
            
            <div className="grid-controls">
              <BackgroundModeSelect value={state.backgroundMode} onChange={v => updateState('backgroundMode', v)} />
              <PatternSelect value={state.pattern} onChange={v => updateState('pattern', v)} />
            </div>

            {state.backgroundMode === 'image' && (
              <ImageUpload onUpload={v => updateState('backgroundImage', v)} />
            )}

            <DownloadButton onClick={handleDownload} />
          </div>
        </section>

        <section className="preview-panel" data-testid="preview-panel">
          <PreviewCanvasHost state={state} />
        </section>
      </main>
    </div>
  )
}

export default App
