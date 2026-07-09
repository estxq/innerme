import Link from "next/link";

const quizzes = [
  {
    href: "/financial-persona",
    num: "01",
    title: "Financial Persona",
    desc: "Discover your money mindset in 10 questions.",
    tag: "Self-discovery",
  },
  {
    href: "/couple-compatibility",
    num: "02",
    title: "Couple Compatibility",
    desc: "See how you and your partner align financially.",
    tag: "Relationships",
  },
];

export default function Home() {
  return (
    <div className="bg-[#FAF8F5]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Inter:wght@300;400;500&display=swap');
        .serif { font-family: 'Playfair Display', Georgia, serif; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.9s ease forwards; }
        .fade-up-2 { animation: fadeUp 0.9s 0.15s ease forwards; opacity: 0; }
        .fade-up-3 { animation: fadeUp 0.9s 0.3s ease forwards; opacity: 0; }
        .fade-up-4 { animation: fadeUp 0.9s 0.45s ease forwards; opacity: 0; }
      `}</style>

      {/* Hero */}
      <section className="relative min-h-[calc(100dvh-57px)] flex flex-col justify-center px-8 md:px-16 overflow-hidden">

        {/* Decorative background elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Large faint circle top right */}
          <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full border border-[#e8e4df] opacity-60"/>
          <div className="absolute -top-16 -right-16 w-[400px] h-[400px] rounded-full border border-[#e8e4df] opacity-40"/>
          {/* Gold accent line */}
          <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-[#c8a96e]/20 to-transparent"/>
          {/* Faint monogram watermark */}
          <p className="absolute bottom-12 right-8 md:right-16 serif text-[clamp(8rem,20vw,18rem)] leading-none text-[#0f172a] opacity-[0.03] select-none font-medium italic">
            im
          </p>
        </div>

        <div className="relative max-w-3xl">
          <p className="fade-up text-[10px] tracking-[0.35em] text-[#c8a96e] uppercase mb-8">Welcome to InnerMe</p>

          <h1 className="fade-up-2 serif text-[clamp(2.8rem,7vw,5.5rem)] leading-[1.1] text-[#0f172a] mb-8">
            Know your money.<br /><em>Know yourself.</em>
          </h1>

          <p className="fade-up-3 text-[#9a9490] font-light text-base md:text-lg leading-relaxed mb-12 max-w-md">
            Discover the financial personality behind your decisions — and build a future that actually fits you.
          </p>

          <div className="fade-up-4 flex flex-wrap gap-4">
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

        {/* Scroll hint */}
        <div className="absolute bottom-10 left-8 md:left-16 flex items-center gap-3">
          <div className="w-px h-10 bg-gradient-to-b from-[#c8a96e] to-transparent"/>
          <p className="text-[10px] tracking-[0.25em] text-[#c0bbb5] uppercase">Explore</p>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-[#e8e4df] mx-8 md:mx-16"/>

      {/* What we offer */}
      <section className="px-8 md:px-16 py-20 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <p className="text-[10px] tracking-[0.35em] text-[#9a9490] uppercase mb-4">What we offer</p>
            <h2 className="serif text-[clamp(2rem,4vw,3rem)] leading-[1.15] text-[#0f172a]">
              Two ways to<br /><em>understand yourself.</em>
            </h2>
          </div>
          <p className="text-[#9a9490] font-light text-sm leading-relaxed max-w-xs">
            Each experience is designed to give you a clearer picture of your financial identity — alone or together.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {quizzes.map((q, i) => (
            <Link key={q.href} href={q.href}
              className="group border border-[#e8e4df] p-8 flex flex-col justify-between min-h-[260px] hover:border-[#0f172a] transition-colors duration-300">
              <div className="flex items-start justify-between mb-10">
                <span className="text-[10px] tracking-[0.2em] text-[#c0bbb5] uppercase">{q.num}</span>
                <span className="text-[10px] tracking-[0.15em] text-[#c8a96e] uppercase border border-[#c8a96e]/30 px-2.5 py-1">{q.tag}</span>
              </div>
              <div>
                <h3 className="serif text-[clamp(1.4rem,3vw,2rem)] leading-snug text-[#0f172a] mb-3 group-hover:italic transition-all duration-300">{q.title}</h3>
                <p className="text-xs text-[#9a9490] font-light leading-relaxed mb-6">{q.desc}</p>
                <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] text-[#0f172a] uppercase group-hover:gap-4 transition-all duration-300">
                  <span>Start</span>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom statement */}
      <section className="border-t border-[#e8e4df] mx-8 md:mx-16 py-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <p className="serif text-[clamp(1.4rem,3vw,2rem)] leading-snug text-[#0f172a] max-w-md">
          Your financial personality is<br /><em>not a limitation — it&apos;s a starting point.</em>
        </p>
        <Link href="/financial-persona"
          className="text-xs tracking-[0.2em] text-[#0f172a] uppercase underline underline-offset-4 hover:text-[#c8a96e] transition-colors duration-300">
          Begin now
        </Link>
      </section>
    </div>
  );
}
