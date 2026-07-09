"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [intro, setIntro] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 1800);
    const hideTimer = setTimeout(() => setIntro(false), 2600);
    return () => { clearTimeout(fadeTimer); clearTimeout(hideTimer); };
  }, []);

  return (
    <div className="bg-[#FAF8F5]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Inter:wght@300;400;500&display=swap');
        .serif { font-family: 'Playfair Display', Georgia, serif; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up   { animation: fadeUp 0.9s ease forwards; }
        .fade-up-2 { animation: fadeUp 0.9s 0.15s ease forwards; opacity: 0; }
        .fade-up-3 { animation: fadeUp 0.9s 0.3s ease forwards; opacity: 0; }
        .fade-up-4 { animation: fadeUp 0.9s 0.45s ease forwards; opacity: 0; }

        @keyframes introLetterIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .intro-word { animation: introLetterIn 0.9s cubic-bezier(0.16,1,0.3,1) forwards; opacity: 0; }
        .intro-word-2 { animation: introLetterIn 0.9s 0.25s cubic-bezier(0.16,1,0.3,1) forwards; opacity: 0; }

        @keyframes introFadeOut {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
        .intro-fade-out { animation: introFadeOut 0.8s ease forwards; }
      `}</style>

      {/* Intro overlay */}
      {intro && (
        <div className={`fixed inset-0 z-50 bg-[#FAF8F5] flex items-center justify-center ${fadeOut ? "intro-fade-out" : ""}`}>
          <p className="text-[clamp(1.2rem,4vw,2rem)] text-[#0f172a] tracking-[0.08em] uppercase"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
            <span className="intro-word">INNER</span><span className="intro-word-2" style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 400, textTransform: "none" }}>ME</span>
          </p>
        </div>
      )}

      {/* Hero */}
      <section className="relative min-h-[calc(100dvh-57px)] flex flex-col items-center justify-center px-8 md:px-16 overflow-hidden text-center">

        {/* Background image */}
        <div className="absolute inset-0 pointer-events-none">
          <img src="/magicpattern-oPH_5xuMgQw-unsplash.jpg" alt="" className="w-full h-full object-cover"/>
          <div className="absolute inset-0 bg-[#FAF8F5]/70"/>
        </div>

        <div className="relative max-w-3xl">
          <p className="fade-up text-[10px] tracking-[0.35em] text-[#c8a96e] uppercase mb-4">Welcome to InnerMe</p>

          <h1 className="fade-up-2 serif text-[clamp(2.8rem,7vw,5.5rem)] leading-[1.1] text-[#0f172a] mb-5">
            Know your money.<br /><em>Know yourself.</em>
          </h1>

          <p className="fade-up-3 text-[#9a9490] font-light text-base md:text-lg leading-relaxed mb-8 max-w-md mx-auto">
            Discover the financial personality behind your decisions and build a future that actually fits you.
          </p>

          <div className="fade-up-4 flex flex-wrap gap-4 justify-center">
            <Link href="/financial-persona"
              className="inline-flex items-center gap-3 bg-[#0f172a] text-[#FAF8F5] px-8 py-4 text-sm tracking-[0.12em] uppercase hover:bg-[#1e293b] transition-colors duration-300">
              Begin your journey
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link href="/couple-compatibility"
              className="inline-flex items-center gap-3 border border-[#e8e4df] text-[#0f172a] px-8 py-4 text-sm tracking-[0.12em] uppercase hover:border-[#0f172a] transition-colors duration-300">
              Take it as a couple
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
