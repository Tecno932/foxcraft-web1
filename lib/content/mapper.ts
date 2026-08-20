import type {
  ContentCategory,
  ContentItem,
  ContentPlatform,
} from "@/types";

import type { Content } from "@prisma/client";

function normalizeCategory(
  value: string,
): ContentCategory {
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
      throw new Error(
        `Categoría de contenido inválida: ${value}`,
      );
  }
}

function normalizePlatform(
  value: string,
): ContentPlatform {
  switch (value.toLowerCase()) {
    case "java":
      return "java";

    case "bedrock":
      return "bedrock";

    case "both":
      return "both";

    default:
      throw new Error(
        `Plataforma de contenido inválida: ${value}`,
      );
  }
}

export function mapContent(
  item: Content,
): ContentItem {
  return {
    id: item.id,

    slug: item.slug,

    title: item.title,

    description: item.description,

    image: item.image,

    authorId: item.authorId,

    version: item.version,

    platform: normalizePlatform(
      item.platform,
    ),

    category: normalizeCategory(
      item.category,
    ),

    featured: item.featured,

    downloads: item.downloads,

    download: item.downloadUrl,

    createdAt: item.createdAt,

    updatedAt: item.updatedAt,
  };
}

export function mapContents(
  items: Content[],
): ContentItem[] {
  return items.map(mapContent);
}