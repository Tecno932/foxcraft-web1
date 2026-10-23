
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Crown } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // Obtener el perfil del usuario autenticado.
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, username, created_at, updated_at")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    throw new Error("No se pudo cargar el perfil.");
  }

  if (!profile) {
    await supabase.auth.signOut();
    redirect("/login");
  }

  // Obtener únicamente los favoritos del usuario actual.
  const {
    data: favorites,
    error: favoritesError,
  } = await supabase
    .from("favorites")
    .select("id, content_type, content_slug, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const { data: premium } = await supabase
    .from("premium_access")
    .select("plan, expires_at")
    .eq("user_id", user.id)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();
  
  if (favoritesError) {
    throw new Error("No se pudieron cargar los favoritos.");
  }

    return (
    <main className="account-page">
        <div className="account-container">
        <header className="account-header">
            <p className="account-eyebrow">Foxcrafting / Mi cuenta</p>
            <h1>Mi perfil</h1>
            <p className="account-subtitle">
            Administrá tus datos y accedé a tus contenidos favoritos.
            </p>
        </header>

        <div className="account-grid">
            <section className="account-section">
            <div className="account-avatar" aria-hidden="true">
                {(profile.username?.[0] ?? user.email?.[0] ?? "F").toUpperCase()}
            </div>

            <h2>Datos de tu cuenta</h2>

            <dl className="account-details">
                <div>
                <dt>Nombre de usuario</dt>
                <dd>{profile.username ?? "Todavía no configurado"}</dd>
                    {premium && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-xs font-semibold text-amber-300">
                        <Crown size={14} />
                        PREMIUM
                    </span>
                    )}
                </div>

                <div>
                <dt>Correo electrónico</dt>
                <dd>{user.email ?? "No disponible"}</dd>
                </div>

                <div>
                <dt>Miembro desde</dt>
                <dd>
                    {new Date(profile.created_at).toLocaleDateString("es-AR")}
                </dd>
                </div>
            </dl>
            </section>

            <section className="account-section">
            <h2>Mis favoritos ({favorites.length})</h2>

            {favorites.length === 0 ? (
                <div className="account-empty">
                Todavía no guardaste favoritos. Cuando guardes contenido,
                aparecerá acá.
                </div>
            ) : (
                <ul className="account-list">
                {favorites.map((favorite) => (
                    <li className="account-item" key={favorite.id}>
                    <div className="account-item-content">
                        <span className="account-item-title">
                        {favorite.content_slug}
                        </span>
                        <span className="account-item-meta">
                        Categoría: {favorite.content_type}
                        </span>
                    </div>

                    {/* Acá podés colocar el botón conectado a removeFavorite */}
                    </li>
                ))}
                </ul>
            )}
            </section>
        </div>
        </div>
    </main>
    );
}
