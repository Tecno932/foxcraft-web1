import {
  mods,
  maps,
  skins,
  shaders,
  resourcePacks,
  texturePacks,
  uiPacks,
  armorTrims,
  banners,
  schematicsJava,
  schematicsBedrock,
} from "@/data";

import type {
  ContentCategory,
  ContentItem,
  SkinItem,
} from "@/types";

import {
  mapContent,
  mapContents,
} from "@/lib/content/mapper";

import { prisma } from "@/lib/prisma";

// ============================================================
// STATIC CONTENT
// ============================================================

const staticContent: ContentItem[] = [
  ...mods.map((item) => ({
    ...item,
    category: "mods" as const,
  })),

  ...maps.map((item) => ({
    ...item,
    category: "maps" as const,
  })),

  ...shaders.map((item) => ({
    ...item,
    category: "shaders" as const,
  })),

  ...resourcePacks.map((item) => ({
    ...item,
    category: "resource-packs" as const,
  })),

  ...texturePacks.map((item) => ({
    ...item,
    category: "texture-packs" as const,
  })),

  ...uiPacks.map((item) => ({
    ...item,
    category: "ui-packs" as const,
  })),

  ...skins.map((item) => ({
    ...item,
    category: "skins" as const,
  })),

  ...armorTrims.map((item) => ({
    ...item,
    category: "armor-trims" as const,
  })),

  ...banners.map((item) => ({
    ...item,
    category: "banners" as const,
  })),

  ...schematicsJava.map((item) => ({
    ...item,
    category: "schematics-java" as const,
  })),

  ...schematicsBedrock.map((item) => ({
    ...item,
    category: "schematics-bedrock" as const,
  })),
];

// ============================================================
// STATIC HELPERS
// ============================================================

function getStaticByCategory(
  category: ContentCategory,
): ContentItem[] {
  return staticContent.filter(
    (item) => item.category === category,
  );
}

function getStaticByRoute(
  category: ContentCategory,
  id: number,
  slug: string,
): ContentItem | null {
  return (
    staticContent.find(
      (item) =>
        item.category === category &&
        item.id === id &&
        item.slug === slug,
    ) ?? null
  );
}

function getStaticBySlug(
  slug: string,
): ContentItem | null {
  return (
    staticContent.find(
      (item) => item.slug === slug,
    ) ?? null
  );
}

// ============================================================
// DATABASE HELPERS
// ============================================================

function databaseCategory(
  category: ContentCategory,
) {
  return category.toUpperCase() as
    | "MODS"
    | "MAPS"
    | "SHADERS"
    | "RESOURCE_PACKS"
    | "TEXTURE_PACKS"
    | "UI_PACKS"
    | "SKINS"
    | "ARMOR_TRIMS"
    | "BANNERS"
    | "SCHEMATICS_JAVA"
    | "SCHEMATICS_BEDROCK";
}

// ============================================================
// REPOSITORY
// ============================================================

