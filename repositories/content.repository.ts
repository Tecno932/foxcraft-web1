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

import { prisma } from "@/lib/prisma";

const content: ContentItem[] = [
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

function getByCategory(
  category: string,
): ContentItem[] {
  return content.filter(
    (item) => item.category === category,
  );
}

export const ContentRepository = {
  async getAll() {
    return prisma.content.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async getFeatured() {
    return prisma.content.findMany({
      where: {
        featured: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async getLatest(limit = 8) {
    return prisma.content.findMany({
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async getBySlug(slug: string) {
    return prisma.content.findUnique({
      where: {
        slug,
      },
    });
  },

  async getByCategory(category: ContentCategory) {
    return prisma.content.findMany({
      where: {
        category,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  getRelated(
    category: string,
    slug: string,
    limit = 4,
  ): ContentItem[] {
    return content
      .filter(
        (item) =>
          item.category === category &&
          item.slug !== slug,
      )
      .slice(0, limit);
  },

  search(
    query: string,
  ): ContentItem[] {
    const value =
      query.toLowerCase().trim();

    if (!value) {
      return content;
    }

    return content.filter(
      (item) =>
        item.title
          .toLowerCase()
          .includes(value) ||
        item.description
          .toLowerCase()
          .includes(value),
    );
  },

  getSkins(): SkinItem[] {
    return content.filter(
      (item): item is SkinItem =>
        item.category === "skins",
    );
  },
};