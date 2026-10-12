import React, { useState } from 'react';
import { IGExamItem } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Maximize2,
  Minimize2,
  Calculator,
  Clock,
  Award,
  Atom,
  Sigma,
} from 'lucide-react';

interface EmbeddedExamRunnerProps {
  exam: IGExamItem;
  onClose: () => void;
  onOpenCalculator: () => void;
}

export const EmbeddedExamRunner: React.FC<EmbeddedExamRunnerProps> = ({
  exam,
  onClose,
  onOpenCalculator,
}) => {
  const { language, isRTL } = useLanguage();
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [isLoadingIframe, setIsLoadingIframe] = useState<boolean>(true);

  const handleReloadIframe = () => {
    setIsLoadingIframe(true);
    setIframeKey((prev) => prev + 1);
  };

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;
  const isPhysics = exam.subject === 'physics';

  return (
    <div
      className={`rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-0 z-50 rounded-none border-0 h-screen'
          : 'min-h-[780px] h-[86vh]'
      }`}
    >
      {/* Top Control Navigation Bar */}
      <div className="px-4 sm:px-6 py-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 active:scale-95 whitespace-nowrap shrink-0"
          >
            <BackIcon className={`w-4 h-4 ${isPhysics ? 'text-emerald-400' : 'text-indigo-400'}`} />
            <span>{language === 'ar' ? 'العودة لقائمة الامتحانات' : 'Back to Exams'}</span>
          </button>

          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 ${
                isPhysics
                  ? 'bg-emerald-950/90 border-emerald-700/60 text-emerald-300'
                  : 'bg-indigo-950/90 border-indigo-700/60 text-indigo-300'
              }`}
            >
              {isPhysics ? <Atom className="w-4 h-4" /> : <Sigma className="w-4 h-4" />}
            </div>

            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>{language === 'ar' ? exam.titleAr : exam.title}</span>
              </h2>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 tabular-nums">
                <span className={isPhysics ? 'text-emerald-400 font-medium' : 'text-indigo-400 font-medium'}>
                  {exam.code}
                </span>
                <span aria-hidden="true">·</span>
                <span>{language === 'ar' ? exam.sessionAr : exam.session}</span>
                <span aria-hidden="true">·</span>
                <span className="text-sky-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {exam.durationMinutes} {language === 'ar' ? 'دقيقة' : 'mins'}
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-amber-400 flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  {exam.totalMarks} {language === 'ar' ? 'درجة' : 'marks'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions: Calculator & Formulas, Reload, Fullscreen (NO EXTERNAL LINK AT ALL) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenCalculator}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/90 hover:bg-amber-900 text-amber-300 text-xs font-bold border border-amber-700/60 transition-colors shadow-sm whitespace-nowrap shrink-0"
            title={language === 'ar' ? 'الحاسبة العلمية وقوانين المنهج' : 'Scientific Calculator & Formula Sheet'}
          >
            <Calculator className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">
              {language === 'ar' ? 'الحاسبة والقوانين' : 'Calculator & Formulas'}
            </span>
          </button>

          <button
            onClick={handleReloadIframe}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors border border-slate-700"
            title={language === 'ar' ? 'إعادة تحميل الامتحان' : 'Reload Exam'}
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsFullscreen((prev) => !prev)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors border border-slate-700"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Embedded Test Container - STRICT REQUIREMENT: NEVER SHOW LINK, ONLY (جاري التحميل) */}
      <div className="flex-1 relative bg-slate-950">
        {isLoadingIframe && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/95 z-20 gap-4 backdrop-blur-sm">
            <div className="relative flex items-center justify-center">
              <div
                className={`w-14 h-14 border-4 rounded-full animate-spin ${
                  isPhysics
                    ? 'border-emerald-500/20 border-t-emerald-500'
                    : 'border-indigo-500/20 border-t-indigo-500'
                }`}
              />
              <div className="absolute w-8 h-8 border-4 border-sky-400/20 border-b-sky-400 rounded-full animate-spin [animation-direction:reverse]" />
            </div>
            <div className="text-center space-y-1.5 px-4">
              <p className="text-lg font-extrabold text-white tracking-wide">
                (جاري التحميل)
              </p>
              <p className="text-xs text-slate-400">
                {language === 'ar'
                  ? 'يرجى الانتظار ثوانٍ معدودة، يتم تجهيز نموذج الامتحان التفاعلي...'
                  : 'Please wait a moment while the interactive exam loads...'}
              </p>
            </div>
          </div>
        )}

        <iframe
          key={iframeKey}
          src={exam.url}
          title={exam.title}
          className="w-full h-full border-0 bg-white"
          allow="clipboard-write; clipboard-read; fullscreen"
          onLoad={() => setIsLoadingIframe(false)}
        />
      </div>
    </div>
  );
};
