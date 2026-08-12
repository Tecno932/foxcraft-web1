"use client";

import Link from "next/link";
import { useState } from "react";
import type { SkinItem } from "@/types";

interface SkinCardProps {
  item: SkinItem;
}

export function SkinCard({ item }: SkinCardProps) {
  const [loading, setLoading] = useState(true);

  const username = item.username ?? item.title;

  const imageUrl = `/api/skins/${encodeURIComponent(username)}`;

  return (
    <Link
      href={`/skins/${item.slug}`}
      className="
        group
        overflow-hidden
        rounded-2xl
        border
        border-border
        bg-surface
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-primary
      "
    >
      <div
        className="
          relative
          flex
          h-[300px]
          items-center
          justify-center
          overflow-hidden
          bg-background
        "
      >
        {loading && (
          <div
            className="
              absolute
              inset-0
              animate-pulse
              bg-muted/20
            "
          >
            <div
              className="
                absolute
                left-1/2
                top-1/2
                h-52
                w-28
                -translate-x-1/2
                -translate-y-1/2
                rounded-xl
                bg-muted/30
              "
            />
          </div>
        )}

        <img
          src={imageUrl}
          alt={`Skin de Minecraft de ${username}`}
          loading="lazy"
          onLoad={() => setLoading(false)}
          onError={() => setLoading(false)}
          className={`
            h-full
            w-full
            object-contain
            p-4
            transition-all
            duration-500
            group-hover:scale-105
            ${
              loading
                ? "opacity-0"
                : "opacity-100"
            }
          `}
        />
      </div>

      <div className="p-4">
        <h3 className="font-heading font-semibold">
          {item.title}
        </h3>

        {item.username && (
          <p className="mt-1 text-sm text-muted">
            @{item.username}
          </p>
        )}
      </div>
    </Link>
  );
}