import Link from "next/link";
import { Download, ExternalLink } from "lucide-react";
import type { SkinItem } from "@/types";

interface SkinHeaderProps {
  item: SkinItem;
}

export function SkinHeader({
  item,
}: SkinHeaderProps) {
  const username = item.username ?? item.title;

  const imageUrl =
    `/api/skins/${encodeURIComponent(username)}`;

  const downloadUrl = item.username
    ? `https://mc-heads.net/download/${encodeURIComponent(
        item.username,
      )}`
    : item.skinUrl;

  return (
    <div
      className="
        grid
        gap-10
        lg:grid-cols-[380px_1fr]
        lg:items-center
      "
    >
      {/* Preview */}
      <div
        className="
          relative
          overflow-hidden
          rounded-3xl
          border
          border-border
          bg-surface
        "
      >
        <div
          className="
            flex
            min-h-[420px]
            items-center
            justify-center
            p-8
          "
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={`Skin de Minecraft de ${username}`}
              className="
                h-[380px]
                w-full
                object-contain
              "
            />
          ) : (
            <div
              className="
                flex
                h-[380px]
                items-center
                justify-center
                text-muted
              "
            >
              Imagen no disponible
            </div>
          )}
        </div>
      </div>

      {/* Information */}
      <div>
        <p
          className="
            text-sm
            font-medium
            uppercase
            tracking-wider
            text-primary
          "
        >
          Skin de Minecraft
        </p>

        <h1
          className="
            mt-2
            font-heading
            text-4xl
            font-bold
            tracking-tight
            sm:text-5xl
          "
        >
          {item.title}
        </h1>

        {item.username && (
          <p className="mt-3 text-lg text-muted">
            @{item.username}
          </p>
        )}

        <p className="mt-6 max-w-2xl text-muted">
          {item.description}
        </p>

        {/* Metadata */}
        <div className="mt-6 flex flex-wrap gap-2">
          {item.model && (
            <span
              className="
                rounded-full
                border
                border-border
                px-3
                py-1
                text-sm
              "
            >
              {item.model === "slim"
                ? "Slim"
                : "Classic"}
            </span>
          )}

          {item.edition?.map((edition) => (
            <span
              key={edition}
              className="
                rounded-full
                border
                border-border
                px-3
                py-1
                text-sm
                capitalize
              "
            >
              {edition}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap gap-3">
          {downloadUrl && (
            <a
              href={downloadUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-primary
                px-5
                py-3
                font-semibold
                text-white
                transition
                hover:opacity-90
              "
            >
              <Download size={18} />
              Descargar Skin
            </a>
          )}

          {item.username && (
            <Link
              href={`https://mc-heads.net/user/${encodeURIComponent(
                item.username,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                border
                border-border
                px-5
                py-3
                font-semibold
                transition
                hover:border-primary
              "
            >
              <ExternalLink size={18} />
              Ver perfil
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}