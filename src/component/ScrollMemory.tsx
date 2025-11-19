"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollMemory() {
  const pathname = usePathname();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // restore scroll position if available
    const savedY = sessionStorage.getItem("scroll-pos");
    if (savedY) window.scrollTo(0, Number(savedY));

    // save scroll position before leaving
    const handleBeforeUnload = () =>
      sessionStorage.setItem("scroll-pos", String(window.scrollY));

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [pathname]);

  return null;
}
