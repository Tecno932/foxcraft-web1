export type ContentCategory =
  | "mods"
  | "maps"
  | "shaders"
  | "resource-packs"
  | "texture-packs"
  | "ui-packs"
  | "skins"
  | "armor-trims"
  | "banners"
  | "schematics-java"
  | "schematics-bedrock";

export type ContentType = ContentCategory;

export type ContentPlatform =
  | "java"
  | "bedrock"
  | "both";

export type ContentEdition =
  | "java"
  | "bedrock"
  | "both";

export interface ContentItem {
  id: number;
  slug: string;
  title: string;
  description: string;
  image: string;
  version: string[];
  platform: string;
  featured: boolean;
  downloads: number;
  download: string;
  createdAt: string;
}

export interface SchematicItem extends ContentItem {
  category:
    | "schematics-java"
    | "schematics-bedrock";

  width?: number;

  height?: number;

  length?: number;

  blocks?: number;

  format?: string;

  minecraftVersion?: string;

  fileSize?: string;
}

export type CatalogItem =
  | ContentItem
  | SchematicItem;