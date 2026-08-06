"use client";
import { useState } from "react";

export default function LensTintSlider() {
  const [value, setValue] = useState(0); // 0 = clear, 100 = dark

  const cloudyOpacity = value <= 50 ? value / 50 : 1;
  const sunnyOpacity = value <= 50 ? 0 : (value - 50) / 50;

  return (
    <div className="max-w-md mx-auto text-center">
      <div className="relative w-full aspect-[738/443]">
        <img
          src="/sunglasses-tint-indoor.png"
          alt="Sunglasses, clear lens"
          className="absolute inset-0 w-full h-full object-contain"
        />
        <img
          src="/sunglasses-tint-cloudy.png"
          alt="Sunglasses, medium tint lens"
          className="absolute inset-0 w-full h-full object-contain"
          style={{ opacity: cloudyOpacity }}
        />
        <img
          src="/sunglasses-tint-sunny.png"
          alt="Sunglasses, dark lens"
          className="absolute inset-0 w-full h-full object-contain"
          style={{ opacity: sunnyOpacity }}
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
