import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  Calculator,
  RotateCcw,
  Trash2,
  Plus,
  ZoomIn,
  ZoomOut,
  ArrowRight,
  ArrowLeft,
  Atom,
  Sigma,
  Activity,
} from 'lucide-react';

interface PlotFunction {
  id: string;
  expr: string;
  color: string;
  visible: boolean;
  label?: string;
}

const COLOR_PALETTE = ['#38bdf8', '#f43f5e', '#10b981', '#fbbf24', '#a855f7', '#06b6d4'];

interface CalculatorWorkstationProps {
  onBackToHome: () => void;
}

export const CalculatorWorkstation: React.FC<CalculatorWorkstationProps> = ({ onBackToHome }) => {
  const { language, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState<'scientific' | 'graph' | 'physics-formulas' | 'math-formulas'>('scientific');

  // Graphing state
  const [functions, setFunctions] = useState<PlotFunction[]>([
    { id: '1', expr: '2*x + 3', color: '#38bdf8', visible: true, label: 'y = 2x + 3' },
    { id: '2', expr: 'x^2 - 4*x + 1', color: '#10b981', visible: true, label: 'y = x² - 4x + 1' },
  ]);
  const [newExpr, setNewExpr] = useState('');
  const [origin, setOrigin] = useState<{ x: number; y: number }>({ x: 350, y: 240 });
  const [scale, setScale] = useState<number>(35);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoverCoord, setHoverCoord] = useState<{ mathX: number; mathY: number } | null>(null);

  // Scientific calculator state
  const [calcInput, setCalcInput] = useState('');
  const [calcResult, setCalcResult] = useState<string | null>(null);
  const [calcHistory, setCalcHistory] = useState<{ expr: string; res: string }[]>([
    { expr: '(2 * 9.8 * 15)^0.5', res: '17.1464' },
    { expr: '(-(-5) + sqrt(25 - 4*1*6)) / 2', res: '3' },
  ]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const evaluateMath = useCallback((exprStr: string, xVal: number): number | null => {
    try {
      const parsed = exprStr
        .replace(/(\d)x/gi, '$1*x')
        .replace(/x/gi, `(${xVal})`)
        .replace(/\^/g, '**')
        .replace(/sqrt/gi, 'Math.sqrt')
        .replace(/sin/gi, 'Math.sin')
        .replace(/cos/gi, 'Math.cos')
        .replace(/tan/gi, 'Math.tan')
        .replace(/abs/gi, 'Math.abs')
        .replace(/pi/gi, 'Math.PI')
        .replace(/e/gi, 'Math.E');
      if (/[^0-9+\-*/().MathsqrtsincostanabsPIE\s]/.test(parsed)) return null;
      // eslint-disable-next-line no-new-func
      const result = new Function(`return (${parsed})`)();
      if (typeof result === 'number' && !isNaN(result) && isFinite(result)) return result;
      return null;
    } catch {
      return null;
    }
  }, []);

  const drawGraph = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, width, height);

    const ox = origin.x;
    const oy = origin.y;

    // Grid lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    const step = scale;

    for (let x = ox % step; x < width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = oy % step; y < height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, oy);
    ctx.lineTo(width, oy);
    ctx.moveTo(ox, 0);
    ctx.lineTo(ox, height);
    ctx.stroke();

    // Plot functions
    functions.forEach((fn) => {
      if (!fn.visible) return;
      ctx.strokeStyle = fn.color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      let started = false;
      for (let px = 0; px < width; px += 2) {
        const mathX = (px - ox) / scale;
        const mathY = evaluateMath(fn.expr, mathX);
        if (mathY !== null) {
          const py = oy - mathY * scale;
          if (py >= -100 && py <= height + 100) {
            if (!started) {
              ctx.moveTo(px, py);
              started = true;
            } else {
              ctx.lineTo(px, py);
            }
          } else {
            started = false;
          }
        } else {
          started = false;
        }
      }
      ctx.stroke();
    });
  }, [functions, origin, scale, evaluateMath]);

  useEffect(() => {
    if (activeTab === 'graph') {
      drawGraph();
    }
  }, [activeTab, drawGraph]);

  const handleAddFunction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpr.trim()) return;
    const color = COLOR_PALETTE[functions.length % COLOR_PALETTE.length];
    setFunctions((prev) => [
      ...prev,
      { id: String(Date.now()), expr: newExpr.trim(), color, visible: true },
    ]);
    setNewExpr('');
  };

  const handleRunScientific = (exprToRun?: string) => {
    const target = exprToRun ?? calcInput;
    if (!target.trim()) return;
    const val = evaluateMath(target, 0);
    if (val !== null) {
      const formatted = Number.isInteger(val) ? String(val) : val.toFixed(4).replace(/\.?0+$/, '');
      setCalcResult(formatted);
      setCalcHistory((prev) => [{ expr: target, res: formatted }, ...prev.slice(0, 9)]);
    } else {
      setCalcResult('Syntax Error');
    }
  };

  const appendCalcToken = (token: string) => {
    setCalcInput((prev) => prev + token);
  };

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  const physicsFormulas = [
    {
      categoryAr: '1. الحركة والقوى (Forces & Motion)',
      categoryEn: '1. Forces & Motion',
      items: [
        { nameAr: 'السرعة المتوسطة', nameEn: 'Average Speed', eq: 'v = s / t' },
        { nameAr: 'العجلة (التسارع)', nameEn: 'Acceleration', eq: 'a = (v - u) / t' },
        { nameAr: 'معادلة الحركة النهائية', nameEn: 'Final Velocity Squared', eq: 'v² = u² + 2as' },
        { nameAr: 'القوة المحصلة (قانون نيوتن الثاني)', nameEn: 'Resultant Force', eq: 'F = m × a' },
        { nameAr: 'الوزن والجاذبية', nameEn: 'Weight', eq: 'W = m × g   (g ≈ 10 N/kg)' },
        { nameAr: 'كمية التحرك (الزخم)', nameEn: 'Momentum', eq: 'p = m × v' },
        { nameAr: 'العزم حول نقطة', nameEn: 'Moment of a Force', eq: 'Moment = F × d' },
      ],
    },
    {
      categoryAr: '2. الطاقة والشغل والقدرة (Energy & Power)',
      categoryEn: '2. Energy, Work & Power',
      items: [
        { nameAr: 'الشغل المبذول', nameEn: 'Work Done', eq: 'W = F × d' },
        { nameAr: 'طاقة الوضع الجاذبية', nameEn: 'Gravitational Potential Energy', eq: 'GPE = m × g × h' },
        { nameAr: 'طاقة الحركة', nameEn: 'Kinetic Energy', eq: 'KE = ½ × m × v²' },
        { nameAr: 'القدرة والكفاءة', nameEn: 'Power & Efficiency', eq: 'P = W / t  |  Eff = (Useful / Total) × 100%' },
      ],
    },
    {
      categoryAr: '3. الكهرباء والموجات (Electricity & Waves)',
      categoryEn: '3. Electricity & Waves',
      items: [
        { nameAr: 'الشحنة والتيار الكهربائي', nameEn: 'Charge & Current', eq: 'Q = I × t' },
        { nameAr: 'قانون أوم (الجهد والمقاومة)', nameEn: "Ohm's Law", eq: 'V = I × R' },
        { nameAr: 'القدرة الكهربائية والطاقة', nameEn: 'Electrical Power & Energy', eq: 'P = I × V  |  E = I × V × t' },
        { nameAr: 'سرعة الموجة', nameEn: 'Wave Speed', eq: 'v = f × λ' },
        { nameAr: 'قانون سنيل للانكسار', nameEn: 'Refractive Index', eq: 'n = sin(i) / sin(r)  |  sin(c) = 1 / n' },
      ],
    },
    {
      categoryAr: '4. المادة والغازات والمحولات (Thermal & Transformers)',
      categoryEn: '4. Matter, Gases & Transformers',
      items: [
        { nameAr: 'الكثافة والضغط', nameEn: 'Density & Pressure', eq: 'ρ = m / V  |  P = F / A  |  P = h × ρ × g' },
        { nameAr: 'قانون بويل والغازات', nameEn: "Boyle's & Pressure Law", eq: 'P₁V₁ = P₂V₂  |  P₁ / T₁ = P₂ / T₂' },
        { nameAr: 'الطاقة الحرارية النوعية', nameEn: 'Specific Heat Capacity', eq: 'ΔQ = m × c × ΔT' },
        { nameAr: 'معادلة المحول الكهربائي', nameEn: 'Transformer Equation', eq: 'Vp / Vs = Np / Ns  |  Vp × Ip = Vs × Is' },
      ],
    },
  ];

  const mathFormulas = [
    {
      categoryAr: '1. الجبر والمتتابعات (Algebra & Sequences)',
      categoryEn: '1. Algebra & Sequences',
      items: [
        { nameAr: 'القانون العام للمعادلة التربيعية', nameEn: 'Quadratic Formula', eq: 'x = [-b ± √(b² - 4ac)] / 2a' },
        { nameAr: 'الحد النوني للمتتابعة الحسابية', nameEn: 'Arithmetic Sequence', eq: 'uₙ = a + (n - 1)d' },
        { nameAr: 'مجموع المتتابعة الحسابية', nameEn: 'Sum of Arithmetic Series', eq: 'Sₙ = (n / 2)[2a + (n - 1)d]' },
        { nameAr: 'الفائدة المركبة والإهلاك', nameEn: 'Compound Interest / Depreciation', eq: 'A = P(1 ± r/100)ⁿ' },
      ],
    },
    {
      categoryAr: '2. حساب المثلثات والهندسة (Trigonometry & Geometry)',
      categoryEn: '2. Trigonometry & Geometry',
      items: [
        { nameAr: 'نظرية فيثاغورس', nameEn: "Pythagoras' Theorem", eq: 'a² + b² = c²' },
        { nameAr: 'قاعدة الجيب (Sine Rule)', nameEn: 'Sine Rule', eq: 'a / sin(A) = b / sin(B) = c / sin(C)' },
        { nameAr: 'قاعدة جيب التمام (Cosine Rule)', nameEn: 'Cosine Rule', eq: 'a² = b² + c² - 2bc cos(A)' },
        { nameAr: 'مساحة المثلث', nameEn: 'Area of Triangle', eq: 'Area = ½ ab sin(C)' },
        { nameAr: 'مجموع زوايا المضلع', nameEn: 'Polygon Interior Angles', eq: 'Sum = (n - 2) × 180°  |  Exterior = 360°' },
      ],
    },
    {
      categoryAr: '3. الحجوم والمساحات والتفاضل (Mensuration & Calculus)',
      categoryEn: '3. Volumes, Areas & Calculus',
      items: [
        { nameAr: 'الكرة (الحجم والمساحة السطحية)', nameEn: 'Sphere Volume & Area', eq: 'V = (4/3)πr³  |  A = 4πr²' },
        { nameAr: 'المخروط والأسطوانة', nameEn: 'Cone & Cylinder', eq: 'V_cone = (1/3)πr²h  |  A_curved = πrl' },
        { nameAr: 'مشتقة الدالة كثيرة الحدود', nameEn: 'Differentiation Power Rule', eq: 'y = axⁿ  ⇒  dy/dx = n·a·xⁿ⁻¹' },
        { nameAr: 'السرعة والعجلة بالتفاضل', nameEn: 'Kinematics Calculus', eq: 'v = ds/dt  |  a = dv/dt' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 active:scale-95 whitespace-nowrap shrink-0"
          >
            <BackIcon className="w-4 h-4 text-amber-400" />
            <span>{language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}</span>
          </button>

          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">
              {language === 'ar'
                ? 'محطة الحاسبة العلمية وملخص قوانين IG (Physics & Math)'
                : 'IGCSE Scientific Calculator & Formula Reference Station'}
            </h2>
            <p className="text-xs text-slate-400">
              {language === 'ar'
                ? 'حاسبة علمية وبيانية متطورة مع أوراق القوانين المعتمدة لمنهجي الفيزياء (4PH1) والرياضيات (4MA1)'
                : 'Scientific & graphing calculator with official Pearson Edexcel Physics (4PH1) and Mathematics (4MA1) formula sheets'}
            </p>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="flex flex-wrap items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs gap-1">
          <button
            onClick={() => setActiveTab('scientific')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'scientific'
                ? 'bg-amber-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'الحاسبة العلمية' : 'Scientific Calc'}</span>
          </button>

          <button
            onClick={() => setActiveTab('graph')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'graph'
                ? 'bg-sky-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'الرسم البياني' : 'Graphing Plotter'}</span>
          </button>

          <button
            onClick={() => setActiveTab('physics-formulas')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'physics-formulas'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Atom className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'قوانين الفيزياء (4PH1)' : 'Physics Formulas'}</span>
          </button>

          <button
            onClick={() => setActiveTab('math-formulas')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'math-formulas'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sigma className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'قوانين الرياضيات (4MA1)' : 'Math Formulas'}</span>
          </button>
        </div>
      </div>

      {/* 1. Scientific Calculator Tab */}
      {activeTab === 'scientific' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2" dir="ltr">
              <input
                type="text"
                value={calcInput}
                onChange={(e) => setCalcInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRunScientific()}
                placeholder="e.g. (2 * 9.8 * 15)^0.5 or sin(0.5) + sqrt(144)"
                className="w-full bg-transparent text-white font-mono text-lg focus:outline-none"
              />
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <span className="text-xs text-slate-500 font-mono">Result:</span>
                <span className="text-xl font-black text-amber-400 font-mono tabular-nums">
                  {calcResult ?? '0'}
                </span>
              </div>
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-5 gap-2" dir="ltr">
              {[
                '7', '8', '9', '(', ')',
                '4', '5', '6', '*', '/',
                '1', '2', '3', '+', '-',
                '0', '.', '^', 'sqrt(', 'pi',
                'sin(', 'cos(', 'tan(', 'abs(', 'e',
              ].map((btn) => (
                <button
                  key={btn}
                  onClick={() => appendCalcToken(btn)}
                  className="py-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-200 font-mono font-bold text-sm border border-slate-800 transition-colors active:scale-95"
                >
                  {btn}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-2" dir="ltr">
              <button
                onClick={() => {
                  setCalcInput('');
                  setCalcResult(null);
                }}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
              >
                CLEAR (AC)
              </button>
              <button
                onClick={() => handleRunScientific()}
                className="flex-1 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-sm shadow-lg transition-colors"
              >
                CALCULATE (=)
              </button>
            </div>
          </div>

          {/* Calculation History */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white">
              {language === 'ar' ? 'سجل العمليات الحسابية' : 'Calculation History'}
            </h3>
            <div className="space-y-2" dir="ltr">
              {calcHistory.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setCalcInput(item.expr);
                    setCalcResult(item.res);
                  }}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-amber-500/50 cursor-pointer flex items-center justify-between text-xs font-mono"
                >
                  <span className="text-slate-300 truncate max-w-[180px]">{item.expr}</span>
                  <span className="text-amber-400 font-bold tabular-nums">= {item.res}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Interactive Function Grapher */}
      {activeTab === 'graph' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white">
              {language === 'ar' ? 'إضافة دالة رياضية y = f(x)' : 'Add Function y = f(x)'}
            </h3>

            <form onSubmit={handleAddFunction} className="flex gap-2" dir="ltr">
              <input
                type="text"
                value={newExpr}
                onChange={(e) => setNewExpr(e.target.value)}
                placeholder="e.g. x^2 - 4 or sin(x)*3"
                className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>Plot</span>
              </button>
            </form>

            <div className="space-y-2" dir="ltr">
              {functions.map((fn) => (
                <div
                  key={fn.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: fn.color }}
                    />
                    <span className="text-xs font-mono text-white">y = {fn.expr}</span>
                  </div>
                  <button
                    onClick={() => setFunctions((prev) => prev.filter((f) => f.id !== fn.id))}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setScale((s) => Math.min(s + 10, 100))}
                className="flex-1 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center justify-center gap-1 hover:bg-slate-800"
              >
                <ZoomIn className="w-3.5 h-3.5" />
                <span>Zoom In</span>
              </button>
              <button
                onClick={() => setScale((s) => Math.max(s - 10, 15))}
                className="flex-1 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center justify-center gap-1 hover:bg-slate-800"
              >
                <ZoomOut className="w-3.5 h-3.5" />
                <span>Zoom Out</span>
              </button>
              <button
                onClick={() => {
                  setOrigin({ x: 350, y: 240 });
                  setScale(35);
                }}
                className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden relative flex flex-col">
            <canvas
              ref={canvasRef}
              width={700}
              height={480}
              onMouseDown={(e) => {
                setIsDragging(true);
                setDragStart({ x: e.clientX - origin.x, y: e.clientY - origin.y });
              }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const px = ((e.clientX - rect.left) / rect.width) * 700;
                const py = ((e.clientY - rect.top) / rect.height) * 480;
                setHoverCoord({
                  mathX: (px - origin.x) / scale,
                  mathY: (origin.y - py) / scale,
                });
                if (isDragging) {
                  setOrigin({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
                }
              }}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => {
                setIsDragging(false);
                setHoverCoord(null);
              }}
              className="w-full h-[460px] cursor-crosshair block"
            />
            {hoverCoord && (
              <div
                className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700 text-xs font-mono text-sky-300 tabular-nums"
                dir="ltr"
              >
                x: {hoverCoord.mathX.toFixed(2)}, y: {hoverCoord.mathY.toFixed(2)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. IGCSE Physics Formula Sheet (4PH1 / 4SD0) */}
      {activeTab === 'physics-formulas' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {physicsFormulas.map((group, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-emerald-400">
                {language === 'ar' ? group.categoryAr : group.categoryEn}
              </h3>
              <div className="space-y-2">
                {group.items.map((item, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <span className="text-xs text-slate-300 font-medium">
                      {language === 'ar' ? item.nameAr : item.nameEn}
                    </span>
                    <span
                      className="text-xs font-mono font-bold text-emerald-300 bg-emerald-950/50 px-2.5 py-1 rounded-lg border border-emerald-800/50"
                      dir="ltr"
                    >
                      {item.eq}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. IGCSE Mathematics Formula Sheet (4MA1) */}
      {activeTab === 'math-formulas' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mathFormulas.map((group, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-indigo-400">
                {language === 'ar' ? group.categoryAr : group.categoryEn}
              </h3>
              <div className="space-y-2">
                {group.items.map((item, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5"
                  >
                    <div className="text-xs text-slate-300 font-medium">
                      {language === 'ar' ? item.nameAr : item.nameEn}
                    </div>
                    <div
                      className="text-xs font-mono font-bold text-indigo-300 bg-indigo-950/50 px-2.5 py-1.5 rounded-lg border border-indigo-800/50 text-center"
                      dir="ltr"
                    >
                      {item.eq}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
