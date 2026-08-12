import type { SkinItem } from "@/types";
import { SkinCard } from "./skin-card";

interface SkinGridProps {
  items: SkinItem[];
}

export function SkinGrid({
  items,
}: SkinGridProps) {
  return (
    <div
      className="
        grid
        grid-cols-1
        gap-6
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
      "
    >
      {items.map((item) => (
        <SkinCard
          key={item.id}
          item={item}
        />
      ))}
    </div>
  );
}