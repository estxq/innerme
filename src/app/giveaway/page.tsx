"use client";
import { useState, useRef, useEffect } from "react";

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

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyaBDJ8He8DH-jDQl0kDFa3sNYmYJ8_gFj2MA-ZDmh0sg9VvlehpP4Ti7LZpksq1lOR5w/exec";

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
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 text-sm font-light text-[#0f172a] focus:outline-none"
      >
        <span className="text-base leading-none">{selected.flag}</span>
        <span>{selected.code}</span>
        <svg className={`w-3 h-3 text-[#9a9490] transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 12 12">
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-8 z-50 w-64 bg-[#FAF8F5] border border-[#e8e4df] shadow-lg">
          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2.5 border-b border-[#e8e4df]">
            <svg className="w-3 h-3 text-[#9a9490] shrink-0" fill="none" viewBox="0 0 16 16">
              <circle cx="6.5" cy="6.5" r="4" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M10 10l3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search country..."
              className="bg-transparent text-xs text-[#0f172a] placeholder:text-[#c0bbb5] focus:outline-none w-full font-light"
            />
          </div>

          {/* List */}
          <ul className="max-h-52 overflow-y-auto">
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-xs text-[#9a9490]">No results</li>
            ) : filtered.map(c => (
              <li key={c.code}>
                <button
                  type="button"
                  onClick={() => { onChange(c.code); setOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-[#f0ece8] transition-colors duration-150 ${c.code === value ? "bg-[#f0ece8]" : ""}`}
                >
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

export default function GiveawayPage() {
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+65");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setLoading(true);
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ name, phone: `${countryCode.replace(/^\+/, "")} ${phone}`, source: "giveaway" }),
      });
    } catch {}
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <div className="min-h-[calc(100dvh-57px)] bg-[#FAF8F5] flex flex-col items-center justify-center px-6 py-20"
      style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Inter:wght@300;400;500&display=swap');`}</style>

      <div className="w-full max-w-md">
        {!submitted ? (
          <>
            <p className="text-xs tracking-[0.25em] text-[#9a9490] uppercase mb-6">Giveaway</p>
            <h1 className="text-[clamp(2rem,6vw,3.5rem)] leading-[1.1] text-[#0f172a] mb-4"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}>
              Complete a session,<br /><em>win something nice.</em>
            </h1>
            <p className="text-[#9a9490] font-light text-sm leading-relaxed mb-10 max-w-xs">
              Book a complimentary 20-minute session with us. Everyone who completes one walks away with a gift.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] tracking-[0.2em] text-[#9a9490] uppercase">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  className="bg-transparent border-b border-[#e8e4df] pb-3 text-[#0f172a] text-sm font-light placeholder:text-[#c0bbb5] focus:outline-none focus:border-[#0f172a] transition-colors duration-200"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] tracking-[0.2em] text-[#9a9490] uppercase">Phone Number</label>
                <div className="flex items-center gap-3 border-b border-[#e8e4df] pb-3 focus-within:border-[#0f172a] transition-colors duration-200">
                  <CountryPicker value={countryCode} onChange={setCountryCode} />
                  <div className="w-px h-4 bg-[#e8e4df]" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="9123 4567"
                    required
                    className="bg-transparent text-[#0f172a] text-sm font-light placeholder:text-[#c0bbb5] focus:outline-none flex-1 min-w-0"
                  />
                </div>
              </div>

              <p className="text-[10px] text-[#b0aba5] leading-relaxed -mt-2">
                By clicking Submit, you consent to InnerMe collecting and using your personal data to contact you, and related updates in accordance with the PDPA.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex items-center gap-3 text-sm tracking-[0.1em] text-[#0f172a] uppercase group disabled:opacity-40 transition-opacity">
                <span>{loading ? "Submitting..." : "Reserve my spot"}</span>
                {!loading && (
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 16 16">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </form>
          </>
        ) : (
          <div>
            <p className="text-xs tracking-[0.25em] text-[#9a9490] uppercase mb-6">You&apos;re in</p>
            <h1 className="text-[clamp(2rem,6vw,3.5rem)] leading-[1.1] text-[#0f172a] mb-4"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}>
              See you <em>soon.</em>
            </h1>
            <p className="text-[#9a9490] font-light text-sm leading-relaxed max-w-xs">
              Our team will be in touch with you to arrange a time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
