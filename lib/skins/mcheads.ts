const MCHEADS_BASE_URL =
  "https://mc-heads.net";

export function getMCHeadsAvatarUrl(
  username: string,
) {
  return `${MCHEADS_BASE_URL}/avatar/${encodeURIComponent(username)}/128`;
}

export function getMCHeadsBodyUrl(
  username: string,
) {
  return `${MCHEADS_BASE_URL}/body/${encodeURIComponent(username)}/128`;
}

export function getMCHeadsSkinUrl(
  username: string,
) {
  return `${MCHEADS_BASE_URL}/skin/${encodeURIComponent(username)}`;
}