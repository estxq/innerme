"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { trackEvent } from "@/lib/fbq";

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

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyaBDJ8He8DH-jDQl0kDFa3sNYmYJ8_gFj2MA-ZDmh0sg9VvlehpP4Ti7LZpksq1lOR5w/exec";

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

const quizData = [
  {
    q: "It's your day off. What's the plan?",
    opts: [
      "Same kopitiam, same order, same uncle",
      "Whatever my friends are doing, I'm in",
      "Something new I saw online last night",
      "Nothing planned. Whatever feels right",
    ],
  },
  {
    q: "How do you handle spicy food?",
    opts: [
      "Chilli on the side, thank you",
      "A bit of kick makes everything better",
      "The spicier the better, I need to sweat",
      "I'd rather have something sweet",
    ],
  },
  {
    q: "Your friends would describe you as...",
    opts: [
      "Dependable. Always there",
      "The one who brings everyone together",
      "Bold. A bit extra sometimes",
      "Warm. Easy to be around",
    ],
  },
  {
    q: "How do you feel about queueing 45 minutes for food?",
    opts: [
      "If it's the good stall, sure",
      "Only if I've got company",
      "Yes, and I'm posting about it",
      "Absolutely not. Life's too short",
    ],
  },
  {
    q: "Pick a hawker centre vibe.",
    opts: [
      "Quiet corner, aircon, no rush",
      "Packed table, everyone talking over each other",
      "Late night, supper crowd, buzzing",
      "Morning light, newspaper, unhurried",
    ],
  },
  {
    q: "What's your role in the group chat?",
    opts: [
      "The one who actually books the table",
      "The one replying to everything",
      "The one suggesting the wildest ideas",
      "The one who reads but rarely replies",
    ],
  },
  {
    q: "How do you eat when you're stressed?",
    opts: [
      "Comfort food. Same thing I always get",
      "Big meal with people, shared plates",
      "Something loud and messy",
      "Something small and sweet",
    ],
  },
  {
    q: "What matters most in a meal?",
    opts: [
      "It's done properly. No shortcuts",
      "Enough to share, nobody goes hungry",
      "It surprises me",
      "It reminds me of something",
    ],
  },
  {
    q: "Someone asks where to eat. You say...",
    opts: [
      "I know a place. Trust me",
      "Let's go where everyone can find something",
      "There's this new spot, hear me out",
      "Anywhere. I'm not fussy",
    ],
  },
  {
    q: "Sunday morning, you're...",
    opts: [
      "Up early, same routine as always",
      "Brunch with the family",
      "Recovering from last night",
      "Slow coffee, no agenda",
    ],
  },
];

const letters = ["A", "B", "C", "D"];

type FoodKey = "chickenrice" | "bakkutteh" | "chillicrab" | "kayatoast";

/** All four figurine PNGs are square at this intrinsic size. */
const FIGURINE_SIZE = 512;

const foods: Record<FoodKey, {
  name: string;
  emoji: string;
  img: string;
  subtitle: string;
  desc: string;
  traits: string[];
  pairsWith: string;
  moneyTie: string;
}> = {
  chickenrice: {
    name: "Chicken Rice",
    emoji: "🍚",
    img: "/chickenrice-figurine.png",
    subtitle: "Reliable, timeless, quietly excellent.",
    desc: "You don't need to shout to be the best. You're the one everyone can count on, the safe choice that never disappoints. There's nothing flashy about you, and that's exactly the point. Done properly, simple beats complicated every single time.",
    traits: ["Consistent", "Trustworthy", "Understated", "Quietly confident"],
    pairsWith: "Bak Kut Teh — they bring the warmth, you bring the standard.",
    moneyTie: "You likely value stability and doing things properly. Steady beats flashy.",
  },
  bakkutteh: {
    name: "Bak Kut Teh",
    emoji: "🍲",
    img: "/bakkuhteh-figurine.png",
    subtitle: "Warm, generous, better with people.",
    desc: "You're happiest when everyone's around the table, soup refilled, nobody in a rush to leave. You look after people without making a show of it, and you'd rather share a hearty meal with good company than eat the fanciest thing alone. Comfort and community over everything.",
    traits: ["Generous", "Nurturing", "Down-to-earth", "Warm"],
    pairsWith: "Chicken Rice — you look after everyone, they keep it grounded.",
    moneyTie: "You probably spend on people and experiences. Money is for sharing.",
  },
  chillicrab: {
    name: "Chilli Crab",
    emoji: "🦀",
    img: "/chillicrab-figurine.png",
    subtitle: "Bold, messy, unforgettable.",
    desc: "You go all in. You're the one people remember, a bit loud, a bit extra, completely unbothered about it. Life's too short to play it safe or stay clean. You'd rather make a mess and a memory.",
    traits: ["Bold", "Adventurous", "Expressive", "Fearless"],
    pairsWith: "Kaya Toast — you burn bright, they keep you steady.",
    moneyTie: "You likely chase opportunity and growth. Just watch the impulse spending.",
  },
  kayatoast: {
    name: "Kaya Toast",
    emoji: "🍞",
    img: "/kayatoast-figurine.png",
    subtitle: "Nostalgic, gentle, quietly comforting.",
    desc: "You move at your own pace, and you're not sorry about it. You find joy in small familiar things, a slow morning, a good coffee, a moment that isn't rushed. You're the calm in everyone else's chaos.",
    traits: ["Nostalgic", "Easy-going", "Thoughtful", "Calm"],
    pairsWith: "Chilli Crab — they pull you out, you slow them down.",
    moneyTie: "You may avoid financial stress by not thinking about it. A little planning goes far.",
  },
};

