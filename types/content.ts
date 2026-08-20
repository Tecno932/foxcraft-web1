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

/**
 * Modelo normalizado utilizado por la interfaz.
 *
 * Los datos provenientes de Prisma o de archivos
 * estáticos deben ser adaptados a esta estructura
 * antes de llegar a los componentes.
 */
export interface ContentItem {
  id: number;

  slug: string;

  title: string;

  description: string;

  image: string;

  author?: string;

  authorId?: string;

  version: string[];

  platform: ContentPlatform;

  edition?: ContentEdition[];

  category: ContentCategory;

  featured: boolean;

  downloads: number;

  download: string;

  createdAt: Date;

  updatedAt?: Date;
}

/**
 * Contenido de tipo schematic.
 */
export interface SchematicItem extends ContentItem {
  category:
    | "schematics-java"
    | "schematics-bedrock";

  blocks?: number;
}

/**
 * Contenido de tipo skin.
 */
export interface SkinItem extends ContentItem {
  category: "skins";

  username?: string;

  uuid?: string;

  model?: "classic" | "slim";

  skinUrl?: string;
}