import {
  Container,
  Heading,
} from "@/components/ui";

import { Explorer } from "@/components/search/explorer";

import { ContentRepository } from "@/repositories/content.repository";

interface ExplorePageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function ExplorePage({
  searchParams,
}: ExplorePageProps) {
  const { page } = await searchParams;

  const items =
    await ContentRepository.getAll();

  /*
   * Explore muestra todo el contenido
   * excepto skins.
   */
  const explorerItems = items.filter(
    (item) => item.category !== "skins",
  );

  const parsedPage = Number.parseInt(
    page ?? "1",
    10,
  );

  const currentPage =
    Number.isFinite(parsedPage) &&
    parsedPage >= 1
      ? parsedPage
      : 1;

  return (
    <main>
      <section className="py-20">
        <Container>
          <Heading>
            Explore
          </Heading>

          <p className="mt-3 text-muted">
            Explora mods, mapas, shaders,
            texturas y más contenido de
            FoxCraft.
          </p>

          <div className="mt-10">
            <Explorer
              items={explorerItems}
              currentPage={currentPage}
            />
          </div>
        </Container>
      </section>
    </main>
  );
}