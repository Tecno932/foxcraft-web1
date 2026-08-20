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

export async function Featured() {
  const featured =
    await ContentRepository.getFeatured();

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
            items={featured}
          />
        </div>
      </Container>
    </section>
  );
}