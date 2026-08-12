import Link from "next/link";

import {
  ArrowRight,
  Search,
} from "lucide-react";

import {
  Button,
  Container,
  Heading,
} from "@/components/ui";

import {
  HeroPreview,
} from "./hero-preview";

import {
  HeroStats,
} from "./hero-stats";

export function Hero() {
  return (
    <section
      className="
      relative
      overflow-hidden
      py-24
      lg:py-36
      "
    >
      <Container>
        <div
          className="
          grid
          items-center
          gap-16
          lg:grid-cols-2
          "
        >
          <div className="space-y-8">
            <div
              className="
              inline-flex
              rounded-full
              border
              border-primary/30
              bg-primary/10
              px-4
              py-2
              text-sm
              text-primary
              "
            >
              Plataforma de contenido para Minecraft
            </div>

            <Heading size="2xl">
              Todo el contenido de Minecraft en un solo lugar.
            </Heading>

            <p
              className="
              max-w-xl
              text-lg
              leading-8
              text-muted
              "
            >
              Descubre Mods, Maps, Shaders, Resource Packs,
              Skins, Schematics y mucho más, organizados en una
              plataforma rápida, moderna y pensada para la comunidad.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
              >
                <Link href="/explore">
                  Explorar

                  <ArrowRight size={18} />
                </Link>
              </Button>

              <Button
                variant="secondary"
                size="lg"
                asChild
              >
                <Link href="/mods">
                  <Search size={18} />

                  Ver Mods
                </Link>
              </Button>
            </div>

            <HeroStats />
          </div>

          <HeroPreview />
        </div>
      </Container>
    </section>
  );
}