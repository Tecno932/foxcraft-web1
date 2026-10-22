import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PremiumCheckout } from "./paypal-checkout";

export const dynamic = "force-dynamic";

export default async function PremiumPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/premium");
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <p className="font-semibold text-primary">FOXCRAFTING PREMIUM</p>
        <h1 className="mt-3 text-3xl font-bold md:text-5xl">
          Desbloquea tu experiencia Premium
        </h1>
        <p className="mt-4 text-muted">
          Descargas exclusivas, contenido Premium y la insignia de corona
          en tu perfil. Pagos únicos, sin renovación automática.
        </p>
      </div>

      <PremiumCheckout />
    </main>
  );
}