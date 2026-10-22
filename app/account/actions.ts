
"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const USERNAME_REGEX = /^[a-z0-9_]{3,24}$/;
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const TYPE_REGEX = /^[a-z0-9_-]{1,40}$/;

async function getAuthenticatedClient() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Debés iniciar sesión.");
  }

  return { supabase, user };
}

// Actualizar el username del usuario autenticado.
export async function updateUsername(input: string) {
  if (typeof input !== "string") {
    throw new Error("El username no es válido.");
  }

  const username = input.trim().toLowerCase();

  if (!USERNAME_REGEX.test(username)) {
    throw new Error(
      "El username debe tener entre 3 y 24 caracteres: letras, números o guion bajo."
    );
  }

  const { supabase, user } = await getAuthenticatedClient();

  const { data, error } = await supabase
    .from("profiles")
    .update({ username })
    .eq("id", user.id)
    .select("id, username")
    .maybeSingle();

  if (error?.code === "23505") {
    throw new Error("Ese username ya está en uso.");
  }

  if (error) {
    throw new Error("No se pudo actualizar el username.");
  }

  if (!data) {
    throw new Error("No se encontró tu perfil.");
  }

  revalidatePath("/account");

  return {
    success: true,
    username: data.username,
  };
}

// Guardar un favorito sin duplicar el mismo contenido.
export async function addFavorite(
  contentTypeInput: string,
  contentSlugInput: string
) {
  if (
    typeof contentTypeInput !== "string" ||
    typeof contentSlugInput !== "string"
  ) {
    throw new Error("El contenido no es válido.");
  }

  const contentType = contentTypeInput.trim().toLowerCase();
  const contentSlug = contentSlugInput.trim().toLowerCase();

  if (
    !TYPE_REGEX.test(contentType) ||
    !SLUG_REGEX.test(contentSlug)
  ) {
    throw new Error(
      "El tipo o identificador del contenido no es válido."
    );
  }

  const { supabase, user } = await getAuthenticatedClient();

  const { error } = await supabase
    .from("favorites")
    .upsert(
      {
        user_id: user.id,
        content_type: contentType,
        content_slug: contentSlug,
      },
      {
        onConflict: "user_id,content_type,content_slug",
        ignoreDuplicates: true,
      }
    );

  if (error) {
    throw new Error("No se pudo guardar el favorito.");
  }

  revalidatePath("/account");

  return { success: true };
}

// Eliminar un favorito perteneciente al usuario autenticado.
export async function removeFavorite(favoriteId: number) {
  if (
    typeof favoriteId !== "number" ||
    !Number.isSafeInteger(favoriteId) ||
    favoriteId <= 0
  ) {
    throw new Error("El favorito no es válido.");
  }

  const { supabase, user } = await getAuthenticatedClient();

  const { data, error } = await supabase
    .from("favorites")
    .delete()
    .eq("id", favoriteId)
    .eq("user_id", user.id)
    .select("id");

  if (error) {
    throw new Error("No se pudo eliminar el favorito.");
  }

  if (!data || data.length === 0) {
    throw new Error("El favorito no existe o no te pertenece.");
  }

  revalidatePath("/account");

  return { success: true };
}
