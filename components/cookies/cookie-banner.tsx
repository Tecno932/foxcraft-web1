"use client";

import { useState } from "react";
import { Check, Settings, X } from "lucide-react";

import { useCookieConsent } from "./cookie-consent";

export function CookieBanner() {
  const {
    hasDecided,
    acceptAll,
    rejectOptional,
    savePreferences,
  } = useCookieConsent();

  const [showSettings, setShowSettings] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [ads, setAds] = useState(true);

  if (hasDecided) {
    return null;
  }

  const handleSavePreferences = () => {
    savePreferences({
      analytics,
      ads,
    });
  };

  return (
    <div
      className="
        fixed
        inset-x-0
        bottom-0
        z-50
        border-t
        border-border
        bg-background/95
        shadow-2xl
        backdrop-blur-xl
      "
      role="dialog"
      aria-label="Preferencias de cookies"
    >
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        {!showSettings ? (
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <h2 className="font-heading text-lg font-semibold">
                Tu privacidad importa
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted">
                Usamos cookies y tecnologías similares para mantener
                FoxCraft funcionando, conocer cómo se utiliza el sitio y
                mostrar publicidad. Podés aceptar todo, rechazar lo
                opcional o elegir tus preferencias.
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap gap-2">
              <button
                type="button"
                onClick={rejectOptional}
                className="
                  inline-flex
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-border
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  transition
                  hover:border-primary
                "
              >
                Rechazar opcionales
              </button>

              <button
                type="button"
                onClick={() => setShowSettings(true)}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-border
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  transition
                  hover:border-primary
                "
              >
                <Settings size={16} />
                Configurar
              </button>

              <button
                type="button"
                onClick={acceptAll}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-primary
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:opacity-90
                "
              >
                <Check size={16} />
                Aceptar todo
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-heading text-lg font-semibold">
                  Preferencias de privacidad
                </h2>

                <p className="mt-2 text-sm leading-6 text-muted">
                  Elegí qué tecnologías opcionales permitís utilizar en
                  FoxCraft.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className="
                  rounded-lg
                  p-2
                  text-muted
                  transition
                  hover:bg-surface-secondary
                  hover:text-foreground
                "
                aria-label="Cerrar configuración"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <div className="rounded-xl border border-border bg-surface p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-medium">Necesarias</h3>
                    <p className="mt-1 text-xs leading-5 text-muted">
                      Necesarias para que el sitio funcione.
                    </p>
                  </div>

                  <span className="rounded-full bg-surface-secondary px-3 py-1 text-xs font-medium text-muted">
                    Siempre activas
                  </span>
                </div>
              </div>

              <label className="cursor-pointer rounded-xl border border-border bg-surface p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-medium">Analytics</h3>
                    <p className="mt-1 text-xs leading-5 text-muted">
                      Nos ayuda a entender el uso del sitio.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(event) =>
                      setAnalytics(event.target.checked)
                    }
                    className="h-4 w-4 accent-primary"
                  />
                </div>
              </label>

              <label className="cursor-pointer rounded-xl border border-border bg-surface p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-medium">Publicidad</h3>
                    <p className="mt-1 text-xs leading-5 text-muted">
                      Permite cargar nuestros servicios publicitarios.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={ads}
                    onChange={(event) => setAds(event.target.checked)}
                    className="h-4 w-4 accent-primary"
                  />
                </div>
              </label>
            </div>

            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={rejectOptional}
                className="
                  rounded-xl
                  border
                  border-border
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  transition
                  hover:border-primary
                "
              >
                Rechazar opcionales
              </button>

              <button
                type="button"
                onClick={handleSavePreferences}
                className="
                  rounded-xl
                  bg-primary
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:opacity-90
                "
              >
                Guardar preferencias
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
