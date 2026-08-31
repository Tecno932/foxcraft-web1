import type {
  ContentItem,
  SkinItem,
  SchematicItem,
} from "@/types";

import { ContentCard } from "./content-card";
import { SkinCard } from "./skins";
import { SchematicCard } from "./schematics";

interface ContentGridProps {
  items: ContentItem[];
}

export function ContentGrid({ items }: ContentGridProps) {
  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted">
          No hay contenido disponible.
        </p>
      </div>
    );
  }

  return (
    <div
      className="
        grid
        gap-6
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
      "
    >
      {items.map((item) => {
        if (item.category === "skins") {
          return (
            <SkinCard
              key={item.id}
              item={item as SkinItem}
            />
          );
        }

        if (
          item.category === "schematics-java" ||
          item.category === "schematics-bedrock"
        ) {
          return (
            <SchematicCard
              key={item.id}
              item={item as SchematicItem}
            />
          );
        }

        return (
          <ContentCard
            key={item.id}
            item={item}
          />
        );
      })}
    </div>
  );
}