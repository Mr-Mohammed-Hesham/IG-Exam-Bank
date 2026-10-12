export type SubjectType = 'physics' | 'math';

export type ExamTier = 'Higher' | 'Foundation' | 'Double Award' | 'Comprehensive';

export type ExamSession =
  | 'June 2018'
  | 'June 2019'
  | 'January 2020'
  | 'May 2020'
  | 'November 2020'
  | 'January 2021'
  | 'June 2021'
  | 'Comprehensive Series';

export interface IGExamItem {
  id: string;
  repoName: string;
  subject: SubjectType;
  code: string; // e.g. "4PH1 / 1P", "4MA1 / 1HR", "4SD0 / 1P"
  paperCode: string; // e.g. "1P", "1PR", "2P", "2PR", "1H", "1HR", "2H", "2HR", "1F", "1FR", "2F", "ALL"
  title: string;
  titleAr: string;
  subtitle: string;
  subtitleAr: string;
  description: string;
  descriptionAr: string;
  session: ExamSession;
  sessionAr: string;
  year: number;
  tier: ExamTier;
  tierAr: string;
  durationMinutes: number;
  totalMarks: number;
  questionsCount: number;
  url: string;
  topics: string[];
  topicsAr: string[];
  featured?: boolean;
}
