"use client";

import { useEffect, useRef } from "react";

export function CatalogAd() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const script = document.createElement("script");

    script.dataset.zone = "11696844";
    script.src = "https://nap5k.com/tag.min.js";

    containerRef.current.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="col-span-full w-full"
      aria-label="Publicidad"
    />
  );
}