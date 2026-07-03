import Link from "next/link";

const pages = [
  { href: "/quiz", label: "01", title: "Finance Personality Quiz", desc: "Discover your money mindset in 10 questions." },
  { href: "/couples", label: "02", title: "Couples Compatibility Test", desc: "See how you and your partner align financially." },
  { href: "/lucky-draw", label: "03", title: "Lucky Draw", desc: "Enter for a chance to win exciting prizes." },
  { href: "/giveaway", label: "04", title: "Giveaway", desc: "Participate in our latest giveaway." },
];

export default function Home() {
  return (
    <div className="min-h-[calc(100dvh-57px)] bg-[#FAF8F5] flex flex-col justify-between px-6 py-16 max-w-5xl mx-auto"
      style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Inter:wght@300;400;500&display=swap');`}</style>

      <div>
        <p className="text-xs tracking-[0.25em] text-[#9a9490] uppercase mb-8">Welcome</p>
        <h1 className="text-[clamp(2.5rem,7vw,5rem)] leading-[1.1] text-[#0f172a] mb-6 max-w-2xl"
          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}>
          Understand your<br /><em>relationship with money.</em>
        </h1>
        <p className="text-[#9a9490] font-light text-base max-w-sm leading-relaxed">
          A suite of tools designed to help you discover, reflect, and grow financially.
        </p>
      </div>

      <div className="border-t border-[#e8e4df] mt-16">
        {pages.map((p, i) => (
          <Link key={p.href} href={p.href}
            className="flex items-center justify-between py-6 border-b border-[#e8e4df] group hover:pl-2 transition-all duration-300">
            <div className="flex items-center gap-8">
              <span className="text-[10px] tracking-[0.2em] text-[#c0bbb5] w-5">{p.label}</span>
              <div>
                <h2 className="text-base text-[#0f172a] font-light group-hover:text-[#c8a96e] transition-colors duration-300"
                  style={{ fontFamily: "'Playfair Display', serif" }}>{p.title}</h2>
                <p className="text-xs text-[#9a9490] font-light mt-0.5">{p.desc}</p>
              </div>
            </div>
            <svg className="w-4 h-4 text-[#c0bbb5] group-hover:text-[#0f172a] group-hover:translate-x-1 transition-all duration-300" fill="none" viewBox="0 0 16 16">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}
