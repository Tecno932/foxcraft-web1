import type { ContentItem } from "./content";

export type SkinModel =
  | "classic"
  | "slim";

export interface SkinItem
  extends ContentItem {
  category: "skins";

  username?: string;

  uuid?: string;

  model?: SkinModel;

  skinUrl?: string;
}