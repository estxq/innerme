"use client";
import { useState, useRef, useEffect, Suspense, type JSX } from "react";
import { useSearchParams } from "next/navigation";
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

const quizData = [
  {
    q: "When you and your partner disagree on a big purchase, you usually...",
    opts: [
      "Talk it through until you both agree",
      "We keep our finances separate, so it's not really an issue",
      "Compromise somewhere in the middle",
      "Avoid the conversation and hope it blows over",
    ],
  },
  {
    q: "How do you currently handle money as a couple?",
    opts: [
      "Fully combined, one shared pot for everything",
      "Completely separate, we split bills and that's it",
      "A mix of both, shared for household and personal for the rest",
      "No real system yet, we just figure it out as we go",
    ],
  },
  {
    q: "How often do you talk about finances with your partner?",
    opts: [
      "Regularly, it's a normal part of our relationship",
      "Only when something urgent comes up",
      "Occasionally, when we remember to",
      "Rarely, it tends to feel awkward or stressful",
    ],
  },
  {
    q: "When planning a holiday together, you tend to...",
    opts: [
      "Set a budget upfront and plan around it",
      "Each pay for what we want individually",
      "Set a rough budget but leave room to splurge",
      "Book first, figure out the money part later",
    ],
  },
  {
    q: "If your partner made a big purchase without telling you, you'd feel...",
    opts: [
      "Upset, big decisions should be made together",
      "Fine, as long as it came from their own money",
      "A little surprised, but I'd want to understand why",
      "I probably wouldn't bring it up",
    ],
  },
  {
    q: "Your ideal savings approach as a couple is...",
    opts: [
      "A shared savings goal we actively work toward together",
      "Individual savings, no pressure on each other",
      "Some shared goals, some personal savings on the side",
      "We haven't really talked about this yet",
    ],
  },
  {
    q: "When it comes to big life decisions like a house, kids, or retirement...",
    opts: [
      "We plan extensively and align on everything",
      "We each have our own vision and trust it'll work out",
      "We talk broadly but leave room for flexibility",
      "We tend to avoid these conversations for now",
    ],
  },
  {
    q: "How do you feel about your partner knowing exactly what you earn and spend?",
    opts: [
      "Completely comfortable, full transparency is important to me",
      "Okay with the big picture, but not every detail",
      "Slightly uncomfortable, but I understand why it matters",
      "I'd prefer to keep it mostly private",
    ],
  },
  {
    q: "If one of you lost your income tomorrow, you'd...",
    opts: [
      "Be okay, we have an emergency plan in place",
      "Manage separately, we don't rely on each other financially",
      "Tighten up together and work through it",
      "Panic, this is something we've never discussed",
    ],
  },
  {
    q: "Your biggest shared financial dream is...",
    opts: [
      "Owning a home and building a stable future together",
      "Maintaining financial independence while enjoying life",
      "Travelling freely and enjoying experiences together",
      "Honestly, we haven't really talked about this",
    ],
  },
];

const letters = ["A", "B", "C", "D"];
type PersonalityType = "planner" | "independent" | "balancer" | "drifter";
type GenderType = "male" | "female";
const letterToType: Record<string, PersonalityType> = { A: "planner", B: "independent", C: "balancer", D: "drifter" };

// ─── Figurines — PNG images from /public ───────────────────────────────────

const FIGURINE_SRCS: Record<PersonalityType, Record<GenderType, string>> = {
  planner:     { male: "/planner-male.png",   female: "/planner-female.png" },
  independent: { male: "/indep-male.png",     female: "/indep-female.png" },
  balancer:    { male: "/balancer-male.png",  female: "/balancer-female.png" },
  drifter:     { male: "/drifter-male.png",   female: "/drifter-female.png" },
};

