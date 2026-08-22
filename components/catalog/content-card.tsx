import Image from "next/image";
import Link from "next/link";

import type { ContentItem } from "@/types";

interface ContentCardProps {
  item: ContentItem;
}

export function ContentCard({
  item,
}: ContentCardProps) {
  return (
    <Link
      href={`/${item.category}/${item.id}/${item.slug}`}
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
        hover:border-primary/50
        hover:shadow-xl
        hover:shadow-primary/10
      "
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="
            (max-width: 640px) 100vw,
            (max-width: 1024px) 50vw,
            25vw
          "
          className="
            object-cover
            transition-transform
            duration-500
            group-hover:scale-105
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/70
            via-black/10
            to-transparent
          "
        />

        {item.platform && (
          <span
            className="
              absolute
              left-4
              top-4
              rounded-full
              bg-black/60
              px-3
              py-1
              text-xs
              font-medium
              text-white
              backdrop-blur
            "
          >
            {item.platform}
          </span>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3
              className="
                truncate
                font-heading
                text-lg
                font-semibold
                transition-colors
                group-hover:text-primary
              "
            >
              {item.title}
            </h3>

            {item.author && (
              <p className="mt-1 text-sm text-muted">
                por {item.author}
              </p>
            )}
          </div>

          {item.version && item.version.length > 0 && (
            <span
              className="
                shrink-0
                rounded-md
                bg-surface-secondary
                px-2
                py-1
                text-xs
                text-muted
              "
            >
              {item.version[0]}
            </span>
          )}
        </div>

        <p className="mt-3 line-clamp-2 text-sm text-muted">
          {item.description}
        </p>

        {item.downloads !== undefined && (
          <div className="mt-4 text-xs text-muted">
            {item.downloads?.toLocaleString() ?? "0"} descargas
          </div>
        )}
      </div>
    </Link>
  );
}