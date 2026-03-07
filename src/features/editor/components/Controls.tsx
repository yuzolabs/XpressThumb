import React from 'react';
import './Controls.css';

interface BaseControlProps<T> {
  value: T;
  onChange: (value: T) => void;
}

export const RatioSelect: React.FC<BaseControlProps<string>> = ({ value, onChange }) => (
  <div className="control-group ratio-select-group" data-testid="ratio-select">
    <label className="control-label">Aspect Ratio</label>
    <div className="radio-pill-group">
      {['16:9', '5:2', '1:1'].map(ratio => (
        <button
          key={ratio}
          className={`radio-pill ${value === ratio ? 'active' : ''}`}
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
    <label className="control-label">Headline</label>
    <textarea
      data-testid="text-input"
      className="styled-textarea"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Enter your headline here..."
      rows={4}
    />
  </div>
);

export const FontSelect: React.FC<BaseControlProps<string>> = ({ value, onChange }) => (
  <div className="control-group font-select-group">
    <label className="control-label">Typography</label>
    <select
      data-testid="font-select"
      className="styled-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="Noto Sans JP">Noto Sans JP</option>
      <option value="M PLUS Rounded 1c">M PLUS Rounded 1c</option>
    </select>
  </div>
);

export const FontSizeSlider: React.FC<BaseControlProps<number>> = ({ value, onChange }) => (
  <div className="control-group slider-group">
    <label className="control-label">Size <span className="slider-value">{value}px</span></label>
    <input
      data-testid="font-size-slider"
      type="range"
      className="styled-slider"
      min={45}
      max={120}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  </div>
);

export const ColorSelect: React.FC<BaseControlProps<string>> = ({ value, onChange }) => (
  <div className="control-group color-select-group">
    <label className="control-label">Palette</label>
    <div className="color-swatches" data-testid="color-select">
      {[
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Dark', hex: '#111111' },
        { name: 'Cream', hex: '#FDFBF7' }
      ].map(color => (
        <button
          key={color.name}
          className={`color-swatch ${value.toLowerCase() === color.hex.toLowerCase() ? 'active' : ''}`}
          style={{ backgroundColor: color.hex }}
          onClick={() => onChange(color.hex)}
          title={color.name}
        />
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
      <div className="position-grid" data-testid="position-select">
        {positions.map(pos => (
          <button
            key={pos}
            className={`position-node ${value === pos ? 'active' : ''}`}
            onClick={() => onChange(pos)}
            aria-label={`Position ${pos}`}
          >
            <div className="position-indicator"></div>
          </button>
        ))}
      </div>
    </div>
  );
};

export const BackgroundModeSelect: React.FC<BaseControlProps<string>> = ({ value, onChange }) => (
  <div className="control-group bg-mode-group">
    <label className="control-label">Background</label>
    <select
      data-testid="background-mode-select"
      className="styled-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="solid">Solid Base</option>
      <option value="gradient">Gradient Mesh</option>
      <option value="image">Custom Image</option>
    </select>
  </div>
);

export const PatternSelect: React.FC<BaseControlProps<string>> = ({ value, onChange }) => (
  <div className="control-group pattern-select-group">
    <label className="control-label">Texture / Pattern</label>
    <select
      data-testid="pattern-select"
      className="styled-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="none">None</option>
      <option value="noise">Cinematic Noise</option>
      <option value="dot">Halftone Dots</option>
      <option value="grid">Blueprint Grid</option>
    </select>
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
      <label className="control-label">Source Asset</label>
      <div className="upload-container">
        <input
          data-testid="image-upload"
          type="file"
          accept="image/*"
          className="styled-file-input"
          onChange={handleFileChange}
          id="file-upload"
        />
        <label htmlFor="file-upload" className="upload-button">
          Select Image
        </label>
      </div>
    </div>
  );
};

export const DownloadButton: React.FC<{ onClick: () => void; disabled?: boolean }> = ({ onClick, disabled }) => (
  <button 
    data-testid="download-button"
    className={`brutal-button download-button ${disabled ? 'disabled' : ''}`}
    onClick={onClick}
    disabled={disabled}
  >
    <span className="button-text">EXPORT_IMG</span>
    <span className="button-glitch"></span>
  </button>
);

export const SolidBackgroundPicker: React.FC<BaseControlProps<string>> = ({ value, onChange }) => (
  <div className="control-group color-select-group">
    <label className="control-label">Solid Color</label>
    <div className="color-swatches" data-testid="solid-bg-picker">
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
          className={`color-swatch ${value === color.hex ? 'active' : ''}`}
          style={{ backgroundColor: color.hex }}
          onClick={() => onChange(color.hex)}
          title={color.name}
        />
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
    <div className="control-group color-select-group">
      <label className="control-label">Gradient Preset</label>
      <div className="color-swatches" data-testid="gradient-bg-picker">
        {presets.map(preset => (
          <button
            key={preset.id}
            className={`color-swatch ${isSelected(preset.colors) ? 'active' : ''}`}
            style={{ background: `linear-gradient(${preset.direction}, ${preset.colors.join(', ')})` }}
            onClick={() => onChange({ direction: preset.direction, colors: preset.colors })}
            title={preset.name}
          />
        ))}
      </div>
    </div>
  );
};