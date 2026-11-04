import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const LanguageSwitcher: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={`flex items-center bg-surface-container-high rounded-full p-1 border border-outline-variant/40 ${className}`}>
      <button
        type="button"
        onClick={() => setLanguage('EN')}
        className={`px-2.5 py-1 rounded-full font-label-sm text-label-sm transition-all ${
          language === 'EN'
            ? 'bg-primary text-on-primary font-semibold shadow-xs'
            : 'text-on-surface-variant hover:text-on-surface'
        }`}
      >
        English
      </button>
      <button
        type="button"
        onClick={() => setLanguage('HI')}
        className={`px-2.5 py-1 rounded-full font-label-sm text-label-sm transition-all ${
          language === 'HI'
            ? 'bg-primary text-on-primary font-semibold shadow-xs'
            : 'text-on-surface-variant hover:text-on-surface'
        }`}
      >
        हिंदी
      </button>
    </div>
  );
};
