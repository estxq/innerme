"use client";
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const COUNTRY_CODES = [
  { code: "+65", flag: "🇸🇬", name: "Singapore" },
  { code: "+60", flag: "🇲🇾", name: "Malaysia" },
  { code: "+62", flag: "🇮🇩", name: "Indonesia" },
  { code: "+63", flag: "🇵🇭", name: "Philippines" },
  { code: "+66", flag: "🇹🇭", name: "Thailand" },
  { code: "+84", flag: "🇻🇳", name: "Vietnam" },
  { code: "+95", flag: "🇲🇲", name: "Myanmar" },
  { code: "+855", flag: "🇰🇭", name: "Cambodia" },
  { code: "+856", flag: "🇱🇦", name: "Laos" },
  { code: "+673", flag: "🇧🇳", name: "Brunei" },
  { code: "+86", flag: "🇨🇳", name: "China" },
  { code: "+852", flag: "🇭🇰", name: "Hong Kong" },
  { code: "+853", flag: "🇲🇴", name: "Macau" },
  { code: "+886", flag: "🇹🇼", name: "Taiwan" },
  { code: "+81", flag: "🇯🇵", name: "Japan" },
  { code: "+82", flag: "🇰🇷", name: "South Korea" },
  { code: "+91", flag: "🇮🇳", name: "India" },
  { code: "+44", flag: "🇬🇧", name: "United Kingdom" },
  { code: "+1", flag: "🇺🇸", name: "United States" },
  { code: "+61", flag: "🇦🇺", name: "Australia" },
  { code: "+64", flag: "🇳🇿", name: "New Zealand" },
  { code: "+49", flag: "🇩🇪", name: "Germany" },
  { code: "+33", flag: "🇫🇷", name: "France" },
  { code: "+971", flag: "🇦🇪", name: "UAE" },
];

