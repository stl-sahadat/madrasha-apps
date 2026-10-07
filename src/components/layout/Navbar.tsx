"use client";

import React, { useState } from "react";
import { ArrowLeft, MoonStar, Globe, Check, ChevronDown, Menu } from "lucide-react";
import { Language, translations } from "@/lib/translations";

interface NavbarProps {
  currentView?: string;
  onNavigate?: (view: string) => void;
  onGoBack?: () => void;
  canGoBack?: boolean;
  madrasaName?: string;
  madrasaLogo?: string;
  currentLanguage?: Language;
  onLanguageChange?: (lang: Language) => void;
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentView = "home", 
  onNavigate, 
  onGoBack,
  canGoBack = false,
  madrasaName,
  madrasaLogo,
  currentLanguage = "bn",
  onLanguageChange,
  onToggleSidebar,
}) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const t = translations[currentLanguage] || translations.bn;

  const languages: { id: Language; name: string; nativeName: string; flag: string }[] = [
    { id: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇧🇩" },
    { id: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
    { id: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
  ];

  return (
    <header className="no-print bg-[#0B0F19] text-white sticky top-0 z-40 border-b border-slate-800/80 shadow-lg shadow-black/20 shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* বামে: ব্র্যান্ড ও টাইটেল */}
        <div className="flex items-center gap-3">
          {/* মোবাইল সাইডবার টগল বাটন */}
          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className="lg:hidden p-2 bg-slate-800 hover:bg-slate-700 text-indigo-400 rounded-xl transition-all border border-slate-700 active:scale-95 shrink-0"
              title="মেনু খুলুন"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* ব্যাক বাটন */}
          {canGoBack && (
            <button
              onClick={onGoBack}
              title={t.goBack}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all border border-slate-700 active:scale-95 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 text-indigo-400" />
              <span>{t.goBack}</span>
            </button>
          )}

          <div 
            onClick={() => onNavigate && onNavigate("home")} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* সফটওয়্যার ব্র্যান্ড বা মাদ্রাসার কাস্টম মনোগ্রাম লোগো */}
            <div className="w-10 h-10 rounded-2xl overflow-hidden shrink-0 shadow-md shadow-indigo-950/50 ring-1 ring-indigo-500/30 bg-white/10 flex items-center justify-center group-hover:ring-indigo-400 transition-all p-1">
              <img 
                src={madrasaLogo || "/logo.png"} 
                alt={madrasaName || "মাদরাসা লোগো"} 
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-white tracking-tight leading-tight group-hover:text-indigo-300 transition-colors">
                  {madrasaName || t.madrasaManagement}
                </h1>
                <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border border-indigo-500/30">
                  {t.smartEducation}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                {t.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* মাঝখানে: মাদরাসা পরিচালনা সম্পর্কিত পবিত্র কুরআনের আয়াত ও অনুবাদ */}
        <div className="hidden md:flex flex-col items-center justify-center px-4 py-1 rounded-2xl bg-gradient-to-r from-slate-900/80 via-indigo-950/50 to-slate-900/80 border border-amber-500/25 shadow-inner">
          <div className="flex items-center gap-2">
            <span className="text-amber-300 font-serif text-sm font-bold tracking-wider select-none drop-shadow-sm">
              ۝ {t.quranAyahText} ۝
            </span>
            <span className="text-[10px] text-amber-200/90 font-bold px-1.5 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30">
              {t.quranAyahSurah}
            </span>
          </div>
          <p className="text-[11px] text-slate-300 font-medium text-center leading-tight mt-0.5">
            "{t.quranAyahMeaning}"
          </p>
        </div>

        {/* ডানে: ইসলামিক চাঁদ-তারা হিজরি তারিখ এবং ৩-ভাষার সুইচার */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* ইউনিক ইসলামিক হিজরি ক্যালেন্ডার ব্যাজ */}
          <div
            title="ইসলামিক হিজরি ক্যালেন্ডার"
            className="flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-amber-500/30 rounded-full text-xs font-semibold text-amber-200 shadow-inner shadow-black/60"
          >
            <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-slate-950 shadow-xs shadow-amber-400/50 shrink-0">
              <MoonStar className="w-2.5 h-2.5 fill-slate-950 text-slate-950" />
            </div>
            <span className="tracking-wide font-bold">{t.hijriDate}</span>
          </div>

          {/* ভাষা পরিবর্তন ড্রপডাউন */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 shadow-sm transition-all active:scale-95"
            >
              <Globe className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">
                {languages.find((l) => l.id === currentLanguage)?.nativeName}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {langMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setLangMenuOpen(false)} 
                />
                <div className="absolute right-0 top-full mt-1.5 w-44 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 p-1.5 animate-fadeIn text-xs">
                  <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 mb-1">
                    {t.language} নির্বাচন
                  </div>
                  {languages.map((lang) => {
                    const isSelected = currentLanguage === lang.id;
                    return (
                      <button
                        key={lang.id}
                        type="button"
                        onClick={() => {
                          if (onLanguageChange) onLanguageChange(lang.id);
                          setLangMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-bold transition-all ${
                          isSelected
                            ? "bg-indigo-600 text-white shadow-sm"
                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-base">{lang.flag}</span>
                          <span>{lang.nativeName}</span>
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
