import {
  Container,
  Heading,
} from "@/components/ui";

import {
  ContentGrid,
} from "@/components/catalog";

import {
  ContentRepository,
} from "@/repositories/content.repository";

const FEATURED_CATEGORIES = [
  "mods",
  "maps",
  "texture-packs",
  "schematics-java",
  "schematics-bedrock",
] as const;

export async function Featured() {
  const featured =
    await ContentRepository.getFeatured();

  const filteredFeatured =
    featured.filter((item) =>
      FEATURED_CATEGORIES.includes(
        item.category as
          (typeof FEATURED_CATEGORIES)[number],
      ),
    );

  return (
    <section className="py-20">
      <Container>
        <Heading>
          Contenido destacado
        </Heading>

        <p className="mt-3 max-w-2xl text-muted">
          Una selección de los mejores
          proyectos de FoxCraft.
        </p>

        <div className="mt-8">
          <ContentGrid
            items={filteredFeatured}
          />
        </div>
      </Container>
    </section>
  );
}