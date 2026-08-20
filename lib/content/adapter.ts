import type {
  ContentCategory,
  ContentItem,
  ContentPlatform,
  ContentEdition,
} from "@/types";

import {
  mapContent,
} from "./mapper";

export {
  mapContent,
};

export function normalizeCategory(
  value: string | null | undefined,
): ContentCategory | undefined {
  if (!value) {
    return undefined;
  }

  switch (value.toLowerCase()) {
    case "mods":
      return "mods";

    case "maps":
      return "maps";

    case "shaders":
      return "shaders";

    case "resource_packs":
    case "resource-packs":
      return "resource-packs";

    case "texture_packs":
    case "texture-packs":
      return "texture-packs";

    case "ui_packs":
    case "ui-packs":
      return "ui-packs";

    case "skins":
      return "skins";

    case "armor_trims":
    case "armor-trims":
      return "armor-trims";

    case "banners":
      return "banners";

    case "schematics_java":
    case "schematics-java":
      return "schematics-java";

    case "schematics_bedrock":
    case "schematics-bedrock":
      return "schematics-bedrock";

    default:
      return undefined;
  }
}

export function normalizePlatform(
  value: string,
): ContentPlatform {
  return value.toLowerCase() as ContentPlatform;
}

export function normalizeEdition(
  value: string[] | null | undefined,
): ContentEdition[] | undefined {
  if (!value) {
    return undefined;
  }

  return value.map(
    (item) =>
      item.toLowerCase() as ContentEdition,
  );
}

export function normalizeContent(
  item: ContentItem,
): ContentItem {
  return {
    ...item,
    category:
      normalizeCategory(item.category) ??
      "mods",
    platform: normalizePlatform(
      item.platform,
    ),
    edition: normalizeEdition(
      item.edition,
    ),
    createdAt:
      item.createdAt instanceof Date
        ? item.createdAt
        : new Date(item.createdAt),
  };
}