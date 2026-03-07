import './App.css'

function App() {
  return (
    <div className="app-shell" data-testid="app-shell">
      <header className="app-header">
        <h1>X Thumbnail Generator</h1>
      </header>
      <main className="app-main">
        <section className="control-panel" data-testid="control-panel">
          <h2>Control Panel</h2>
          <p>Thumbnail settings will be configured here.</p>
        </section>
        <section className="preview-panel" data-testid="preview-panel">
          <h2>Preview</h2>
          <p>Thumbnail preview will appear here.</p>
        </section>
      </main>
    </div>
  )
}

export default App
