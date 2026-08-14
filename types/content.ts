// types/content.ts

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

  category?: ContentCategory;

  slug: string;

  title: string;

  description: string;

  image: string;

  author?: string;

  version: string[];

  platform: ContentPlatform;

  edition?: ContentEdition[];

  featured: boolean;

  downloads: number;

  download: string;

  createdAt: string;
}

export interface SchematicItem
  extends ContentItem {
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