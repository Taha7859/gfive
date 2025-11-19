"use client";

import React from "react";

interface GradientButtonProps {
  label: string;
  href?: string;
  onClick?: () => void;
}

export default function GradientButton({ label, href, onClick }: GradientButtonProps) {
  const ButtonContent = (
    <button
      onClick={onClick}
      className="relative inline-block p-px font-semibold leading-6 text-white bg-gray-800 
                 shadow-2xl cursor-pointer rounded-xl shadow-zinc-900 
                 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95 group"
    >
      <span
  className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-600 via-blue-500 to-purple-800 
             p-[10px] opacity-0 transition-opacity duration-500 group-hover:opacity-100 
             shadow-[0_0_10px_rgba(59,130,246,0.6)]"
></span>




      <span className="relative z-10 block px-6 py-3 rounded-xl bg-blue-800">
        <div className="relative z-10 flex items-center space-x-2">
          <span className="transition-all duration-500 group-hover:translate-x-1">
            {label}
          </span>
          <svg
            className="w-6 h-6 transition-transform duration-500 group-hover:translate-x-1"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              fillRule="evenodd"
              d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
            />
          </svg>
        </div>
      </span>
    </button>
  );

  // If `href` diya gaya hai to anchor wrap kare
  if (href) {
    return (
      <a href={href} className="inline-block">
        {ButtonContent}
      </a>
    );
  }

  return ButtonContent;
}
