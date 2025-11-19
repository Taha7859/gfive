"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react";
import FancyButton from "./style/categorybutton";

const charactercategories = [
  { name: "Anime", path: "/services/character-design" },
  { name: "Character Art", path: "/services/character-art" },
  { name: "DND Characters", path: "/services/dnd-characters" },
  { name: "Furry Art", path: "/services/fury-art" },
  { name: "Cartoon Characters", path: "/services/cartoon-characters" },
  { name: "Chibi Characters", path: "/services/chibi-characters" },
  { name: "Concept Art Characters", path: "/services/concept-art" },
  { name: "Cover Art", path: "/services/cover-art" },
  { name: "Dark Fantasy Character", path: "/services/dark-fantasy" },
  { name: "Fantasy Characters", path: "/services/fantasy-characters" },
  { name: "Furry Anthropomorphic Characters", path: "/services/furry-anthropomorphic" },
  { name: "Kawaii Characters", path: "/services/kawaii-characters" },
  { name: "Mascot Characters", path: "/services/mascot-characters" },
  { name: "Pixel Art Characters", path: "/services/pixel-art" },
];

export default function CharacterCategoriesNav() {
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  // ✅ Handle scroll for arrow visibility
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setShowLeft(scrollLeft > 20);
    setShowRight(scrollLeft + clientWidth < scrollWidth - 20);
  };

  // ✅ Save & restore scroll position
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const savedX = sessionStorage.getItem("char-scroll");
    if (savedX) el.scrollLeft = Number(savedX);

    const handleSave = () => {
      sessionStorage.setItem("char-scroll", String(el.scrollLeft));
    };

    el.addEventListener("scroll", handleScroll);
    el.addEventListener("scroll", handleSave);
    handleScroll();

    return () => {
      el.removeEventListener("scroll", handleScroll);
      el.removeEventListener("scroll", handleSave);
    };
  }, []);

  // ✅ Only reset scroll when visiting character-design
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    if (pathname === "/services/character-design") {
      el.scrollTo({ left: 0, behavior: "smooth" });
      sessionStorage.setItem("char-scroll", "0");
    } else {
      // restore saved scroll for other categories
      const savedX = sessionStorage.getItem("char-scroll");
      if (savedX) el.scrollLeft = Number(savedX);
    }
  }, [pathname]);

  // ✅ Scroll function
  const scroll = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -250 : 250,
      behavior: "smooth",
    });
  };

  return (
    <div className="w-full sticky top-20 bg-white/70 backdrop-blur-md z-20">
      <div className="relative py-3">
        {/* Scrollable buttons */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-3 px-10 scroll-smooth no-scrollbar whitespace-nowrap"
        >
          {charactercategories.map(({ name, path }) => (
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
