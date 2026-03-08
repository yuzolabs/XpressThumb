import React from 'react';
import './Controls.css';

interface BaseControlProps<T> {
  value: T;
  onChange: (value: T) => void;
}

export const RatioSelect: React.FC<BaseControlProps<string>> = ({ value, onChange }) => (
  <div className="control-group ratio-select-group" data-testid="ratio-select">
    <label className="control-label">Aspect Ratio</label>
    <div
      className="segmented-control"
      role="radiogroup"
      aria-label="Select aspect ratio"
    >
      {['16:9', '5:2', '1:1'].map(ratio => (
        <button
          key={ratio}
          type="button"
          role="radio"
          aria-checked={value === ratio}
          className={`segmented-button ${value === ratio ? 'active' : ''}`}
          onClick={() => onChange(ratio)}
        >
          {ratio}
        </button>
      ))}
    </div>
  </div>
);

export const TextInput: React.FC<BaseControlProps<string>> = ({ value, onChange }) => (
  <div className="control-group text-input-group">
    <label className="control-label" htmlFor="headline-input">
      Headline
    </label>
    <textarea
      id="headline-input"
      data-testid="text-input"
      className="styled-textarea"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Enter your headline here..."
      rows={4}
    />
    <p className="control-helper">Headline appears live on the canvas</p>
  </div>
);

export const FontSelect: React.FC<BaseControlProps<string>> = ({ value, onChange }) => (
  <div className="control-group font-select-group">
    <label className="control-label" htmlFor="font-select">
      Typography
    </label>
    <div className="select-wrapper">
      <select
        id="font-select"
        data-testid="font-select"
        className="styled-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="Noto Sans JP">Noto Sans JP</option>
        <option value="M PLUS Rounded 1c">M PLUS Rounded 1c</option>
      </select>
      <svg className="select-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="6,9 12,15 18,9"></polyline>
      </svg>
    </div>
  </div>
);

export const FontSizeSlider: React.FC<BaseControlProps<number>> = ({ value, onChange }) => (
  <div className="control-group slider-group">
    <div className="slider-header">
      <label className="control-label">Size</label>
      <span className="slider-value-badge">{value}px</span>
    </div>
    <input
      data-testid="font-size-slider"
      type="range"
      className="styled-slider"
      min={45}
      max={120}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      aria-label="Font size"
    />
  </div>
);

export const ColorSelect: React.FC<BaseControlProps<string>> = ({ value, onChange }) => (
  <div className="control-group color-select-group">
    <label className="control-label">Text Color</label>
    <div className="color-swatches" data-testid="color-select" role="radiogroup" aria-label="Select text color">
      {[
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Dark', hex: '#111111' },
        { name: 'Cream', hex: '#FDFBF7' }
      ].map(color => (
        <button
          key={color.name}
          type="button"
          role="radio"
          aria-checked={value.toLowerCase() === color.hex.toLowerCase()}
          aria-label={color.name}
          className={`color-swatch-tile ${value.toLowerCase() === color.hex.toLowerCase() ? 'active' : ''}`}
          onClick={() => onChange(color.hex)}
          title={color.name}
        >
          <span
            className="color-swatch-fill"
            style={{ backgroundColor: color.hex }}
          />
          {value.toLowerCase() === color.hex.toLowerCase() && (
            <svg className="color-swatch-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20,6 9,17 4,12"></polyline>
            </svg>
          )}
        </button>
      ))}
    </div>
  </div>
);

export const PositionSelect: React.FC<BaseControlProps<string>> = ({ value, onChange }) => {
  const positions = [
    'top-left', 'top', 'top-right',
    'left', 'center', 'right',
    'bottom-left', 'bottom', 'bottom-right'
  ];

  return (
    <div className="control-group position-select-group">
      <label className="control-label">Alignment</label>
      <div
        className="position-grid"
        data-testid="position-select"
        role="radiogroup"
        aria-label="Select text position"
      >
        {positions.map(pos => (
          <button
            key={pos}
            type="button"
            role="radio"
            aria-checked={value === pos}
            aria-label={`Position ${pos.replace('-', ' ')}`}
            className={`position-node ${value === pos ? 'active' : ''}`}
            onClick={() => onChange(pos)}
          >
            <span className="position-indicator"></span>
          </button>
        ))}
      </div>
    </div>
  );
};

