import { notFound } from "next/navigation";

import { ContentRepository } from "@/repositories/content.repository";

import { ContentGrid } from "@/components/catalog";

import { SkinGrid } from "@/components/catalog/skins";

import { Pagination } from "@/components/catalog/pagination";

import {
  Container,
  Heading,
} from "@/components/ui";

import type {
  ContentCategory,
  SkinItem,
} from "@/types";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;

  searchParams: Promise<{
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

/**
 * Traduce la categoría de la URL a la categoría
 * utilizada internamente por el repositorio.
 *
 * /shaders → texture-packs
 */
function getRepositoryCategory(
  category: ContentCategory,
): ContentCategory {
  if (category === "shaders") {
    return "texture-packs";
  }

  return category;
}

/**
 * Títulos personalizados para las rutas públicas.
 */
function getCategoryTitle(
  category: ContentCategory,
): string {
  if (category === "shaders") {
    return "Textures and Shaders";
  }

  if (category === "skins") {
    return "Skins";
  }

  return category
    .replaceAll("-", " ")
    .replace(
      /\b\w/g,
      (letter) => letter.toUpperCase(),
    );
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { category } = await params;

  const { page } = await searchParams;

  if (!isContentCategory(category)) {
    notFound();
  }

  /**
   * La URL puede utilizar una categoría diferente
   * a la categoría interna del contenido.
   *
   * /shaders → texture-packs
   */
  const repositoryCategory =
    getRepositoryCategory(category);

  const items =
    await ContentRepository.getByCategory(
      repositoryCategory,
    );

  if (!items.length) {
    notFound();
  }

  const parsedPage = Number.parseInt(
    page ?? "1",
    10,
  );

  const currentPage =
    Number.isFinite(parsedPage) &&
    parsedPage >= 1
      ? parsedPage
      : 1;

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
    getCategoryTitle(category);

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
              <SkinGrid
                items={
                  paginatedItems as SkinItem[]
                }
              />
            ) : (
              <ContentGrid
                items={paginatedItems}
              />
            )}

            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              basePath={`/${category}`}
            />
          </div>
        </Container>
      </section>
    </main>
  );
}