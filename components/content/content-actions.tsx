"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  Download,
  ArrowUpRight,
  Clock,
} from "lucide-react";

import Script from "next/script";
import { Button } from "@/components/ui";
import { useCookieConsent } from "@/components/cookies/cookie-consent";

interface Props {
  download: string;
}

export function ContentActions({
  download,
}: Props) {
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    return () => {
    };
  }, [download]);

  useEffect(() => {
    if (countdown === null) {
      return;
    }

    if (countdown === 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setCountdown((current) => {
        if (current === null) {
          return null;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [countdown]);

  const handlePrepareDownload = () => {
    if (countdown !== null) {
      return;
    }

    setCountdown(5);
  };

  const { consent } = useCookieConsent();

  const handleFinalDownload = () => {

    if (!download) {
      console.error("[FoxCraft] ERROR: URL de descarga vacía");
      return;
    }
  };

  const isReady = countdown === 0;

  return (
    <>
      {consent?.ads && (
        <Script
          src="https://al5sm.com/tag.min.js"
          data-zone="11696491"
          strategy="afterInteractive"
          onError={(error) => {
            console.error("[Monetag] Error cargando script:", error);
          }}
        />
      )}

      <div className="flex flex-wrap gap-3">
        {!isReady ? (
          <Button
            size="lg"
            onClick={handlePrepareDownload}
            disabled={countdown !== null}
          >
            {countdown !== null ? (
              <>
                <Clock size={18} />
                Preparando descarga... {countdown}s
              </>
            ) : (
              <>
                <Download size={18} />
                Descargar
              </>
            )}
          </Button>
        ) : (
          <Button
            asChild
            size="lg"
          >
            <a
              href={download}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleFinalDownload}
            >
              <Download size={18} />
              Descargar ahora
            </a>
          </Button>
        )}

        <Button
          asChild
          variant="secondary"
          size="lg"
        >
          <Link href="/explore">
            <ArrowUpRight size={18} />
            Explorar más
          </Link>
        </Button>
      </div>
    </>
  );
}