export const BackgroundModeSelect: React.FC<BaseControlProps<string>> = ({ value, onChange }) => (
  <div className="control-group bg-mode-group" data-testid="background-mode-select">
    <label className="control-label">Mode</label>
    <div
      className="segmented-control"
      role="radiogroup"
      aria-label="Select background mode"
    >
      {[
        { value: 'solid', label: 'Solid' },
        { value: 'gradient', label: 'Gradient' },
        { value: 'image', label: 'Image' }
      ].map(mode => (
        <button
          key={mode.value}
          type="button"
          role="radio"
          aria-checked={value === mode.value}
          className={`segmented-button ${value === mode.value ? 'active' : ''}`}
          onClick={() => onChange(mode.value)}
        >
          {mode.label}
        </button>
      ))}
    </div>
  </div>
);

export const PatternSelect: React.FC<BaseControlProps<string>> = ({ value, onChange }) => (
  <div className="control-group pattern-select-group" data-testid="pattern-select">
    <label className="control-label">Texture</label>
    <div
      className="pattern-chips"
      role="radiogroup"
      aria-label="Select pattern"
    >
      {[
        { value: 'none', label: 'None' },
        { value: 'noise', label: 'Noise' },
        { value: 'dot', label: 'Dot' },
        { value: 'grid', label: 'Grid' }
      ].map(pattern => (
        <button
          key={pattern.value}
          type="button"
          role="radio"
          aria-checked={value === pattern.value}
          className={`pattern-chip ${value === pattern.value ? 'active' : ''}`}
          onClick={() => onChange(pattern.value)}
        >
          {pattern.label}
        </button>
      ))}
    </div>
  </div>
);

export const ImageUpload: React.FC<{ onUpload: (dataUrl: string) => void }> = ({ onUpload }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUpload(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="control-group upload-group">
      <label className="control-label">Background Image</label>
      <div className="upload-container">
        <input
          data-testid="image-upload"
          type="file"
          accept="image/*"
          className="styled-file-input"
          onChange={handleFileChange}
          id="file-upload"
          aria-label="Upload background image"
        />
        <label htmlFor="file-upload" className="upload-card">
          <div className="upload-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17,8 12,3 7,8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
          </div>
          <span className="upload-title">Add background image</span>
          <span className="upload-hint">PNG or JPG</span>
        </label>
      </div>
    </div>
  );
};

export const DownloadButton: React.FC<{ onClick: () => void; disabled?: boolean }> = ({ onClick, disabled }) => (
  <button
    data-testid="download-button"
    type="button"
    className={`download-button ${disabled ? 'disabled' : ''}`}
    onClick={onClick}
    disabled={disabled}
    aria-disabled={disabled}
  >
    <span className="button-text">Export Image</span>
  </button>
);

export const SolidBackgroundPicker: React.FC<BaseControlProps<string>> = ({ value, onChange }) => (
  <div className="control-group solid-bg-group">
    <label className="control-label">Color</label>
    <div className="solid-color-grid" data-testid="solid-bg-picker" role="radiogroup" aria-label="Select background color">
      {[
        { name: 'Dark Void', hex: '#1a1a2e' },
        { name: 'Crimson', hex: '#E63946' },
        { name: 'Royal Blue', hex: '#1D3557' },
        { name: 'Forest', hex: '#2A9D8F' },
        { name: 'Golden', hex: '#E9C46A' },
        { name: 'White', hex: '#FFFFFF' }
      ].map(color => (
        <button
          key={color.name}
          type="button"
          role="radio"
          aria-checked={value === color.hex}
          aria-label={color.name}
          className={`solid-color-tile ${value === color.hex ? 'active' : ''}`}
          onClick={() => onChange(color.hex)}
          title={color.name}
        >
          <span
            className="solid-color-fill"
            style={{ backgroundColor: color.hex }}
          />
          {value === color.hex && (
            <svg className="solid-color-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20,6 9,17 4,12"></polyline>
            </svg>
          )}
        </button>
      ))}
    </div>
  </div>
);

