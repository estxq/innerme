"use client";
import { useState } from "react";

export default function LensTintSlider() {
  const [value, setValue] = useState(0); // 0 = clear, 100 = dark

  return (
    <div className="max-w-md mx-auto text-center">
      <div className="relative w-full aspect-[264/123]">
        {/* Base layer: clear lens */}
        <img
          src="/sunglasses-indoor-aligned.png"
          alt="Sunglasses, clear lens"
          className="absolute inset-0 w-full h-full object-contain"
        />
        {/* Top layer: dark lens, faded in as the slider increases */}
        <img
          src="/sunglasses-sunny-aligned.png"
          alt="Sunglasses, dark lens"
          className="absolute inset-0 w-full h-full object-contain transition-opacity duration-75"
          style={{ opacity: value / 100 }}
        />
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full mt-6 accent-[#0f172a]"
      />
      <div className="flex justify-between text-xs text-[#9a9490] mt-2 uppercase tracking-[0.15em]">
        <span>Indoor</span>
        <span>Cloudy</span>
        <span>Sunny</span>
      </div>
    </div>
  );
}
