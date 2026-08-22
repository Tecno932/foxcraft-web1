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
  return [...staticContent];
},

  // ==========================================================
  // GET FEATURED
  // ==========================================================

async getFeatured(): Promise<ContentItem[]> {
  return staticContent.filter(
    (item) => item.featured,
  );
},

  // ==========================================================
  // GET LATEST
  // ==========================================================

async getLatest(
  limit = 8,
): Promise<ContentItem[]> {
  return staticContent
    .slice()
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
  return getStaticByRoute(
    category,
    id,
    slug,
  );
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
  return getStaticBySlug(slug);
},

  // ==========================================================
  // GET BY CATEGORY
  // ==========================================================

async getByCategory(
  category: ContentCategory,
): Promise<ContentItem[]> {
  return getStaticByCategory(category);
},

  // ==========================================================
  // GET RELATED
  // ==========================================================

async getRelated(
  category: ContentCategory,
  slug: string,
  limit = 4,
): Promise<ContentItem[]> {
  return getStaticByCategory(category)
    .filter(
      (item) => item.slug !== slug,
    )
    .slice(0, limit);
},

  // ==========================================================
  // SEARCH
  // ==========================================================

async search(
  query: string,
): Promise<ContentItem[]> {
  const value = query
    .toLowerCase()
    .trim();

  if (!value) {
    return this.getAll();
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

  // ==========================================================
  // GET SKINS
  // ==========================================================

  async getSkins(): Promise<SkinItem[]> {
    const items =
      await this.getByCategory("skins");

    return items as SkinItem[];
  },
};