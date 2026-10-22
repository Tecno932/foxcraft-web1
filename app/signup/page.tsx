"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function signUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email.trim() || password.length < 8) {
      setError("Ingresá un correo y una contraseña de al menos 8 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      setMessage(
        data.session
          ? "Cuenta creada correctamente. Ya podés continuar."
          : "¡Casi listo! Revisá tu correo y confirmá tu cuenta.",
      );
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "No se pudo registrar la cuenta.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function signInWithGoogle() {
    setError("");
    setMessage("");
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
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "No se pudo continuar con Google.",
      );
      setGoogleLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">
          <span className="auth-brand-mark" aria-hidden="true">
            F
          </span>
          FOXCRAFTING
        </div>

        <h1>Crear cuenta</h1>
        <p className="auth-description">
          Registrate para guardar tus favoritos y tener tu espacio personal
          en Foxcrafting.
        </p>

        <form className="auth-form" onSubmit={signUp}>
          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="vos@ejemplo.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="Mínimo 8 caracteres"
            minLength={8}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="auth-button"
            type="submit"
            disabled={loading || googleLoading}
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
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

        {message && (
          <p className="auth-message auth-success" role="status">
            {message}
          </p>
        )}

        <p className="auth-switch">
          ¿Ya tenés una cuenta? <Link href="/login">Iniciá sesión</Link>
        </p>
      </section>
    </main>
  );
}