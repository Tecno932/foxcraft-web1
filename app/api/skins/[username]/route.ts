import {
  NextResponse,
} from "next/server";

interface RouteContext {
  params: Promise<{
    username: string;
  }>;
}

interface MinecraftProfile {
  id: string;
  name: string;
}

export async function GET(
  _request: Request,
  { params }: RouteContext,
) {
  try {
    const {
      username,
    } = await params;

    const name =
      decodeURIComponent(username).trim();

    if (!name) {
      return new NextResponse(
        "Missing username",
        {
          status: 400,
        },
      );
    }

    const profileResponse =
      await fetch(
        `https://api.mojang.com/users/profiles/minecraft/${encodeURIComponent(name)}`,
        {
          headers: {
            Accept:
              "application/json",
          },

          next: {
            revalidate: 3600,
          },
        },
      );

    if (!profileResponse.ok) {
      return new NextResponse(
        "Minecraft profile not found",
        {
          status: 404,
        },
      );
    }

    const profile =
      (await profileResponse.json()) as MinecraftProfile;

    const renderUrl =
      `https://visage.surgeplay.com/full/512/${profile.id}`;

    const imageResponse =
      await fetch(
        renderUrl,
        {
          headers: {
            Accept:
              "image/png,image/*",
          },

          next: {
            revalidate: 3600,
          },
        },
      );

    if (!imageResponse.ok) {
      return new NextResponse(
        "Skin render unavailable",
        {
          status: 502,
        },
      );
    }

    const image =
      await imageResponse.arrayBuffer();

    return new NextResponse(
      image,
      {
        status: 200,

        headers: {
          "Content-Type":
            imageResponse.headers.get(
              "content-type",
            ) ?? "image/png",

          "Cache-Control":
            "public, max-age=3600, s-maxage=3600",
        },
      },
    );
  } catch (error) {
    console.error(
      "Skin API error:",
      error,
    );

    return new NextResponse(
      "Failed to load skin",
      {
        status: 500,
      },
    );
  }
}