export const GradientBackgroundPicker: React.FC<{
  value: { direction: string, colors: string[] },
  onChange: (value: { direction: string, colors: string[] }) => void
}> = ({ value, onChange }) => {
  const presets = [
    { id: 'cyberpunk', name: 'Cyberpunk', direction: 'to right', colors: ['#f8049c', '#fdd54f'] },
    { id: 'ocean', name: 'Deep Ocean', direction: 'to bottom right', colors: ['#2E3192', '#1BFFFF'] },
    { id: 'sunset', name: 'Sunset', direction: 'to right', colors: ['#ff9966', '#ff5e62'] },
    { id: 'aurora', name: 'Aurora', direction: 'to bottom', colors: ['#00c6ff', '#0072ff'] },
    { id: 'neon', name: 'Neon City', direction: 'to right', colors: ['#12c2e9', '#c471ed', '#f64f59'] }
  ];

  const isSelected = (presetColors: string[]) =>
    JSON.stringify(presetColors) === JSON.stringify(value.colors);

  return (
    <div className="control-group gradient-bg-group">
      <label className="control-label">Preset</label>
      <div className="gradient-grid" data-testid="gradient-bg-picker" role="radiogroup" aria-label="Select gradient preset">
        {presets.map(preset => (
          <button
            key={preset.id}
            type="button"
            role="radio"
            aria-checked={isSelected(preset.colors)}
            aria-label={preset.name}
            className={`gradient-tile ${isSelected(preset.colors) ? 'active' : ''}`}
            onClick={() => onChange({ direction: preset.direction, colors: preset.colors })}
            title={preset.name}
          >
            <span
              className="gradient-fill"
              style={{ background: `linear-gradient(${preset.direction}, ${preset.colors.join(', ')})` }}
            />
            <span className="gradient-name">{preset.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export const OverlayUpload: React.FC<{
  onUpload: (dataUrl: string) => void,
  onRemove: () => void,
  hasOverlay: boolean
}> = ({ onUpload, onRemove, hasOverlay }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUpload(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="control-group upload-group">
      <label className="control-label">Image Overlay</label>
      <div className="upload-container">
        {hasOverlay ? (
          <div className="overlay-active-state">
            <div className="overlay-status">
              <svg className="overlay-status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21,15 16,10 5,21"></polyline>
              </svg>
              <span className="overlay-status-text">Overlay active</span>
            </div>
            <button
              type="button"
              className="overlay-remove-button"
              onClick={onRemove}
            >
              Remove
            </button>
          </div>
        ) : (
          <>
            <input
              data-testid="overlay-upload"
              type="file"
              accept="image/*"
              className="styled-file-input"
              onChange={handleFileChange}
              id="overlay-upload-input"
              aria-label="Upload overlay image"
            />
            <label htmlFor="overlay-upload-input" className="upload-card">
              <div className="upload-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21,15 16,10 5,21"></polyline>
                </svg>
              </div>
              <span className="upload-title">Add overlay image</span>
              <span className="upload-hint">PNG or JPG</span>
            </label>
          </>
        )}
      </div>
    </div>
  );
};

export const SliderControl: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  unit?: string;
  onChange: (value: number) => void;
  testId?: string;
}> = ({ label, value, min, max, unit = '', onChange, testId }) => (
  <div className="control-group slider-group">
    <div className="slider-header">
      <label className="control-label">{label}</label>
      <span className="slider-value-badge">{value}{unit}</span>
    </div>
    <input
      data-testid={testId}
      type="range"
      className="styled-slider"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      aria-label={label}
    />
  </div>
);
