"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setError("No se pudo iniciar sesión. Revisá tus credenciales.");
        return;
      }

      router.replace("/account");
      router.refresh();
    } catch {
      setError("Ocurrió un error al iniciar sesión. Intentá nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  async function signInWithGoogle() {
    setError("");
    setGoogleLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch {
      setError("No se pudo iniciar sesión con Google.");
      setGoogleLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>Bienvenido de nuevo</h1>
        <p className="auth-description">
          Iniciá sesión para acceder a tu perfil y tus favoritos.
        </p>

        <form className="auth-form" onSubmit={login}>
          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="tuemail@gmail.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="Tu contraseña"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="auth-button"
            type="submit"
            disabled={loading || googleLoading}
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        <div className="auth-divider">o</div>

        <button
          className="auth-button auth-button-secondary"
          type="button"
          onClick={signInWithGoogle}
          disabled={loading || googleLoading}
        >
          {googleLoading ? "Conectando..." : "Continuar con Google"}
        </button>

        {error && (
          <p className="auth-message auth-error" role="alert">
            {error}
          </p>
        )}

        <p className="auth-switch">
          ¿Todavía no tenés cuenta? <Link href="/signup">Registrate</Link>
        </p>
      </section>
    </main>
  );
}