import React from 'react';
import './Controls.css';
import { useMessages } from '../../../shared/i18n';

interface BaseControlProps<T> {
  value: T;
  onChange: (value: T) => void;
}

export const RatioSelect: React.FC<BaseControlProps<string>> = ({ value, onChange }) => {
  const messages = useMessages();

  return (
    <div className="control-group ratio-select-group" data-testid="ratio-select">
      <label className="control-label">{messages.controls.ratio.label}</label>
      <div
        className="segmented-control"
        role="radiogroup"
        aria-label={messages.controls.ratio.ariaLabel}
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
};

export const TextInput: React.FC<BaseControlProps<string>> = ({ value, onChange }) => {
  const messages = useMessages();

  return (
    <div className="control-group text-input-group">
      <label className="control-label" htmlFor="headline-input">
        {messages.controls.text.label}
      </label>
      <textarea
        id="headline-input"
        data-testid="text-input"
        className="styled-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={messages.controls.text.placeholder}
        rows={4}
      />
      <p className="control-helper">{messages.controls.text.helper}</p>
    </div>
  );
};

export const FontSelect: React.FC<BaseControlProps<string>> = ({ value, onChange }) => {
  const messages = useMessages();

  return (
    <div className="control-group font-select-group">
      <label className="control-label" htmlFor="font-select">
        {messages.controls.font.label}
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
};

export const FontSizeSlider: React.FC<BaseControlProps<number>> = ({ value, onChange }) => {
  const messages = useMessages();

  return (
    <div className="control-group slider-group">
      <div className="slider-header">
        <label className="control-label">{messages.controls.fontSize.label}</label>
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
        aria-label={messages.controls.fontSize.ariaLabel}
      />
    </div>
  );
};

export const ColorSelect: React.FC<BaseControlProps<string>> = ({ value, onChange }) => {
  const messages = useMessages();
  const colors = [
    { name: messages.controls.color.options.white, hex: '#FFFFFF' },
    { name: messages.controls.color.options.dark, hex: '#111111' },
    { name: messages.controls.color.options.cream, hex: '#FDFBF7' }
  ];

  return (
    <div className="control-group color-select-group">
      <label className="control-label">{messages.controls.color.label}</label>
      <div className="color-swatches" data-testid="color-select" role="radiogroup" aria-label={messages.controls.color.ariaLabel}>
        {colors.map(color => (
          <button
            key={color.hex}
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
};

export const PositionSelect: React.FC<BaseControlProps<string>> = ({ value, onChange }) => {
  const messages = useMessages();
  const positions = [
    'top-left', 'top', 'top-right',
    'left', 'center', 'right',
    'bottom-left', 'bottom', 'bottom-right'
  ];

  return (
    <div className="control-group position-select-group">
      <label className="control-label">{messages.controls.position.label}</label>
      <div
        className="position-grid"
        data-testid="position-select"
        role="radiogroup"
        aria-label={messages.controls.position.ariaLabel}
      >
        {positions.map(pos => (
          <button
            key={pos}
            type="button"
            role="radio"
            aria-checked={value === pos}
            aria-label={messages.controls.position.options[pos as keyof typeof messages.controls.position.options]}
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

export const BackgroundModeSelect: React.FC<BaseControlProps<string>> = ({ value, onChange }) => {
  const messages = useMessages();
  const modes = [
    { value: 'solid', label: messages.controls.backgroundMode.options.solid },
    { value: 'gradient', label: messages.controls.backgroundMode.options.gradient },
    { value: 'image', label: messages.controls.backgroundMode.options.image }
  ];

  return (
    <div className="control-group bg-mode-group" data-testid="background-mode-select">
      <label className="control-label">{messages.controls.backgroundMode.label}</label>
      <div
        className="segmented-control"
        role="radiogroup"
        aria-label={messages.controls.backgroundMode.ariaLabel}
      >
        {modes.map(mode => (
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
};

export const PatternSelect: React.FC<BaseControlProps<string>> = ({ value, onChange }) => {
  const messages = useMessages();
  const patterns = [
    { value: 'none', label: messages.controls.pattern.options.none },
    { value: 'noise', label: messages.controls.pattern.options.noise },
    { value: 'dot', label: messages.controls.pattern.options.dot },
    { value: 'grid', label: messages.controls.pattern.options.grid }
  ];

  return (
    <div className="control-group pattern-select-group" data-testid="pattern-select">
      <label className="control-label">{messages.controls.pattern.label}</label>
      <div
        className="pattern-chips"
        role="radiogroup"
        aria-label={messages.controls.pattern.ariaLabel}
      >
        {patterns.map(pattern => (
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
};

export const ImageUpload: React.FC<{ onUpload: (dataUrl: string) => void }> = ({ onUpload }) => {
  const messages = useMessages();

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
      <label className="control-label">{messages.controls.backgroundImage.label}</label>
      <div className="upload-container">
        <input
          data-testid="image-upload"
          type="file"
          accept="image/*"
          className="styled-file-input"
          onChange={handleFileChange}
          id="file-upload"
          aria-label={messages.controls.backgroundImage.inputAriaLabel}
        />
        <label htmlFor="file-upload" className="upload-card">
          <div className="upload-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17,8 12,3 7,8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
          </div>
          <span className="upload-title">{messages.controls.backgroundImage.uploadTitle}</span>
          <span className="upload-hint">{messages.controls.backgroundImage.uploadHint}</span>
        </label>
      </div>
    </div>
  );
};

export const DownloadButton: React.FC<{ onClick: () => void; disabled?: boolean }> = ({ onClick, disabled }) => {
  const messages = useMessages();

  return (
    <button
      data-testid="download-button"
      type="button"
      className={`download-button ${disabled ? 'disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
    >
      <span className="button-text">{messages.controls.download.label}</span>
    </button>
  );
};

export const SolidBackgroundPicker: React.FC<BaseControlProps<string>> = ({ value, onChange }) => {
  const messages = useMessages();
  const colors = [
    { name: messages.controls.solidBackground.colors.darkVoid, hex: '#1a1a2e' },
    { name: messages.controls.solidBackground.colors.crimson, hex: '#E63946' },
    { name: messages.controls.solidBackground.colors.royalBlue, hex: '#1D3557' },
    { name: messages.controls.solidBackground.colors.forest, hex: '#2A9D8F' },
    { name: messages.controls.solidBackground.colors.golden, hex: '#E9C46A' },
    { name: messages.controls.solidBackground.colors.white, hex: '#FFFFFF' }
  ];

  return (
    <div className="control-group solid-bg-group">
      <label className="control-label">{messages.controls.solidBackground.label}</label>
      <div className="solid-color-grid" data-testid="solid-bg-picker" role="radiogroup" aria-label={messages.controls.solidBackground.ariaLabel}>
        {colors.map(color => (
          <button
            key={color.hex}
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
};

export const GradientBackgroundPicker: React.FC<{
  value: { direction: string, colors: string[] },
  onChange: (value: { direction: string, colors: string[] }) => void
}> = ({ value, onChange }) => {
  const messages = useMessages();
  const presets = [
    { id: 'cyberpunk', name: messages.controls.gradient.presets.cyberpunk, direction: 'to right', colors: ['#f8049c', '#fdd54f'] },
    { id: 'ocean', name: messages.controls.gradient.presets.ocean, direction: 'to bottom right', colors: ['#2E3192', '#1BFFFF'] },
    { id: 'sunset', name: messages.controls.gradient.presets.sunset, direction: 'to right', colors: ['#ff9966', '#ff5e62'] },
    { id: 'aurora', name: messages.controls.gradient.presets.aurora, direction: 'to bottom', colors: ['#00c6ff', '#0072ff'] },
    { id: 'neon', name: messages.controls.gradient.presets.neon, direction: 'to right', colors: ['#12c2e9', '#c471ed', '#f64f59'] }
  ];

  const isSelected = (presetColors: string[]) =>
    JSON.stringify(presetColors) === JSON.stringify(value.colors);

  return (
    <div className="control-group gradient-bg-group">
      <label className="control-label">{messages.controls.gradient.label}</label>
      <div className="gradient-grid" data-testid="gradient-bg-picker" role="radiogroup" aria-label={messages.controls.gradient.ariaLabel}>
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
  const messages = useMessages();

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
      <label className="control-label">{messages.controls.overlay.label}</label>
      <div className="upload-container">
        {hasOverlay ? (
          <div className="overlay-active-state">
            <div className="overlay-status">
              <svg className="overlay-status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21,15 16,10 5,21"></polyline>
              </svg>
              <span className="overlay-status-text">{messages.controls.overlay.active}</span>
            </div>
            <button
              type="button"
              className="overlay-remove-button"
              onClick={onRemove}
            >
              {messages.controls.overlay.remove}
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
              aria-label={messages.controls.overlay.inputAriaLabel}
            />
            <label htmlFor="overlay-upload-input" className="upload-card">
              <div className="upload-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21,15 16,10 5,21"></polyline>
                </svg>
              </div>
              <span className="upload-title">{messages.controls.overlay.uploadTitle}</span>
              <span className="upload-hint">{messages.controls.overlay.uploadHint}</span>
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
