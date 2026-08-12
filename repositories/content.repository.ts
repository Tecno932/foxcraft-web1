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
  ContentItem,
  SkinItem,
} from "@/types";

const content: ContentItem[] = [
  ...mods,
  ...maps,
  ...skins,
  ...shaders,
  ...resourcePacks,
  ...texturePacks,
  ...uiPacks,
  ...armorTrims,
  ...banners,
  ...schematicsJava,
  ...schematicsBedrock,
];

function getByCategory(
  category: string,
): ContentItem[] {
  return content.filter(
    (item) => item.category === category,
  );
}

export const ContentRepository = {
  getAll(): ContentItem[] {
    return content;
  },

  getFeatured(): ContentItem[] {
    return content.filter(
      (item) => item.featured,
    );
  },

  getLatest(
    limit = 6,
  ): ContentItem[] {
    return content.slice(0, limit);
  },

  getBySlug(
    slug: string,
  ): ContentItem | undefined {
    return content.find(
      (item) => item.slug === slug,
    );
  },

  getByCategory,

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