const letterToFood: Record<string, FoodKey> = {
  A: "chickenrice",
  B: "bakkutteh",
  C: "chillicrab",
  D: "kayatoast",
};

/**
 * Food types aren't a progression from worse to better, so this tallies which
 * letter was picked most rather than summing a score. Ties fall back to the
 * earliest question answered with the tied letter, which keeps results stable.
 */
function getResult(answers: Record<number, string>): FoodKey {
  const counts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
  Object.values(answers).forEach((a) => { counts[a] += 1; });

  let best = "A";
  let bestCount = -1;
  for (const letter of letters) {
    if (counts[letter] > bestCount) {
      best = letter;
      bestCount = counts[letter];
    }
  }
  return letterToFood[best];
}

type Stage = "intro" | "quiz" | "gate" | "result";

const slideVariants = {
  enter: { opacity: 0, y: 40 },
  center: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
  exit: { opacity: 0, y: -30, transition: { duration: 0.35, ease: "easeIn" as const } },
};

export default function LocalFoodQuizPage() {
  const [stage, setStage] = useState<Stage>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+65");
  const [error, setError] = useState("");
  const [result, setResult] = useState<FoodKey | null>(null);
  const [copied, setCopied] = useState(false);

  const progress = stage === "quiz" ? currentQ / quizData.length : stage === "gate" ? 1 : 0;

  function startQuiz() {
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
      if (currentQ + 1 >= quizData.length) setStage("gate");
      else setCurrentQ(currentQ + 1);
    }, 420);
  }

  function validatePhone(code: string, num: string): string {
    const digits = num.replace(/\D/g, "");
    if (!digits) return "Please enter your phone number.";
    if (code === "+65") {
      if (!/^[89]\d{7}$/.test(digits)) return "Enter a valid 8-digit SG number starting with 8 or 9.";
    } else if (digits.length < 7 || digits.length > 12) {
      return "Enter a valid phone number.";
    }
    return "";
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError("Please enter your name."); return; }
    const phoneErr = validatePhone(countryCode, phone);
    if (phoneErr) { setError(phoneErr); return; }
    setError("");

    const food = getResult(answers);

    fetch(GOOGLE_SCRIPT_URL, {
      method: "POST", mode: "no-cors",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({
        name,
        phone: `${countryCode.replace(/^\+/, "")} ${phone}`,
        result: foods[food].name,
        source: "localfood",
        ...Object.fromEntries(
          quizData.map((item, i) => [
            `q${i + 1}`,
            answers[i] ? item.opts[letters.indexOf(answers[i])] : "",
          ]),
        ),
      }),
    }).catch(() => {});

    trackEvent("Lead", { content_name: "Local Food Quiz", content_category: foods[food].name });
    setResult(food);
    setStage("result");
  }

  const f = result ? foods[result] : null;

  return (
    <div className="relative min-h-[calc(100dvh-57px)] flex flex-col"
      style={{ fontFamily: "'Inter', sans-serif" }}>

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

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <AnimatePresence mode="wait">

          {/* INTRO */}
          {stage === "intro" && (
            <motion.div key="intro" variants={slideVariants} initial="enter" animate="center" exit="exit"
              className="max-w-xl w-full text-center">
              <p className="text-xs tracking-[0.25em] text-[#9a9490] uppercase mb-6">Just For Fun</p>
              <h1 className="serif text-[clamp(2.4rem,6vw,4rem)] leading-[1.15] text-[#0f172a] mb-6">
                Which Singaporean<br /><em>local food are you?</em>
              </h1>
              <p className="text-[#9a9490] text-base font-light leading-relaxed mb-8 max-w-sm mx-auto">
                10 questions. No wrong answers.<br />
                Chicken rice or chilli crab? Let&apos;s find out.
              </p>

              <div className="flex items-center justify-center gap-3 mb-10">
                {(Object.keys(foods) as FoodKey[]).map((key) => (
                  <Image key={key} src={foods[key].img} alt={foods[key].name}
                    width={FIGURINE_SIZE} height={FIGURINE_SIZE}
                    sizes="(min-width: 640px) 80px, 64px"
                    loading="eager"
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain" />
                ))}
              </div>

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
                Your dish<br /><em>is ready.</em>
              </h2>
              <p className="text-[#9a9490] font-light text-sm leading-relaxed mb-10">
                Enter your details to find out which local food you are.
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
                    <input value={phone}
                      onChange={e => setPhone(e.target.value.replace(/\D/g, ""))}
                      placeholder={countryCode === "+65" ? "9123 4567" : "Phone number"}
                      maxLength={countryCode === "+65" ? 8 : 12}
                      inputMode="numeric" type="tel" required
                      className="bg-transparent text-[#0f172a] text-sm font-light placeholder:text-[#c0bbb5] focus:outline-none flex-1 min-w-0" />
                  </div>
                </div>
                {error && <p className="text-red-400 text-xs mt-2 font-light">{error}</p>}
                <button type="submit"
                  className="mt-8 inline-flex items-center gap-3 bg-[#0f172a] text-[#FAF8F5] px-8 py-4 text-sm tracking-[0.12em] uppercase hover:bg-[#1e293b] transition-colors duration-300 cursor-pointer self-start">
                  Reveal My Dish
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
          {stage === "result" && f && (
            <motion.div key="result" variants={slideVariants} initial="enter" animate="center" exit="exit"
              className="max-w-2xl w-full">
              <p className="text-xs tracking-[0.25em] text-[#c8a96e] uppercase mb-6">You are</p>

              <div className="mb-10">
                <Image src={f.img} alt={`${f.name} figurine`}
                  width={FIGURINE_SIZE} height={FIGURINE_SIZE}
                  sizes="(min-width: 640px) 256px, 224px"
                  loading="eager" fetchPriority="high"
                  className="w-56 h-56 sm:w-64 sm:h-64 object-contain mb-4" />
                <h2 className="serif text-[clamp(2rem,5vw,3.5rem)] leading-[1.1] text-[#0f172a] mb-3">
                  {f.name}
                </h2>
                <p className="text-[#9a9490] text-base font-light italic leading-relaxed max-w-md">
                  {f.subtitle}
                </p>
              </div>

              <div className="border-t border-[#e8e4df] pt-8 mb-8">
                <p className="text-[#4a4540] font-light text-base leading-relaxed">
                  {f.desc}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="border border-[#e8e4df] p-5">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-[#9a9490] mb-3">Your traits</p>
                  {f.traits.map(t => (
                    <p key={t} className="text-sm text-[#4a4540] font-light mb-1.5 leading-snug">{t}</p>
                  ))}
                </div>
                <div className="border border-[#e8e4df] p-5">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-[#9a9490] mb-3">You pair well with</p>
                  <p className="text-sm text-[#4a4540] font-light leading-relaxed">{f.pairsWith}</p>
                </div>
              </div>

              <div className="border-l-2 border-[#c8a96e] pl-5 mb-10">
                <p className="text-[10px] tracking-[0.2em] text-[#c8a96e] uppercase mb-2">And with money?</p>
                <p className="text-sm text-[#4a4540] font-light leading-relaxed">{f.moneyTie}</p>
              </div>

              <div className="bg-[#0f172a] px-8 py-10 text-center mb-8">
                <p className="text-xs tracking-[0.25em] text-[#c8a96e] uppercase mb-3">Go deeper</p>
                <h3 className="serif text-[clamp(1.25rem,3vw,1.75rem)] leading-snug text-white mb-8">
                  Now find out your financial personality.
                </h3>
                <a href="/financial-persona"
                  className="inline-flex items-center gap-2 bg-white text-[#0f172a] px-6 py-3 text-xs tracking-[0.12em] uppercase hover:bg-[#f0ece8] transition-colors duration-300">
                  Take the Quiz
                </a>
              </div>

              <div className="flex items-center gap-6">
                <button onClick={() => { setStage("intro"); setAnswers({}); setCurrentQ(0); setResult(null); }}
                  className="text-xs tracking-[0.2em] text-[#9a9490] uppercase underline underline-offset-4 hover:text-[#0f172a] transition-colors cursor-pointer bg-transparent border-none">
                  Retake quiz
                </button>
                <button
                  onClick={async () => {
                    const shareText = `I'm ${f.name}! ${f.emoji} Find out which Singaporean local food you are →`;
                    const shareUrl = "https://www.innerme.sg/local-food";
                    if (navigator.share) {
                      try {
                        await navigator.share({ text: shareText, url: shareUrl });
                      } catch {
                        // user cancelled the share sheet — no action needed
                      }
                    } else {
                      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }
                  }}
                  className="flex items-center gap-2 text-xs tracking-[0.2em] text-[#9a9490] uppercase hover:text-[#0f172a] transition-colors cursor-pointer bg-transparent border-none">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M6 10.5a.5.5 0 0 1-.5-.5V4a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-.5.5H6z" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M4 5.5H3.5A1.5 1.5 0 0 0 2 7v5.5A1.5 1.5 0 0 0 3.5 14H9a1.5 1.5 0 0 0 1.5-1.5V12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                  {copied ? "Copied!" : "Share my result"}
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
