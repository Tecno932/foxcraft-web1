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

  ...skins.map((item) => ({
    ...item,
    category: "skins" as const,
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
// STOP WORDS
// ============================================================
//
// Palabras demasiado comunes que no aportan relevancia real
// al comparar contenidos.
//

const STOP_WORDS = new Set([
  // Español
  "a",
  "al",
  "algo",
  "algunos",
  "alguna",
  "algunas",
  "como",
  "con",
  "contra",
  "cual",
  "cuando",
  "de",
  "del",
  "desde",
  "donde",
  "el",
  "ella",
  "ellas",
  "ellos",
  "en",
  "entre",
  "es",
  "esta",
  "este",
  "estos",
  "estas",
  "hay",
  "la",
  "las",
  "lo",
  "los",
  "más",
  "para",
  "por",
  "que",
  "se",
  "sin",
  "sobre",
  "su",
  "sus",
  "un",
  "una",
  "uno",
  "unos",
  "unas",
  "y",

  // Palabras frecuentes en contenido de Minecraft
  "minecraft",
  "mc",
  "mod",
  "mods",
  "addon",
  "addons",
  "map",
  "maps",
  "mapa",
  "mapas",
  "pack",
  "packs",
  "texture",
  "textures",
  "textura",
  "texturas",
  "resource",
  "resources",
  "recursos",
  "shader",
  "shaders",
  "version",
  "versions",
  "versión",
  "versiones",
  "bedrock",
  "java",
  "edition",
  "edición",
  "update",
  "updates",
  "actualización",
  "actualizaciones",
]);

// ============================================================
// TEXT NORMALIZATION
// ============================================================

function normalizeText(
  value: string,
): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      "",
    )
    .replace(
      /[^a-z0-9\s]/g,
      " ",
    )
    .replace(
      /\s+/g,
      " ",
    )
    .trim();
}

function tokenize(
  value: string,
): string[] {
  const normalized =
    normalizeText(value);

  if (!normalized) {
    return [];
  }

  return normalized
    .split(" ")
    .filter(
      (word) =>
        word.length >= 3 &&
        !STOP_WORDS.has(word) &&
        !isVersion(word),
    );
}

function isVersion(
  value: string,
): boolean {
  return /^\d+(?:\.\d+)+(?:[a-z]+)?$/i.test(
    value,
  );
}

function uniqueWords(
  words: string[],
): Set<string> {
  return new Set(words);
}

// ============================================================
// TEXT SIMILARITY
// ============================================================

function countSharedWords(
  source: Set<string>,
  target: Set<string>,
): number {
  let matches = 0;

  for (const word of source) {
    if (target.has(word)) {
      matches++;
    }
  }

  return matches;
}

function calculateTextScore(
  current: ContentItem,
  candidate: ContentItem,
): number {
  const currentTitle =
    uniqueWords(
      tokenize(current.title),
    );

  const candidateTitle =
    uniqueWords(
      tokenize(candidate.title),
    );

  const currentDescription =
    uniqueWords(
      tokenize(
        current.description,
      ),
    );

  const candidateDescription =
    uniqueWords(
      tokenize(
        candidate.description,
      ),
    );

  const titleMatches =
    countSharedWords(
      currentTitle,
      candidateTitle,
    );

  const descriptionMatches =
    countSharedWords(
      currentDescription,
      candidateDescription,
    );

  const titleToDescriptionMatches =
    countSharedWords(
      currentTitle,
      candidateDescription,
    );

  const descriptionToTitleMatches =
    countSharedWords(
      currentDescription,
      candidateTitle,
    );

  let score = 0;

  // Coincidencias directas entre títulos.
  score += titleMatches * 25;

  // Coincidencias entre descripciones.
  score += descriptionMatches * 8;

  // El título de uno aparece conceptualmente
  // relacionado con la descripción del otro.
  score +=
    titleToDescriptionMatches * 12;

  score +=
    descriptionToTitleMatches * 10;

  return score;
}

// ============================================================
// VERSION SIMILARITY
// ============================================================

function calculateVersionScore(
  current: ContentItem,
  candidate: ContentItem,
): number {
  const currentVersions =
    new Set(
      current.version.map(
        (version) =>
          normalizeText(version),
      ),
    );

  const candidateVersions =
    new Set(
      candidate.version.map(
        (version) =>
          normalizeText(version),
      ),
    );

  let matches = 0;

  for (const version of currentVersions) {
    if (candidateVersions.has(version)) {
      matches++;
    }
  }

  return matches * 20;
}

// ============================================================
// PLATFORM SIMILARITY
// ============================================================

function calculatePlatformScore(
  current: ContentItem,
  candidate: ContentItem,
): number {
  if (
    current.platform ===
    candidate.platform
  ) {
    return 15;
  }

  if (
    current.platform === "both" ||
    candidate.platform === "both"
  ) {
    return 10;
  }

  return 0;
}

// ============================================================
// RELATED SCORE
// ============================================================

function calculateRelatedScore(
  current: ContentItem,
  candidate: ContentItem,
): number {
  let score = 0;

  score += calculateTextScore(
    current,
    candidate,
  );

  score += calculateVersionScore(
    current,
    candidate,
  );

  score += calculatePlatformScore(
    current,
    candidate,
  );

  // Contenido destacado recibe una pequeña prioridad.
  if (candidate.featured) {
    score += 3;
  }

  return score;
}

// ============================================================
// STATIC HELPERS
// ============================================================

function getStaticByCategory(
  category: ContentCategory,
): ContentItem[] {
  return staticContent.filter(
    (item) =>
      item.category === category,
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
    return getStaticByCategory(
      category,
    );
  },

  // ==========================================================
  // GET RELATED
  //
  // Busca contenido relacionado utilizando:
  //
  // 1. Título
  // 2. Descripción
  // 3. Versiones
  // 4. Plataforma
  // 5. Contenido destacado
  //
  // El contenido pertenece siempre a la misma categoría.
  // ==========================================================

  async getRelated(
    category: ContentCategory,
    slug: string,
    limit = 4,
  ): Promise<ContentItem[]> {
    const current =
      getStaticBySlug(slug);

    if (!current) {
      return [];
    }

    const candidates =
      getStaticByCategory(
        category,
      ).filter(
        (item) =>
          item.slug !== current.slug,
      );

    const scored =
      candidates.map((item) => ({
        item,
        score:
          calculateRelatedScore(
            current,
            item,
          ),
      }));

    scored.sort(
      (a, b) => {
        // Primero relevancia.
        if (b.score !== a.score) {
          return b.score - a.score;
        }

        // Después descargas.
        if (
          b.item.downloads !==
          a.item.downloads
        ) {
          return (
            b.item.downloads -
            a.item.downloads
          );
        }

        // Finalmente contenido más reciente.
        return (
          b.item.createdAt.getTime() -
          a.item.createdAt.getTime()
        );
      },
    );

    return scored
      .slice(0, limit)
      .map(
        ({ item }) => item,
      );
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
      await this.getByCategory(
        "skins",
      );

    return items as SkinItem[];
  },
};