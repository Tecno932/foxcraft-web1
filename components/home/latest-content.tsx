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

export async function LatestContent() {
  const latest =
    await ContentRepository.getLatest(8);

  return (
    <section className="py-20">
      <Container>
        <Heading>
          Últimos agregados
        </Heading>

        <p className="mt-3 max-w-2xl text-muted">
          Descubrí los últimos contenidos
          agregados a FoxCraft.
        </p>

        <div className="mt-8">
          <ContentGrid
            items={latest}
          />
        </div>
      </Container>
    </section>
  );
}