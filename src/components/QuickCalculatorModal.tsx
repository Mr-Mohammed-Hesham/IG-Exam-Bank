import React, { useState } from 'react';
import { X, Calculator, Atom, Sigma } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface QuickCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickCalculatorModal: React.FC<QuickCalculatorModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const [tab, setTab] = useState<'calc' | 'physics' | 'math'>('calc');
  const [expr, setExpr] = useState('');
  const [result, setResult] = useState<string>('0');

  if (!isOpen) return null;

  const evaluate = (inputStr?: string) => {
    const target = inputStr ?? expr;
    if (!target.trim()) return;
    try {
      const parsed = target
        .replace(/\^/g, '**')
        .replace(/sqrt/gi, 'Math.sqrt')
        .replace(/sin/gi, 'Math.sin')
        .replace(/cos/gi, 'Math.cos')
        .replace(/tan/gi, 'Math.tan')
        .replace(/pi/gi, 'Math.PI');
      if (/[^0-9+\-*/().MathsqrtsincostanPI\s]/.test(parsed)) {
        setResult('Error');
        return;
      }
      // eslint-disable-next-line no-new-func
      const val = new Function(`return (${parsed})`)();
      if (typeof val === 'number' && !isNaN(val) && isFinite(val)) {
        setResult(Number.isInteger(val) ? String(val) : val.toFixed(4).replace(/\.?0+$/, ''));
      } else {
        setResult('Error');
      }
    } catch {
      setResult('Error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">
              {language === 'ar'
                ? 'الحاسبة السريعة وقوانين الامتحان'
                : 'Quick Calculator & Exam Formulas'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sub-tabs */}
        <div className="px-5 pt-3 flex gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setTab('calc')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
              tab === 'calc' ? 'bg-amber-600 text-white' : 'bg-slate-950 text-slate-400'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'حاسبة علمية' : 'Calculator'}</span>
          </button>
          <button
            onClick={() => setTab('physics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
              tab === 'physics' ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-slate-400'
            }`}
          >
            <Atom className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'قوانين الفيزياء' : 'Physics Sheet'}</span>
          </button>
          <button
            onClick={() => setTab('math')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
              tab === 'math' ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-400'
            }`}
          >
            <Sigma className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'قوانين الرياضيات' : 'Math Sheet'}</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 max-h-[70vh] overflow-y-auto">
          {tab === 'calc' && (
            <div className="space-y-3" dir="ltr">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <input
                  type="text"
                  value={expr}
                  onChange={(e) => setExpr(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && evaluate()}
                  placeholder="25 * 9.8 or sqrt(196)"
                  className="w-full bg-transparent text-white font-mono text-base focus:outline-none"
                />
                <div className="text-right text-lg font-black text-amber-400 font-mono mt-1 tabular-nums">
                  = {result}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '^', '+'].map(
                  (k) => (
                    <button
                      key={k}
                      onClick={() => setExpr((p) => p + k)}
                      className="py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-mono font-bold text-sm border border-slate-800"
                    >
                      {k}
                    </button>
                  )
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setExpr('');
                    setResult('0');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  AC
                </button>
                <button
                  onClick={() => evaluate()}
                  className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs"
                >
                  Calculate (=)
                </button>
              </div>
            </div>
          )}

          {tab === 'physics' && (
            <div className="space-y-2 text-xs font-mono" dir="ltr">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-emerald-300">
                v = s / t &nbsp;|&nbsp; a = (v - u) / t &nbsp;|&nbsp; v² = u² + 2as
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-emerald-300">
                F = m × a &nbsp;|&nbsp; W = m × g &nbsp;|&nbsp; p = m × v &nbsp;|&nbsp; Moment = F × d
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-emerald-300">
                KE = ½mv² &nbsp;|&nbsp; GPE = mgh &nbsp;|&nbsp; Work = F × d &nbsp;|&nbsp; P = E / t
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-emerald-300">
                Q = I × t &nbsp;|&nbsp; V = I × R &nbsp;|&nbsp; P = I × V &nbsp;|&nbsp; v = f × λ
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-emerald-300">
                ρ = m / V &nbsp;|&nbsp; P = F / A &nbsp;|&nbsp; P = hρg &nbsp;|&nbsp; P₁V₁ = P₂V₂
              </div>
            </div>
          )}

          {tab === 'math' && (
            <div className="space-y-2 text-xs font-mono" dir="ltr">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-indigo-300">
                x = [-b ± √(b² - 4ac)] / 2a
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-indigo-300">
                uₙ = a + (n - 1)d &nbsp;|&nbsp; Sₙ = (n/2)[2a + (n - 1)d]
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-indigo-300">
                a / sin(A) = b / sin(B) &nbsp;|&nbsp; a² = b² + c² - 2bc cos(A)
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-indigo-300">
                Area = ½ ab sin(C) &nbsp;|&nbsp; V_sphere = (4/3)πr³ &nbsp;|&nbsp; V_cone = (1/3)πr²h
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
