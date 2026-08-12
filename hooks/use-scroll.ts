"use client";

import { useEffect, useState } from "react";

export function useScroll(offset = 20) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > offset);
    }

    onScroll();

    window.addEventListener("scroll", onScroll);

    return () =>
      window.removeEventListener("scroll", onScroll);
  }, [offset]);

  return scrolled;
}