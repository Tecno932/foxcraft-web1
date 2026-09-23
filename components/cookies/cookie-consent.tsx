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
  ads: true;
}

interface CookieConsentContextValue {
  consent: CookieConsent | null;
  hasDecided: boolean;
  acceptAll: () => void;
  savePreferences: (preferences: {
    analytics: boolean;
  }) => void;
  resetConsent: () => void;
}

const CookieConsentContext =
  createContext<CookieConsentContextValue | null>(null);

function saveConsent(consent: CookieConsent) {
  console.log(
    "[CookieDebug] saveConsent() recibido:",
    consent
  );

  try {
    localStorage.setItem(
      COOKIE_CONSENT_KEY,
      JSON.stringify(consent)
    );

    console.log(
      "[CookieDebug] localStorage.setItem() OK"
    );

    console.log(
      "[CookieDebug] Valor almacenado:",
      localStorage.getItem(COOKIE_CONSENT_KEY)
    );
  } catch (error) {
    console.error(
      "[CookieDebug] ERROR escribiendo localStorage:",
      error
    );

    throw error;
  }
}

function createConsent(
  analytics: boolean
): CookieConsent {
  const consent: CookieConsent = {
    necessary: true,
    analytics,
    ads: true,
  };

  console.log(
    "[CookieDebug] createConsent():",
    consent
  );

  return consent;
}

export function CookieConsentProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [consent, setConsent] =
    useState<CookieConsent | null>(null);

  const [hasDecided, setHasDecided] =
    useState(false);

  useEffect(() => {
    console.log(
      "[CookieDebug] CookieConsentProvider montado"
    );

    try {
      const stored = localStorage.getItem(
        COOKIE_CONSENT_KEY
      );

      console.log(
        "[CookieDebug] localStorage inicial:",
        stored
      );

      if (!stored) {
        console.log(
          "[CookieDebug] No existe consentimiento guardado"
        );

        return;
      }

      const parsed =
        JSON.parse(stored) as Partial<CookieConsent>;

      console.log(
        "[CookieDebug] Datos parseados:",
        parsed
      );

      const restored: CookieConsent = {
        necessary: true,
        analytics: parsed.analytics === true,
        ads: true,
      };

      console.log(
        "[CookieDebug] Consentimiento restaurado:",
        restored
      );

      setConsent(restored);
      setHasDecided(true);

      saveConsent(restored);

      console.log(
        "[CookieDebug] Consentimiento restaurado correctamente"
      );
    } catch (error) {
      console.error(
        "[CookieDebug] ERROR restaurando consentimiento:",
        error
      );

      localStorage.removeItem(
        COOKIE_CONSENT_KEY
      );
    }
  }, []);

  const acceptAll = () => {
    console.log(
      "[CookieDebug] ============================="
    );

    console.log(
      "[CookieDebug] acceptAll() INICIADO"
    );

    try {
      const nextConsent = createConsent(true);

      console.log(
        "[CookieDebug] Consentimiento a guardar:",
        nextConsent
      );

      saveConsent(nextConsent);

      console.log(
        "[CookieDebug] Guardado completado"
      );

      setConsent(nextConsent);

      console.log(
        "[CookieDebug] setConsent() ejecutado"
      );

      setHasDecided(true);

      console.log(
        "[CookieDebug] setHasDecided(true) ejecutado"
      );

      console.log(
        "[CookieDebug] Estado final esperado:",
        {
          consent: nextConsent,
          hasDecided: true,
        }
      );

      console.log(
        "[CookieDebug] acceptAll() FINALIZADO"
      );

      console.log(
        "[CookieDebug] ============================="
      );
    } catch (error) {
      console.error(
        "[CookieDebug] ERROR CRÍTICO EN acceptAll():",
        error
      );

      console.log(
        "[CookieDebug] ============================="
      );
    }
  };

  const savePreferences = (preferences: {
    analytics: boolean;
  }) => {
    console.log(
      "[CookieDebug] savePreferences() INICIADO"
    );

    console.log(
      "[CookieDebug] Preferencias recibidas:",
      preferences
    );

    try {
      const nextConsent = createConsent(
        preferences.analytics
      );

      saveConsent(nextConsent);

      setConsent(nextConsent);
      setHasDecided(true);

      console.log(
        "[CookieDebug] Preferencias guardadas correctamente:",
        nextConsent
      );
    } catch (error) {
      console.error(
        "[CookieDebug] ERROR en savePreferences():",
        error
      );
    }
  };

  const resetConsent = () => {
    console.log(
      "[CookieDebug] resetConsent() ejecutado"
    );

    try {
      localStorage.removeItem(
        COOKIE_CONSENT_KEY
      );

      setConsent(null);
      setHasDecided(false);

      console.log(
        "[CookieDebug] Consentimiento eliminado correctamente"
      );
    } catch (error) {
      console.error(
        "[CookieDebug] ERROR eliminando consentimiento:",
        error
      );
    }
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
  const context = useContext(
    CookieConsentContext
  );

  if (!context) {
    throw new Error(
      "useCookieConsent debe utilizarse dentro de CookieConsentProvider"
    );
  }

  return context;
}