"use client";

import { useState } from "react";
import { Check, Settings, X } from "lucide-react";
import { useCookieConsent } from "./cookie-consent";

export function CookieConsentBanner() {
  const {
    hasDecided,
    acceptAll,
    savePreferences,
  } = useCookieConsent();

  const [showSettings, setShowSettings] = useState(false);
  const [analytics, setAnalytics] = useState(true);

  const handleAcceptAll = () => {
    console.log("[CookieDebug] =============================");
    console.log("[CookieDebug] Click en 'Aceptar todo'");
    console.log("[CookieDebug] hasDecided antes:", hasDecided);

    try {
      acceptAll();

      console.log(
        "[CookieDebug] acceptAll() ejecutado correctamente"
      );

      console.log(
        "[CookieDebug] Se solicitó guardar:",
        {
          necessary: true,
          analytics: true,
          ads: true,
        }
      );

      console.log(
        "[CookieDebug] localStorage después del click:",
        localStorage.getItem("foxcraft-cookie-consent")
      );

      console.log("[CookieDebug] =============================");
    } catch (error) {
      console.error(
        "[CookieDebug] ERROR en handleAcceptAll:",
        error
      );
    }
  };

  const handleSavePreferences = () => {
    console.log("[CookieDebug] =============================");
    console.log("[CookieDebug] Click en 'Aceptar y continuar'");
    console.log("[CookieDebug] Analytics:", analytics);

    try {
      savePreferences({
        analytics,
      });

      console.log(
        "[CookieDebug] savePreferences() ejecutado correctamente"
      );

      console.log(
        "[CookieDebug] localStorage después de guardar:",
        localStorage.getItem("foxcraft-cookie-consent")
      );

      console.log("[CookieDebug] =============================");
    } catch (error) {
      console.error(
        "[CookieDebug] ERROR en handleSavePreferences:",
        error
      );
    }
  };

  if (hasDecided) {
    console.log(
      "[CookieDebug] Banner oculto porque hasDecided = true"
    );

    return null;
  }

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
                Usamos cookies necesarias para mantener FoxCraft
                funcionando y cookies de publicidad para mostrar anuncios
                y habilitar las descargas.
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  console.log(
                    "[CookieDebug] Click en 'Configurar'"
                  );

                  setShowSettings(true);
                }}
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
                onClick={handleAcceptAll}
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
                  Las cookies publicitarias son necesarias para
                  utilizar las descargas de FoxCraft.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  console.log(
                    "[CookieDebug] Cerrar configuración"
                  );

                  setShowSettings(false);
                }}
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
                    <h3 className="font-medium">
                      Necesarias
                    </h3>

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
                    <h3 className="font-medium">
                      Analytics
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-muted">
                      Nos ayuda a entender el uso del sitio.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(event) => {
                      console.log(
                        "[CookieDebug] Analytics cambiado:",
                        event.target.checked
                      );

                      setAnalytics(event.target.checked);
                    }}
                    className="h-4 w-4 accent-primary"
                  />
                </div>
              </label>

              <div className="rounded-xl border border-border bg-surface p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-medium">
                      Publicidad
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-muted">
                      Necesaria para habilitar las descargas y
                      cargar servicios publicitarios.
                    </p>
                  </div>

                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    Obligatoria
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  console.log(
                    "[CookieDebug] Volver desde configuración"
                  );

                  setShowSettings(false);
                }}
                className="
                  rounded-xl
                  border
                  border-border
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  transition
                  hover:bg-surface-secondary
                "
              >
                Volver
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
                Aceptar y continuar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}