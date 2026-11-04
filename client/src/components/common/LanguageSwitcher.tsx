import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Globe } from 'lucide-react';

export const LanguageSwitcher: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={`inline-flex items-center bg-[#FAF9F5] border border-[#E5E4DE] rounded-full p-0.5 text-xs font-medium ${className}`}>
      <div className="pl-2 pr-1 text-[#727B74]">
        <Globe className="w-3.5 h-3.5" />
      </div>
      <button
        type="button"
        onClick={() => setLanguage('HI')}
        className={`px-2.5 py-1 rounded-full transition-all duration-200 ${
          language === 'HI'
            ? 'bg-[#174C3C] text-white shadow-xs font-semibold'
            : 'text-[#202923] hover:text-[#174C3C]'
        }`}
      >
        हिंदी
      </button>
      <button
        type="button"
        onClick={() => setLanguage('EN')}
        className={`px-2.5 py-1 rounded-full transition-all duration-200 ${
          language === 'EN'
            ? 'bg-[#174C3C] text-white shadow-xs font-semibold'
            : 'text-[#202923] hover:text-[#174C3C]'
        }`}
      >
        English
      </button>
    </div>
  );
};
