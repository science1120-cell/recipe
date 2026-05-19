import type { User } from "@supabase/supabase-js";

/** Display name from user_metadata, falling back to email local-part. */
export function getDisplayName(user: User | null | undefined): string {
  if (!user) return "Guest";

  const meta = user.user_metadata ?? {};
  const fromMeta =
    (typeof meta.full_name === "string" && meta.full_name.trim()) ||
    (typeof meta.name === "string" && meta.name.trim()) ||
    (typeof meta.display_name === "string" && meta.display_name.trim());

  if (fromMeta) return fromMeta;

  const email = user.email?.trim();
  if (email) {
    const local = email.split("@")[0];
    if (local) return local.charAt(0).toUpperCase() + local.slice(1);
  }

  return "Chef";
}

export function getUserEmail(user: User | null | undefined): string | null {
  return user?.email?.trim() || null;
}

/** Stable emoji avatar from display name (for profile circle). */
export function getAvatarEmoji(user: User | null | undefined): string {
  const name = getDisplayName(user);
  const emojis = ["👩‍🍳", "👨‍🍳", "🍳", "🥘", "🍲", "🧑‍🍳"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash + name.charCodeAt(i)) | 0;
  return emojis[Math.abs(hash) % emojis.length];
}

export function formatMemberSince(user: User | null | undefined): string | null {
  if (!user?.created_at) return null;
  const date = new Date(user.created_at);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, { year: "numeric", month: "long" });
}
