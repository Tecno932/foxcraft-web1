import Link from "next/link";
import { redirect } from "next/navigation";
import { Crown } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function PremiumSuccessPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: premium } = await supabase
    .from("premium_access")
    .select("plan, expires_at")
    .eq("user_id", user.id)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

  return (
    <main className="mx-auto max-w-2xl px-4 py-20 text-center">
      <Crown className="mx-auto h-14 w-14 text-amber-400" />

      <h1 className="mt-5 text-3xl font-bold">
        {premium ? "¡Tu Premium está activo!" : "Estamos confirmando tu pago"}
      </h1>

      <p className="mt-4 text-muted">
        {premium
          ? `Tu acceso vence el ${new Date(premium.expires_at).toLocaleString("es-AR", {
              dateStyle: "medium",
              timeStyle: "short",
              timeZone: "UTC",
            })} UTC.`
          : "El pago puede tardar unos instantes en reflejarse. No vuelvas a pagar; comprueba tu perfil en unos momentos."}
      </p>

      <Link
        href="/account"
        className="mt-8 inline-flex rounded-xl bg-primary px-5 py-3 font-semibold text-white"
      >
        Ir a mi perfil
      </Link>
    </main>
  );
}