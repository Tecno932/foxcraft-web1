"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SkinPaginationProps {
  currentPage: number;
  totalPages: number;
}

export function SkinPagination({
  currentPage,
  totalPages,
}: SkinPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const getPageUrl = (page: number) => {
    return page === 1
      ? "/skins"
      : `/skins?page=${page}`;
  };

  const pages: number[] = [];

  const start = Math.max(
    1,
    currentPage - 2,
  );

  const end = Math.min(
    totalPages,
    currentPage + 2,
  );

  for (let page = start; page <= end; page++) {
    pages.push(page);
  }

  return (
    <nav
      className="
        mt-12
        flex
        flex-wrap
        items-center
        justify-center
        gap-2
      "
      aria-label="Paginación de skins"
    >
      {currentPage > 1 ? (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="
            inline-flex
            h-10
            items-center
            gap-2
            rounded-xl
            border
            border-border
            px-4
            text-sm
            font-medium
            transition
            hover:border-primary
            hover:text-primary
          "
        >
          <ChevronLeft size={16} />
          Anterior
        </Link>
      ) : (
        <span
          className="
            inline-flex
            h-10
            cursor-not-allowed
            items-center
            gap-2
            rounded-xl
            border
            border-border
            px-4
            text-sm
            font-medium
            opacity-40
          "
        >
          <ChevronLeft size={16} />
          Anterior
        </span>
      )}

      {start > 1 && (
        <>
          <Link
            href={getPageUrl(1)}
            className="
              inline-flex
              h-10
              min-w-10
              items-center
              justify-center
              rounded-xl
              border
              border-border
              px-3
              text-sm
              font-medium
              transition
              hover:border-primary
              hover:text-primary
            "
          >
            1
          </Link>

          {start > 2 && (
            <span className="px-1 text-muted">
              ...
            </span>
          )}
        </>
      )}

      {pages.map((page) => {
        const active =
          page === currentPage;

        return (
          <Link
            key={page}
            href={getPageUrl(page)}
            aria-current={
              active
                ? "page"
                : undefined
            }
            className={`
              inline-flex
              h-10
              min-w-10
              items-center
              justify-center
              rounded-xl
              border
              px-3
              text-sm
              font-medium
              transition
              ${
                active
                  ? `
                    border-primary
                    bg-primary
                    text-white
                  `
                  : `
                    border-border
                    hover:border-primary
                    hover:text-primary
                  `
              }
            `}
          >
            {page}
          </Link>
        );
      })}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && (
            <span className="px-1 text-muted">
              ...
            </span>
          )}

          <Link
            href={getPageUrl(totalPages)}
            className="
              inline-flex
              h-10
              min-w-10
              items-center
              justify-center
              rounded-xl
              border
              border-border
              px-3
              text-sm
              font-medium
              transition
              hover:border-primary
              hover:text-primary
            "
          >
            {totalPages}
          </Link>
        </>
      )}

      {currentPage < totalPages ? (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="
            inline-flex
            h-10
            items-center
            gap-2
            rounded-xl
            border
            border-border
            px-4
            text-sm
            font-medium
            transition
            hover:border-primary
            hover:text-primary
          "
        >
          Siguiente
          <ChevronRight size={16} />
        </Link>
      ) : (
        <span
          className="
            inline-flex
            h-10
            cursor-not-allowed
            items-center
            gap-2
            rounded-xl
            border
            border-border
            px-4
            text-sm
            font-medium
            opacity-40
          "
        >
          Siguiente
          <ChevronRight size={16} />
        </span>
      )}
    </nav>
  );
}