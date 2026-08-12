import {
  notFound,
} from "next/navigation";

import {
  Container,
} from "@/components/ui";

import {
  SkinHeader,
} from "@/components/catalog/skins";

import {
  ContentHeader,
  ContentInfo,
} from "@/components/content";

import {
  ContentRepository,
} from "@/repositories/content.repository";

import type {
  SkinItem,
} from "@/types";

interface Props {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export default async function ContentPage({
  params,
}: Props) {
  const {
    category,
    slug,
  } = await params;

  const item =
    ContentRepository.getBySlug(slug);

  if (!item) {
    notFound();
  }

  /*
   * Evita que una URL como /maps/skin-slug
   * muestre accidentalmente el contenido.
   */
  if (item.category !== category) {
    notFound();
  }

  return (
    <main>
      <section className="py-20">
        <Container>
          <div className="space-y-10">

            {item.category === "skins" ? (
              <SkinHeader
                item={item as SkinItem}
              />
            ) : (
              <ContentHeader
                item={item}
              />
            )}

            <ContentInfo
              item={item}
            />

          </div>
        </Container>
      </section>
    </main>
  );
}