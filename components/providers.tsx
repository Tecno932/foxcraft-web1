"use client";

import type { ReactNode } from "react";

import { CookieConsentProvider } from "@/components/cookies/cookie-consent";
import { CookieConsentUI } from "@/components/cookies/cookie-consent-ui";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <CookieConsentProvider>
      {children}

      <CookieConsentUI />
    </CookieConsentProvider>
  );
}
