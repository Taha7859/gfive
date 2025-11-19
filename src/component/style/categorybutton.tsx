"use client";

import React from "react";
import Link from "next/link";

interface FancyButtonProps {
  href: string;
  label: string;
  active?: boolean;
}

export default function FancyButton({
  href,
  label,
  active = false,
}: FancyButtonProps) {
  return (
    <Link href={href}>
      <button
        className={`bg-neutral-950 text-neutral-400 border  border-neutral-400 border-b-4 font-medium 
        overflow-hidden relative px-6 py-2 rounded-full 
        hover:brightness-150 hover:border-t-4 hover:border-b 
        active:opacity-75 outline-none duration-300 group 
        ${active ? "text-white border-neutral-200 brightness-150" : ""}`}
      >
        {/* 🔹 Moving Light Bar (same as Uiverse.io) */}
        <span
          className="bg-neutral-400 shadow-neutral-400 absolute -top-[150%] left-0 inline-flex 
          w-80 h-[5px] rounded-full opacity-50 
          group-hover:top-[150%] duration-500 
          shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"
        ></span>

        {/* 🔸 Label */}
        {label}
      </button>
    </Link>
  );
}
