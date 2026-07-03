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

// ─── Chibi SVG Figurines ────────────────────────────────────────────────────
// viewBox 0 0 100 175 — head r=31 (chibi large), warm skin, very dark hair
// Each figurine has unique gradient IDs prefixed by type+gender (e.g. pm-, pf-)

const Figurines: Record<PersonalityType, Record<GenderType, () => JSX.Element>> = {

  planner: {
    // Navy button-up + khaki pants + brown shoes + round gold glasses + clipboard + pen
    male: () => (
      <svg width="100" height="175" viewBox="0 0 100 175" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="pm-sk" cx="42%" cy="36%" r="60%"><stop offset="0%" stopColor="#fcd9b6"/><stop offset="100%" stopColor="#e09060"/></radialGradient>
          <radialGradient id="pm-hr" cx="50%" cy="22%" r="65%"><stop offset="0%" stopColor="#2e2010"/><stop offset="100%" stopColor="#0c0806"/></radialGradient>
        </defs>
        {/* Platform */}
        <ellipse cx="50" cy="170" rx="28" ry="7" fill="#111"/>
        {/* Brown shoes */}
        <ellipse cx="37" cy="162" rx="11" ry="5" fill="#4a2810"/>
        <ellipse cx="63" cy="162" rx="11" ry="5" fill="#4a2810"/>
        <rect x="28" y="150" width="20" height="14" rx="5" fill="#5a3218"/>
        <rect x="52" y="150" width="20" height="14" rx="5" fill="#5a3218"/>
        {/* Khaki pants */}
        <rect x="30" y="116" width="18" height="38" rx="7" fill="#c4a87a"/>
        <rect x="52" y="116" width="18" height="38" rx="7" fill="#c4a87a"/>
        {/* Belt */}
        <rect x="27" y="112" width="46" height="7" rx="2" fill="#3a2010"/>
        <rect x="45" y="111" width="10" height="9" rx="1.5" fill="#c8a96e"/>
        {/* Navy blazer body */}
        <rect x="23" y="76" width="54" height="40" rx="9" fill="#0f172a"/>
        {/* White shirt centre */}
        <path d="M38 76 L50 94 L62 76" fill="#FAF8F5"/>
        <path d="M42 76 L50 88 L58 76" fill="#dedad6"/>
        {/* Shirt buttons */}
        <circle cx="50" cy="98" r="1.2" fill="#c8a96e"/>
        <circle cx="50" cy="104" r="1.2" fill="#c8a96e"/>
        {/* Lapels */}
        <path d="M38 76 L32 90 L40 103" fill="#0d1526"/>
        <path d="M62 76 L68 90 L60 103" fill="#0d1526"/>
        {/* Left arm holding clipboard */}
        <path d="M23 86 Q8 96 6 114" stroke="#0f172a" strokeWidth="15" strokeLinecap="round" fill="none"/>
        <ellipse cx="7" cy="113" rx="6" ry="5" fill="url(#pm-sk)"/>
        <rect x="0" y="99" width="16" height="21" rx="2" fill="#c8a96e"/>
        <rect x="6" y="97" width="5" height="5" rx="1" fill="#0f172a"/>
        <line x1="2" y1="108" x2="15" y2="108" stroke="white" strokeWidth="0.9"/>
        <line x1="2" y1="113" x2="15" y2="113" stroke="white" strokeWidth="0.9"/>
        <line x1="2" y1="118" x2="11" y2="118" stroke="white" strokeWidth="0.9"/>
        <path d="M3 107 L5 110 L9 104" stroke="white" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round"/>
        {/* Right arm holding pen */}
        <path d="M77 86 Q88 76 90 63" stroke="#0f172a" strokeWidth="15" strokeLinecap="round" fill="none"/>
        <ellipse cx="90" cy="61" rx="5" ry="5" fill="url(#pm-sk)"/>
        <rect x="88" y="44" width="4" height="19" rx="2" fill="#1a1a1a"/>
        <polygon points="88,44 92,44 90,39" fill="#c8a96e"/>
        {/* Neck */}
        <rect x="44" y="66" width="12" height="14" rx="5" fill="url(#pm-sk)"/>
        {/* HEAD */}
        <circle cx="50" cy="43" r="31" fill="url(#pm-sk)"/>
        {/* Ears */}
        <ellipse cx="19" cy="45" rx="4.5" ry="6.5" fill="url(#pm-sk)"/>
        <ellipse cx="81" cy="45" rx="4.5" ry="6.5" fill="url(#pm-sk)"/>
        <ellipse cx="19" cy="45" rx="2" ry="3.5" fill="#d4855a" opacity="0.4"/>
        <ellipse cx="81" cy="45" rx="2" ry="3.5" fill="#d4855a" opacity="0.4"/>
        {/* HAIR */}
        <path d="M19 38 Q20 7 50 5 Q80 7 81 38 Q77 11 50 13 Q23 11 19 38Z" fill="url(#pm-hr)"/>
        <path d="M19 38 Q17 48 18 57" fill="url(#pm-hr)"/>
        <path d="M81 38 Q83 48 82 57" fill="url(#pm-hr)"/>
        {/* Glasses over eyes */}
        <circle cx="37" cy="45" r="10.5" stroke="#c8a96e" strokeWidth="2" fill="rgba(195,225,245,0.07)"/>
        <circle cx="63" cy="45" r="10.5" stroke="#c8a96e" strokeWidth="2" fill="rgba(195,225,245,0.07)"/>
        <line x1="47.5" y1="45" x2="52.5" y2="45" stroke="#c8a96e" strokeWidth="2"/>
        <line x1="73.5" y1="43" x2="80" y2="46" stroke="#c8a96e" strokeWidth="1.5"/>
        <line x1="26.5" y1="43" x2="20" y2="46" stroke="#c8a96e" strokeWidth="1.5"/>
        {/* Eyes */}
        <ellipse cx="37" cy="45" rx="7" ry="6.5" fill="white"/>
        <circle cx="37" cy="46" r="4.5" fill="#1e140a"/>
        <circle cx="37" cy="46" r="2.3" fill="#0c0806"/>
        <circle cx="39" cy="43.5" r="1.6" fill="white"/>
        <ellipse cx="63" cy="45" rx="7" ry="6.5" fill="white"/>
        <circle cx="63" cy="46" r="4.5" fill="#1e140a"/>
        <circle cx="63" cy="46" r="2.3" fill="#0c0806"/>
        <circle cx="65" cy="43.5" r="1.6" fill="white"/>
        {/* Eyebrows */}
        <path d="M28 32 Q37 28 46 32" stroke="#1e140a" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M54 32 Q63 28 72 32" stroke="#1e140a" strokeWidth="2" fill="none" strokeLinecap="round"/>
        {/* Nose */}
        <circle cx="50" cy="57" r="1.8" fill="#d07a50" opacity="0.6"/>
        {/* Smile */}
        <path d="M41 65 Q50 72 59 65" stroke="#b86040" strokeWidth="2" fill="none" strokeLinecap="round"/>
        {/* Blush */}
        <ellipse cx="23" cy="56" rx="7" ry="3.5" fill="#ff9090" opacity="0.22"/>
        <ellipse cx="77" cy="56" rx="7" ry="3.5" fill="#ff9090" opacity="0.22"/>
      </svg>
    ),

    // White blouse + khaki wide pants + nude heels + round glasses + notebook + pen
    female: () => (
      <svg width="100" height="175" viewBox="0 0 100 175" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="pf-sk" cx="42%" cy="36%" r="60%"><stop offset="0%" stopColor="#fcd9b6"/><stop offset="100%" stopColor="#e09060"/></radialGradient>
          <radialGradient id="pf-hr" cx="50%" cy="22%" r="65%"><stop offset="0%" stopColor="#2e2010"/><stop offset="100%" stopColor="#0c0806"/></radialGradient>
        </defs>
        <ellipse cx="50" cy="170" rx="28" ry="7" fill="#111"/>
        {/* Nude heels */}
        <ellipse cx="37" cy="163" rx="9" ry="4" fill="#c8956e"/>
        <ellipse cx="63" cy="163" rx="9" ry="4" fill="#c8956e"/>
        <rect x="30" y="155" width="15" height="10" rx="3" fill="#c8956e"/>
        <rect x="55" y="155" width="15" height="10" rx="3" fill="#c8956e"/>
        {/* Heel spike */}
        <rect x="32" y="163" width="3" height="8" rx="1.5" fill="#b07a50"/>
        <rect x="57" y="163" width="3" height="8" rx="1.5" fill="#b07a50"/>
        {/* Khaki wide pants */}
        <rect x="30" y="118" width="17" height="40" rx="7" fill="#c4a87a"/>
        <rect x="53" y="118" width="17" height="40" rx="7" fill="#c4a87a"/>
        {/* Thin belt */}
        <rect x="28" y="114" width="44" height="6" rx="2" fill="#8a5a30"/>
        <rect x="46" y="113" width="8" height="8" rx="1" fill="#c8a96e"/>
        {/* White blouse */}
        <rect x="24" y="76" width="52" height="42" rx="9" fill="#f8f4f0"/>
        {/* Collar */}
        <path d="M39 76 L50 92 L61 76" fill="#eee8e0"/>
        <path d="M43 76 L50 86 L57 76" fill="#e0dad2"/>
        {/* Blouse buttons */}
        <circle cx="50" cy="96" r="1" fill="#c8a96e"/>
        <circle cx="50" cy="102" r="1" fill="#c8a96e"/>
        <circle cx="50" cy="108" r="1" fill="#c8a96e"/>
        {/* Lapels */}
        <path d="M39 76 L33 90 L41 103" fill="#eae4dc"/>
        <path d="M61 76 L67 90 L59 103" fill="#eae4dc"/>
        {/* Left arm holding notebook */}
        <path d="M24 88 Q9 98 7 114" stroke="#f8f4f0" strokeWidth="14" strokeLinecap="round" fill="none"/>
        <ellipse cx="8" cy="113" rx="6" ry="5" fill="url(#pf-sk)"/>
        <rect x="1" y="100" width="14" height="18" rx="2" fill="#0f172a"/>
        <rect x="6" y="98" width="4" height="4" rx="1" fill="#c8a96e"/>
        <line x1="3" y1="108" x2="14" y2="108" stroke="white" strokeWidth="0.9"/>
        <line x1="3" y1="112" x2="14" y2="112" stroke="white" strokeWidth="0.9"/>
        <line x1="3" y1="116" x2="11" y2="116" stroke="white" strokeWidth="0.9"/>
        {/* Right arm raised holding pen */}
        <path d="M76 88 Q87 78 89 65" stroke="#f8f4f0" strokeWidth="14" strokeLinecap="round" fill="none"/>
        <ellipse cx="89" cy="63" rx="5" ry="5" fill="url(#pf-sk)"/>
        <rect x="87" y="46" width="4" height="19" rx="2" fill="#1a1a1a"/>
        <polygon points="87,46 91,46 89,41" fill="#c8a96e"/>
        {/* Neck */}
        <rect x="44" y="66" width="12" height="14" rx="5" fill="url(#pf-sk)"/>
        {/* HEAD */}
        <circle cx="50" cy="43" r="31" fill="url(#pf-sk)"/>
        {/* Ears */}
        <ellipse cx="19" cy="45" rx="4.5" ry="6.5" fill="url(#pf-sk)"/>
        <ellipse cx="81" cy="45" rx="4.5" ry="6.5" fill="url(#pf-sk)"/>
        <ellipse cx="19" cy="45" rx="2" ry="3.5" fill="#d4855a" opacity="0.4"/>
        <ellipse cx="81" cy="45" rx="2" ry="3.5" fill="#d4855a" opacity="0.4"/>
        {/* Long wavy hair */}
        <path d="M19 37 Q20 7 50 5 Q80 7 81 37 Q77 11 50 13 Q23 11 19 37Z" fill="url(#pf-hr)"/>
        <path d="M19 37 Q15 52 16 72 Q17 88 19 98" stroke="#1e140a" strokeWidth="11" strokeLinecap="round" fill="none"/>
        <path d="M81 37 Q85 52 84 72 Q83 88 81 98" stroke="#1e140a" strokeWidth="11" strokeLinecap="round" fill="none"/>
        <path d="M17 68 Q15 78 17 88" stroke="#2a1e0e" strokeWidth="3" fill="none" strokeLinecap="round"/>
        {/* Round glasses */}
        <circle cx="37" cy="45" r="10.5" stroke="#c8a96e" strokeWidth="2" fill="rgba(195,225,245,0.07)"/>
        <circle cx="63" cy="45" r="10.5" stroke="#c8a96e" strokeWidth="2" fill="rgba(195,225,245,0.07)"/>
        <line x1="47.5" y1="45" x2="52.5" y2="45" stroke="#c8a96e" strokeWidth="2"/>
        <line x1="73.5" y1="43" x2="80" y2="46" stroke="#c8a96e" strokeWidth="1.5"/>
        <line x1="26.5" y1="43" x2="20" y2="46" stroke="#c8a96e" strokeWidth="1.5"/>
        {/* Eyes */}
        <ellipse cx="37" cy="45" rx="7" ry="6.5" fill="white"/>
        <circle cx="37" cy="46" r="4.5" fill="#1e140a"/>
        <circle cx="37" cy="46" r="2.3" fill="#0c0806"/>
        <circle cx="39" cy="43.5" r="1.6" fill="white"/>
        <ellipse cx="63" cy="45" rx="7" ry="6.5" fill="white"/>
        <circle cx="63" cy="46" r="4.5" fill="#1e140a"/>
        <circle cx="63" cy="46" r="2.3" fill="#0c0806"/>
        <circle cx="65" cy="43.5" r="1.6" fill="white"/>
        {/* Eyebrows */}
        <path d="M28 32 Q37 28 46 32" stroke="#1e140a" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M54 32 Q63 28 72 32" stroke="#1e140a" strokeWidth="2" fill="none" strokeLinecap="round"/>
        {/* Nose */}
        <circle cx="50" cy="57" r="1.8" fill="#d07a50" opacity="0.6"/>
        {/* Smile */}
        <path d="M41 65 Q50 72 59 65" stroke="#b86040" strokeWidth="2" fill="none" strokeLinecap="round"/>
        {/* Blush */}
        <ellipse cx="23" cy="56" rx="7" ry="3.5" fill="#ff9090" opacity="0.22"/>
        <ellipse cx="77" cy="56" rx="7" ry="3.5" fill="#ff9090" opacity="0.22"/>
        {/* Small earrings */}
        <circle cx="19" cy="52" r="2" fill="#c8a96e"/>
        <circle cx="81" cy="52" r="2" fill="#c8a96e"/>
      </svg>
    ),
  },

  independent: {
    // Olive open jacket + white tee + dark jeans + white sneakers + coffee cup
    male: () => (
      <svg width="100" height="175" viewBox="0 0 100 175" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="im-sk" cx="42%" cy="36%" r="60%"><stop offset="0%" stopColor="#fcd9b6"/><stop offset="100%" stopColor="#e09060"/></radialGradient>
          <radialGradient id="im-hr" cx="50%" cy="22%" r="65%"><stop offset="0%" stopColor="#2e2010"/><stop offset="100%" stopColor="#0c0806"/></radialGradient>
        </defs>
        <ellipse cx="50" cy="170" rx="28" ry="7" fill="#111"/>
        {/* White sneakers */}
        <ellipse cx="37" cy="162" rx="11" ry="5" fill="#e8e2da"/>
        <ellipse cx="63" cy="162" rx="11" ry="5" fill="#e8e2da"/>
        <rect x="28" y="150" width="20" height="14" rx="5" fill="#f0ece6"/>
        <rect x="52" y="150" width="20" height="14" rx="5" fill="#f0ece6"/>
        {/* Sneaker sole */}
        <rect x="28" y="160" width="20" height="5" rx="2" fill="#d8d0c8"/>
        <rect x="52" y="160" width="20" height="5" rx="2" fill="#d8d0c8"/>
        {/* Dark jeans */}
        <rect x="30" y="116" width="18" height="38" rx="7" fill="#2a3560"/>
        <rect x="52" y="116" width="18" height="38" rx="7" fill="#2a3560"/>
        {/* Jeans seam */}
        <line x1="39" y1="116" x2="39" y2="154" stroke="#222a50" strokeWidth="1" strokeDasharray="3 4"/>
        <line x1="61" y1="116" x2="61" y2="154" stroke="#222a50" strokeWidth="1" strokeDasharray="3 4"/>
        {/* Belt area */}
        <rect x="27" y="112" width="46" height="7" rx="2" fill="#1a2040"/>
        {/* Olive jacket (open) */}
        <rect x="22" y="76" width="56" height="40" rx="9" fill="#4a5a38"/>
        {/* White tee visible underneath */}
        <rect x="34" y="76" width="32" height="40" fill="#e8e2da"/>
        {/* Jacket lapels */}
        <path d="M34 76 L26 96 L34 116" fill="#405030"/>
        <path d="M66 76 L74 96 L66 116" fill="#405030"/>
        {/* Jacket collar crease */}
        <path d="M34 76 L40 86 L50 80 L60 86 L66 76" fill="#3e5028"/>
        {/* Left arm holding coffee */}
        <path d="M22 86 Q8 96 6 114" stroke="#4a5a38" strokeWidth="15" strokeLinecap="round" fill="none"/>
        <ellipse cx="7" cy="113" rx="6" ry="5" fill="url(#im-sk)"/>
        {/* Coffee mug */}
        <rect x="0" y="100" width="14" height="16" rx="3" fill="#1a1a1a"/>
        <path d="M14 104 Q19 104 19 109 Q19 114 14 114" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <rect x="0" y="100" width="14" height="5" rx="2" fill="#c8a96e"/>
        {/* Steam from coffee */}
        <path d="M4 98 Q5 94 4 90" stroke="#c0bbb5" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        <path d="M8 96 Q9 92 8 88" stroke="#c0bbb5" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        {/* Right arm, hand in pocket */}
        <path d="M78 86 Q90 94 92 110" stroke="#4a5a38" strokeWidth="15" strokeLinecap="round" fill="none"/>
        <ellipse cx="91" cy="110" rx="6" ry="5" fill="url(#im-sk)"/>
        {/* Neck */}
        <rect x="44" y="66" width="12" height="14" rx="5" fill="url(#im-sk)"/>
        {/* HEAD */}
        <circle cx="50" cy="43" r="31" fill="url(#im-sk)"/>
        {/* Ears */}
        <ellipse cx="19" cy="45" rx="4.5" ry="6.5" fill="url(#im-sk)"/>
        <ellipse cx="81" cy="45" rx="4.5" ry="6.5" fill="url(#im-sk)"/>
        <ellipse cx="19" cy="45" rx="2" ry="3.5" fill="#d4855a" opacity="0.4"/>
        <ellipse cx="81" cy="45" rx="2" ry="3.5" fill="#d4855a" opacity="0.4"/>
        {/* Wavy hair */}
        <path d="M19 37 Q20 7 50 5 Q80 7 81 37 Q77 10 60 11 Q50 8 40 11 Q23 10 19 37Z" fill="url(#im-hr)"/>
        <path d="M19 37 Q17 48 18 58" fill="url(#im-hr)"/>
        <path d="M81 37 Q83 48 82 58" fill="url(#im-hr)"/>
        {/* Wavy front */}
        <path d="M34 11 Q40 6 46 11 Q50 7 54 11 Q60 6 66 11" stroke="#2a1e0e" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        {/* Eyes */}
        <ellipse cx="37" cy="46" rx="7" ry="6.5" fill="white"/>
        <circle cx="37" cy="47" r="4.5" fill="#1e140a"/>
        <circle cx="37" cy="47" r="2.3" fill="#0c0806"/>
        <circle cx="39" cy="44.5" r="1.6" fill="white"/>
        <ellipse cx="63" cy="46" rx="7" ry="6.5" fill="white"/>
        <circle cx="63" cy="47" r="4.5" fill="#1e140a"/>
        <circle cx="63" cy="47" r="2.3" fill="#0c0806"/>
        <circle cx="65" cy="44.5" r="1.6" fill="white"/>
        {/* Eyebrows (natural) */}
        <path d="M29 33 Q37 29 45 33" stroke="#1e140a" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M55 33 Q63 29 71 33" stroke="#1e140a" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <circle cx="50" cy="57" r="1.8" fill="#d07a50" opacity="0.6"/>
        <path d="M42 65 Q50 71 58 65" stroke="#b86040" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <ellipse cx="23" cy="57" rx="7" ry="3.5" fill="#ff9090" opacity="0.22"/>
        <ellipse cx="77" cy="57" rx="7" ry="3.5" fill="#ff9090" opacity="0.22"/>
      </svg>
    ),

    // Olive jacket + cream wide pants + white sneakers + coffee + confident pose
    female: () => (
      <svg width="100" height="175" viewBox="0 0 100 175" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="if-sk" cx="42%" cy="36%" r="60%"><stop offset="0%" stopColor="#fcd9b6"/><stop offset="100%" stopColor="#e09060"/></radialGradient>
          <radialGradient id="if-hr" cx="50%" cy="22%" r="65%"><stop offset="0%" stopColor="#2e2010"/><stop offset="100%" stopColor="#0c0806"/></radialGradient>
        </defs>
        <ellipse cx="50" cy="170" rx="28" ry="7" fill="#111"/>
        {/* White sneakers */}
        <ellipse cx="37" cy="162" rx="11" ry="5" fill="#e8e2da"/>
        <ellipse cx="63" cy="162" rx="11" ry="5" fill="#e8e2da"/>
        <rect x="28" y="150" width="20" height="14" rx="5" fill="#f0ece6"/>
        <rect x="52" y="150" width="20" height="14" rx="5" fill="#f0ece6"/>
        <rect x="28" y="160" width="20" height="5" rx="2" fill="#d8d0c8"/>
        <rect x="52" y="160" width="20" height="5" rx="2" fill="#d8d0c8"/>
        {/* Cream wide pants */}
        <rect x="30" y="116" width="18" height="38" rx="7" fill="#e8e0d0"/>
        <rect x="52" y="116" width="18" height="38" rx="7" fill="#e8e0d0"/>
        {/* Belt */}
        <rect x="27" y="112" width="46" height="6" rx="2" fill="#8a6a40"/>
        <rect x="46" y="111" width="8" height="8" rx="1" fill="#c8a96e"/>
        {/* Olive jacket open */}
        <rect x="22" y="76" width="56" height="40" rx="9" fill="#4a5a38"/>
        {/* White tee under */}
        <rect x="34" y="76" width="32" height="40" fill="#e8e2da"/>
        <path d="M34 76 L26 96 L34 116" fill="#405030"/>
        <path d="M66 76 L74 96 L66 116" fill="#405030"/>
        <path d="M34 76 L40 86 L50 80 L60 86 L66 76" fill="#3e5028"/>
        {/* Left arm holding coffee */}
        <path d="M22 86 Q8 96 6 114" stroke="#4a5a38" strokeWidth="14" strokeLinecap="round" fill="none"/>
        <ellipse cx="7" cy="113" rx="6" ry="5" fill="url(#if-sk)"/>
        <rect x="0" y="100" width="14" height="16" rx="3" fill="#1a1a1a"/>
        <path d="M14 104 Q19 104 19 109 Q19 114 14 114" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <rect x="0" y="100" width="14" height="5" rx="2" fill="#c8a96e"/>
        <path d="M4 98 Q5 94 4 90" stroke="#c0bbb5" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        <path d="M8 96 Q9 92 8 88" stroke="#c0bbb5" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        {/* Right arm hand on hip */}
        <path d="M78 86 Q90 94 92 110" stroke="#4a5a38" strokeWidth="14" strokeLinecap="round" fill="none"/>
        <path d="M92 110 Q92 120 88 122" stroke="#4a5a38" strokeWidth="13" strokeLinecap="round" fill="none"/>
        <ellipse cx="87" cy="123" rx="6" ry="5" fill="url(#if-sk)"/>
        {/* Neck */}
        <rect x="44" y="66" width="12" height="14" rx="5" fill="url(#if-sk)"/>
        {/* HEAD */}
        <circle cx="50" cy="43" r="31" fill="url(#if-sk)"/>
        {/* Ears + earrings */}
        <ellipse cx="19" cy="45" rx="4.5" ry="6.5" fill="url(#if-sk)"/>
        <ellipse cx="81" cy="45" rx="4.5" ry="6.5" fill="url(#if-sk)"/>
        <ellipse cx="19" cy="45" rx="2" ry="3.5" fill="#d4855a" opacity="0.4"/>
        <ellipse cx="81" cy="45" rx="2" ry="3.5" fill="#d4855a" opacity="0.4"/>
        <circle cx="19" cy="52" r="2" fill="#c8a96e"/>
        <circle cx="81" cy="52" r="2" fill="#c8a96e"/>
        {/* Hair — messy bun on top */}
        <path d="M19 37 Q20 7 50 5 Q80 7 81 37 Q77 11 50 13 Q23 11 19 37Z" fill="url(#if-hr)"/>
        <path d="M19 37 Q17 48 18 57" fill="url(#if-hr)"/>
        <path d="M81 37 Q83 48 82 57" fill="url(#if-hr)"/>
        {/* Messy bun */}
        <circle cx="55" cy="8" r="8" fill="#1e140a"/>
        <circle cx="62" cy="5" r="5" fill="#1e140a"/>
        <circle cx="50" cy="5" r="5" fill="#1e140a"/>
        {/* Eyes */}
        <ellipse cx="37" cy="46" rx="7" ry="6.5" fill="white"/>
        <circle cx="37" cy="47" r="4.5" fill="#1e140a"/>
        <circle cx="37" cy="47" r="2.3" fill="#0c0806"/>
        <circle cx="39" cy="44.5" r="1.6" fill="white"/>
        <ellipse cx="63" cy="46" rx="7" ry="6.5" fill="white"/>
        <circle cx="63" cy="47" r="4.5" fill="#1e140a"/>
        <circle cx="63" cy="47" r="2.3" fill="#0c0806"/>
        <circle cx="65" cy="44.5" r="1.6" fill="white"/>
        <path d="M29 33 Q37 29 45 33" stroke="#1e140a" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M55 33 Q63 29 71 33" stroke="#1e140a" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <circle cx="50" cy="57" r="1.8" fill="#d07a50" opacity="0.6"/>
        <path d="M42 65 Q50 71 58 65" stroke="#b86040" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <ellipse cx="23" cy="57" rx="7" ry="3.5" fill="#ff9090" opacity="0.22"/>
        <ellipse cx="77" cy="57" rx="7" ry="3.5" fill="#ff9090" opacity="0.22"/>
      </svg>
    ),
  },

  balancer: {
    // Beige sweater + dark grey pants + white sneakers + tablet (both hands)
    male: () => (
      <svg width="100" height="175" viewBox="0 0 100 175" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bm-sk" cx="42%" cy="36%" r="60%"><stop offset="0%" stopColor="#fcd9b6"/><stop offset="100%" stopColor="#e09060"/></radialGradient>
          <radialGradient id="bm-hr" cx="50%" cy="22%" r="65%"><stop offset="0%" stopColor="#2e2010"/><stop offset="100%" stopColor="#0c0806"/></radialGradient>
        </defs>
        <ellipse cx="50" cy="170" rx="28" ry="7" fill="#111"/>
        {/* White sneakers */}
        <ellipse cx="37" cy="162" rx="11" ry="5" fill="#e8e2da"/>
        <ellipse cx="63" cy="162" rx="11" ry="5" fill="#e8e2da"/>
        <rect x="28" y="150" width="20" height="14" rx="5" fill="#f0ece6"/>
        <rect x="52" y="150" width="20" height="14" rx="5" fill="#f0ece6"/>
        <rect x="28" y="160" width="20" height="5" rx="2" fill="#d8d0c8"/>
        <rect x="52" y="160" width="20" height="5" rx="2" fill="#d8d0c8"/>
        {/* Dark grey pants */}
        <rect x="30" y="116" width="18" height="38" rx="7" fill="#444450"/>
        <rect x="52" y="116" width="18" height="38" rx="7" fill="#444450"/>
        {/* Beige sweater body */}
        <rect x="23" y="76" width="54" height="44" rx="9" fill="#c8a882"/>
        {/* Crew neck */}
        <ellipse cx="50" cy="78" rx="11" ry="7" fill="#b89870"/>
        {/* Ribbed hem */}
        <rect x="23" y="114" width="54" height="6" rx="2" fill="#b89870"/>
        {/* Both arms forward holding tablet */}
        <path d="M23 88 Q8 96 6 112" stroke="#c8a882" strokeWidth="15" strokeLinecap="round" fill="none"/>
        <path d="M77 88 Q92 96 94 112" stroke="#c8a882" strokeWidth="15" strokeLinecap="round" fill="none"/>
        {/* Tablet held in front */}
        <rect x="28" y="104" width="44" height="30" rx="3" fill="#0f172a"/>
        <rect x="30" y="106" width="40" height="24" rx="2" fill="#2a3a5a"/>
        {/* Tablet screen glow */}
        <rect x="31" y="107" width="38" height="22" rx="1" fill="#3a5080" opacity="0.7"/>
        <line x1="32" y1="110" x2="60" y2="110" stroke="#6a90c0" strokeWidth="0.8" opacity="0.6"/>
        <line x1="32" y1="114" x2="55" y2="114" stroke="#6a90c0" strokeWidth="0.8" opacity="0.6"/>
        <line x1="32" y1="118" x2="58" y2="118" stroke="#6a90c0" strokeWidth="0.8" opacity="0.6"/>
        <circle cx="70" cy="133" r="1.5" fill="#5a6a8a"/>
        {/* Hands on sides of tablet */}
        <ellipse cx="6" cy="112" rx="6" ry="5" fill="url(#bm-sk)"/>
        <ellipse cx="94" cy="112" rx="6" ry="5" fill="url(#bm-sk)"/>
        {/* Neck */}
        <rect x="44" y="66" width="12" height="14" rx="5" fill="url(#bm-sk)"/>
        {/* HEAD */}
        <circle cx="50" cy="43" r="31" fill="url(#bm-sk)"/>
        {/* Ears */}
        <ellipse cx="19" cy="45" rx="4.5" ry="6.5" fill="url(#bm-sk)"/>
        <ellipse cx="81" cy="45" rx="4.5" ry="6.5" fill="url(#bm-sk)"/>
        <ellipse cx="19" cy="45" rx="2" ry="3.5" fill="#d4855a" opacity="0.4"/>
        <ellipse cx="81" cy="45" rx="2" ry="3.5" fill="#d4855a" opacity="0.4"/>
        {/* Neat parted hair */}
        <path d="M19 38 Q20 7 50 5 Q80 7 81 38 Q77 11 50 13 Q23 11 19 38Z" fill="url(#bm-hr)"/>
        <path d="M19 38 Q17 48 18 58" fill="url(#bm-hr)"/>
        <path d="M81 38 Q83 48 82 58" fill="url(#bm-hr)"/>
        {/* Side part */}
        <path d="M38 12 Q40 8 50 8 Q60 8 62 12" stroke="#2a1e0e" strokeWidth="2" fill="none"/>
        {/* Eyes */}
        <ellipse cx="37" cy="46" rx="7" ry="6.5" fill="white"/>
        <circle cx="37" cy="47" r="4.5" fill="#1e140a"/>
        <circle cx="37" cy="47" r="2.3" fill="#0c0806"/>
        <circle cx="39" cy="44.5" r="1.6" fill="white"/>
        <ellipse cx="63" cy="46" rx="7" ry="6.5" fill="white"/>
        <circle cx="63" cy="47" r="4.5" fill="#1e140a"/>
        <circle cx="63" cy="47" r="2.3" fill="#0c0806"/>
        <circle cx="65" cy="44.5" r="1.6" fill="white"/>
        <path d="M29 33 Q37 29 45 33" stroke="#1e140a" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M55 33 Q63 29 71 33" stroke="#1e140a" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <circle cx="50" cy="57" r="1.8" fill="#d07a50" opacity="0.6"/>
        <path d="M42 65 Q50 71 58 65" stroke="#b86040" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <ellipse cx="23" cy="57" rx="7" ry="3.5" fill="#ff9090" opacity="0.22"/>
        <ellipse cx="77" cy="57" rx="7" ry="3.5" fill="#ff9090" opacity="0.22"/>
      </svg>
    ),

    // Beige blazer + blue wide-leg jeans + white sneakers + tablet
    female: () => (
      <svg width="100" height="175" viewBox="0 0 100 175" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bf-sk" cx="42%" cy="36%" r="60%"><stop offset="0%" stopColor="#fcd9b6"/><stop offset="100%" stopColor="#e09060"/></radialGradient>
          <radialGradient id="bf-hr" cx="50%" cy="22%" r="65%"><stop offset="0%" stopColor="#2e2010"/><stop offset="100%" stopColor="#0c0806"/></radialGradient>
        </defs>
        <ellipse cx="50" cy="170" rx="28" ry="7" fill="#111"/>
        {/* White sneakers */}
        <ellipse cx="37" cy="162" rx="11" ry="5" fill="#e8e2da"/>
        <ellipse cx="63" cy="162" rx="11" ry="5" fill="#e8e2da"/>
        <rect x="28" y="150" width="20" height="14" rx="5" fill="#f0ece6"/>
        <rect x="52" y="150" width="20" height="14" rx="5" fill="#f0ece6"/>
        <rect x="28" y="160" width="20" height="5" rx="2" fill="#d8d0c8"/>
        <rect x="52" y="160" width="20" height="5" rx="2" fill="#d8d0c8"/>
        {/* Blue wide-leg jeans */}
        <rect x="28" y="116" width="19" height="38" rx="8" fill="#4a6a98"/>
        <rect x="53" y="116" width="19" height="38" rx="8" fill="#4a6a98"/>
        {/* Jeans seam */}
        <line x1="37" y1="116" x2="37" y2="154" stroke="#3a5888" strokeWidth="1" strokeDasharray="3 4"/>
        <line x1="63" y1="116" x2="63" y2="154" stroke="#3a5888" strokeWidth="1" strokeDasharray="3 4"/>
        {/* Beige blazer */}
        <rect x="23" y="76" width="54" height="44" rx="9" fill="#d4b896"/>
        {/* White blouse inside */}
        <path d="M39 76 L50 94 L61 76" fill="#f8f4f0"/>
        <path d="M43 76 L50 86 L57 76" fill="#eae4dc"/>
        {/* Blazer lapels */}
        <path d="M39 76 L33 92 L41 106" fill="#c4a880"/>
        <path d="M61 76 L67 92 L59 106" fill="#c4a880"/>
        {/* Left arm with tablet */}
        <path d="M23 88 Q8 96 6 112" stroke="#d4b896" strokeWidth="14" strokeLinecap="round" fill="none"/>
        <path d="M77 88 Q92 96 94 112" stroke="#d4b896" strokeWidth="14" strokeLinecap="round" fill="none"/>
        {/* Tablet */}
        <rect x="28" y="104" width="44" height="30" rx="3" fill="#0f172a"/>
        <rect x="30" y="106" width="40" height="24" rx="2" fill="#2a3a5a"/>
        <rect x="31" y="107" width="38" height="22" rx="1" fill="#3a5080" opacity="0.7"/>
        <line x1="32" y1="110" x2="60" y2="110" stroke="#6a90c0" strokeWidth="0.8" opacity="0.6"/>
        <line x1="32" y1="114" x2="55" y2="114" stroke="#6a90c0" strokeWidth="0.8" opacity="0.6"/>
        <line x1="32" y1="118" x2="58" y2="118" stroke="#6a90c0" strokeWidth="0.8" opacity="0.6"/>
        <circle cx="70" cy="133" r="1.5" fill="#5a6a8a"/>
        <ellipse cx="6" cy="112" rx="6" ry="5" fill="url(#bf-sk)"/>
        <ellipse cx="94" cy="112" rx="6" ry="5" fill="url(#bf-sk)"/>
        {/* Neck */}
        <rect x="44" y="66" width="12" height="14" rx="5" fill="url(#bf-sk)"/>
        {/* HEAD */}
        <circle cx="50" cy="43" r="31" fill="url(#bf-sk)"/>
        {/* Ears + earrings */}
        <ellipse cx="19" cy="45" rx="4.5" ry="6.5" fill="url(#bf-sk)"/>
        <ellipse cx="81" cy="45" rx="4.5" ry="6.5" fill="url(#bf-sk)"/>
        <ellipse cx="19" cy="45" rx="2" ry="3.5" fill="#d4855a" opacity="0.4"/>
        <ellipse cx="81" cy="45" rx="2" ry="3.5" fill="#d4855a" opacity="0.4"/>
        <circle cx="19" cy="52" r="2" fill="#c8a96e"/>
        <circle cx="81" cy="52" r="2" fill="#c8a96e"/>
        {/* Long wavy hair */}
        <path d="M19 37 Q20 7 50 5 Q80 7 81 37 Q77 11 50 13 Q23 11 19 37Z" fill="url(#bf-hr)"/>
        <path d="M19 37 Q15 52 16 72 Q17 88 19 98" stroke="#1e140a" strokeWidth="11" strokeLinecap="round" fill="none"/>
        <path d="M81 37 Q85 52 84 72 Q83 88 81 98" stroke="#1e140a" strokeWidth="11" strokeLinecap="round" fill="none"/>
        <path d="M17 68 Q15 78 17 88" stroke="#2a1e0e" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <path d="M83 68 Q85 78 83 88" stroke="#2a1e0e" strokeWidth="3" fill="none" strokeLinecap="round"/>
        {/* Eyes */}
        <ellipse cx="37" cy="46" rx="7" ry="6.5" fill="white"/>
        <circle cx="37" cy="47" r="4.5" fill="#1e140a"/>
        <circle cx="37" cy="47" r="2.3" fill="#0c0806"/>
        <circle cx="39" cy="44.5" r="1.6" fill="white"/>
        <ellipse cx="63" cy="46" rx="7" ry="6.5" fill="white"/>
        <circle cx="63" cy="47" r="4.5" fill="#1e140a"/>
        <circle cx="63" cy="47" r="2.3" fill="#0c0806"/>
        <circle cx="65" cy="44.5" r="1.6" fill="white"/>
        <path d="M29 33 Q37 29 45 33" stroke="#1e140a" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M55 33 Q63 29 71 33" stroke="#1e140a" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <circle cx="50" cy="57" r="1.8" fill="#d07a50" opacity="0.6"/>
        <path d="M42 65 Q50 71 58 65" stroke="#b86040" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <ellipse cx="23" cy="57" rx="7" ry="3.5" fill="#ff9090" opacity="0.22"/>
        <ellipse cx="77" cy="57" rx="7" ry="3.5" fill="#ff9090" opacity="0.22"/>
      </svg>
    ),
  },

  drifter: {
    // Black leather jacket + dark cargo pants + black sneakers + hands in pockets
    male: () => (
      <svg width="100" height="175" viewBox="0 0 100 175" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="dm-sk" cx="42%" cy="36%" r="60%"><stop offset="0%" stopColor="#fcd9b6"/><stop offset="100%" stopColor="#e09060"/></radialGradient>
          <radialGradient id="dm-hr" cx="50%" cy="22%" r="65%"><stop offset="0%" stopColor="#2e2010"/><stop offset="100%" stopColor="#0c0806"/></radialGradient>
        </defs>
        <ellipse cx="50" cy="170" rx="28" ry="7" fill="#111"/>
        {/* Black hi-top sneakers */}
        <ellipse cx="37" cy="162" rx="11" ry="5" fill="#1a1a1a"/>
        <ellipse cx="63" cy="162" rx="11" ry="5" fill="#1a1a1a"/>
        <rect x="28" y="148" width="20" height="16" rx="4" fill="#222"/>
        <rect x="52" y="148" width="20" height="16" rx="4" fill="#222"/>
        {/* Sneaker sole */}
        <rect x="28" y="161" width="20" height="5" rx="2" fill="#333"/>
        <rect x="52" y="161" width="20" height="5" rx="2" fill="#333"/>
        {/* Laces */}
        <line x1="30" y1="153" x2="46" y2="153" stroke="#555" strokeWidth="1"/>
        <line x1="30" y1="157" x2="46" y2="157" stroke="#555" strokeWidth="1"/>
        <line x1="54" y1="153" x2="70" y2="153" stroke="#555" strokeWidth="1"/>
        <line x1="54" y1="157" x2="70" y2="157" stroke="#555" strokeWidth="1"/>
        {/* Dark cargo pants */}
        <rect x="30" y="116" width="18" height="36" rx="7" fill="#2a2a30"/>
        <rect x="52" y="116" width="18" height="36" rx="7" fill="#2a2a30"/>
        {/* Cargo pockets */}
        <rect x="31" y="128" width="9" height="10" rx="2" fill="#323238"/>
        <rect x="60" y="128" width="9" height="10" rx="2" fill="#323238"/>
        {/* Pocket snaps */}
        <circle cx="35" cy="128" r="1" fill="#444"/>
        <circle cx="64" cy="128" r="1" fill="#444"/>
        {/* Chain */}
        <path d="M60 120 Q62 125 64 128" stroke="#888" strokeWidth="1.5" fill="none"/>
        <circle cx="61" cy="122" r="1" fill="#888"/>
        <circle cx="63" cy="126" r="1" fill="#888"/>
        {/* Black leather jacket body */}
        <rect x="22" y="76" width="56" height="44" rx="9" fill="#1a1a1a"/>
        {/* Jacket lapels + open collar */}
        <path d="M38 76 L30 96 L40 116" fill="#111"/>
        <path d="M62 76 L70 96 L60 116" fill="#111"/>
        <path d="M38 76 L44 90 L50 84 L56 90 L62 76" fill="#222"/>
        {/* Jacket stitch details */}
        <path d="M32 88 Q36 96 38 108" stroke="#2e2e2e" strokeWidth="1.2" fill="none"/>
        <path d="M68 88 Q64 96 62 108" stroke="#2e2e2e" strokeWidth="1.2" fill="none"/>
        {/* Arms in pockets slouched */}
        <path d="M22 90 Q8 102 8 118" stroke="#1a1a1a" strokeWidth="15" strokeLinecap="round" fill="none"/>
        <path d="M78 90 Q92 102 92 118" stroke="#1a1a1a" strokeWidth="15" strokeLinecap="round" fill="none"/>
        {/* Neck */}
        <rect x="44" y="66" width="12" height="14" rx="5" fill="url(#dm-sk)"/>
        {/* HEAD */}
        <circle cx="50" cy="43" r="31" fill="url(#dm-sk)"/>
        {/* Ears */}
        <ellipse cx="19" cy="45" rx="4.5" ry="6.5" fill="url(#dm-sk)"/>
        <ellipse cx="81" cy="45" rx="4.5" ry="6.5" fill="url(#dm-sk)"/>
        <ellipse cx="19" cy="45" rx="2" ry="3.5" fill="#d4855a" opacity="0.4"/>
        <ellipse cx="81" cy="45" rx="2" ry="3.5" fill="#d4855a" opacity="0.4"/>
        {/* Messy hair */}
        <path d="M19 38 Q20 7 50 5 Q80 7 81 38 Q78 10 64 11 Q55 7 50 9 Q45 7 36 11 Q22 10 19 38Z" fill="url(#dm-hr)"/>
        <path d="M19 38 Q17 48 18 58" fill="url(#dm-hr)"/>
        <path d="M81 38 Q83 48 82 58" fill="url(#dm-hr)"/>
        {/* Messy spikes */}
        <path d="M34 10 Q37 4 40 10" fill="#1e140a"/>
        <path d="M42 8 Q45 2 48 8" fill="#1e140a"/>
        <path d="M50 9 Q53 3 56 9" fill="#1e140a"/>
        <path d="M58 11 Q61 5 64 11" fill="#1e140a"/>
        {/* Sleepy eyes (relaxed droopy) */}
        <ellipse cx="37" cy="47" rx="7" ry="5.5" fill="white"/>
        <ellipse cx="37" cy="48" rx="7" ry="2.5" fill="#1e140a" opacity="0.3"/>
        <circle cx="37" cy="48" r="4" fill="#1e140a"/>
        <circle cx="37" cy="48" r="2" fill="#0c0806"/>
        <circle cx="39" cy="46" r="1.4" fill="white"/>
        {/* Half-closed eyelid */}
        <path d="M30 44 Q37 41 44 44" stroke="#1e140a" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        <ellipse cx="63" cy="47" rx="7" ry="5.5" fill="white"/>
        <ellipse cx="63" cy="48" rx="7" ry="2.5" fill="#1e140a" opacity="0.3"/>
        <circle cx="63" cy="48" r="4" fill="#1e140a"/>
        <circle cx="63" cy="48" r="2" fill="#0c0806"/>
        <circle cx="65" cy="46" r="1.4" fill="white"/>
        <path d="M56 44 Q63 41 70 44" stroke="#1e140a" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        {/* Droopy brows */}
        <path d="M29 34 Q37 32 45 35" stroke="#1e140a" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M55 35 Q63 32 71 34" stroke="#1e140a" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <circle cx="50" cy="58" r="1.8" fill="#d07a50" opacity="0.6"/>
        {/* Lazy smirk */}
        <path d="M42 66 Q48 70 55 68" stroke="#b86040" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <ellipse cx="23" cy="58" rx="7" ry="3.5" fill="#ff9090" opacity="0.18"/>
        <ellipse cx="77" cy="58" rx="7" ry="3.5" fill="#ff9090" opacity="0.18"/>
        {/* z's */}
        <text x="67" y="16" fill="#c8a96e" fontSize="9" fontFamily="Georgia,serif" fontStyle="italic" opacity="0.85">z</text>
        <text x="73" y="9" fill="#c8a96e" fontSize="6" fontFamily="Georgia,serif" fontStyle="italic" opacity="0.55">z</text>
      </svg>
    ),

    // Black leather jacket + black crop top + cargo pants + black sneakers + sunglasses
    female: () => (
      <svg width="100" height="175" viewBox="0 0 100 175" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="df-sk" cx="42%" cy="36%" r="60%"><stop offset="0%" stopColor="#fcd9b6"/><stop offset="100%" stopColor="#e09060"/></radialGradient>
          <radialGradient id="df-hr" cx="50%" cy="22%" r="65%"><stop offset="0%" stopColor="#2e2010"/><stop offset="100%" stopColor="#0c0806"/></radialGradient>
        </defs>
        <ellipse cx="50" cy="170" rx="28" ry="7" fill="#111"/>
        {/* Black sneakers */}
        <ellipse cx="37" cy="162" rx="11" ry="5" fill="#1a1a1a"/>
        <ellipse cx="63" cy="162" rx="11" ry="5" fill="#1a1a1a"/>
        <rect x="28" y="150" width="20" height="14" rx="4" fill="#222"/>
        <rect x="52" y="150" width="20" height="14" rx="4" fill="#222"/>
        <rect x="28" y="161" width="20" height="5" rx="2" fill="#333"/>
        <rect x="52" y="161" width="20" height="5" rx="2" fill="#333"/>
        {/* Cargo pants all black */}
        <rect x="30" y="116" width="18" height="38" rx="7" fill="#1e1e24"/>
        <rect x="52" y="116" width="18" height="38" rx="7" fill="#1e1e24"/>
        <rect x="31" y="128" width="9" height="10" rx="2" fill="#282830"/>
        <rect x="60" y="128" width="9" height="10" rx="2" fill="#282830"/>
        {/* Chain */}
        <path d="M60 120 Q62 125 64 128" stroke="#888" strokeWidth="1.5" fill="none"/>
        <circle cx="61" cy="122" r="1" fill="#888"/>
        <circle cx="63" cy="126" r="1" fill="#888"/>
        {/* Black crop top visible */}
        <rect x="30" y="106" width="40" height="14" rx="3" fill="#111"/>
        {/* Black leather jacket */}
        <rect x="22" y="76" width="56" height="34" rx="9" fill="#1a1a1a"/>
        <path d="M38 76 L30 96 L40 110" fill="#111"/>
        <path d="M62 76 L70 96 L60 110" fill="#111"/>
        <path d="M38 76 L44 88 L50 82 L56 88 L62 76" fill="#222"/>
        <path d="M32 86 Q36 94 38 106" stroke="#2e2e2e" strokeWidth="1.2" fill="none"/>
        <path d="M68 86 Q64 94 62 106" stroke="#2e2e2e" strokeWidth="1.2" fill="none"/>
        {/* Arms hanging */}
        <path d="M22 88 Q8 100 8 116" stroke="#1a1a1a" strokeWidth="14" strokeLinecap="round" fill="none"/>
        <path d="M78 88 Q92 100 92 116" stroke="#1a1a1a" strokeWidth="14" strokeLinecap="round" fill="none"/>
        {/* Neck */}
        <rect x="44" y="66" width="12" height="14" rx="5" fill="url(#df-sk)"/>
        {/* HEAD */}
        <circle cx="50" cy="43" r="31" fill="url(#df-sk)"/>
        {/* Ears + earrings */}
        <ellipse cx="19" cy="45" rx="4.5" ry="6.5" fill="url(#df-sk)"/>
        <ellipse cx="81" cy="45" rx="4.5" ry="6.5" fill="url(#df-sk)"/>
        <ellipse cx="19" cy="45" rx="2" ry="3.5" fill="#d4855a" opacity="0.4"/>
        <ellipse cx="81" cy="45" rx="2" ry="3.5" fill="#d4855a" opacity="0.4"/>
        {/* Hoop earrings */}
        <circle cx="19" cy="52" r="3" stroke="#c8a96e" strokeWidth="1.5" fill="none"/>
        <circle cx="81" cy="52" r="3" stroke="#c8a96e" strokeWidth="1.5" fill="none"/>
        {/* Long wavy hair */}
        <path d="M19 37 Q20 7 50 5 Q80 7 81 37 Q77 11 50 13 Q23 11 19 37Z" fill="url(#df-hr)"/>
        <path d="M19 37 Q15 52 16 72 Q17 88 19 98" stroke="#1e140a" strokeWidth="11" strokeLinecap="round" fill="none"/>
        <path d="M81 37 Q85 52 84 72 Q83 88 81 98" stroke="#1e140a" strokeWidth="11" strokeLinecap="round" fill="none"/>
        <path d="M17 68 Q15 78 17 88 Q16 95 18 100" stroke="#2a1e0e" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <path d="M83 68 Q85 78 83 88 Q84 95 82 100" stroke="#2a1e0e" strokeWidth="3" fill="none" strokeLinecap="round"/>
        {/* Dark sunglasses — classic cat-eye */}
        <path d="M23 42 Q26 37 37 38 Q44 37 46 42 Q44 47 37 47 Q26 47 23 42Z" fill="#111"/>
        <path d="M54 42 Q56 36 65 37 Q75 37 78 42 Q76 48 65 48 Q56 47 54 42Z" fill="#111"/>
        {/* Bridge */}
        <path d="M46 42 Q50 40 54 42" stroke="#111" strokeWidth="2.5" fill="none"/>
        {/* Temples */}
        <path d="M23 42 Q20 42 18 44" stroke="#111" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M78 42 Q81 42 83 44" stroke="#111" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        {/* Lens shine */}
        <path d="M26 40 Q30 39 34 40" stroke="#333" strokeWidth="0.9" fill="none" strokeLinecap="round"/>
        <path d="M57 40 Q61 39 65 40" stroke="#333" strokeWidth="0.9" fill="none" strokeLinecap="round"/>
        {/* Eyebrows above glasses */}
        <path d="M26 34 Q37 30 46 34" stroke="#1e140a" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M54 34 Q63 30 74 34" stroke="#1e140a" strokeWidth="2" fill="none" strokeLinecap="round"/>
        {/* Nose + mouth */}
        <circle cx="50" cy="57" r="1.8" fill="#d07a50" opacity="0.6"/>
        <path d="M42 65 Q48 69 56 67" stroke="#b86040" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <ellipse cx="23" cy="57" rx="7" ry="3.5" fill="#ff9090" opacity="0.18"/>
        <ellipse cx="77" cy="57" rx="7" ry="3.5" fill="#ff9090" opacity="0.18"/>
        {/* z's */}
        <text x="67" y="16" fill="#c8a96e" fontSize="9" fontFamily="Georgia,serif" fontStyle="italic" opacity="0.85">z</text>
        <text x="73" y="9" fill="#c8a96e" fontSize="6" fontFamily="Georgia,serif" fontStyle="italic" opacity="0.55">z</text>
      </svg>
    ),
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
                        className="mb-4 flex justify-center">
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
