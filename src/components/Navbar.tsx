"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const quizLinks = [
  { href: "/financial-persona", label: "Financial Persona" },
  { href: "/couple-compatibility", label: "Couple Compatibility" },
];

const links = [
  { href: "/giveaway", label: "Giveaway" },
  { href: "/blog", label: "Blog" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [mobileQuizOpen, setMobileQuizOpen] = useState(false);
  const quizRef = useRef<HTMLDivElement>(null);

  const isQuizActive = quizLinks.some((l) => l.href === pathname);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (quizRef.current && !quizRef.current.contains(e.target as Node)) setQuizOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=Inter:wght@300;400;500&display=swap');
      `}</style>
      <nav className="sticky top-0 z-50 bg-[#FAF8F5] border-b border-[#e8e4df]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-[#0f172a] tracking-[0.08em] text-sm font-medium uppercase"
            style={{ fontFamily: "'Inter', sans-serif" }}>
            inner<span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 400 }}>me</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {/* Quiz dropdown */}
            <div ref={quizRef} className="relative">
              <button type="button" onClick={() => setQuizOpen((o) => !o)}
                className={`flex items-center gap-1.5 text-xs tracking-[0.15em] uppercase transition-colors duration-200 cursor-pointer ${
                  isQuizActive ? "text-[#0f172a] font-medium" : "text-[#9a9490] hover:text-[#0f172a]"
                }`}
                style={{ fontFamily: "'Inter', sans-serif" }}>
                Quiz
                <svg className={`w-2.5 h-2.5 transition-transform duration-200 ${quizOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 12 12">
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {quizOpen && (
                <div className="absolute left-0 top-8 z-50 w-56 bg-[#FAF8F5] border border-[#e8e4df] shadow-lg">
                  {quizLinks.map((l) => (
                    <Link key={l.href} href={l.href} onClick={() => setQuizOpen(false)}
                      className={`block px-4 py-3 text-xs tracking-[0.1em] uppercase transition-colors duration-150 ${
                        pathname === l.href ? "text-[#0f172a] font-medium bg-[#f0ece8]" : "text-[#9a9490] hover:text-[#0f172a] hover:bg-[#f0ece8]"
                      }`}
                      style={{ fontFamily: "'Inter', sans-serif" }}>
                      {l.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {links.map((l) => (
              <Link key={l.href} href={l.href}
                className={`text-xs tracking-[0.15em] uppercase transition-colors duration-200 ${
                  pathname === l.href
                    ? "text-[#0f172a] font-medium"
                    : "text-[#9a9490] hover:text-[#0f172a]"
                }`}
                style={{ fontFamily: "'Inter', sans-serif" }}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Mobile burger */}
          <button onClick={() => setOpen(!open)}
            className="md:hidden flex flex-col gap-1.5 p-2 cursor-pointer" aria-label="Menu">
            <span className={`block w-5 h-px bg-[#0f172a] transition-all duration-300 ${open ? "rotate-45 translate-y-2" : ""}`}/>
            <span className={`block w-5 h-px bg-[#0f172a] transition-all duration-300 ${open ? "opacity-0" : ""}`}/>
            <span className={`block w-5 h-px bg-[#0f172a] transition-all duration-300 ${open ? "-rotate-45 -translate-y-2" : ""}`}/>
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t border-[#e8e4df] bg-[#FAF8F5]">
            {/* Quiz expandable */}
            <button type="button" onClick={() => setMobileQuizOpen((o) => !o)}
              className={`w-full flex items-center justify-between px-6 py-4 text-xs tracking-[0.15em] uppercase border-b border-[#f0ece8] cursor-pointer ${
                isQuizActive ? "text-[#0f172a] font-medium" : "text-[#9a9490]"
              }`}
              style={{ fontFamily: "'Inter', sans-serif" }}>
              Quiz
              <svg className={`w-2.5 h-2.5 transition-transform duration-200 ${mobileQuizOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 12 12">
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {mobileQuizOpen && quizLinks.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => { setOpen(false); setMobileQuizOpen(false); }}
                className={`block pl-10 pr-6 py-3 text-xs tracking-[0.1em] uppercase border-b border-[#f0ece8] bg-[#f7f4f0] ${
                  pathname === l.href ? "text-[#0f172a] font-medium" : "text-[#9a9490]"
                }`}
                style={{ fontFamily: "'Inter', sans-serif" }}>
                {l.label}
              </Link>
            ))}

            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                className={`block px-6 py-4 text-xs tracking-[0.15em] uppercase border-b border-[#f0ece8] ${
                  pathname === l.href ? "text-[#0f172a] font-medium" : "text-[#9a9490]"
                }`}
                style={{ fontFamily: "'Inter', sans-serif" }}>
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </>
  );
}
