import {
  getCrafatarBodyUrl,
} from "./crafatar";

import {
  getMCHeadsBodyUrl,
} from "./mcheads";

export function getSkinImageUrl(
  uuid?: string,
  username?: string,
) {
  if (uuid) {
    return getCrafatarBodyUrl(
      uuid,
      4,
    );
  }

  if (username) {
    return getMCHeadsBodyUrl(
      username,
    );
  }

  return null;
}