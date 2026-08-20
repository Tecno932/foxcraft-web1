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

import {
  prisma,
} from "@/lib/prisma";

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
// REPOSITORY
// ============================================================

export const ContentRepository = {

  // ----------------------------------------------------------
  // GET ALL
  // ----------------------------------------------------------

  async getAll(): Promise<ContentItem[]> {
    const items =
      await prisma.content.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

    if (items.length > 0) {
      return mapContents(items);
    }

    return staticContent;
  },

  // ----------------------------------------------------------
  // GET FEATURED
  // ----------------------------------------------------------

  async getFeatured(): Promise<ContentItem[]> {
    const items =
      await prisma.content.findMany({
        where: {
          featured: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    if (items.length > 0) {
      return mapContents(items);
    }

    return staticContent.filter(
      (item) => item.featured,
    );
  },

  // ----------------------------------------------------------
  // GET LATEST
  // ----------------------------------------------------------

  async getLatest(
    limit = 8,
  ): Promise<ContentItem[]> {
    const items =
      await prisma.content.findMany({
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      });

    if (items.length > 0) {
      return mapContents(items);
    }

    return staticContent
      .slice()
      .sort(
        (a, b) =>
          b.createdAt.getTime() -
          a.createdAt.getTime(),
      )
      .slice(0, limit);
  },

  // ----------------------------------------------------------
  // GET BY SLUG
  // ----------------------------------------------------------

  async getBySlug(
    slug: string,
  ): Promise<ContentItem | null> {
    const item =
      await prisma.content.findUnique({
        where: {
          slug,
        },
      });

    if (item) {
      return mapContent(item);
    }

    return getStaticBySlug(slug);
  },

  // ----------------------------------------------------------
  // GET BY CATEGORY
  // ----------------------------------------------------------

  async getByCategory(
    category: ContentCategory,
  ): Promise<ContentItem[]> {
    const items =
      await prisma.content.findMany({
        where: {
          category:
            category.toUpperCase() as never,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    if (items.length > 0) {
      return mapContents(items);
    }

    return getStaticByCategory(category);
  },

  // ----------------------------------------------------------
  // GET RELATED
  // ----------------------------------------------------------

  async getRelated(
    category: ContentCategory,
    slug: string,
    limit = 4,
  ): Promise<ContentItem[]> {
    const items =
      await prisma.content.findMany({
        where: {
          category:
            category.toUpperCase() as never,
          NOT: {
            slug,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
      });

    if (items.length > 0) {
      return mapContents(items);
    }

    return getStaticByCategory(category)
      .filter(
        (item) => item.slug !== slug,
      )
      .slice(0, limit);
  },

  // ----------------------------------------------------------
  // SEARCH
  // ----------------------------------------------------------

  async search(
    query: string,
  ): Promise<ContentItem[]> {
    const value =
      query.toLowerCase().trim();

    if (!value) {
      return this.getAll();
    }

    const items =
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

    if (items.length > 0) {
      return mapContents(items);
    }

    return staticContent.filter(
      (item) =>
        item.title
          .toLowerCase()
          .includes(value) ||
        item.description
          .toLowerCase()
          .includes(value),
    );
  },

  // ----------------------------------------------------------
  // GET SKINS
  // ----------------------------------------------------------

  async getSkins(): Promise<SkinItem[]> {
    const items =
      await this.getByCategory("skins");

    return items as SkinItem[];
  },
};