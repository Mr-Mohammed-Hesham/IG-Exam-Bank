import React, { useState, useMemo } from 'react';
import { IGExamItem, SubjectType } from '../types';
import { allIGExams, physicsExams, mathExams, examSessionsList } from '../data/igExamsData';
import { useLanguage } from '../context/LanguageContext';
import { EmbeddedExamRunner } from './EmbeddedExamRunner';
import {
  Atom,
  Sigma,
  Search,
  PlayCircle,
  Clock,
  Award,
  Layers,
  RotateCcw,
  Bookmark,
  CheckCircle2,
} from 'lucide-react';

interface SubjectExamsSectionProps {
  mode: 'physics' | 'math' | 'archive';
  initialActiveExam?: IGExamItem | null;
  onClearInitialExam?: () => void;
  onOpenCalculator: () => void;
  bookmarkedIds: Set<string>;
  onToggleBookmark: (id: string) => void;
}

export const SubjectExamsSection: React.FC<SubjectExamsSectionProps> = ({
  mode,
  initialActiveExam = null,
  onClearInitialExam,
  onOpenCalculator,
  bookmarkedIds,
  onToggleBookmark,
}) => {
  const { language } = useLanguage();

  const [activeExam, setActiveExam] = useState<IGExamItem | null>(initialActiveExam);
  const [selectedSession, setSelectedSession] = useState<string>('all');
  const [selectedPaperType, setSelectedPaperType] = useState<string>('all');
  const [subjectFilter, setSubjectFilter] = useState<'all' | SubjectType>('all');
  const [bookmarkedOnly, setBookmarkedOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sync if parent passes a quick-start exam
  React.useEffect(() => {
    if (initialActiveExam) {
      setActiveExam(initialActiveExam);
    }
  }, [initialActiveExam]);

  const baseExams = useMemo(() => {
    if (mode === 'physics') return physicsExams;
    if (mode === 'math') return mathExams;
    return allIGExams;
  }, [mode]);

  const paperFilterOptions = useMemo(() => {
    if (mode === 'physics') {
      return [
        { id: 'all', labelEn: 'All Papers (14)', labelAr: 'كل الأوراق (14)' },
        { id: '1P', labelEn: 'Paper 1P', labelAr: 'الورقة 1P' },
        { id: '1PR', labelEn: 'Paper 1PR (Regional)', labelAr: 'الورقة 1PR' },
        { id: '2P', labelEn: 'Paper 2P', labelAr: 'الورقة 2P' },
        { id: '2PR', labelEn: 'Paper 2PR (Regional)', labelAr: 'الورقة 2PR' },
        { id: 'Double', labelEn: 'Double Award (4SD0 / P2)', labelAr: 'جائزة مزدوجة (4SD0 / P2)' },
      ];
    }
    if (mode === 'math') {
      return [
        { id: 'all', labelEn: 'All Papers (17)', labelAr: 'كل الأوراق (17)' },
        { id: 'Higher', labelEn: 'Higher Tier (1H / 1HR / 2H / 2HR)', labelAr: 'المستوى المتقدم (Higher)' },
        { id: 'Foundation', labelEn: 'Foundation Tier (1F / 1FR / 2F)', labelAr: 'المستوى الأساسي (Foundation)' },
        { id: 'Comprehensive', labelEn: 'Comprehensive Suites (97 Qs / Master)', labelAr: 'النماذج الشاملة والمجمعة' },
      ];
    }
    return [
      { id: 'all', labelEn: 'All Tiers & Papers', labelAr: 'جميع الأوراق والمستويات' },
      { id: 'Higher', labelEn: 'Higher Tier (1H/2H/1P/2P)', labelAr: 'المستوى المتقدم (Higher)' },
      { id: 'Foundation', labelEn: 'Foundation Tier (1F/2F)', labelAr: 'المستوى الأساسي (Foundation)' },
      { id: 'Double', labelEn: 'Double Award (4SD0)', labelAr: 'الجائزة المزدوجة (4SD0)' },
      { id: 'Comprehensive', labelEn: 'Comprehensive Suites', labelAr: 'النماذج الشاملة والمجمعة' },
    ];
  }, [mode]);

  const filteredExams = useMemo(() => {
    return baseExams.filter((exam) => {
      if (mode === 'archive' && subjectFilter !== 'all' && exam.subject !== subjectFilter) {
        return false;
      }

      if (selectedSession !== 'all' && exam.session !== selectedSession) {
        return false;
      }

      if (selectedPaperType !== 'all') {
        if (mode === 'physics') {
          if (selectedPaperType === 'Double') {
            if (exam.tier !== 'Double Award' && exam.paperCode !== 'P2') return false;
          } else if (exam.paperCode !== selectedPaperType) {
            return false;
          }
        } else {
          if (selectedPaperType === 'Higher' && exam.tier !== 'Higher') return false;
          if (selectedPaperType === 'Foundation' && exam.tier !== 'Foundation') return false;
          if (selectedPaperType === 'Double' && exam.tier !== 'Double Award') return false;
          if (selectedPaperType === 'Comprehensive' && exam.tier !== 'Comprehensive') return false;
        }
      }

      if (bookmarkedOnly && !bookmarkedIds.has(exam.id)) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle =
          exam.title.toLowerCase().includes(q) ||
          exam.titleAr.toLowerCase().includes(q) ||
          exam.subtitle.toLowerCase().includes(q) ||
          exam.subtitleAr.toLowerCase().includes(q);
        const matchCode =
          exam.code.toLowerCase().includes(q) ||
          exam.paperCode.toLowerCase().includes(q) ||
          exam.repoName.toLowerCase().includes(q);
        const matchSession =
          exam.session.toLowerCase().includes(q) || exam.sessionAr.toLowerCase().includes(q);
        const matchTopics =
          exam.topics.some((t) => t.toLowerCase().includes(q)) ||
          exam.topicsAr.some((t) => t.toLowerCase().includes(q));
        return matchTitle || matchCode || matchSession || matchTopics;
      }

      return true;
    });
  }, [baseExams, mode, subjectFilter, selectedSession, selectedPaperType, bookmarkedOnly, bookmarkedIds, searchQuery]);

  const handleStartExam = (exam: IGExamItem) => {
    setActiveExam(exam);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleCloseExam = () => {
    setActiveExam(null);
    if (onClearInitialExam) onClearInitialExam();
  };

  const resetFilters = () => {
    setSelectedSession('all');
    setSelectedPaperType('all');
    setSubjectFilter('all');
    setBookmarkedOnly(false);
    setSearchQuery('');
  };

  // If an exam is currently active, render the EmbeddedExamRunner directly in-page
  if (activeExam) {
    return (
      <EmbeddedExamRunner
        exam={activeExam}
        onClose={handleCloseExam}
        onOpenCalculator={onOpenCalculator}
      />
    );
  }

  const isPhysicsMode = mode === 'physics';
  const isMathMode = mode === 'math';

  return (
    <div className="space-y-6">
      {/* Section Header Banner */}
      <div
        className={`relative overflow-hidden rounded-3xl border p-6 sm:p-8 shadow-xl ${
          isPhysicsMode
            ? 'border-emerald-900/60 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40'
            : isMathMode
            ? 'border-indigo-900/60 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40'
            : 'border-sky-900/60 bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950/40'
        }`}
      >
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold">
              {isPhysicsMode ? (
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <Atom className="w-4 h-4" />
                  <span>Pearson Edexcel IGCSE Physics (4PH1 & 4SD0)</span>
                </span>
              ) : isMathMode ? (
                <span className="text-indigo-400 flex items-center gap-1.5">
                  <Sigma className="w-4 h-4" />
                  <span>Pearson Edexcel IGCSE Mathematics A (4MA1)</span>
                </span>
              ) : (
                <span className="text-sky-400 flex items-center gap-1.5">
                  <Layers className="w-4 h-4" />
                  <span>Complete IGCSE Past Papers Archive (Physics & Mathematics)</span>
                </span>
              )}
              <span className="text-slate-500" aria-hidden="true">·</span>
              <span className="text-slate-300">
                {language === 'ar' ? 'تشغيل تفاعلي مباشر داخل الصفحة' : 'Direct In-Page Interactive Runner'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {isPhysicsMode
                ? language === 'ar'
                  ? 'امتحانات الفيزياء التفاعلية (IGCSE Physics — 14 نموذجاً)'
                  : 'IGCSE Physics Interactive Exams (14 Past Papers)'
                : isMathMode
                ? language === 'ar'
                  ? 'امتحانات الرياضيات التفاعلية (IGCSE Mathematics — 17 نموذجاً)'
                  : 'IGCSE Mathematics Interactive Exams (17 Past Papers)'
                : language === 'ar'
                ? 'الأرشيف الشامل لامتحانات IG (31 امتحان فيزياء ورياضيات)'
                : 'Complete IGCSE Exam Archive (All 31 Physics & Math Papers)'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isPhysicsMode
                ? language === 'ar'
                  ? 'جميع أوراق الفيزياء (1P, 1PR, 2P, 2PR) ونماذج الجائزة المزدوجة (Double Award 4SD0) لدورات يونيو 2018، يناير ومايو 2020، ويناير ويونيو 2021.'
                  : 'Complete collection of Edexcel Physics Papers 1P, 1PR, 2P, 2PR, and Double Award (4SD0) from June 2018 through June 2021.'
                : isMathMode
                ? language === 'ar'
                  ? 'جميع أوراق الرياضيات 4MA1 للمستويين المتقدم (Higher: 1H, 1HR, 2H, 2HR) والأساسي (Foundation: 1F, 1FR, 2F) بالإضافة إلى الموسوعات المجمعة.'
                  : 'All Edexcel 4MA1 Mathematics papers across Higher (1H, 1HR, 2H, 2HR) and Foundation (1F, 1FR, 2F) tiers plus comprehensive multi-paper suites.'
                : language === 'ar'
                ? 'استعرض، ابحث، وابدأ أياً من الـ 31 امتحاناً رسمياً وتفاعلياً لمادتي الفيزياء والرياضيات مباشرة داخل المنصة.'
                : 'Browse, filter, and launch any of the 31 interactive Physics and Mathematics IGCSE exams directly inside the platform.'}
            </p>
          </div>

          {/* Summary Stat Counters */}
          <div className="flex items-center gap-3 shrink-0 tabular-nums">
            <div className="p-3.5 rounded-2xl bg-slate-950/85 border border-slate-800 text-center min-w-[105px]">
              <div
                className={`text-2xl font-black font-mono ${
                  isPhysicsMode
                    ? 'text-emerald-400'
                    : isMathMode
                    ? 'text-indigo-400'
                    : 'text-sky-400'
                }`}
              >
                {baseExams.length}
              </div>
              <div className="text-[11px] text-slate-400">
                {language === 'ar' ? 'إجمالي النماذج' : 'Total Exams'}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/85 border border-slate-800 text-center min-w-[105px]">
              <div className="text-2xl font-black text-amber-400 font-mono">
                {filteredExams.length}
              </div>
              <div className="text-[11px] text-slate-400">
                {language === 'ar' ? 'المعروض حالياً' : 'Showing Now'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Control Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'ar'
                  ? 'ابحث باسم الامتحان، كود الورقة (1H, 1P, 2PR, 2F)، السنة، أو الموضوع...'
                  : 'Search by exam title, paper code (1H, 1P, 2PR, 2F), year, or topic...'
              }
              className="w-full ps-10 pe-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Archive Mode Subject Switcher + Bookmarked Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            {mode === 'archive' && (
              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setSubjectFilter('all')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors whitespace-nowrap shrink-0 ${
                    subjectFilter === 'all'
                      ? 'bg-sky-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {language === 'ar' ? 'المادتين معاً (31)' : 'Both Subjects (31)'}
                </button>
                <button
                  onClick={() => setSubjectFilter('physics')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors whitespace-nowrap shrink-0 ${
                    subjectFilter === 'physics'
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {language === 'ar' ? 'الفيزياء (14)' : 'Physics (14)'}
                </button>
                <button
                  onClick={() => setSubjectFilter('math')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors whitespace-nowrap shrink-0 ${
                    subjectFilter === 'math'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {language === 'ar' ? 'الرياضيات (17)' : 'Math (17)'}
                </button>
              </div>
            )}

            <button
              onClick={() => setBookmarkedOnly((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all whitespace-nowrap shrink-0 ${
                bookmarkedOnly
                  ? 'bg-amber-950/90 border-amber-600 text-amber-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>
                {language === 'ar'
                  ? `المحفوظة (${bookmarkedIds.size})`
                  : `Saved (${bookmarkedIds.size})`}
              </span>
            </button>

            {(selectedSession !== 'all' ||
              selectedPaperType !== 'all' ||
              subjectFilter !== 'all' ||
              bookmarkedOnly ||
              searchQuery.trim() !== '') && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'إعادة ضبط' : 'Reset'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Paper Type / Tier Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800/80">
          <span className="text-[11px] text-slate-400 font-semibold me-2">
            {language === 'ar' ? 'تصفية حسب الورقة / المستوى:' : 'Filter by Paper / Tier:'}
          </span>
          {paperFilterOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedPaperType(opt.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                selectedPaperType === opt.id
                  ? isPhysicsMode
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : isMathMode
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-sky-600 text-white shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {language === 'ar' ? opt.labelAr : opt.labelEn}
            </button>
          ))}
        </div>

        {/* Session / Year Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800/80">
          <span className="text-[11px] text-slate-400 font-semibold me-2">
            {language === 'ar' ? 'تصفية حسب الدورة / السنة:' : 'Filter by Exam Session:'}
          </span>
          {examSessionsList.map((sess) => (
            <button
              key={sess.id}
              onClick={() => setSelectedSession(sess.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                selectedSession === sess.id
                  ? 'bg-slate-200 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {language === 'ar' ? sess.labelAr : sess.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Exams Grid */}
      {filteredExams.length === 0 ? (
        <div className="p-12 rounded-3xl border border-slate-800 bg-slate-900/60 text-center space-y-4">
          <p className="text-base font-bold text-white">
            {language === 'ar'
              ? 'لا توجد امتحانات مطابقة لخيارات البحث الحالية'
              : 'No exams match your current filters'}
          </p>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {language === 'ar'
              ? 'جرب تغيير الفلتر أو مسح كلمة البحث لعرض جميع نماذج الامتحانات المتاحة.'
              : 'Try resetting the session or paper filters to see all available IGCSE past papers.'}
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
          >
            {language === 'ar' ? 'عرض جميع الامتحانات' : 'Show All Exams'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExams.map((exam) => {
            const isPhysics = exam.subject === 'physics';
            const isSaved = bookmarkedIds.has(exam.id);

            return (
              <div
                key={exam.id}
                className={`group rounded-2xl border bg-slate-900/90 p-5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 ${
                  isPhysics
                    ? 'border-slate-800/90 hover:border-emerald-500/60 hover:shadow-lg hover:shadow-emerald-950/20'
                    : 'border-slate-800/90 hover:border-indigo-500/60 hover:shadow-lg hover:shadow-indigo-950/20'
                }`}
              >
                <div>
                  {/* Top Metadata Line (Unboxed clean metadata + Bookmark button) */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 text-xs tabular-nums">
                      <span
                        className={`font-mono font-bold ${
                          isPhysics ? 'text-emerald-400' : 'text-indigo-400'
                        }`}
                      >
                        {exam.code}
                      </span>
                      <span className="text-slate-600" aria-hidden="true">·</span>
                      <span className="text-slate-300 font-medium">
                        {language === 'ar' ? exam.sessionAr : exam.session}
                      </span>
                    </div>

                    <button
                      onClick={() => onToggleBookmark(exam.id)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isSaved
                          ? 'bg-amber-950/80 border-amber-600/70 text-amber-400'
                          : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
                      }`}
                      title={language === 'ar' ? 'حفظ في المفضلة' : 'Bookmark Exam'}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Title & Subtitle */}
                  <h3
                    className={`text-sm sm:text-base font-bold text-white transition-colors line-clamp-1 ${
                      isPhysics ? 'group-hover:text-emerald-300' : 'group-hover:text-indigo-300'
                    }`}
                  >
                    {language === 'ar' ? exam.titleAr : exam.title}
                  </h3>

                  <p className="text-xs text-slate-400 font-medium mt-0.5 mb-2 line-clamp-1">
                    {language === 'ar' ? exam.subtitleAr : exam.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                    {language === 'ar' ? exam.descriptionAr : exam.description}
                  </p>

                  {/* Clean Unboxed Topics & Specs */}
                  <div className="pt-2.5 border-t border-slate-800/70 space-y-2 mb-4">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-400">
                      {(language === 'ar' ? exam.topicsAr : exam.topics).slice(0, 4).map((topic, idx, arr) => (
                        <React.Fragment key={idx}>
                          <span>{topic}</span>
                          {idx < arr.length - 1 && (
                            <span className="text-slate-600" aria-hidden="true">·</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono tabular-nums">
                      <span className="flex items-center gap-1 text-sky-400">
                        <Clock className="w-3 h-3" />
                        {exam.durationMinutes} {language === 'ar' ? 'دقيقة' : 'mins'}
                      </span>
                      <span>
                        {exam.questionsCount} {language === 'ar' ? 'سؤال' : 'Qs'}
                      </span>
                      <span className="flex items-center gap-1 text-amber-400">
                        <Award className="w-3 h-3" />
                        {exam.totalMarks} {language === 'ar' ? 'درجة' : 'marks'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Primary In-Page Launch Button (NO EXTERNAL URL DISPLAYED) */}
                <button
                  onClick={() => handleStartExam(exam)}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-white font-bold text-xs shadow-md transition-all active:scale-95 whitespace-nowrap shrink-0 ${
                    isPhysics
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-950/40'
                      : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-indigo-950/40'
                  }`}
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>
                    {language === 'ar'
                      ? 'بدء نموذج الامتحان داخل الصفحة'
                      : 'Start Exam In-Page'}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
