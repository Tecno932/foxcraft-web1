"use client";

import type { ReactNode } from "react";

import {
  CookieConsentProvider,
} from "./cookie-consent";

import { CookieBanner } from "./cookie-banner";
import { ConditionalAnalytics } from "./conditional-analytics";

export function CookieProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <CookieConsentProvider>
      {children}

      <CookieBanner />
      <ConditionalAnalytics />
    </CookieConsentProvider>
  );
}