const Figurines: Record<PersonalityType, Record<GenderType, () => JSX.Element>> = {
  planner: {
    male:   () => <img src={FIGURINE_SRCS.planner.male}   alt="The Planner"     className="w-full h-full object-contain object-bottom" style={{ mixBlendMode: "multiply" }} />,
    female: () => <img src={FIGURINE_SRCS.planner.female} alt="The Planner"     className="w-full h-full object-contain object-bottom" style={{ mixBlendMode: "multiply" }} />,
  },
  independent: {
    male:   () => <img src={FIGURINE_SRCS.independent.male}   alt="The Independent" className="w-full h-full object-contain object-bottom" style={{ mixBlendMode: "multiply" }} />,
    female: () => <img src={FIGURINE_SRCS.independent.female} alt="The Independent" className="w-full h-full object-contain object-bottom" style={{ mixBlendMode: "multiply" }} />,
  },
  balancer: {
    male:   () => <img src={FIGURINE_SRCS.balancer.male}   alt="The Balancer"   className="w-full h-full object-contain object-bottom" style={{ mixBlendMode: "multiply" }} />,
    female: () => <img src={FIGURINE_SRCS.balancer.female} alt="The Balancer"   className="w-full h-full object-contain object-bottom" style={{ mixBlendMode: "multiply" }} />,
  },
  drifter: {
    male:   () => <img src={FIGURINE_SRCS.drifter.male}   alt="The Drifter"    className="w-full h-full object-contain object-bottom" style={{ mixBlendMode: "multiply" }} />,
    female: () => <img src={FIGURINE_SRCS.drifter.female} alt="The Drifter"    className="w-full h-full object-contain object-bottom" style={{ mixBlendMode: "multiply" }} />,
  },
};

const personalities: Record<PersonalityType, { name: string; desc: string }> = {
  planner: {
    name: "The Planner",
    desc: "Structured, goal-oriented, wants full alignment. Money conversations don't scare you. They excite you.",
  },
  independent: {
    name: "The Independent",
    desc: "Values financial autonomy and prefers to keep things separate. Self-sufficient and trusts your partner to handle their own.",
  },
  balancer: {
    name: "The Balancer",
    desc: "Flexible and practical. You meet in the middle, not too rigid about money but not careless either.",
  },
  drifter: {
    name: "The Drifter",
    desc: "Goes with the flow and tends to avoid financial conversations. Not because you don't care. It just feels overwhelming to start.",
  },
};

type PairingResult = { name: string; pct: number; desc: string; tip: string };

