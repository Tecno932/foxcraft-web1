import Link from "next/link";
import {
  Download,
  FileBox,
  Layers3,
} from "lucide-react";

import { formatNumber } from "@/lib/format-number";
import type { SchematicItem } from "@/types";

interface SchematicCardProps {
  item: SchematicItem;
}

export function SchematicCard({
  item,
}: SchematicCardProps) {
  return (
    <Link
      href={`/${item.category}/${item.id}/${item.slug}`}
      className="
        group
        rounded-2xl
        border
        border-border
        bg-surface
        p-5
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-primary/50
        hover:shadow-xl
      "
    >
      <div
        className="
          flex
          items-start
          justify-between
          gap-4
        "
      >
        <div
          className="
            flex
            h-12
            w-12
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-primary/10
            text-primary
          "
        >
          <FileBox size={24} />
        </div>

        <span
          className="
            rounded-full
            bg-surface-secondary
            px-3
            py-1
            text-xs
            text-muted
          "
        >
          {item.category === "schematics-java"
            ? "Java"
            : "Bedrock"}
        </span>
      </div>

      <div className="mt-5">
        <h3
          className="
            font-heading
            text-lg
            font-semibold
            transition-colors
            group-hover:text-primary
          "
        >
          {item.title}
        </h3>

        <p
          className="
            mt-2
            line-clamp-2
            text-sm
            leading-6
            text-muted
          "
        >
          {item.description}
        </p>
      </div>

      <div
        className="
          mt-5
          grid
          grid-cols-2
          gap-3
          border-t
          border-border
          pt-4
        "
      >
        <div className="flex items-center gap-2 text-xs text-muted">
          <Layers3 size={15} />

          <span>
            {item.blocks
              ? `${formatNumber(item.blocks)} bloques`
              : "Sin datos"}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted">
          <Download size={15} />

          <span>
            {formatNumber(item.downloads)}
          </span>
        </div>
      </div>
    </Link>
  );
}