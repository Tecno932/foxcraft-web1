"use client";

import { useEffect, useMemo, useState } from "react";

import { ContentGrid } from "@/components/catalog";
import { Pagination } from "@/components/catalog/pagination";
import { EmptyState } from "@/components/ui";

import { SearchBar } from "./search-bar";

import type { ContentItem } from "@/types";

interface ExplorerProps {
  items: ContentItem[];
  currentPage: number;
}

const ITEMS_PER_PAGE = 24;

export function Explorer({
  items,
  currentPage,
}: ExplorerProps) {
  const [results, setResults] =
    useState(items);

  /*
   * Mantiene los resultados sincronizados
   * con los datos recibidos del servidor.
   */
  useEffect(() => {
    setResults(items);
  }, [items]);

  function handleSearch(value: string) {
    const search =
      value.toLowerCase().trim();

    if (!search) {
      setResults(items);
      return;
    }

    const filtered = items.filter(
      (item) => {
        const title =
          item.title.toLowerCase();

        const description =
          item.description.toLowerCase();

        return (
          title.includes(search) ||
          description.includes(search)
        );
      },
    );

    setResults(filtered);
  }

  const totalPages = Math.max(
    1,
    Math.ceil(
      results.length / ITEMS_PER_PAGE,
    ),
  );

  /*
   * Evita intentar mostrar una página
   * que no existe.
   */
  const safePage = Math.min(
    Math.max(currentPage, 1),
    totalPages,
  );

  const paginatedItems = useMemo(() => {
    const start =
      (safePage - 1) *
      ITEMS_PER_PAGE;

    const end =
      start + ITEMS_PER_PAGE;

    return results.slice(start, end);
  }, [results, safePage]);

  return (
    <div className="space-y-10">
      <SearchBar
        onSearch={handleSearch}
      />

      {results.length > 0 ? (
        <>
          <ContentGrid
            items={paginatedItems}
          />

          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            basePath="/explore"
          />
        </>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}