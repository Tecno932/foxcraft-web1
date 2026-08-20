import {
  notFound,
} from "next/navigation";

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
  ContentCategory,
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

const ITEMS_PER_PAGE = 24;

function isContentCategory(
  value: string,
): value is ContentCategory {
  return [
    "mods",
    "maps",
    "shaders",
    "resource-packs",
    "texture-packs",
    "ui-packs",
    "skins",
    "armor-trims",
    "banners",
    "schematics-java",
    "schematics-bedrock",
  ].includes(value);
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { category } = await params;

  if (!isContentCategory(category)) {
    notFound();
  }

  const { page } =
    (await searchParams) ?? {};

  const items =
    await ContentRepository.getByCategory(
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
                  items={
                    paginatedItems as SkinItem[]
                  }
                />

                <SkinPagination
                  currentPage={safePage}
                  totalPages={totalPages}
                />
              </>
            ) : (
              <ContentGrid
                items={paginatedItems}
              />
            )}
          </div>
        </Container>
      </section>
    </main>
  );
}