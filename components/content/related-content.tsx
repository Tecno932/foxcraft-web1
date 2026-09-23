import type { ContentItem } from "@/types";

import { ContentCard } from "@/components/catalog/content-card";

interface RelatedContentProps {
  items: ContentItem[];
}

export function RelatedContent({
  items,
}: RelatedContentProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div>
        <h2
          className="
            font-heading
            text-2xl
            font-semibold
          "
        >
          También te puede interesar
        </h2>

        <p className="mt-2 text-sm text-muted">
          Otros contenidos que podrían interesarte.
        </p>
      </div>

      <div
        className="
          grid
          gap-5
          sm:grid-cols-2
          lg:grid-cols-4
        "
      >
        {items.map((item) => (
          <ContentCard
            key={`${item.category}-${item.id}`}
            item={item}
          />
        ))}
      </div>
    </section>
  );
}