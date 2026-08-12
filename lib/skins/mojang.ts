const MOJANG_API =
  "https://api.mojang.com";

export interface MojangProfile {
  id: string;
  name: string;
}

export async function getPlayerByUsername(
  username: string,
): Promise<MojangProfile | null> {
  const response = await fetch(
    `${MOJANG_API}/users/profiles/minecraft/${encodeURIComponent(username)}`,
    {
      next: {
        revalidate: 3600,
      },
    },
  );

  if (!response.ok) {
    return null;
  }

  return response.json();
}