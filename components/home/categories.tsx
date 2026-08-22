import Link from "next/link";
import { Container, Heading } from "@/components/ui";
import Image from "next/image";
import { ASSETS } from "@/constants";

const categories = [
  {
    name: "Mods",
    href: "/mods",
    icon: ASSETS.categories.mods,
  },
  {
    name: "Maps",
    href: "/maps",
    icon: ASSETS.categories.maps,
  },
  {
    name: "Visuals",
    href: "/shaders",
    icon: ASSETS.categories.shaders,
  },
  {
    name: "Proceso...",
    href: "/skins",
    icon: ASSETS.categories.skins,
  },
  {
    name: "Proceso...",
    href: "/resource-packs",
    icon: ASSETS.categories.resourcePacks,
  },
  {
    name: "Proceso...",
    href: "/schematics-java",
    icon: ASSETS.categories.schematics,
  },
];

export function Categories(){

  return(
    <section className="py-20">

      <Container>

        <Heading>
          Explora categorías
        </Heading>


<div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
  {categories.map((category) => (
    <Link
      key={category.href}
      href={category.href}
      className="
        group
        overflow-hidden
        rounded-2xl
        border
        border-border
        bg-surface
        p-6
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-primary
        hover:shadow-[0_10px_30px_rgba(249,115,22,.15)]
      "
    >
      <div className="flex items-center justify-between gap-6">
        <div className="flex-1">
          <h3 className="text-xl font-semibold">
            {category.name}
          </h3>

          <p className="mt-2 text-sm text-muted">
            Explora contenido para Minecraft.
          </p>

          <div className="mt-6 text-sm font-medium text-primary">
            Explorar →
          </div>
        </div>

        <Image
          src={category.icon}
          alt={category.name}
          width={140}
          height={140}
          className="
            h-28
            w-28
            object-contain
            opacity-80
            transition-all
            duration-300
            group-hover:scale-110
            group-hover:opacity-100
          "
        />
      </div>
    </Link>
  ))}
</div>

<div className="mt-6 flex items-center justify-between">
  <span className="text-sm text-muted">
    Explorar →
  </span>
</div>


      </Container>

    </section>
  )
}