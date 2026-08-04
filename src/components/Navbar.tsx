"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/financial-persona", label: "Financial Persona" },
  { href: "/couple-compatibility", label: "Couple Compatibility" },
  { href: "/lucky-draw", label: "Lucky Draw" },
  { href: "/giveaway", label: "Giveaway" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

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
