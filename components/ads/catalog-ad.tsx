"use client";

import { useEffect, useRef } from "react";

import { useCookieConsent } from "@/components/cookies/cookie-consent";

export function CatalogAd() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { consent } = useCookieConsent();

  useEffect(() => {
    if (!consent?.ads || !containerRef.current) {
      return;
    }

    const script = document.createElement("script");

    script.dataset.zone = "11696844";
    script.src = "https://nap5k.com/tag.min.js";

    containerRef.current.appendChild(script);

    return () => {
      script.remove();
    };
  }, [consent?.ads]);

  if (!consent?.ads) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="col-span-full w-full"
      aria-label="Publicidad"
    />
  );
}