function CountryPicker({ value, onChange }: { value: string; onChange: (code: string) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const selected = COUNTRY_CODES.find(c => c.code === value) ?? COUNTRY_CODES[0];
  const filtered = COUNTRY_CODES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.code.includes(search)
  );
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);
  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
    else setSearch("");
  }, [open]);
  return (
    <div ref={ref} className="relative shrink-0">
      <button type="button" onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 text-sm font-light text-[#0f172a] focus:outline-none">
        <span className="text-base leading-none">{selected.flag}</span>
        <span>{selected.code}</span>
        <svg className={`w-3 h-3 text-[#9a9490] transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 12 12">
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 top-8 z-50 w-64 bg-[#FAF8F5] border border-[#e8e4df] shadow-lg">
          <div className="flex items-center gap-2 px-3 py-2.5 border-b border-[#e8e4df]">
            <svg className="w-3 h-3 text-[#9a9490] shrink-0" fill="none" viewBox="0 0 16 16">
              <circle cx="6.5" cy="6.5" r="4" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M10 10l3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <input ref={searchRef} type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search country..."
              className="bg-transparent text-xs text-[#0f172a] placeholder:text-[#c0bbb5] focus:outline-none w-full font-light"/>
          </div>
          <ul className="max-h-52 overflow-y-auto">
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-xs text-[#9a9490]">No results</li>
            ) : filtered.map(c => (
              <li key={c.code}>
                <button type="button" onClick={() => { onChange(c.code); setOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-[#f0ece8] transition-colors duration-150 ${c.code === value ? "bg-[#f0ece8]" : ""}`}>
                  <span className="text-base leading-none">{c.flag}</span>
                  <span className="flex-1 text-xs text-[#0f172a] font-light">{c.name}</span>
                  <span className="text-xs text-[#9a9490]">{c.code}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyaBDJ8He8DH-jDQl0kDFa3sNYmYJ8_gFj2MA-ZDmh0sg9VvlehpP4Ti7LZpksq1lOR5w/exec";

const quizData = [
  { q: "What is your age range?", opts: ["18–24", "25–34", "35–44", "45+"] },
  { q: "When you receive extra money...", opts: ["Save most of it", "Spend some, enjoy some", "Invest immediately", "Forget where it went"] },
  { q: "Your biggest financial fear is...", opts: ["Not enough savings", "Losing freedom", "Medical emergencies", "Being stuck working forever"] },
  { q: "You view money as...", opts: ["Security", "Freedom", "Growth", "Stress"] },
  { q: "When it comes to planning...", opts: ["I plan everything", "I roughly estimate", "I just wing it", "I avoid thinking about it"] },
  { q: "When you think about retirement...", opts: ["I already started planning", "I know I should but haven't", "I prefer enjoying life now first", "It feels too far away to think about"] },
  { q: "If you suddenly lose your main income tomorrow...", opts: ["I'll be okay for quite a while", "I'll survive but need adjustments", "I'll panic quite fast", "Please don't manifest this"] },
  { q: "What best describes your investing style?", opts: ["Safe & steady", "Balanced approach", "Higher risk for higher growth", "I don't really understand investing"] },
  { q: "Which statement sounds most like you?", opts: ["I want peace of mind.", "I want freedom & flexibility.", "I want my money to grow aggressively.", "I just don't want financial stress."] },
  { q: "How do you usually make financial decisions?", opts: ["Research & compare carefully", "Ask trusted people", "Follow opportunities quickly", "Delay until really necessary"] },
];

const letters = ["A", "B", "C", "D"];
const pointValues: Record<string, number> = { A: 3, B: 2, C: 4, D: 1 };

type PersonalityKey = "protector" | "lifestyle" | "wealth" | "avoider" | "architect";

const personalities: Record<PersonalityKey, {
  name: string; subtitle: string; color: string; accent: string;
  financialAge: string; desc: string;
  strengths: string[]; blindspots: string[]; nextLevel: string[];
  figurineSrc: string;
}> = {
  protector: {
    name: "The Protector", subtitle: "You value stability, security and peace of mind.",
    color: "#1a2744", accent: "#c8a96e", financialAge: "Financial Guardian",
    desc: "You value stability, security and peace of mind. Money, to you, is about protection. Having enough cushion so nothing can catch you off guard.",
    strengths: ["Responsible with money", "Thinks ahead", "Values protection & preparedness", "Financially cautious"],
    blindspots: ["May over-save and under-invest", "Fear of risk may slow wealth growth", "Inflation may quietly erode savings"],
    nextLevel: ["Wealth optimisation", "Passive income building", "Long-term investment growth"],
    figurineSrc: "/protector.png",
  },
  lifestyle: {
    name: "The Lifestyle Builder", subtitle: "You believe money should improve life, not just sit untouched.",
    color: "#6b3a4d", accent: "#c8a96e", financialAge: "Financial Explorer",
    desc: "You believe money should improve life, not just sit untouched. You spend with intention and want your finances to support the life you actually want to live.",
    strengths: ["Enjoys experiences & freedom", "Emotionally generous", "Understands work-life balance", "Values flexibility"],
    blindspots: ["May underestimate long-term planning", "Lifestyle inflation can happen easily", "Financial structure may be inconsistent"],
    nextLevel: ["Stronger financial systems", "Consistent investing habits", "Future income planning"],
    figurineSrc: "/lifestyle.png",
  },
  wealth: {
    name: "The Wealth Builder", subtitle: "You are growth-oriented and future-focused.",
    color: "#1e3a5f", accent: "#c8a96e", financialAge: "Financial Builder",
    desc: "You are growth-oriented and future-focused. You're always looking for the next opportunity to put your money to work and build toward something bigger.",
    strengths: ["Strategic thinker", "Long-term mindset", "Wants money to work harder", "Open to opportunities & investments"],
    blindspots: ["May focus heavily on accumulation", "Sometimes overlooks protection", "Can become overly aggressive or impatient"],
    nextLevel: ["Wealth preservation", "Diversification", "Lifetime income planning"],
    figurineSrc: "/wealthbuilder.png",
  },
  avoider: {
    name: "The Avoider", subtitle: "You know finances matter — but it feels overwhelming.",
    color: "#3d2c4e", accent: "#c8a96e", financialAge: "Financial Baby",
    desc: "You know finances matter, but sometimes it feels overwhelming. It's not that you don't care — it's that it's hard to know where to even start.",
    strengths: ["Aware there's room to improve", "Emotionally driven", "Open to guidance", "Wants stability deep down"],
    blindspots: ["Avoiding planning creates future stress", "Delaying decisions can become expensive", "Often reactive instead of proactive"],
    nextLevel: ["Build simple systems", "Improve financial confidence", "Start with small consistent actions"],
    figurineSrc: "/Avoider.png",
  },
  architect: {
    name: "The Financial Architect", subtitle: "You don't just earn money — you design your future.",
    color: "#0f172a", accent: "#c8a96e", financialAge: "Financial Architect",
    desc: "You don't just earn money — you intentionally design your future. You think in systems, plan in decades, and treat money as a tool for the life and legacy you want to build.",
    strengths: ["Strategic & disciplined", "Long-term visionary", "Financially proactive", "Understands wealth systems"],
    blindspots: ["Can become overly focused on goals", "May struggle to slow down & enjoy the process"],
    nextLevel: ["Legacy planning", "Advanced wealth structuring", "Multi-generational planning"],
    figurineSrc: "/architect.png",
  },
};

function getResult(answers: Record<number, string>) {
  const counts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
  let score = 0;
  Object.values(answers).forEach((a) => { counts[a]++; score += pointValues[a]; });
  let tier: PersonalityKey;
  if (score <= 15) tier = "avoider";
  else if (score <= 21) tier = "lifestyle";
  else if (score <= 27) tier = "protector";
  else if (score <= 33) tier = "wealth";
  else tier = "architect";
  return { counts, score, tier };
}

type Stage = "intro" | "quiz" | "gate" | "result";

const slideVariants = {
  enter: { opacity: 0, y: 40 },
  center: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
  exit: { opacity: 0, y: -30, transition: { duration: 0.35, ease: "easeIn" as const } },
};

export default function QuizPage() {
  const [stage, setStage] = useState<Stage>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+65");
  const [error, setError] = useState(false);
  const [result, setResult] = useState<PersonalityKey | null>(null);
  const [direction, setDirection] = useState(1);
  const [showAdmin, setShowAdmin] = useState(false);
  const [leads, setLeads] = useState<object[]>(() => {
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem("quiz_leads") || "[]");
  });

  const answered = Object.keys(answers).length;
  const progress = stage === "quiz" ? (currentQ / quizData.length) : stage === "gate" ? 1 : 0;

  function startQuiz() {
    setDirection(1);
    setStage("quiz");
    setCurrentQ(0);
    setSelected(null);
  }

  function handleOptionSelect(letter: string) {
    if (selected) return;
    setSelected(letter);
    setTimeout(() => {
      const newAnswers = { ...answers, [currentQ]: letter };
      setAnswers(newAnswers);
      setSelected(null);
      if (currentQ + 1 >= quizData.length) {
        setDirection(1);
        setStage("gate");
      } else {
        setDirection(1);
        setCurrentQ(currentQ + 1);
      }
    }, 420);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) { setError(true); return; }
    setError(false);

    const { counts, score, tier } = getResult(answers);
    const p = personalities[tier];
    const lead = { name, phone, type: p.name, time: new Date().toLocaleString(), counts, score };

    const updated = [...leads, lead];
    setLeads(updated);
    localStorage.setItem("quiz_leads", JSON.stringify(updated));

    fetch(GOOGLE_SCRIPT_URL, {
      method: "POST", mode: "no-cors",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ name, phone: `${countryCode.replace(/^\+/, "")} ${phone}`, result: p.name, source: "quiz" }),
    }).catch(() => {});

    setResult(tier);
    setDirection(1);
    setStage("result");
  }

  const p = result ? personalities[result] : null;

  return (
    <div className="relative min-h-[calc(100dvh-57px)] bg-[#FAF8F5] flex flex-col"
      style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@300;400;500&display=swap');
        .serif { font-family: 'Playfair Display', Georgia, serif; }
        .option-item { border-bottom: 1px solid #e8e4df; }
        .option-item:last-child { border-bottom: none; }
        .option-item:hover .option-text { transform: translateX(8px); }
        .option-item.option-selected { background: #0f172a; color: #fff; }
        .option-item.option-selected .option-num { color: #c8a96e; }
      `}</style>

      {/* Progress bar */}
      {(stage === "quiz" || stage === "gate") && (
        <div className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-[#e8e4df]">
          <motion.div className="h-full bg-[#0f172a]"
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }} />
        </div>
      )}

      {/* Step counter */}
      {stage === "quiz" && (
        <div className="fixed top-4 right-6 z-40 text-xs tracking-[0.15em] text-[#9a9490] font-light">
          {String(currentQ + 1).padStart(2, "0")} / {String(quizData.length).padStart(2, "0")}
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <AnimatePresence mode="wait" custom={direction}>

          {/* INTRO */}
          {stage === "intro" && (
            <motion.div key="intro" variants={slideVariants} initial="enter" animate="center" exit="exit"
              className="max-w-xl w-full text-center">
              <p className="text-xs tracking-[0.25em] text-[#9a9490] uppercase mb-6">Financial Personality Quiz</p>
              <h1 className="serif text-[clamp(2.4rem,6vw,4rem)] leading-[1.15] text-[#0f172a] mb-6">
                What&apos;s your<br /><em>financial personality?</em>
              </h1>
              <p className="text-[#9a9490] text-base font-light leading-relaxed mb-10 max-w-sm mx-auto">
                10 honest questions. No right or wrong answers.<br />
                Discover how you truly relate to money.
              </p>
              <button onClick={startQuiz}
                className="inline-flex items-center gap-3 bg-[#0f172a] text-[#FAF8F5] px-8 py-4 text-sm tracking-[0.12em] uppercase hover:bg-[#1e293b] transition-colors duration-300 cursor-pointer">
                Begin
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <p className="mt-6 text-[11px] text-[#c0bbb5] tracking-wide">Takes about 2 minutes</p>
            </motion.div>
          )}

          {/* QUIZ */}
          {stage === "quiz" && (
            <motion.div key={`q-${currentQ}`} variants={slideVariants} initial="enter" animate="center" exit="exit"
              className="max-w-2xl w-full">
              <p className="text-xs tracking-[0.2em] text-[#c8a96e] uppercase mb-8 font-medium">
                Question {currentQ + 1}
              </p>
              <h2 className="serif text-[clamp(1.8rem,4.5vw,3rem)] leading-[1.2] text-[#0f172a] mb-12 max-w-lg">
                {quizData[currentQ].q}
              </h2>
              <div className="border-t border-[#e8e4df]">
                {quizData[currentQ].opts.map((opt, j) => {
                  const letter = letters[j];
                  const isSelected = selected === letter;
                  return (
                    <button key={j} onClick={() => handleOptionSelect(letter)}
                      className={`option-item w-full flex items-center gap-5 px-0 py-5 text-left transition-all duration-300 cursor-pointer group ${isSelected ? "option-selected px-4" : "bg-transparent text-[#0f172a]"}`}>
                      <span className={`option-num text-xs tracking-[0.15em] font-medium shrink-0 w-5 transition-colors duration-300 ${isSelected ? "" : "text-[#c0bbb5] group-hover:text-[#c8a96e]"}`}>
                        {letter}
                      </span>
                      <span className={`option-text text-base font-light transition-transform duration-300 leading-relaxed ${isSelected ? "font-normal" : ""}`}>
                        {opt}
                      </span>
                      {isSelected && (
                        <span className="ml-auto shrink-0">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M3 8l4 4 6-6" stroke="#c8a96e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* GATE */}
          {stage === "gate" && (
            <motion.div key="gate" variants={slideVariants} initial="enter" animate="center" exit="exit"
              className="max-w-md w-full">
              <p className="text-xs tracking-[0.25em] text-[#c8a96e] uppercase mb-6">Almost there</p>
              <h2 className="serif text-[clamp(1.8rem,4vw,2.8rem)] leading-[1.2] text-[#0f172a] mb-4">
                Your results<br /><em>are ready.</em>
              </h2>
              <p className="text-[#9a9490] font-light text-sm leading-relaxed mb-10">
                Enter your details to unlock your Financial Personality.
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col">
                <div className="flex flex-col gap-1.5 mb-6">
                  <label className="text-[10px] tracking-[0.2em] text-[#9a9490] uppercase">Name</label>
                  <input value={name} onChange={e => setName(e.target.value)}
                    placeholder="Your name" required
                    className="bg-transparent border-b border-[#e8e4df] pb-3 text-[#0f172a] text-sm font-light placeholder:text-[#c0bbb5] focus:outline-none focus:border-[#0f172a] transition-colors duration-200" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] tracking-[0.2em] text-[#9a9490] uppercase">Phone Number</label>
                  <div className="flex items-center gap-3 border-b border-[#e8e4df] pb-3 focus-within:border-[#0f172a] transition-colors duration-200">
                    <CountryPicker value={countryCode} onChange={setCountryCode} />
                    <div className="w-px h-4 bg-[#e8e4df]" />
                    <input value={phone} onChange={e => setPhone(e.target.value)}
                      placeholder="9123 4567" type="tel" required
                      className="bg-transparent text-[#0f172a] text-sm font-light placeholder:text-[#c0bbb5] focus:outline-none flex-1 min-w-0" />
                  </div>
                </div>
                {error && <p className="text-red-400 text-xs mt-2 font-light">Please fill in both fields.</p>}
                <button type="submit"
                  className="mt-8 inline-flex items-center gap-3 bg-[#0f172a] text-[#FAF8F5] px-8 py-4 text-sm tracking-[0.12em] uppercase hover:bg-[#1e293b] transition-colors duration-300 cursor-pointer self-start">
                  Reveal My Personality
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <p className="mt-6 text-[10px] text-[#c0bbb5] leading-relaxed max-w-xs">
                  By clicking Submit, you consent to InnerMe collecting and using your personal data to contact you, and related updates in accordance with the PDPA.
                </p>
              </form>
            </motion.div>
          )}

          {/* RESULT */}
          {stage === "result" && p && (
            <motion.div key="result" variants={slideVariants} initial="enter" animate="center" exit="exit"
              className="max-w-2xl w-full">
              <p className="text-xs tracking-[0.25em] text-[#c8a96e] uppercase mb-6">Your Financial Personality</p>

              <div className="mb-10">
                <h2 className="serif text-[clamp(2rem,5vw,3.5rem)] leading-[1.1] text-[#0f172a] mb-3">
                  {p.name}
                </h2>
                <p className="text-[#9a9490] text-base font-light italic leading-relaxed max-w-md mb-6">
                  {p.subtitle}
                </p>
                <img src={p.figurineSrc} alt={p.name} className="h-48 object-contain object-bottom" style={{ mixBlendMode: "multiply" }} />
              </div>

              <div className="border-t border-[#e8e4df] pt-8 mb-10">
                <p className="text-[#4a4540] font-light text-base leading-relaxed max-w-lg">
                  {p.desc}
                </p>
              </div>

              {/* Traits - blurred teaser */}
              <div className="relative mb-10 overflow-hidden">
                {/* Visible first row */}
                <div className="grid grid-cols-3 gap-6 pointer-events-none select-none">
                  {[
                    { label: "Strengths", items: p.strengths },
                    { label: "Blind spots", items: p.blindspots },
                    { label: "Next level", items: p.nextLevel },
                  ].map(col => (
                    <div key={col.label}>
                      <p className="text-[10px] tracking-[0.2em] uppercase text-[#9a9490] mb-3">{col.label}</p>
                      {col.items.map((item, i) => (
                        <p key={item} className={`text-xs text-[#4a4540] font-light mb-2 leading-snug ${i >= 1 ? "blur-sm" : ""}`}>{item}</p>
                      ))}
                    </div>
                  ))}
                </div>
                {/* Gradient fade + message */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FAF8F5] via-[#FAF8F5]/80 to-transparent flex items-end justify-center pb-2">
                  <div className="text-center">
                    <p className="text-[10px] tracking-[0.2em] text-[#9a9490] uppercase mb-1">Full report</p>
                    <p className="serif text-base text-[#0f172a] leading-snug">Our specialist will reach out<br />with your detailed breakdown.</p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#c0bbb5] leading-relaxed max-w-md">
                Your financial personality is not who you are forever. It&apos;s a starting point to help you grow, improve and build the life you want.
              </p>

              <button onClick={() => { setStage("intro"); setAnswers({}); setCurrentQ(0); setResult(null); }}
                className="mt-8 text-xs tracking-[0.2em] text-[#9a9490] uppercase underline underline-offset-4 hover:text-[#0f172a] transition-colors cursor-pointer bg-transparent border-none">
                Retake quiz
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Admin */}
      {showAdmin && (
        <div className="border-t border-[#e8e4df] px-6 py-8 bg-white">
          <p className="text-xs tracking-[0.2em] text-[#9a9490] uppercase mb-4">Captured Leads</p>
          <table className="w-full text-xs border-collapse">
            <thead><tr className="border-b border-[#e8e4df]">
              {["Name","Phone","Type","Time"].map(h => (
                <th key={h} className="text-left py-2 pr-6 text-[#9a9490] font-normal tracking-wide">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {(leads as Record<string,string>[]).map((l, i) => (
                <tr key={i} className="border-b border-[#f0ece8]">
                  <td className="py-2.5 pr-6 text-[#0f172a]">{l.name}</td>
                  <td className="py-2.5 pr-6 text-[#4a4540]">{l.phone}</td>
                  <td className="py-2.5 pr-6 text-[#4a4540]">{l.type}</td>
                  <td className="py-2.5 text-[#9a9490]">{l.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button onClick={() => setShowAdmin(v => !v)}
        className="fixed bottom-5 right-5 text-[10px] tracking-[0.15em] text-[#c0bbb5] uppercase hover:text-[#0f172a] transition-colors cursor-pointer bg-transparent border-none">
        Admin
      </button>
    </div>
  );
}