const pairings: Record<string, PairingResult> = {
  "planner-planner": {
    name: "The Power Couple", pct: 95,
    desc: "You're fully aligned. Same goals, same language, same drive. When two Planners come together, money becomes a shared mission rather than a source of conflict.",
    tip: "Watch out for over-planning. Leave room to enjoy the journey, not just the destination.",
  },
  "planner-balancer": {
    name: "The Sweet Spot", pct: 80,
    desc: "You complement each other beautifully. The Planner brings structure, the Balancer brings flexibility. Together you build something that's both stable and enjoyable.",
    tip: "Let the Balancer slow you down sometimes. Not every decision needs a spreadsheet.",
  },
  "balancer-planner": {
    name: "The Sweet Spot", pct: 80,
    desc: "You complement each other beautifully. The Planner brings structure, the Balancer brings flexibility. Together you build something that's both stable and enjoyable.",
    tip: "Let the Balancer slow you down sometimes. Not every decision needs a spreadsheet.",
  },
  "balancer-balancer": {
    name: "The Harmonists", pct: 75,
    desc: "Easy-going and naturally in sync. You rarely fight about money because you both know how to meet in the middle. Life feels balanced, and honestly that's really good.",
    tip: "Be careful not to be so balanced that nothing gets decided. Some goals need commitment.",
  },
  "planner-independent": {
    name: "The Negotiators", pct: 55,
    desc: "There's real tension between wanting full alignment and needing personal freedom. You can make it work, but it takes honest, ongoing conversations about where the lines are.",
    tip: "Define what's shared and what's personal early. Ambiguity is where conflict starts.",
  },
  "independent-planner": {
    name: "The Negotiators", pct: 55,
    desc: "There's real tension between wanting full alignment and needing personal freedom. You can make it work, but it takes honest, ongoing conversations about where the lines are.",
    tip: "Define what's shared and what's personal early. Ambiguity is where conflict starts.",
  },
  "independent-balancer": {
    name: "The Modern Pair", pct: 65,
    desc: "You work well if communication is open. The Balancer wants connection, the Independent wants space. Finding where those two things overlap is where you'll thrive.",
    tip: "Check in quarterly about shared goals. It doesn't have to be a big deal, just a conversation.",
  },
  "balancer-independent": {
    name: "The Modern Pair", pct: 65,
    desc: "You work well if communication is open. The Balancer wants connection, the Independent wants space. Finding where those two things overlap is where you'll thrive.",
    tip: "Check in quarterly about shared goals. It doesn't have to be a big deal, just a conversation.",
  },
  "independent-independent": {
    name: "The Free Spirits", pct: 50,
    desc: "You're both self-sufficient and that's admirable. But shared goals can suffer when no one's driving. Fun together, but financially parallel rather than united.",
    tip: "Pick one or two shared goals to work toward. It doesn't mean giving up your independence.",
  },
  "planner-drifter": {
    name: "The Anchor & The Wave", pct: 35,
    desc: "One of you carries the financial weight while the other floats along. This can work short-term, but resentment tends to build if nothing changes.",
    tip: "The Drifter needs a gentle on-ramp into financial conversations, not a lecture. Start small.",
  },
  "drifter-planner": {
    name: "The Anchor & The Wave", pct: 35,
    desc: "One of you carries the financial weight while the other floats along. This can work short-term, but resentment tends to build if nothing changes.",
    tip: "The Drifter needs a gentle on-ramp into financial conversations, not a lecture. Start small.",
  },
  "balancer-drifter": {
    name: "The Steady Hand", pct: 30,
    desc: "The Balancer often ends up managing more than their share. You pick up the slack without meaning to, and the Drifter doesn't always realise the imbalance.",
    tip: "Have an honest conversation about expectations before the gap gets too wide to bridge.",
  },
  "drifter-balancer": {
    name: "The Steady Hand", pct: 30,
    desc: "The Balancer often ends up managing more than their share. You pick up the slack without meaning to, and the Drifter doesn't always realise the imbalance.",
    tip: "Have an honest conversation about expectations before the gap gets too wide to bridge.",
  },
  "independent-drifter": {
    name: "The Wanderers", pct: 20,
    desc: "Neither of you is steering the financial ship. It's exciting in the short term, but without structure, small money issues can quietly become big ones.",
    tip: "Start with one simple shared habit. A monthly check-in, a joint savings jar, anything. Momentum matters.",
  },
  "drifter-independent": {
    name: "The Wanderers", pct: 20,
    desc: "Neither of you is steering the financial ship. It's exciting in the short term, but without structure, small money issues can quietly become big ones.",
    tip: "Start with one simple shared habit. A monthly check-in, a joint savings jar, anything. Momentum matters.",
  },
  "drifter-drifter": {
    name: "The Live-for-Now Duo", pct: 10,
    desc: "You both avoid financial conversations and live in the moment. Life feels free, until it doesn't. This pairing needs external support to build a foundation.",
    tip: "You don't need to figure it all out at once. One conversation, one decision, one step at a time.",
  },
};

function getPersonality(answers: Record<number, string>): PersonalityType {
  const counts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
  Object.values(answers).forEach((a) => counts[a]++);
  const order = ["A", "C", "B", "D"];
  let best = "A"; let max = -1;
  for (const l of order) { if (counts[l] > max) { max = counts[l]; best = l; } }
  return letterToType[best];
}

function encodeData(answers: Record<number, string>, name: string, gender: string, ageRange: string): string {
  const arr = Array.from({ length: 10 }, (_, i) => answers[i] || "");
  return btoa(unescape(encodeURIComponent(arr.join(",") + "|" + name + "|" + gender + "|" + ageRange)));
}

function decodeData(encoded: string): { answers: Record<number, string>; name: string; gender: GenderType; ageRange: string } {
  try {
    const raw = decodeURIComponent(escape(atob(encoded)));
    const parts = raw.split("|");
    const answers: Record<number, string> = {};
    parts[0].split(",").forEach((v, i) => { if (v) answers[i] = v; });
    const g = parts[2] === "female" ? "female" : "male";
    return { answers, name: parts[1] || "", gender: g, ageRange: parts[3] || "" };
  } catch { return { answers: {}, name: "", gender: "male", ageRange: "" }; }
}

