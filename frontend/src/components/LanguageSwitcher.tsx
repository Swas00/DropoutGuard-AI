import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check, ChevronDown, Sparkles } from 'lucide-react';
import { supportedLanguages } from '../i18n';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = supportedLanguages.find(l => l.code === i18n.language) || supportedLanguages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLanguage = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem('dropoutguard_language', code);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-white/[0.08] hover:border-indigo-500/40 text-xs text-slate-300 hover:text-white transition-all duration-200 cursor-pointer shadow-sm group"
        title="Select Interface Language / भाषा चुनें"
      >
        <Globe className="w-3.5 h-3.5 text-indigo-400 group-hover:rotate-45 transition-transform duration-300 shrink-0" />
        <span className="font-semibold text-[11px] hidden sm:inline">{currentLang.nativeName}</span>
        <span className="font-semibold text-[10px] font-mono uppercase sm:hidden text-indigo-300">{currentLang.code}</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-indigo-400' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 sm:w-64 max-w-[calc(100vw-1.5rem)] rounded-2xl bg-[#0b1120] border border-white/[0.16] shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          
          <div className="px-2.5 py-2 border-b border-white/[0.08] mb-1 flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              Regional Localization
            </span>
            <span className="text-[9px] font-mono text-slate-400">6 Indian & Global</span>
          </div>

          <div className="space-y-0.5 max-h-72 overflow-y-auto">
            {supportedLanguages.map((lang) => {
              const isSelected = lang.code === currentLang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleSelectLanguage(lang.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-medium'
                      : 'text-slate-300 hover:bg-white/[0.05] hover:text-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{lang.nativeName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({lang.name})</span>
                    </div>
                    <div className="text-[9px] text-slate-500 font-mono mt-0.5">{lang.region}</div>
                  </div>

                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
