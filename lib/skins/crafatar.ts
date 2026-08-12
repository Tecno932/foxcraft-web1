const CRAFATAR_BASE_URL =
  "https://crafatar.com";

export function getCrafatarSkinUrl(
  uuid: string,
) {
  return `${CRAFATAR_BASE_URL}/skins/${uuid}`;
}

export function getCrafatarBodyUrl(
  uuid: string,
  scale = 4,
) {
  return `${CRAFATAR_BASE_URL}/renders/body/${uuid}?scale=${scale}`;
}

export function getCrafatarAvatarUrl(
  uuid: string,
  size = 128,
) {
  return `${CRAFATAR_BASE_URL}/avatars/${uuid}?size=${size}&overlay`;
}