const slideVariants = {
  enter: { opacity: 0, y: 40 },
  center: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
  exit: { opacity: 0, y: -30, transition: { duration: 0.35, ease: "easeIn" as const } },
};

type Stage = "intro" | "profile" | "quiz" | "gate" | "share" | "waiting" | "result";

const AGE_RANGES = ["18–24", "25–34", "35–44", "45+"];

function CouplesQuiz() {
  const searchParams = useSearchParams();
  const partnerParam = searchParams.get("p");
  const isPartnerB = !!partnerParam;
  const partnerAData = partnerParam ? decodeData(partnerParam) : null;

  const [stage, setStage] = useState<Stage>(isPartnerB ? "waiting" : "intro");
  const [gender, setGender] = useState<GenderType>("female");
  const [ageRange, setAgeRange] = useState("");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+65");
  const [phone, setPhone] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<{ typeA: PersonalityType; typeB: PersonalityType; pairing: PairingResult; nameB: string; genderB: GenderType } | null>(null);

  const progress = stage === "quiz" ? currentQ / quizData.length : stage === "gate" ? 1 : 0;

  function startQuiz() { setStage("profile"); }

  function handleProfileContinue() {
    if (!ageRange) return;
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

  function handleGateSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    if (!isPartnerB) {
      const encoded = encodeData(answers, name, gender, ageRange);
      const url = `${window.location.origin}/couples?p=${encoded}`;
      setShareUrl(url);
      fetch("https://script.google.com/macros/s/AKfycbyaBDJ8He8DH-jDQl0kDFa3sNYmYJ8_gFj2MA-ZDmh0sg9VvlehpP4Ti7LZpksq1lOR5w/exec", {
        method: "POST", mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ name, phone: `${countryCode.replace(/^\+/, "")} ${phone}`, gender, ageRange, source: "couples", role: "partner-a" }),
      }).catch(() => {});
      setStage("share");
    } else {
      const typeA = getPersonality(partnerAData!.answers);
      const typeB = getPersonality(answers);
      const key = `${typeA}-${typeB}`;
      const pairing = pairings[key] ?? { name: "The Unique Pair", pct: 50, desc: "Your combination is one of a kind.", tip: "Keep communicating." };
      fetch("https://script.google.com/macros/s/AKfycbyaBDJ8He8DH-jDQl0kDFa3sNYmYJ8_gFj2MA-ZDmh0sg9VvlehpP4Ti7LZpksq1lOR5w/exec", {
        method: "POST", mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({
          name: `${partnerAData!.name} & ${name}`,
          phone: `${partnerAData!.name}: (Partner A) | ${name}: ${countryCode.replace(/^\+/, "")} ${phone}`,
          result: pairing.name,
          source: "couples",
        }),
      }).catch(() => {});
      setResult({ typeA, typeB, pairing, nameB: name, genderB: gender });
      setStage("result");
    }
  }

  function copyLink() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="relative min-h-[calc(100dvh-57px)] bg-[#FAF8F5] flex flex-col"
      style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Inter:wght@300;400;500&display=swap');
        .serif { font-family: 'Playfair Display', Georgia, serif; }
        .opt-row { border-bottom: 1px solid #e8e4df; }
        .opt-row:last-child { border-bottom: none; }
        .opt-row:hover .opt-text { transform: translateX(8px); }
        .opt-selected { background: #0f172a; color: #fff; padding-left: 1rem; padding-right: 1rem; }
        .opt-selected .opt-num { color: #c8a96e; }
      `}</style>

      {(stage === "quiz" || stage === "gate") && (
        <div className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-[#e8e4df]">
          <motion.div className="h-full bg-[#0f172a]"
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }} />
        </div>
      )}

      {stage === "quiz" && (
        <div className="fixed top-4 right-6 z-40 text-xs tracking-[0.15em] text-[#9a9490] font-light">
          {String(currentQ + 1).padStart(2, "0")} / {String(quizData.length).padStart(2, "0")}
        </div>
      )}

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <AnimatePresence mode="wait">

          {stage === "intro" && (
            <motion.div key="intro" variants={slideVariants} initial="enter" animate="center" exit="exit"
              className="max-w-xl w-full text-center">
              <p className="text-xs tracking-[0.25em] text-[#9a9490] uppercase mb-6">Couples Compatibility Test</p>
              <h1 className="serif text-[clamp(2.2rem,5.5vw,3.8rem)] leading-[1.15] text-[#0f172a] mb-6">
                How aligned are you<br /><em>with your partner?</em>
              </h1>
              <p className="text-[#9a9490] text-base font-light leading-relaxed mb-10 max-w-sm mx-auto">
                10 questions on how you handle money together. You go first, then send the link to your partner. Results only unlock when both of you are done.
              </p>
              <button onClick={startQuiz}
                className="inline-flex items-center gap-3 bg-[#0f172a] text-[#FAF8F5] px-8 py-4 text-sm tracking-[0.12em] uppercase hover:bg-[#1e293b] transition-colors duration-300 cursor-pointer">
                I&apos;ll go first
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <p className="mt-6 text-[11px] text-[#c0bbb5] tracking-wide">Takes about 3 minutes</p>
            </motion.div>
          )}

          {stage === "waiting" && (
            <motion.div key="waiting" variants={slideVariants} initial="enter" animate="center" exit="exit"
              className="max-w-xl w-full text-center">
              <p className="text-xs tracking-[0.25em] text-[#9a9490] uppercase mb-6">Couples Compatibility Test</p>
              <div className="text-4xl mb-6">💌</div>
              <h1 className="serif text-[clamp(2rem,5vw,3.2rem)] leading-[1.15] text-[#0f172a] mb-4">
                <em>{partnerAData?.name || "Your partner"}</em><br />is waiting for you.
              </h1>
              <p className="text-[#9a9490] text-base font-light leading-relaxed mb-10 max-w-sm mx-auto">
                They&apos;ve completed their side. Answer 10 questions honestly. Your compatibility result unlocks once you&apos;re both done.
              </p>
              <button onClick={startQuiz}
                className="inline-flex items-center gap-3 bg-[#0f172a] text-[#FAF8F5] px-8 py-4 text-sm tracking-[0.12em] uppercase hover:bg-[#1e293b] transition-colors duration-300 cursor-pointer">
                Start my test
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </motion.div>
          )}

          {stage === "profile" && (
            <motion.div key="profile" variants={slideVariants} initial="enter" animate="center" exit="exit"
              className="max-w-md w-full">
              <p className="text-xs tracking-[0.25em] text-[#9a9490] uppercase mb-6">Before we begin</p>
              <h2 className="serif text-[clamp(1.8rem,4vw,2.8rem)] leading-[1.2] text-[#0f172a] mb-10">
                A little about<br /><em>yourself.</em>
              </h2>

              <div className="mb-8">
                <p className="text-[10px] tracking-[0.2em] text-[#9a9490] uppercase mb-4">I identify as</p>
                <div className="grid grid-cols-2 gap-3">
                  {(["female", "male"] as GenderType[]).map(g => (
                    <button key={g} type="button" onClick={() => setGender(g)}
                      className={`py-4 text-sm font-light tracking-[0.05em] border transition-all duration-200 cursor-pointer capitalize ${gender === g ? "bg-[#0f172a] text-[#FAF8F5] border-[#0f172a]" : "bg-transparent text-[#0f172a] border-[#e8e4df] hover:border-[#0f172a]"}`}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-10">
                <p className="text-[10px] tracking-[0.2em] text-[#9a9490] uppercase mb-4">My age range</p>
                <div className="grid grid-cols-2 gap-3">
                  {AGE_RANGES.map(a => (
                    <button key={a} type="button" onClick={() => setAgeRange(a)}
                      className={`py-4 text-sm font-light tracking-[0.05em] border transition-all duration-200 cursor-pointer ${ageRange === a ? "bg-[#0f172a] text-[#FAF8F5] border-[#0f172a]" : "bg-transparent text-[#0f172a] border-[#e8e4df] hover:border-[#0f172a]"}`}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={handleProfileContinue} disabled={!ageRange}
                className="inline-flex items-center gap-3 bg-[#0f172a] text-[#FAF8F5] px-8 py-4 text-sm tracking-[0.12em] uppercase hover:bg-[#1e293b] transition-colors duration-300 cursor-pointer disabled:opacity-30">
                Continue
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </motion.div>
          )}

          {stage === "quiz" && (
            <motion.div key={`q-${currentQ}`} variants={slideVariants} initial="enter" animate="center" exit="exit"
              className="max-w-2xl w-full">
              <p className="text-xs tracking-[0.2em] text-[#c8a96e] uppercase mb-8 font-medium">Question {currentQ + 1}</p>
              <h2 className="serif text-[clamp(1.6rem,4vw,2.6rem)] leading-[1.25] text-[#0f172a] mb-12 max-w-lg">
                {quizData[currentQ].q}
              </h2>
              <div className="border-t border-[#e8e4df]">
                {quizData[currentQ].opts.map((opt, j) => {
                  const letter = letters[j];
                  const isSel = selected === letter;
                  return (
                    <button key={j} onClick={() => handleOptionSelect(letter)}
                      className={`opt-row w-full flex items-center gap-5 py-5 text-left transition-all duration-300 cursor-pointer group ${isSel ? "opt-selected" : "bg-transparent text-[#0f172a] px-0"}`}>
                      <span className={`opt-num text-xs tracking-[0.15em] font-medium shrink-0 w-5 transition-colors duration-300 ${isSel ? "" : "text-[#c0bbb5] group-hover:text-[#c8a96e]"}`}>
                        {letter}
                      </span>
                      <span className={`opt-text text-base font-light transition-transform duration-300 leading-relaxed ${isSel ? "font-normal" : ""}`}>
                        {opt}
                      </span>
                      {isSel && (
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

          {stage === "gate" && (
            <motion.div key="gate" variants={slideVariants} initial="enter" animate="center" exit="exit"
              className="max-w-md w-full">
              <p className="text-xs tracking-[0.25em] text-[#c8a96e] uppercase mb-6">
                {isPartnerB ? "Last step" : "Almost there"}
              </p>
              <h2 className="serif text-[clamp(1.8rem,4vw,2.8rem)] leading-[1.2] text-[#0f172a] mb-4">
                {isPartnerB ? <><em>Your result</em><br />is ready.</> : <><em>Your side</em><br />is done.</>}
              </h2>
              <p className="text-[#9a9490] font-light text-sm leading-relaxed mb-10">
                {isPartnerB ? "Enter your details to unlock your compatibility result." : "Enter your details and we'll generate a link for your partner next."}
              </p>
              <form onSubmit={handleGateSubmit} className="flex flex-col gap-0">
                <div className="border-t border-[#e8e4df]">
                  <input value={name} onChange={e => setName(e.target.value)}
                    placeholder="Your name" required
                    className="w-full py-4 text-base font-light text-[#0f172a] bg-transparent outline-none placeholder:text-[#c0bbb5] border-b border-[#e8e4df] focus:border-[#0f172a] transition-colors" />
                </div>
                <div className="flex items-center gap-3 border-b border-[#e8e4df] focus-within:border-[#0f172a] transition-colors duration-200 py-4">
                  <CountryPicker value={countryCode} onChange={setCountryCode} />
                  <div className="w-px h-4 bg-[#e8e4df]" />
                  <input value={phone} onChange={e => setPhone(e.target.value)}
                    placeholder="9123 4567" type="tel" required
                    className="flex-1 min-w-0 text-base font-light text-[#0f172a] bg-transparent outline-none placeholder:text-[#c0bbb5]" />
                </div>
                <button type="submit"
                  className="mt-8 inline-flex items-center gap-3 bg-[#0f172a] text-[#FAF8F5] px-8 py-4 text-sm tracking-[0.12em] uppercase hover:bg-[#1e293b] transition-colors duration-300 cursor-pointer self-start">
                  {isPartnerB ? "Reveal our result" : "Generate partner link"}
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

          {stage === "share" && (
            <motion.div key="share" variants={slideVariants} initial="enter" animate="center" exit="exit"
              className="max-w-md w-full">
              <p className="text-xs tracking-[0.25em] text-[#9a9490] uppercase mb-6">Step 2 of 2</p>
              <h2 className="serif text-[clamp(1.8rem,4vw,2.8rem)] leading-[1.2] text-[#0f172a] mb-4">
                Now send this<br /><em>to your partner.</em>
              </h2>
              <p className="text-[#9a9490] font-light text-sm leading-relaxed mb-10 max-w-xs">
                Your result will only unlock once they complete their side. The link is unique to both of you.
              </p>
              <div className="border border-[#e8e4df] p-4 flex items-center justify-between gap-4 mb-4">
                <p className="text-xs text-[#4a4540] font-light break-all leading-relaxed flex-1 select-all">{shareUrl}</p>
                <button onClick={copyLink}
                  className="shrink-0 text-[10px] tracking-[0.15em] uppercase text-[#0f172a] border border-[#0f172a] px-3 py-2 hover:bg-[#0f172a] hover:text-white transition-colors duration-200 cursor-pointer whitespace-nowrap">
                  {copied ? "Copied ✓" : "Copy link"}
                </button>
              </div>
              <p className="text-[10px] text-[#c0bbb5] leading-relaxed">
                Once your partner completes the test using this link, both of you will see your compatibility result.
              </p>
            </motion.div>
          )}

          {stage === "result" && result && (
            <motion.div key="result" variants={slideVariants} initial="enter" animate="center" exit="exit"
              className="max-w-2xl w-full">
              <p className="text-xs tracking-[0.25em] text-[#c8a96e] uppercase mb-6">Your Compatibility Result</p>

              <div className="mb-10">
                <div className="flex items-end gap-2 mb-2">
                  <span className="serif text-[clamp(3.5rem,10vw,6rem)] leading-none text-[#0f172a]">{result.pairing.pct}</span>
                  <span className="serif text-[clamp(1.5rem,4vw,2.5rem)] leading-none text-[#c8a96e] mb-2">%</span>
                </div>
                <h2 className="serif text-[clamp(1.6rem,4vw,2.4rem)] leading-[1.2] text-[#0f172a] italic">{result.pairing.name}</h2>
              </div>

              <div className="mb-10">
                <div className="h-[2px] bg-[#e8e4df] w-full">
                  <motion.div className="h-full bg-[#0f172a]"
                    initial={{ width: 0 }}
                    animate={{ width: `${result.pairing.pct}%` }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-10">
                {([
                  { label: partnerAData?.name || "Partner A", type: result.typeA, g: partnerAData?.gender ?? "female" },
                  { label: result.nameB, type: result.typeB, g: result.genderB },
                ] as { label: string; type: PersonalityType; g: GenderType }[]).map((p) => {
                  const FigurineComponent = Figurines[p.type][p.g];
                  return (
                    <div key={p.label} className="border border-[#e8e4df] px-5 py-5">
                      <p className="text-[10px] tracking-[0.2em] text-[#9a9490] uppercase mb-4 truncate">{p.label}</p>
                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
                        className="mb-4 h-52 flex justify-center">
                        <FigurineComponent />
                      </motion.div>
                      <p className="serif text-base text-[#0f172a]">{personalities[p.type].name}</p>
                      <p className="text-xs text-[#9a9490] font-light mt-1 leading-snug">{personalities[p.type].desc}</p>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-[#e8e4df] pt-8 mb-6">
                <p className="text-[#4a4540] font-light text-base leading-relaxed max-w-lg">{result.pairing.desc}</p>
              </div>

              <div className="border-l-2 border-[#c8a96e] pl-5 mb-10">
                <p className="text-[10px] tracking-[0.2em] text-[#c8a96e] uppercase mb-2">Our tip</p>
                <p className="text-sm text-[#4a4540] font-light leading-relaxed">{result.pairing.tip}</p>
              </div>

              <p className="text-xs text-[#c0bbb5] leading-relaxed max-w-md">
                Compatibility isn&apos;t fixed. It&apos;s built through honest conversations and small, consistent actions together.
              </p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

export default function CouplesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[calc(100dvh-57px)] bg-[#FAF8F5] flex items-center justify-center">
        <p className="text-xs tracking-[0.2em] text-[#9a9490] uppercase">Loading...</p>
      </div>
    }>
      <CouplesQuiz />
    </Suspense>
  );
}