export const ContentRepository = {
  // ==========================================================
  // GET ALL
  // ==========================================================

  async getAll(): Promise<ContentItem[]> {
    const databaseItems =
      await prisma.content.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

    const mappedDatabase =
      mapContents(databaseItems);

    /*
     * Los datos estáticos y los datos de PostgreSQL
     * permanecen separados.
     *
     * PostgreSQL primero.
     * Los archivos de data/ se mantienen intactos.
     */
    return [
      ...mappedDatabase,
      ...staticContent,
    ];
  },

  // ==========================================================
  // GET FEATURED
  // ==========================================================

  async getFeatured(): Promise<ContentItem[]> {
    const databaseItems =
      await prisma.content.findMany({
        where: {
          featured: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    const mappedDatabase =
      mapContents(databaseItems);

    const staticItems =
      staticContent.filter(
        (item) => item.featured,
      );

    return [
      ...mappedDatabase,
      ...staticItems,
    ];
  },

  // ==========================================================
  // GET LATEST
  // ==========================================================

  async getLatest(
    limit = 8,
  ): Promise<ContentItem[]> {
    const databaseItems =
      await prisma.content.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
      });

    const staticItems =
      staticContent
        .slice()
        .sort(
          (a, b) =>
            b.createdAt.getTime() -
            a.createdAt.getTime(),
        )
        .slice(0, limit);

    const combined = [
      ...mapContents(databaseItems),
      ...staticItems,
    ];

    return combined
      .sort(
        (a, b) =>
          b.createdAt.getTime() -
          a.createdAt.getTime(),
      )
      .slice(0, limit);
  },

  // ==========================================================
  // GET BY ROUTE
  //
  // /[category]/[id]/[slug]
  // ==========================================================

  async getByRoute(
    category: ContentCategory,
    id: number,
    slug: string,
  ): Promise<ContentItem | null> {
    /*
     * Primero buscamos en los datos estáticos.
     *
     * Esto permite que:
     *
     * /mods/1/scp-dystopia
     *
     * siga funcionando aunque ese contenido
     * no exista en PostgreSQL.
     */
    const staticItem =
      getStaticByRoute(
        category,
        id,
        slug,
      );

    if (staticItem) {
      return staticItem;
    }

    /*
     * Si no existe en data/, buscamos en PostgreSQL.
     */
    const databaseItem =
      await prisma.content.findFirst({
        where: {
          id,
          slug,
          category: databaseCategory(
            category,
          ),
        },
      });

    if (databaseItem) {
      return mapContent(databaseItem);
    }

    return null;
  },

  // ==========================================================
  // GET BY SLUG
  //
  // Compatibilidad temporal.
  //
  // NO utilizar para las nuevas rutas.
  // La ruta oficial ahora es:
  //
  // /[category]/[id]/[slug]
  // ==========================================================

  async getBySlug(
    slug: string,
  ): Promise<ContentItem | null> {
    const staticItem =
      getStaticBySlug(slug);

    if (staticItem) {
      return staticItem;
    }

    const databaseItem =
      await prisma.content.findFirst({
        where: {
          slug,
        },
      });

    if (databaseItem) {
      return mapContent(databaseItem);
    }

    return null;
  },

  // ==========================================================
  // GET BY CATEGORY
  // ==========================================================

async getByCategory(
  category: ContentCategory,
): Promise<ContentItem[]> {
  const staticItems =
    getStaticByCategory(category);

  const databaseCategories = [
    "mods",
    "maps",
    "shaders",
    "resource-packs",
    "ui-packs",
    "skins",
    "armor-trims",
    "banners",
    "schematics-java",
    "schematics-bedrock",
  ] as const;

  const supportsDatabase =
    databaseCategories.includes(
      category as (typeof databaseCategories)[number],
    );

  if (!supportsDatabase) {
    return staticItems;
  }

  const databaseItems =
    await prisma.content.findMany({
      where: {
        category:
          databaseCategory(category),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

  const mappedDatabase =
    mapContents(databaseItems);

  return [
    ...mappedDatabase,
    ...staticItems,
  ];
},

  // ==========================================================
  // GET RELATED
  // ==========================================================

  async getRelated(
    category: ContentCategory,
    slug: string,
    limit = 4,
  ): Promise<ContentItem[]> {
    const databaseItems =
      await prisma.content.findMany({
        where: {
          category:
            databaseCategory(category),

          NOT: {
            slug,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
      });

    const mappedDatabase =
      mapContents(databaseItems);

    const staticItems =
      getStaticByCategory(category)
        .filter(
          (item) => item.slug !== slug,
        )
        .slice(0, limit);

    return [
      ...mappedDatabase,
      ...staticItems,
    ]
      .slice(0, limit);
  },

  // ==========================================================
  // SEARCH
  // ==========================================================

  async search(
    query: string,
  ): Promise<ContentItem[]> {
    const value =
      query.toLowerCase().trim();

    if (!value) {
      return this.getAll();
    }

    const databaseItems =
      await prisma.content.findMany({
        where: {
          OR: [
            {
              title: {
                contains: value,
                mode: "insensitive",
              },
            },
            {
              description: {
                contains: value,
                mode: "insensitive",
              },
            },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    const databaseResults =
      mapContents(databaseItems);

    const staticResults =
      staticContent.filter(
        (item) =>
          item.title
            .toLowerCase()
            .includes(value) ||
          item.description
            .toLowerCase()
            .includes(value),
      );

    return [
      ...databaseResults,
      ...staticResults,
    ];
  },

  // ==========================================================
  // GET SKINS
  // ==========================================================

  async getSkins(): Promise<SkinItem[]> {
    const items =
      await this.getByCategory("skins");

    return items as SkinItem[];
  },
};