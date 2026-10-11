import React, { useState } from 'react';
import { IGExamItem } from './types';
import { HomeHub } from './components/HomeHub';
import { SubjectExamsSection } from './components/SubjectExamsSection';
import { CalculatorWorkstation } from './components/CalculatorWorkstation';
import { QuickCalculatorModal } from './components/QuickCalculatorModal';
import { AppLogo } from './components/AppLogo';
import { useLanguage } from './context/LanguageContext';
import {
  Atom,
  Sigma,
  Layers,
  Calculator,
  Globe,
  Home,
} from 'lucide-react';

export type MainTabType = 'home' | 'physics' | 'math' | 'archive' | 'calculator';

export default function App() {
  const { t, language, toggleLanguage, isRTL } = useLanguage();

  const [activeTab, setActiveTab] = useState<MainTabType>('home');
  const [quickStartExam, setQuickStartExam] = useState<IGExamItem | null>(null);
  const [isCalcModalOpen, setIsCalcModalOpen] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(() => new Set());

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleQuickStartFromHome = (exam: IGExamItem) => {
    setQuickStartExam(exam);
    setActiveTab(exam.subject === 'physics' ? 'physics' : 'math');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white ${
        isRTL ? "font-['Cairo',sans-serif]" : "font-['Plus_Jakarta_Sans',sans-serif]"
      }`}
    >
      {/* Top Bar Navigation (Clean 3-Zone Contract) */}
      <header className="border-b border-slate-800/80 bg-slate-900/95 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <button
            onClick={() => {
              setQuickStartExam(null);
              setActiveTab('home');
            }}
            className="flex items-center gap-2.5 text-start cursor-pointer group whitespace-nowrap shrink-0"
          >
            <AppLogo size={38} />
            <span className="text-base sm:text-lg font-extrabold text-white tracking-tight group-hover:text-emerald-300 transition-colors">
              {t.appTitle}
            </span>
          </button>

          {/* Zone 2: 5 Concise Single-Line Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs sm:text-sm font-bold text-slate-300">
            <button
              onClick={() => {
                setQuickStartExam(null);
                setActiveTab('home');
              }}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'home'
                  ? 'border-sky-400 text-white'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Home className="w-3.5 h-3.5 text-sky-400" />
              <span>{t.tabHome}</span>
            </button>

            <button
              onClick={() => {
                setQuickStartExam(null);
                setActiveTab('physics');
              }}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'physics'
                  ? 'border-emerald-400 text-emerald-300'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Atom className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'ar' ? 'الفيزياء (14)' : 'Physics (14)'}</span>
            </button>

            <button
              onClick={() => {
                setQuickStartExam(null);
                setActiveTab('math');
              }}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'math'
                  ? 'border-indigo-400 text-indigo-300'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Sigma className="w-3.5 h-3.5 text-indigo-400" />
              <span>{language === 'ar' ? 'الرياضيات (17)' : 'Mathematics (17)'}</span>
            </button>

            <button
              onClick={() => {
                setQuickStartExam(null);
                setActiveTab('archive');
              }}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'archive'
                  ? 'border-sky-400 text-sky-300'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              <span>{language === 'ar' ? 'الأرشيف (31)' : 'All Archive (31)'}</span>
            </button>

            <button
              onClick={() => {
                setQuickStartExam(null);
                setActiveTab('calculator');
              }}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'calculator'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Calculator className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.tabCalculator}</span>
            </button>
          </nav>

          {/* Zone 3: Language Switch Action */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold transition-all active:scale-95 whitespace-nowrap shrink-0"
              title={language === 'ar' ? 'Switch to English' : 'التحويل إلى اللغة العربية'}
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.btnLangToggle}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile / Tablet Navigation Bar (Below Header) */}
      <div className="lg:hidden border-b border-slate-800/80 bg-slate-900/60 px-4 py-2 overflow-x-auto">
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => {
              setQuickStartExam(null);
              setActiveTab('home');
            }}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap shrink-0 ${
              activeTab === 'home' ? 'bg-slate-800 text-white' : 'text-slate-400'
            }`}
          >
            {t.tabHome}
          </button>
          <button
            onClick={() => {
              setQuickStartExam(null);
              setActiveTab('physics');
            }}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap shrink-0 ${
              activeTab === 'physics' ? 'bg-emerald-600 text-white' : 'text-slate-400'
            }`}
          >
            {language === 'ar' ? 'الفيزياء (14)' : 'Physics (14)'}
          </button>
          <button
            onClick={() => {
              setQuickStartExam(null);
              setActiveTab('math');
            }}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap shrink-0 ${
              activeTab === 'math' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            {language === 'ar' ? 'الرياضيات (17)' : 'Math (17)'}
          </button>
          <button
            onClick={() => {
              setQuickStartExam(null);
              setActiveTab('archive');
            }}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap shrink-0 ${
              activeTab === 'archive' ? 'bg-sky-600 text-white' : 'text-slate-400'
            }`}
          >
            {language === 'ar' ? 'الأرشيف (31)' : 'Archive (31)'}
          </button>
          <button
            onClick={() => {
              setQuickStartExam(null);
              setActiveTab('calculator');
            }}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap shrink-0 ${
              activeTab === 'calculator' ? 'bg-amber-600 text-white' : 'text-slate-400'
            }`}
          >
            {t.tabCalculator}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {activeTab === 'home' && (
          <HomeHub
            onSelectFeature={(feature) => {
              setQuickStartExam(null);
              setActiveTab(feature);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onQuickStartExam={handleQuickStartFromHome}
          />
        )}

        {activeTab === 'physics' && (
          <SubjectExamsSection
            mode="physics"
            initialActiveExam={quickStartExam?.subject === 'physics' ? quickStartExam : null}
            onClearInitialExam={() => setQuickStartExam(null)}
            onOpenCalculator={() => setIsCalcModalOpen(true)}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={toggleBookmark}
          />
        )}

        {activeTab === 'math' && (
          <SubjectExamsSection
            mode="math"
            initialActiveExam={quickStartExam?.subject === 'math' ? quickStartExam : null}
            onClearInitialExam={() => setQuickStartExam(null)}
            onOpenCalculator={() => setIsCalcModalOpen(true)}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={toggleBookmark}
          />
        )}

        {activeTab === 'archive' && (
          <SubjectExamsSection
            mode="archive"
            initialActiveExam={quickStartExam}
            onClearInitialExam={() => setQuickStartExam(null)}
            onOpenCalculator={() => setIsCalcModalOpen(true)}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={toggleBookmark}
          />
        )}

        {activeTab === 'calculator' && (
          <CalculatorWorkstation onBackToHome={() => setActiveTab('home')} />
        )}
      </main>

      {/* Global Application Footer with Mr. Mohammed Hesham Signature & Vector Logo */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-900/90 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-start">
          <div className="flex items-center gap-3">
            <AppLogo size={40} />
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2 justify-center sm:justify-start">
                <span className="text-slate-300">{t.footerDevTitle}</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-sky-300 to-indigo-300 font-extrabold text-base tracking-wide font-sans">
                  Mr. Mohammed Hesham
                </span>
              </div>
              <p className="text-xs text-slate-400">{t.footerPlatformDesc}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
            <span className="text-slate-300 font-medium font-mono" dir="ltr">
              Prepared by: Mr. Mohammed Hesham
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-500 font-mono" dir="ltr">
              &copy; {new Date().getFullYear()} {t.footerAllRightsReserved}
            </span>
          </div>
        </div>
      </footer>

      {/* Quick Calculator & Formula Sheet Modal */}
      <QuickCalculatorModal
        isOpen={isCalcModalOpen}
        onClose={() => setIsCalcModalOpen(false)}
      />
    </div>
  );
}
