"use client";

import { useState } from "react";

import { CookieConsentBanner } from "@/components/cookies/cookie-consent-banner";
import { CookiePreferences } from "@/components/cookies/cookie-preferences";

export function CookieConsentUI() {
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  return (
    <>
      <CookieConsentBanner
        onOpenPreferences={() => setPreferencesOpen(true)}
      />

      <CookiePreferences
        open={preferencesOpen}
        onClose={() => setPreferencesOpen(false)}
      />
    </>
  );
}