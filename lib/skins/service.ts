import {
  getPlayerByUsername,
} from "./mojang";

import {
  getCrafatarSkinUrl,
  getCrafatarBodyUrl,
  getCrafatarAvatarUrl,
} from "./crafatar";

import {
  getVisageFullUrl,
  getVisageBustUrl,
} from "./visage";

export interface SkinProfile {
  username: string;
  uuid: string;

  skin: {
    png: string;
    body: string;
    avatar: string;
  };

  visage: {
    full: string;
    bust: string;
  };
}

export async function getSkinProfile(
  username: string,
): Promise<SkinProfile | null> {
  const profile =
    await getPlayerByUsername(username);

  if (!profile) {
    return null;
  }

  return {
    username: profile.name,

    uuid: profile.id,

    skin: {
      png: getCrafatarSkinUrl(profile.id),

      body: getCrafatarBodyUrl(profile.id),

      avatar: getCrafatarAvatarUrl(profile.id),
    },

    visage: {
      full: getVisageFullUrl(profile.id),

      bust: getVisageBustUrl(profile.id),
    },
  };
}