"use client";

import { ArrowRight } from "lucide-react";

export default function AnimatedButton() {
  return (
    <button
      className="
        relative flex items-center gap-2 rounded-full border-[3px]
        border-white/30 bg-[#07090a] px-5 py-2
        font-bold text-white text-[15px]
        shadow-lg transition-transform duration-300
        hover:scale-105 hover:border-white/60
        overflow-hidden
      "
    >
      Submit your order
      <ArrowRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" />

      {/* shine effect */}
      <span
        className="
          pointer-events-none absolute top-0 left-[-100px] h-full w-[100px]
          bg-gradient-to-r from-transparent via-white/100 to-transparent
          opacity-60 animate-none hover:animate-shine
        "
      />
    </button>
  );
}








