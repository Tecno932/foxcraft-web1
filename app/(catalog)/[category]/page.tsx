import { notFound } from "next/navigation";

import {
  Container,
  Heading,
} from "@/components/ui";

import {
  ContentRepository,
} from "@/repositories/content.repository";

import {
  ContentGrid,
} from "@/components/catalog";

import type {
  ContentItem,
  SkinItem,
} from "@/types";

import {
  SkinGrid,
  SkinPagination,
} from "@/components/catalog/skins";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;

  searchParams?: Promise<{
    page?: string;
  }>;
}

const ITEMS_PER_PAGE = 25;

function isSkinItem(
  item: ContentItem,
): item is SkinItem {
  return item.category === "skins";
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { category } = await params;

  const { page } =
    (await searchParams) ?? {};

  const items =
    ContentRepository.getByCategory(
      category,
    );

  if (!items.length) {
    notFound();
  }

  const currentPage = Math.max(
    1,
    Number(page) || 1,
  );

  const totalPages = Math.ceil(
    items.length / ITEMS_PER_PAGE,
  );

  const safePage = Math.min(
    currentPage,
    totalPages,
  );

  const start =
    (safePage - 1) *
    ITEMS_PER_PAGE;

  const end =
    start + ITEMS_PER_PAGE;

  const paginatedItems =
    items.slice(start, end);

  const title =
    category === "skins"
      ? "Skins"
      : category
          .replaceAll("-", " ")
          .replace(
            /\b\w/g,
            (letter) =>
              letter.toUpperCase(),
          );

  return (
    <main>
      <section className="py-20">
        <Container>
          <Heading>
            {title}
          </Heading>

          <p className="mt-3 text-muted">
            Explora contenido de FoxCraft.
          </p>

          <div className="mt-10">
            {category === "skins" ? (
              <>
                <SkinGrid
                  items={paginatedItems.filter(isSkinItem)}
                />

                <SkinPagination
                  currentPage={
                    safePage
                  }
                  totalPages={
                    totalPages
                  }
                />
              </>
            ) : (
              <ContentGrid
                items={
                  paginatedItems
                }
              />
            )}
          </div>
        </Container>
      </section>
    </main>
  );
}