export interface MinecraftProfile {
  id: string;
  name: string;
}

export async function getMinecraftProfile(
  username: string,
): Promise<MinecraftProfile | null> {
  const response = await fetch(
    `https://api.mojang.com/users/profiles/minecraft/${encodeURIComponent(username)}`,
    {
      next: {
        revalidate: 3600,
      },
    },
  );

  if (!response.ok) {
    return null;
  }

  const data = await response.json();

  return {
    id: data.id,
    name: data.name,
  };
}