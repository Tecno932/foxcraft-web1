"use client";

import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";

import { useCookieConsent } from "@/components/cookies/cookie-consent";

interface CookiePreferencesProps {
  open: boolean;
  onClose: () => void;
}

export function CookiePreferences({
  open,
  onClose,
}: CookiePreferencesProps) {
  const { consent, savePreferences } = useCookieConsent();

  const [analytics, setAnalytics] = useState(false);
  const [ads, setAds] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    setAnalytics(consent?.analytics === true);
    setAds(consent?.ads === true);
  }, [open, consent]);

  if (!open) {
    return null;
  }

  const handleSave = () => {
    savePreferences({
      analytics,
      ads,
    });

    onClose();
  };

  return (
    <div
      className="
        fixed inset-0 z-[60]
        flex items-end justify-center
        bg-black/60 p-0
        backdrop-blur-sm
        sm:items-center sm:p-4
      "
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-preferences-title"
        className="
          w-full max-w-lg
          overflow-hidden
          rounded-t-2xl
          border border-border
          bg-background
          shadow-2xl
          sm:rounded-2xl
        "
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2
              id="cookie-preferences-title"
              className="font-heading text-lg font-semibold"
            >
              Preferencias de privacidad
            </h2>

            <p className="mt-1 text-sm text-muted">
              Elige qué categorías opcionales quieres permitir.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar preferencias"
            className="
              rounded-lg p-2 text-muted
              transition
              hover:bg-surface-secondary
              hover:text-foreground
            "
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3 p-5">
          <PreferenceRow
            title="Cookies necesarias"
            description="Necesarias para que FoxCraft funcione correctamente."
            enabled
            disabled
          />

          <PreferenceRow
            title="Analytics"
            description="Nos permite conocer cómo se utiliza FoxCraft y mejorar el sitio."
            enabled={analytics}
            onChange={setAnalytics}
          />

          <PreferenceRow
            title="Publicidad"
            description="Permite cargar servicios publicitarios y mostrar anuncios."
            enabled={ads}
            onChange={setAds}
          />
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-border p-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="
              rounded-xl border border-border
              px-4 py-2.5
              text-sm font-medium
              transition
              hover:bg-surface-secondary
            "
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="
              rounded-xl bg-primary
              px-4 py-2.5
              text-sm font-semibold text-white
              transition
              hover:opacity-90
            "
          >
            Guardar preferencias
          </button>
        </div>
      </div>
    </div>
  );
}

interface PreferenceRowProps {
  title: string;
  description: string;
  enabled: boolean;
  disabled?: boolean;
  onChange?: (enabled: boolean) => void;
}

function PreferenceRow({
  title,
  description,
  enabled,
  disabled = false,
  onChange,
}: PreferenceRowProps) {
  return (
    <div
      className="
        flex items-center justify-between gap-4
        rounded-xl
        border border-border
        p-4
      "
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold">{title}</h3>

          {disabled && (
            <span className="rounded-full bg-surface-secondary px-2 py-0.5 text-[10px] font-medium text-muted">
              Siempre activo
            </span>
          )}
        </div>

        <p className="mt-1 text-xs leading-5 text-muted">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={`${title}: ${enabled ? "activado" : "desactivado"}`}
        disabled={disabled}
        onClick={() => onChange?.(!enabled)}
        className={`
          relative flex h-7 w-12 shrink-0 items-center rounded-full
          transition
          ${
            enabled
              ? "bg-primary"
              : "bg-surface-secondary"
          }
          ${disabled ? "cursor-not-allowed opacity-80" : "cursor-pointer"}
        `}
      >
        <span
          className={`
            flex h-5 w-5 items-center justify-center rounded-full
            bg-white shadow-sm
            transition-transform
            ${enabled ? "translate-x-6" : "translate-x-1"}
          `}
        >
          {enabled && (
            <Check size={12} className="text-primary" />
          )}
        </span>
      </button>
    </div>
  );
}