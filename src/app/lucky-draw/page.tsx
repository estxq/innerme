export default function LuckyDrawPage() {
  return (
    <div className="min-h-[calc(100dvh-57px)] flex items-center justify-center px-6 pb-16"
      style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=Inter:wght@300;400;500&display=swap');`}</style>
      <div className="text-center">
        <p className="text-xs tracking-[0.25em] text-[#c8a96e] uppercase mb-6">Lucky Draw</p>
        <h1 className="text-[clamp(2rem,6vw,3.5rem)] leading-[1.1] text-[#0f172a] mb-4"
          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}>
          Coming <em>soon.</em>
        </h1>
        <p className="text-[#9a9490] font-light text-sm leading-relaxed max-w-xs mx-auto">
          Something exciting is on its way. Check back shortly.
        </p>
      </div>
    </div>
  );
}
