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

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyaBDJ8He8DH-jDQl0kDFa3sNYmYJ8_gFj2MA-ZDmh0sg9VvlehpP4Ti7LZpksq1lOR5w/exec";

export default function LuckyDrawPage() {
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+65");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  function validatePhone(code: string, num: string): string {
    const digits = num.replace(/\D/g, "");
    if (!digits) return "Please enter your phone number.";
    if (code === "+65") {
      if (!/^[89]\d{7}$/.test(digits)) return "Enter a valid 8-digit SG number starting with 8 or 9.";
    } else {
      if (digits.length < 7 || digits.length > 12) return "Enter a valid phone number.";
    }
    return "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setPhoneError("Please enter your name."); return; }
    const err = validatePhone(countryCode, phone);
    if (err) { setPhoneError(err); return; }
    setPhoneError("");
    setLoading(true);
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ name, phone: `${countryCode.replace(/^\+/, "")} ${phone}`, source: "lucky-draw" }),
      });
    } catch {}
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <div className="min-h-[calc(100dvh-57px)] bg-[#FAF8F5] flex flex-col"
      style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Inter:wght@300;400;500&display=swap');
        .serif { font-family: 'Playfair Display', Georgia, serif; }
      `}</style>

      {!submitted ? (
        <div className="flex-1 flex flex-col lg:flex-row">

          {/* Left — prize info */}
          <div className="lg:w-1/2 bg-[#c8a96e] px-10 pt-16 pb-16 flex flex-col justify-start">
            <p className="text-xs tracking-[0.3em] text-[#0f172a] uppercase mb-10">Lucky Draw</p>
            <h1 className="serif text-[clamp(2.8rem,6vw,4.5rem)] leading-[1.1] text-[#0f172a] mb-8">
              20 winners.<br /><em>One entry.</em>
            </h1>
            <p className="text-[#5a4020] font-light text-base leading-relaxed max-w-xs mb-8">
              Enter your details for a chance to win a Grab voucher. Twenty lucky winners will be drawn at random.
            </p>

            {/* Deadline banner */}
            <div className="flex items-center gap-3 mb-8">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0">
                <circle cx="8" cy="8" r="6.5" stroke="#0f172a" strokeWidth="1.2"/>
                <path d="M8 4.5v4l2.5 2" stroke="#0f172a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p className="text-[#0f172a] text-xs tracking-[0.12em] font-light uppercase">Draw closes 31 July 2026</p>
            </div>

            {/* Prize card */}
            <div className="border border-[rgba(15,23,42,0.2)] bg-[rgba(255,255,255,0.15)] p-6 max-w-xs mb-4">
              <p className="text-[10px] tracking-[0.25em] text-[#0f172a] uppercase mb-4">The Prize</p>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 shrink-0 flex items-center justify-center border border-[#0f172a] opacity-80">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" stroke="#0f172a" strokeWidth="1.5" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <p className="text-[#0f172a] font-light text-base leading-snug">Grab Voucher</p>
                  <p className="text-[#5a4020] text-xs font-light mt-1">Awarded to 20 randomly selected winners</p>
                </div>
              </div>
            </div>

            {/* Note — directly below prize card */}
            <p className="text-[#7a5a30] text-xs font-light leading-relaxed max-w-xs">
              Winners will be contacted via the phone number provided. Draw closes 31 July 2026.
            </p>
          </div>

          {/* Right — form */}
          <div className="lg:w-1/2 px-10 pt-16 pb-16 flex flex-col justify-start">
            <p className="text-xs tracking-[0.25em] text-[#9a9490] uppercase mb-10">Enter the draw</p>
            <h2 className="serif text-[clamp(2.8rem,6vw,4.5rem)] leading-[1.1] text-[#0f172a] mb-8">
              Your details,<br /><em>that&apos;s all we need.</em>
            </h2>
            <p className="text-[#9a9490] font-light text-sm leading-relaxed mb-10 max-w-xs">
              One entry per person. Fill in your name and phone number and you&apos;re in.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col max-w-sm">
              <div className="flex flex-col gap-1.5 mb-6">
                <label className="text-[10px] tracking-[0.2em] text-[#9a9490] uppercase">Name</label>
                <input value={name} onChange={e => setName(e.target.value)}
                  placeholder="Your name" required
                  className="bg-transparent border-b border-[#e8e4df] pb-3 text-[#0f172a] text-sm font-light placeholder:text-[#c0bbb5] focus:outline-none focus:border-[#0f172a] transition-colors duration-200"/>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] tracking-[0.2em] text-[#9a9490] uppercase">Phone Number</label>
                <div className="flex items-center gap-3 border-b border-[#e8e4df] pb-3 focus-within:border-[#0f172a] transition-colors duration-200">
                  <CountryPicker value={countryCode} onChange={setCountryCode}/>
                  <div className="w-px h-4 bg-[#e8e4df]"/>
                  <input value={phone} onChange={e => setPhone(e.target.value)}
                    placeholder="9123 4567" type="tel" required
                    className="bg-transparent text-[#0f172a] text-sm font-light placeholder:text-[#c0bbb5] focus:outline-none flex-1 min-w-0"/>
                </div>
              </div>

              {phoneError && <p className="text-red-400 text-xs mt-4 font-light">{phoneError}</p>}
              <button type="submit" disabled={loading}
                className="mt-8 inline-flex items-center gap-3 bg-[#0f172a] text-[#FAF8F5] px-8 py-4 text-sm tracking-[0.12em] uppercase hover:bg-[#1e293b] transition-colors duration-300 self-start disabled:opacity-40 cursor-pointer">
                {loading ? "Entering..." : "Enter the draw"}
                {!loading && (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>

              <p className="mt-6 text-[10px] text-[#c0bbb5] leading-relaxed max-w-xs">
                By clicking Enter, you consent to InnerMe collecting and using your personal data to contact you, and related updates in accordance with the PDPA.
              </p>
            </form>
          </div>

        </div>
      ) : (
        /* Confirmation */
        <div className="flex-1 flex items-center justify-center px-10">
          <div className="max-w-md text-center">
            <p className="text-xs tracking-[0.25em] text-[#9a9490] uppercase mb-6">You&apos;re in</p>
            <h1 className="serif text-[clamp(2.2rem,5vw,3.5rem)] leading-[1.15] text-[#0f172a] mb-4">
              Good luck,<br /><em>{name}.</em>
            </h1>
            <p className="text-[#9a9490] font-light text-sm leading-relaxed max-w-xs mx-auto">
              Your entry has been recorded. If you&apos;re one of the 20 winners, we&apos;ll reach out to you directly.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
