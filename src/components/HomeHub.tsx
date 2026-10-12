import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MainTabType } from '../App';
import { allIGExams, physicsExams, mathExams } from '../data/igExamsData';
import { IGExamItem } from '../types';
import {
  Atom,
  Sigma,
  Layers,
  Calculator,
  ArrowRight,
  ArrowLeft,
  Clock,
  Award,
  CheckCircle2,
  PlayCircle,
  BookOpen,
} from 'lucide-react';

interface HomeHubProps {
  onSelectFeature: (tab: MainTabType) => void;
  onQuickStartExam: (exam: IGExamItem) => void;
}

export const HomeHub: React.FC<HomeHubProps> = ({ onSelectFeature, onQuickStartExam }) => {
  const { language, isRTL } = useLanguage();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const featuredExams = allIGExams.filter((e) => e.featured).slice(0, 6);

  return (
    <div className="space-y-8">
      {/* Top Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/60 p-6 sm:p-8 lg:p-10 shadow-2xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-3xl">
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <span>Pearson Edexcel International GCSE (9–1)</span>
              <span aria-hidden="true">·</span>
              <span>Physics (4PH1 / 4SD0)</span>
              <span aria-hidden="true">·</span>
              <span>Mathematics A (4MA1)</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight [text-wrap:balance]">
              {language === 'ar'
                ? 'منصة امتحانات IG التفاعلية الشاملة للفيزياء والرياضيات'
                : 'Comprehensive IGCSE Interactive Exam Platform for Physics & Mathematics'}
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              {language === 'ar'
                ? 'جميع الامتحانات الرسمية والنماذج التفاعلية لمادتي الفيزياء (14 نموذجاً) والرياضيات (17 نموذجاً) تفتح مباشرة داخل المنصة مع التصحيح الفوري، الرسوم البيانية التفاعلية، والعداد التنازلي تحت إشراف Mr. Mohammed Hesham.'
                : 'Access all 31 interactive IGCSE Edexcel Past Papers for Physics (14 Papers) and Mathematics (17 Papers) directly in-page with instant auto-grading, SVG diagrams, and real exam timers curated by Mr. Mohammed Hesham.'}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onSelectFeature('physics')}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-950/50 transition-all active:scale-95 whitespace-nowrap shrink-0"
              >
                <Atom className="w-4 h-4" />
                <span>
                  {language === 'ar' ? 'تصفح امتحانات الفيزياء (14)' : 'Browse Physics Exams (14)'}
                </span>
              </button>

              <button
                onClick={() => onSelectFeature('math')}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-950/50 transition-all active:scale-95 whitespace-nowrap shrink-0"
              >
                <Sigma className="w-4 h-4" />
                <span>
                  {language === 'ar' ? 'تصفح امتحانات الرياضيات (17)' : 'Browse Mathematics Exams (17)'}
                </span>
              </button>

              <button
                onClick={() => onSelectFeature('archive')}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm border border-slate-700 transition-all active:scale-95 whitespace-nowrap shrink-0"
              >
                <Layers className="w-4 h-4 text-sky-400" />
                <span>
                  {language === 'ar' ? 'الأرشيف الكامل (31 امتحان)' : 'All 31 Exams Archive'}
                </span>
              </button>
            </div>
          </div>

          {/* Key Quantitative Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 shrink-0 lg:w-80">
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800/90 text-center">
              <div className="text-2xl sm:text-3xl font-black text-white font-mono tabular-nums">
                {allIGExams.length}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {language === 'ar' ? 'إجمالي نماذج الامتحانات' : 'Total Interactive Exams'}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800/90 text-center">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono tabular-nums">
                {physicsExams.length}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {language === 'ar' ? 'امتحانات الفيزياء (4PH1)' : 'IGCSE Physics Papers'}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800/90 text-center">
              <div className="text-2xl sm:text-3xl font-black text-indigo-400 font-mono tabular-nums">
                {mathExams.length}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {language === 'ar' ? 'امتحانات الرياضيات (4MA1)' : 'IGCSE Math Papers'}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800/90 text-center">
              <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono tabular-nums">
                2018–26
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {language === 'ar' ? 'دورات الامتحانات المغطاة' : 'Exam Sessions Covered'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Primary Portal Cards (Matching SAT-Math-Bank Structure) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. IGCSE Physics Portal Card */}
        <div
          onClick={() => onSelectFeature('physics')}
          className="group relative cursor-pointer overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/95 to-emerald-950/30 p-6 sm:p-8 transition-all duration-200 hover:border-emerald-500/70 hover:shadow-xl flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-3 mb-5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-950 border border-emerald-500/40 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Atom className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-400" />
              </div>
              <div className="text-end tabular-nums">
                <span className="text-xs font-bold text-emerald-400 font-mono">
                  {physicsExams.length} {language === 'ar' ? 'نموذج فيزياء' : 'Physics Exams'}
                </span>
                <span className="block text-[11px] text-slate-400 mt-0.5 font-mono">
                  4PH1 & 4SD0 · Paper 1P / 1PR / 2P / 2PR
                </span>
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-emerald-300 transition-colors">
              {language === 'ar'
                ? 'قسم امتحانات الفيزياء (IGCSE Physics)'
                : 'IGCSE Physics Past Papers & Mocks'}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 mt-2.5 leading-relaxed">
              {language === 'ar'
                ? 'يضم 14 امتحاناً تفاعلياً كاملاً لدورتي يونيو ويناير ومايو (2018 – 2021) للورقتين الأولى والثانية (1P, 1PR, 2P, 2PR) ونماذج الجائزة المزدوجة (Double Award 4SD0) مع رسوم الدوائر والمنحنيات والتصحيح الفوري.'
                : 'Complete suite of 14 interactive Physics past papers (June 2018 – June 2021) across Papers 1P, 1PR, 2P, 2PR, and Double Award (4SD0) with SVG circuits, velocity-time graphs, and instant grading.'}
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-4 text-xs text-slate-400">
              <span>June 2018 (1P, 1PR, 2P)</span>
              <span aria-hidden="true">·</span>
              <span>Jan & May 2020 (1P, 1PR, 2P, 2PR)</span>
              <span aria-hidden="true">·</span>
              <span>Jan & Jun 2021 (1P, 2PR, P2)</span>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 group-hover:text-emerald-300 flex items-center gap-2">
              <span>
                {language === 'ar' ? 'دخول قسم امتحانات الفيزياء' : 'Open Physics Exam Bank'}
              </span>
              <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              Prepared by: Mr. Mohammed Hesham
            </span>
          </div>
        </div>

        {/* 2. IGCSE Mathematics Portal Card */}
        <div
          onClick={() => onSelectFeature('math')}
          className="group relative cursor-pointer overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/95 to-indigo-950/30 p-6 sm:p-8 transition-all duration-200 hover:border-indigo-500/70 hover:shadow-xl flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-3 mb-5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-950 border border-indigo-500/40 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Sigma className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-400" />
              </div>
              <div className="text-end tabular-nums">
                <span className="text-xs font-bold text-indigo-400 font-mono">
                  {mathExams.length} {language === 'ar' ? 'نموذج رياضيات' : 'Mathematics Exams'}
                </span>
                <span className="block text-[11px] text-slate-400 mt-0.5 font-mono">
                  4MA1 · Higher (1H/2H) & Foundation (1F/2F)
                </span>
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-indigo-300 transition-colors">
              {language === 'ar'
                ? 'قسم امتحانات الرياضيات (IGCSE Mathematics)'
                : 'IGCSE Mathematics Past Papers (4MA1)'}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 mt-2.5 leading-relaxed">
              {language === 'ar'
                ? 'يضم 17 امتحاناً تفاعلياً شاملاً لمنهج بيرسون إدكسل (4MA1) للمستويين المتقدم (Higher: 1H, 1HR, 2H, 2HR) والأساسي (Foundation: 1F, 1FR, 2F) بالإضافة إلى الموسوعات الشاملة لدورات يونيو 2019، يناير ونوفمبر 2020، ويناير 2021.'
                : 'Includes 17 interactive Edexcel 4MA1 Mathematics exams covering both Higher (1H, 1HR, 2H, 2HR) and Foundation (1F, 1FR, 2F) tiers, plus the complete 97-question January 2020 Mega Suite.'}
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-4 text-xs text-slate-400">
              <span>June 2019 (1F, 1FR, 2F, 1H, 1HR)</span>
              <span aria-hidden="true">·</span>
              <span>Jan & Nov 2020 (1H, 1HR, 2H, 2HR)</span>
              <span aria-hidden="true">·</span>
              <span>Jan 2021 & 4MA1 Master</span>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-400 group-hover:text-indigo-300 flex items-center gap-2">
              <span>
                {language === 'ar' ? 'دخول قسم امتحانات الرياضيات' : 'Open Mathematics Exam Bank'}
              </span>
              <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              Prepared by: Mr. Mohammed Hesham
            </span>
          </div>
        </div>

        {/* 3. Complete Archive by Session & Tier (31 Exams) */}
        <div
          onClick={() => onSelectFeature('archive')}
          className="group relative cursor-pointer overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/95 to-sky-950/30 p-6 sm:p-8 transition-all duration-200 hover:border-sky-500/70 hover:shadow-xl flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-3 mb-5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-950 border border-sky-500/40 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Layers className="w-7 h-7 sm:w-8 sm:h-8 text-sky-400" />
              </div>
              <div className="text-end tabular-nums">
                <span className="text-xs font-bold text-sky-400 font-mono">
                  31 {language === 'ar' ? 'امتحان مصنف' : 'Categorized Exams'}
                </span>
                <span className="block text-[11px] text-slate-400 mt-0.5 font-mono">
                  2018 · 2019 · 2020 · 2021 · 2026
                </span>
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-sky-300 transition-colors">
              {language === 'ar'
                ? 'أرشيف الدورات والسنوات الشامل'
                : 'Complete Past Paper Archive & Filter'}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 mt-2.5 leading-relaxed">
              {language === 'ar'
                ? 'ابحث وفلتر جميع الـ 31 امتحاناً حسب المادة (فيزياء / رياضيات)، دورة الامتحان (يونيو 2018 حتى 2026)، نوع الورقة (Paper 1 / Paper 2 / Regional R)، أو المستوى (Higher / Foundation).'
                : 'Filter and search across all 31 official and revision IGCSE papers by subject, session date, paper code (1P, 2P, 1H, 2H, 1F, 2F), or Regional (R) status.'}
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-4 text-xs text-slate-400">
              <span>{language === 'ar' ? 'فلترة فورية بالسنوات' : 'Instant Session Filtering'}</span>
              <span aria-hidden="true">·</span>
              <span>{language === 'ar' ? 'تشغيل مباشر داخل الصفحة' : 'In-Page Exam Runner'}</span>
              <span aria-hidden="true">·</span>
              <span>{language === 'ar' ? 'وضع ملء الشاشة' : 'Fullscreen Mode'}</span>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs font-bold text-sky-400 group-hover:text-sky-300 flex items-center gap-2">
              <span>
                {language === 'ar' ? 'استعراض الأرشيف الكامل' : 'Explore Complete Archive'}
              </span>
              <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              Prepared by: Mr. Mohammed Hesham
            </span>
          </div>
        </div>

        {/* 4. Scientific & Graphing Calculator + IGCSE Formula Sheet */}
        <div
          onClick={() => onSelectFeature('calculator')}
          className="group relative cursor-pointer overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/95 to-amber-950/30 p-6 sm:p-8 transition-all duration-200 hover:border-amber-500/70 hover:shadow-xl flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-3 mb-5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-950 border border-amber-500/40 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Calculator className="w-7 h-7 sm:w-8 sm:h-8 text-amber-400" />
              </div>
              <div className="text-end tabular-nums">
                <span className="text-xs font-bold text-amber-400 font-mono">
                  {language === 'ar' ? 'أدوات الحل والقوانين' : 'Workstation & Formulas'}
                </span>
                <span className="block text-[11px] text-slate-400 mt-0.5 font-mono">
                  Graphing · Scientific · Physics & Math Sheets
                </span>
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-amber-300 transition-colors">
              {language === 'ar'
                ? 'محطة الحاسبة العلمية وملخص القوانين'
                : 'Scientific Calculator & IGCSE Formula Reference'}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 mt-2.5 leading-relaxed">
              {language === 'ar'
                ? 'حاسبة علمية وبيانية متكاملة لرسم الدوال وحل المعادلات، مرفقة بملخص شامل لقوانين الفيزياء (4PH1) وقوانين الرياضيات (4MA1) المعتمدة في ورقة الامتحان.'
                : 'Integrated graphing and scientific calculator paired with official Pearson Edexcel IGCSE Physics (4PH1) and Mathematics (4MA1) formula sheets and physical constants.'}
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-4 text-xs text-slate-400">
              <span>{language === 'ar' ? 'حاسبة علمية وبيانية' : 'Graphing & Scientific Calc'}</span>
              <span aria-hidden="true">·</span>
              <span>{language === 'ar' ? 'قوانين الفيزياء 4PH1' : '4PH1 Physics Equations'}</span>
              <span aria-hidden="true">·</span>
              <span>{language === 'ar' ? 'قوانين الرياضيات 4MA1' : '4MA1 Math Formulas'}</span>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 group-hover:text-amber-300 flex items-center gap-2">
              <span>
                {language === 'ar' ? 'فتح الحاسبة وملخص القوانين' : 'Open Calculator & Formulas'}
              </span>
              <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              Prepared by: Mr. Mohammed Hesham
            </span>
          </div>
        </div>
      </div>

      {/* Featured Quick-Launch Exams Section */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <span>
                {language === 'ar'
                  ? 'نماذج مختارة للبدء السريع (تفتح مباشرة داخل المنصة)'
                  : 'Featured Quick-Launch Exams (Open Directly In-Page)'}
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {language === 'ar'
                ? 'اضغط على أي امتحان لفتحه فوراً داخل المنصة دون الانتقال لأي رابط خارجي'
                : 'Click any exam card to launch it immediately inside the platform'}
            </p>
          </div>

          <button
            onClick={() => onSelectFeature('archive')}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 transition-colors"
          >
            <span>
              {language === 'ar' ? 'عرض جميع الـ 31 امتحاناً' : 'View All 31 Exams'}
            </span>
            <ArrowIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredExams.map((exam) => {
            const isPhysics = exam.subject === 'physics';
            return (
              <div
                key={exam.id}
                className={`group rounded-2xl border bg-slate-900/90 p-5 flex flex-col justify-between transition-all duration-200 ${
                  isPhysics
                    ? 'border-slate-800 hover:border-emerald-500/60'
                    : 'border-slate-800 hover:border-indigo-500/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3 text-xs tabular-nums">
                    <span
                      className={`font-mono font-bold ${
                        isPhysics ? 'text-emerald-400' : 'text-indigo-400'
                      }`}
                    >
                      {exam.code}
                    </span>
                    <span className="text-slate-400 font-mono">
                      {language === 'ar' ? exam.sessionAr : exam.session} · {exam.durationMinutes}m
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors line-clamp-1">
                    {language === 'ar' ? exam.titleAr : exam.title}
                  </h4>

                  <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed mb-4">
                    {language === 'ar' ? exam.descriptionAr : exam.description}
                  </p>
                </div>

                <button
                  onClick={() => onQuickStartExam(exam)}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-white font-bold text-xs transition-all active:scale-95 whitespace-nowrap shrink-0 ${
                    isPhysics
                      ? 'bg-emerald-600 hover:bg-emerald-500'
                      : 'bg-indigo-600 hover:bg-indigo-500'
                  }`}
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>
                    {language === 'ar' ? 'بدء الامتحان داخل المنصة' : 'Start Exam In-Page'}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Assurance Strip */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            {language === 'ar'
              ? 'جميع الـ 31 امتحاناً لمادتي الفيزياء والرياضيات تعمل مباشرة داخل المنصة مع حفظ التقدم والتصحيح التلقائي.'
              : 'All 31 Physics & Mathematics exams run directly inside the platform with auto-save and instant grading.'}
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono">
          <span className="text-slate-500">Supervisor:</span>
          <span className="text-slate-200 font-bold">Mr. Mohammed Hesham</span>
        </div>
      </div>
    </div>
  );
};
