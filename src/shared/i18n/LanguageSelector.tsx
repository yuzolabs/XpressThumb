import React from 'react';
import type { SupportedLocale } from './index';
import { useMessages } from './index';

interface LanguageSelectorProps {
  value: SupportedLocale;
  onChange: (locale: SupportedLocale) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ value, onChange }) => {
  const messages = useMessages();
  const options: { value: SupportedLocale; label: string }[] = [
    { value: 'en', label: 'EN' },
    { value: 'ja', label: 'JA' },
  ];

  return (
    <div className="language-selector" role="radiogroup" aria-label={messages.languageSelector.ariaLabel}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          className={`language-button ${value === option.value ? 'active' : ''}`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};
