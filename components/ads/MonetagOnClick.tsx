"use client";

import Script from "next/script";

import { useCookieConsent } from "@/components/cookies/cookie-consent";

export function MonetagOnClick() {
  const { consent } = useCookieConsent();

  if (!consent?.ads) {
    return null;
  }

  return (
    <Script
      src="https://al5sm.com/tag.min.js"
      data-zone="11696491"
      strategy="afterInteractive"
    />
  );
}