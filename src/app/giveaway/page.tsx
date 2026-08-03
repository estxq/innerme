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
const DEADLINE = new Date("2026-07-31T23:59:59+08:00");

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

function useCountdown(target: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    function tick() {
      const diff = Math.max(0, target.getTime() - Date.now());
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return timeLeft;
}

export default function GiveawayPage() {
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+65");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [agreed, setAgreed] = useState(false);
  const countdown = useCountdown(DEADLINE);

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
    if (!agreed) { setPhoneError("Please agree to the terms before submitting."); return; }
    setPhoneError("");
    setLoading(true);
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST", mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ name, phone: `${countryCode.replace(/^\+/, "")} ${phone}`, source: "giveaway" }),
      });
    } catch {}
    setLoading(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="min-h-[calc(100dvh-57px)] bg-[#FAF8F5] flex items-center justify-center px-6"
        style={{ fontFamily: "'Inter', sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Inter:wght@300;400;500&display=swap');`}</style>
        <div className="text-center">
          <p className="text-xs tracking-[0.25em] text-[#9a9490] uppercase mb-6">You&apos;re in</p>
          <h1 className="text-[clamp(2rem,6vw,3.5rem)] leading-[1.1] text-[#0f172a] mb-6"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}>
            See you <em>soon.</em>
          </h1>
          <p className="text-[#9a9490] font-light text-sm leading-relaxed max-w-xs mx-auto">
            Our team will be in touch with you to arrange a time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100dvh-57px)] bg-[#FAF8F5]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Inter:wght@300;400;500&display=swap');
        .serif { font-family: 'Playfair Display', Georgia, serif; }
      `}</style>

      {/* Hero banner */}
      <div className="bg-[#0f172a] px-6 py-12 text-center">
        <p className="text-xs tracking-[0.3em] text-[#c8a96e] uppercase mb-4">InnerMe Giveaway</p>
        <h1 className="serif text-[clamp(2rem,5vw,3.5rem)] leading-[1.15] text-white mb-8">
          Win a pair of<br /><em>Sporting Sunglasses.</em>
        </h1>

        {/* Countdown */}
        <div className="flex justify-center gap-6 mb-2">
          {[
            { label: "Days", val: countdown.days },
            { label: "Hours", val: countdown.hours },
            { label: "Minutes", val: countdown.minutes },
            { label: "Seconds", val: countdown.seconds },
          ].map(({ label, val }) => (
            <div key={label} className="text-center">
              <p className="serif text-[clamp(2rem,6vw,3.5rem)] leading-none text-white font-light">
                {String(val).padStart(2, "0")}
              </p>
              <p className="text-[10px] tracking-[0.2em] text-[#9a9490] uppercase mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How to win */}
      <div className="max-w-2xl mx-auto px-6 py-10 border-b border-[#e8e4df]">
        <p className="text-xs tracking-[0.25em] text-[#9a9490] uppercase mb-6">How to win</p>
        <div className="flex flex-col gap-5">
          {[
            { n: "1", title: "Fill in the form below", desc: "Enter your name and mobile number." },
            { n: "2", title: "Complete a session with us", desc: "Book and attend a complimentary 20-minute financial planning session." },
            { n: "3", title: "Get entered into the draw", desc: "One winner will be selected at random after the draw closes on 31 July 2026." },
          ].map(step => (
            <div key={step.n} className="flex items-start gap-4">
              <div className="w-6 h-6 rounded-full bg-[#c8a96e] flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[10px] text-white font-medium">{step.n}</span>
              </div>
              <div>
                <p className="text-sm text-[#0f172a] font-medium">{step.title}</p>
                <p className="text-xs text-[#9a9490] font-light mt-0.5 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-6 py-10">
        <p className="text-xs tracking-[0.25em] text-[#9a9490] uppercase mb-6">Enter the giveaway</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] tracking-[0.2em] text-[#9a9490] uppercase">Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="Your full name" required
              className="bg-transparent border-b border-[#e8e4df] pb-3 text-[#0f172a] text-sm font-light placeholder:text-[#c0bbb5] focus:outline-none focus:border-[#0f172a] transition-colors duration-200"/>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] tracking-[0.2em] text-[#9a9490] uppercase">Mobile Number</label>
            <div className="flex items-center gap-3 border-b border-[#e8e4df] pb-3 focus-within:border-[#0f172a] transition-colors duration-200">
              <CountryPicker value={countryCode} onChange={setCountryCode}/>
              <div className="w-px h-4 bg-[#e8e4df]"/>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                placeholder="9123 4567" required
                className="bg-transparent text-[#0f172a] text-sm font-light placeholder:text-[#c0bbb5] focus:outline-none flex-1 min-w-0"/>
            </div>
          </div>

          {/* Consent box */}
          <div>
            <p className="text-xs text-[#4a4540] font-light mb-3 leading-relaxed">
              By clicking Submit and entering the Giveaway, you agree that you have read the following and consent to:
            </p>
            <div className="border border-[#e8e4df] p-4 max-h-40 overflow-y-auto text-[11px] text-[#9a9490] font-light leading-relaxed space-y-3">
              <p><strong className="text-[#4a4540]">A. InnerMe:</strong></p>
              <p>a. collecting and processing the contact details and personal data you have provided, including for the purposes of the Giveaway;</p>
              <p>b. and its partners sending you financial planning content, news and exclusive offers by SMS, phone calls, email and other electronic means; and</p>
              <p>c. disclosing your personal data to our financial planning partners, each in accordance with the Personal Data Protection Act (PDPA).</p>
              <p><strong className="text-[#4a4540]">B. Our financial planning partners</strong> and their respective representatives collecting, using, disclosing and/or processing your personal data for the purpose of contacting you about financial planning products and services through all channels including but not limited to SMS, Social Media, In-app Push Notifications, Phone Calls, etc.</p>
              <p>You hereby expressly understand and agree that your given consent(s) herein do not supersede or replace any other consents which you may have previously given in respect of your personal data.</p>
              <p>You understand that you may withdraw your consent at any time by contacting us directly.</p>
            </div>

            <label className="flex items-start gap-3 mt-4 cursor-pointer">
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                className="mt-0.5 accent-[#0f172a] shrink-0"/>
              <span className="text-[11px] text-[#9a9490] font-light leading-relaxed">
                I have read and agree to the above terms and consent to InnerMe collecting and using my personal data in accordance with the PDPA.
              </span>
            </label>
          </div>

          {phoneError && <p className="text-red-400 text-xs font-light">{phoneError}</p>}

          <button type="submit" disabled={loading}
            className="inline-flex items-center gap-3 bg-[#0f172a] text-[#FAF8F5] px-8 py-4 text-sm tracking-[0.12em] uppercase hover:bg-[#1e293b] transition-colors duration-300 self-start disabled:opacity-40 cursor-pointer">
            {loading ? "Submitting..." : "Submit entry"}
            {!loading && (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
