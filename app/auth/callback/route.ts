
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  // Solo permitir destinos internos.
  const destination =
    next?.startsWith("/") && !next.startsWith("//")
      ? next
      : "/account";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(
        new URL(destination, origin)
      );
    }
  }

  return NextResponse.redirect(
    new URL("/login?error=auth_callback", origin)
  );
}
