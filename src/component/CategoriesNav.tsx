"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react";
import FancyButton from "./style/categorybutton";

const categories = [
  { name: "Logo", path: "/services/graphics" },
  { name: "Banners", path: "/services/banners" },
  { name: "Emotes", path: "/services/emotes" },
  { name: "Panel", path: "/services/panel" },
  { name: "Sub Badges", path: "/services/sub-badges" },
  { name: "Alerts", path: "/services/alerts" },
  { name: "Overlay", path: "/services/overlay" },
  { name: "V Tuber", path: "/services/v-tuber" },
  { name: "PNG Tuber", path: "/services/png-tuber" },
  { name: "VR Chat", path: "/services/vr-chat" },
  { name: "Stream Pack", path: "/services/stream-pack" },
];

export default function CategoriesNav() {
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  // ✅ Track scroll for arrow visibility
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setShowLeft(scrollLeft > 20);
    setShowRight(scrollLeft + clientWidth < scrollWidth - 20);
  };

  // ✅ Restore scroll position when returning to this component
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Restore last position
    const savedX = sessionStorage.getItem("cat-scroll");
    if (savedX) el.scrollLeft = Number(savedX);

    // Track and save scroll position
    const handleSave = () => {
      sessionStorage.setItem("cat-scroll", String(el.scrollLeft));
    };
    el.addEventListener("scroll", handleScroll);
    el.addEventListener("scroll", handleSave);

    handleScroll();

    return () => {
      el.removeEventListener("scroll", handleScroll);
      el.removeEventListener("scroll", handleSave);
    };
  }, []);

  // ✅ Scroll arrows
  const scroll = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -250 : 250,
      behavior: "smooth",
    });
  };

  return (
    <div className="w-full sticky top-20 bg-white/70 backdrop-blur-md z-20">
      {/* ✅ Mobile Version */}
      <div className="relative md:hidden py-3">
        {/* Scrollable Categories */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-3 px-10 scroll-smooth no-scrollbar whitespace-nowrap"
        >
          {categories.map(({ name, path }) => (
            <FancyButton
              key={path}
              href={path}
              label={name}
              active={pathname === path}
            />
          ))}
        </div>

        {/* Left Arrow */}
        {showLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-1 top-1/2 -translate-y-1/2 z-30 bg-white/80 backdrop-blur-lg border border-gray-200 rounded-full p-1.5 shadow-md hover:scale-110 transition-all duration-200"
          >
            <ArrowLeftCircle size={28} className="text-gray-700" />
          </button>
        )}

        {/* Right Arrow */}
        {showRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-1 top-1/2 -translate-y-1/2 z-30 bg-white/80 backdrop-blur-lg border border-gray-200 rounded-full p-1.5 shadow-md hover:scale-110 transition-all duration-200"
          >
            <ArrowRightCircle size={28} className="text-gray-700" />
          </button>
        )}
      </div>

      {/* ✅ Desktop Version */}
      <div className="hidden md:flex flex-wrap justify-center gap-3 p-4 backdrop-blur-md bg-white/60 rounded-b-xl shadow-sm">
        {categories.map(({ name, path }) => (
          <FancyButton
            key={path}
            href={path}
            label={name}
            active={pathname === path}
          />
        ))}
      </div>

      {/* ✅ Hide scrollbar */}
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
