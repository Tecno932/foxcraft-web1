import "server-only";

import { createClient } from "@/lib/supabase/server";

export async function getCurrentPremium() {
  const supabase = await createClient();
  const { data: { user }, error: authError } =
    await supabase.auth.getUser();

  if (authError || !user) {
    return { user: null, premium: null };
  }

  const { data: premium } = await supabase
    .from("premium_access")
    .select("plan, starts_at, expires_at")
    .eq("user_id", user.id)
    .lte("starts_at", new Date().toISOString())
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

  return { user, premium };
}