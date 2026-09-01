"use client";

import type { ReactNode } from "react";

import { CookieConsentProvider } from "@/components/cookies/cookie-consent";
import { CookieConsentUI } from "@/components/cookies/cookie-consent-ui";
import { ConditionalAnalytics } from "@/components/cookies/conditional-analytics";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <CookieConsentProvider>
      {children}

      <CookieConsentUI />
      <ConditionalAnalytics />
    </CookieConsentProvider>
  );
}