import {
  notFound,
} from "next/navigation";

import {
  Container,
} from "@/components/ui";

import {
  ContentHeader,
  ContentInfo,
  ContentActions,
} from "@/components/content";

import {
  SkinHeader,
} from "@/components/catalog/skins";

import {
  ContentRepository,
} from "@/repositories/content.repository";

import type {
  ContentCategory,
  SkinItem,
} from "@/types";

interface Props {
  params: Promise<{
    category: string;
    id: string;
    slug: string;
  }>;
}

const validCategories: ContentCategory[] = [
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
];

function isContentCategory(
  value: string,
): value is ContentCategory {
  return validCategories.includes(
    value as ContentCategory,
  );
}

export default async function ContentPage({
  params,
}: Props) {
  const {
    category,
    id,
    slug,
  } = await params;

  // ==========================================================
  // VALIDATE CATEGORY
  // ==========================================================

  if (!isContentCategory(category)) {
    notFound();
  }

  // ==========================================================
  // VALIDATE ID
  // ==========================================================

  const contentId = Number(id);

  if (
    !Number.isInteger(contentId) ||
    contentId <= 0
  ) {
    notFound();
  }

  // ==========================================================
  // GET CONTENT
  // ==========================================================

  const item =
    await ContentRepository.getByRoute(
      category,
      contentId,
      slug,
    );

  if (!item) {
    notFound();
  }

  // ==========================================================
  // VALIDATE CATEGORY
  // ==========================================================

  if (item.category !== category) {
    notFound();
  }

  // ==========================================================
  // SKINS
  // ==========================================================

  if (item.category === "skins") {
    return (
      <main>
        <section className="py-20">
          <Container>
            <SkinHeader
              item={item as SkinItem}
            />
          </Container>
        </section>
      </main>
    );
  }

  // ==========================================================
  // DEFAULT CONTENT
  // ==========================================================

  return (
    <main>
      <section className="py-16 lg:py-20">
        <Container>
          <div className="mx-auto max-w-5xl space-y-10">
            <ContentHeader
              item={item}
            />

            <ContentInfo
              item={item}
            />

            <div className="rounded-2xl border border-border bg-surface p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-heading text-xl font-semibold">
                    Descargar {item.title}
                  </h2>

                  <p className="mt-1 text-sm text-muted">
                    Accede al enlace de
                    descarga del contenido.
                  </p>
                </div>

                <ContentActions
                  download={item.download}
                />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}