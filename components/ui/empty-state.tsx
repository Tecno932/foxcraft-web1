import { SearchX } from "lucide-react";

export function EmptyState() {
  return (
    <div
      className="
      flex
      flex-col
      items-center
      justify-center
      rounded-2xl
      border
      border-dashed
      border-border
      bg-surface
      px-8
      py-16
      text-center
      "
    >
      <SearchX
        className="mb-4 text-muted"
        size={40}
      />

      <h3 className="text-xl font-semibold">
        No se encontraron resultados
      </h3>

      <p className="mt-2 max-w-md text-muted">
        Intenta cambiar los filtros o realizar otra búsqueda.
      </p>
    </div>
  );
}