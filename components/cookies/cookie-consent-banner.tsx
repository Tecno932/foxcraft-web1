"use client";

import Link from "next/link";
import { Settings, ShieldCheck } from "lucide-react";

import { useCookieConsent } from "@/components/cookies/cookie-consent";

interface CookieConsentBannerProps {
  onOpenPreferences: () => void;
}

export function CookieConsentBanner({
  onOpenPreferences,
}: CookieConsentBannerProps) {
  const { hasDecided, acceptAll, rejectOptional } = useCookieConsent();

  if (hasDecided) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-label="Consentimiento de cookies"
      aria-describedby="cookie-consent-description"
      className="
        fixed inset-x-0 bottom-0 z-50
        border-t border-border
        bg-background/95
        shadow-2xl
        backdrop-blur-xl
      "
    >
      <div
        className="
          mx-auto flex max-w-7xl flex-col gap-5
          px-4 py-5
          sm:px-6
          lg:flex-row lg:items-center lg:px-8
        "
      >
        <div className="flex min-w-0 flex-1 gap-4">
          <div
            className="
              hidden h-11 w-11 shrink-0
              items-center justify-center
              rounded-xl bg-primary/10 text-primary
              sm:flex
            "
          >
            <ShieldCheck size={22} />
          </div>

          <div>
            <h2 className="font-heading text-base font-semibold">
              Tu privacidad importa
            </h2>

            <p
              id="cookie-consent-description"
              className="mt-1 max-w-3xl text-sm leading-6 text-muted"
            >
              Usamos cookies y tecnologías similares para mantener FoxCraft
              funcionando, analizar el uso del sitio y mostrar publicidad.
              Puedes aceptar todo o configurar tus preferencias.
            </p>

            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
              <Link
                href="/privacy"
                className="underline underline-offset-2 transition-colors hover:text-foreground"
              >
                Política de privacidad
              </Link>

              <Link
                href="/cookies"
                className="underline underline-offset-2 transition-colors hover:text-foreground"
              >
                Política de cookies
              </Link>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            onClick={rejectOptional}
            className="
              inline-flex items-center justify-center
              rounded-xl border border-border
              px-4 py-2.5
              text-sm font-medium
              transition
              hover:border-primary/50
              hover:bg-surface-secondary
            "
          >
            Rechazar opcionales
          </button>

          <button
            type="button"
            onClick={onOpenPreferences}
            className="
              inline-flex items-center justify-center gap-2
              rounded-xl border border-border
              px-4 py-2.5
              text-sm font-medium
              transition
              hover:border-primary/50
              hover:bg-surface-secondary
            "
          >
            <Settings size={16} />
            Preferencias
          </button>

          <button
            type="button"
            onClick={acceptAll}
            className="
              inline-flex items-center justify-center
              rounded-xl bg-primary
              px-4 py-2.5
              text-sm font-semibold text-white
              transition
              hover:opacity-90
            "
          >
            Aceptar todo
          </button>
        </div>
      </div>
    </div>
  );
}