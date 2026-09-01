"use client";

import {
createContext,
useContext,
useEffect,
useState,
type ReactNode,
} from "react";

const COOKIE_CONSENT_KEY = "foxcraft-cookie-consent";

export interface CookieConsent {
necessary: true;
analytics: boolean;
ads: boolean;
}

interface CookieConsentContextValue {
consent: CookieConsent | null;
hasDecided: boolean;
acceptAll: () => void;
savePreferences: (preferences: {
analytics: boolean;
ads: boolean;
}) => void;
resetConsent: () => void;
}

const CookieConsentContext =
createContext<CookieConsentContextValue | null>(null);

function saveConsent(consent: CookieConsent) {
localStorage.setItem(
COOKIE_CONSENT_KEY,
JSON.stringify(consent)
);
}

function createConsent(
analytics: boolean,
ads: boolean
): CookieConsent {
return {
necessary: true,
analytics,
ads,
};
}

export function CookieConsentProvider({
children,
}: {
children: ReactNode;
}) {
const [consent, setConsent] = useState<CookieConsent | null>(null);
const [hasDecided, setHasDecided] = useState(false);

useEffect(() => {
const stored = localStorage.getItem(COOKIE_CONSENT_KEY);

if (!stored) {
  return;
}

try {
  const parsed = JSON.parse(stored) as Partial<CookieConsent>;

  const restored: CookieConsent = {
    necessary: true,
    analytics: parsed.analytics === true,
    ads: parsed.ads === true,
  };

  setConsent(restored);
  setHasDecided(true);
} catch {
  localStorage.removeItem(COOKIE_CONSENT_KEY);
}

}, []);

const acceptAll = () => {
const nextConsent = createConsent(true, true);

saveConsent(nextConsent);
setConsent(nextConsent);
setHasDecided(true);

};

const savePreferences = (preferences: {
analytics: boolean;
ads: boolean;
}) => {
const nextConsent = createConsent(
preferences.analytics,
preferences.ads
);

saveConsent(nextConsent);
setConsent(nextConsent);
setHasDecided(true);

};

const resetConsent = () => {
localStorage.removeItem(COOKIE_CONSENT_KEY);
setConsent(null);
setHasDecided(false);
};

return (
<CookieConsentContext.Provider
value={{
consent,
hasDecided,
acceptAll,
savePreferences,
resetConsent,
}}
>
{children}
</CookieConsentContext.Provider>
);
}

export function useCookieConsent() {
const context = useContext(CookieConsentContext);

if (!context) {
throw new Error(
"useCookieConsent debe utilizarse dentro de CookieConsentProvider"
);
}

return context;
}
