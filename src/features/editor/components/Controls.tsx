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
          className={`color-swatch ${value === color.name ? 'active' : ''}`}
          style={{ backgroundColor: color.hex }}
          onClick={() => onChange(color.name)}
          title={color.name}
        />
      ))}
    </div>
  </div>
);

export const PositionSelect: React.FC<BaseControlProps<string>> = ({ value, onChange }) => {
  const positions = [
    'top-left', 'top-center', 'top-right',
    'middle-left', 'middle-center', 'middle-right',
    'bottom-left', 'bottom-center', 'bottom-right'
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

export const DownloadButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button 
    data-testid="download-button"
    className="brutal-button download-button"
    onClick={onClick}
  >
    <span className="button-text">EXPORT_IMG</span>
    <span className="button-glitch"></span>
  </button>
);
