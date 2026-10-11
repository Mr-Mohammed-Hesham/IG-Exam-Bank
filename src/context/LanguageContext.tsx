import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ar' | 'en';

interface Translations {
  appTitle: string;
  appBadge: string;
  appSubtitle: string;
  tabHome: string;
  tabPhysics: string;
  tabMath: string;
  tabAllArchive: string;
  tabCalculator: string;
  btnCalculatorPopup: string;
  btnLangToggle: string;
  loadingText: string;
  loadingSubtext: string;
  backToCatalog: string;
  reloadExam: string;
  fullscreenToggle: string;
  footerDevTitle: string;
  footerPlatformDesc: string;
  footerAllRightsReserved: string;
}

const translations: Record<Language, Translations> = {
  ar: {
    appTitle: 'منصة 4U لامتحانات IG Edexcel',
    appBadge: 'Physics & Math (9-1)',
    appSubtitle: 'بوابة الامتحانات التفاعلية الشاملة لمادتي الفيزياء (4PH1/4SD0) والرياضيات (4MA1) — إعداد Mr. Mohammed Hesham',
    tabHome: 'الرئيسية',
    tabPhysics: 'امتحانات الفيزياء (Physics)',
    tabMath: 'امتحانات الرياضيات (Math)',
    tabAllArchive: 'أرشيف السنوات الشامل (31)',
    tabCalculator: 'الحاسبة والقوانين',
    btnCalculatorPopup: 'الحاسبة العلمية',
    btnLangToggle: 'English',
    loadingText: 'جاري التحميل',
    loadingSubtext: 'يرجى الانتظار لحظات بينما يتم تجهيز نموذج الامتحان التفاعلي داخل المنصة...',
    backToCatalog: 'العودة لقائمة الامتحانات',
    reloadExam: 'إعادة تحميل الامتحان',
    fullscreenToggle: 'ملء الشاشة',
    footerDevTitle: 'إعداد وتطوير:',
    footerPlatformDesc: 'منصة 4U التفاعلية لامتحانات Pearson Edexcel International GCSE (الفيزياء والرياضيات)',
    footerAllRightsReserved: 'جميع الحقوق محفوظة',
  },
  en: {
    appTitle: '4U IGCSE Edexcel Exam Platform',
    appBadge: 'Physics & Math (9-1)',
    appSubtitle: 'Comprehensive Interactive Past Papers for IGCSE Physics (4PH1/4SD0) & Mathematics (4MA1) — By Mr. Mohammed Hesham',
    tabHome: 'Home',
    tabPhysics: 'Physics Exams (4PH1)',
    tabMath: 'Mathematics Exams (4MA1)',
    tabAllArchive: 'Complete Archive (31)',
    tabCalculator: 'Calculator & Formulas',
    btnCalculatorPopup: 'Scientific Calc',
    btnLangToggle: 'عربي',
    loadingText: 'جاري التحميل',
    loadingSubtext: 'Please wait a moment while the interactive exam paper loads inside the platform...',
    backToCatalog: 'Back to Exam List',
    reloadExam: 'Reload Exam',
    fullscreenToggle: 'Fullscreen Mode',
    footerDevTitle: 'Prepared & Developed by:',
    footerPlatformDesc: '4U Interactive Portal for Pearson Edexcel International GCSE (Physics & Mathematics)',
    footerAllRightsReserved: 'All Rights Reserved',
  },
};

interface LanguageContextType {
  language: Language;
  t: Translations;
  toggleLanguage: () => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar');

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        t: translations[language],
        toggleLanguage,
        isRTL: language === 'ar',
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
