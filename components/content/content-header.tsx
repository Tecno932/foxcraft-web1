import Image from "next/image";

import {
  Badge,
  Heading,
} from "@/components/ui";

import type {
  ContentItem,
} from "@/types";

interface Props {
  item: ContentItem;
}

function formatCategory(
  category: string,
) {
  return category
    .replaceAll("-", " ")
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase(),
    );
}

export function ContentHeader({
  item,
}: Props) {
  return (
    <div className="space-y-7">

      {/* Imagen principal */}
      <div
        className="
          relative
          aspect-video
          overflow-hidden
          rounded-3xl
          border
          border-border
          bg-surface
        "
      >
        <Image
          src={item.image}
          alt={item.title}
          fill
          priority
          className="
            object-cover
          "
        />
      </div>

      {/* Categoría / plataforma */}
      <div
        className="
          flex
          flex-wrap
          items-center
          gap-2
        "
      >
        <Badge variant="primary">
          {formatCategory(
            item.category,
          )}
        </Badge>

        <Badge variant="surface">
          {item.platform === "both"
            ? "Java + Bedrock"
            : item.platform === "java"
              ? "Java"
              : "Bedrock"}
        </Badge>

        {item.version.length > 0 && (
          <Badge variant="surface">
            {item.version[0]}
          </Badge>
        )}
      </div>

      {/* Título */}
      <div className="space-y-3">

        <Heading
          as="h1"
          size="2xl"
        >
          {item.title}
        </Heading>

        <p
          className="
            max-w-3xl
            text-lg
            leading-8
            text-muted
          "
        >
          {item.description}
        </p>

      </div>

    </div>
  );
}