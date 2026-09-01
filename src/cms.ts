import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { cloneContent, defaultContent, type SiteContent } from "./content";

export type CmsConnection = {
  projectUrl: string;
  publishableKey: string;
  updatedAt?: string;
};

const LOCAL_CONNECTION_KEY = "invicti-cms-connection";
const LOCAL_CONTENT_KEY = "invicti-cms-content";
const LOCAL_SESSION_KEY = "invicti-temp-admin-session";
const clients = new Map<string, SupabaseClient>();

const browserStorage = () => typeof window === "undefined" ? null : window.localStorage;
const isJsonResponse = (response: Response) => response.headers.get("Content-Type")?.includes("application/json") ?? false;

export const getSupabaseClient = (connection: CmsConnection) => {
  const cacheKey = `${connection.projectUrl}|${connection.publishableKey}`;
  const cached = clients.get(cacheKey);
  if (cached) return cached;
  const client = createClient(connection.projectUrl, connection.publishableKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
  clients.set(cacheKey, client);
  return client;
};

export async function loadConnection(): Promise<CmsConnection | null> {
  // 1. Check committed static config file (public/cms-connection.json — anon key is public-safe)
  try {
    const res = await fetch("/cms-connection.json", { headers: { Accept: "application/json" }, cache: "no-store" });
    if (res.ok && isJsonResponse(res)) {
      const cfg = await res.json() as { projectUrl?: string; publishableKey?: string };
      if (cfg.projectUrl && cfg.publishableKey) return cfg as CmsConnection;
    }
  } catch { /* File not yet committed. */ }
  // 2. Check build-time env vars (Vercel dashboard)
  const envUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const envKey = import.meta.env.VITE_SUPABASE_KEY as string | undefined;
  if (envUrl && envKey) {
    return { projectUrl: envUrl.trim().replace(/\/$/, ""), publishableKey: envKey.trim() };
  }
  // 3. Try Cloudflare Worker API
  try {
    const response = await fetch("/api/connection", { headers: { Accept: "application/json" } });
    if (response.ok && isJsonResponse(response)) {
      const payload = await response.json() as { connection?: CmsConnection | null };
      if (payload.connection) return payload.connection;
    }
  } catch { /* Local Vite preview has no Worker API. */ }
  // 4. Fallback to localStorage
  const saved = browserStorage()?.getItem(LOCAL_CONNECTION_KEY);
  if (!saved) return null;
  try { return JSON.parse(saved) as CmsConnection; } catch { return null; }
}

export async function saveConnection(connection: CmsConnection, accessToken?: string): Promise<CmsConnection> {
  const normalized = {
    projectUrl: connection.projectUrl.trim().replace(/\/$/, ""),
    publishableKey: connection.publishableKey.trim(),
  };
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  try {
    const response = await fetch("/api/connection", { method: "POST", headers, body: JSON.stringify(normalized) });
    if (response.ok && isJsonResponse(response)) {
      const payload = await response.json() as { connection: CmsConnection };
      browserStorage()?.setItem(LOCAL_CONNECTION_KEY, JSON.stringify(payload.connection));
      return payload.connection;
    }
    if (response.status !== 404 && isJsonResponse(response)) {
      const payload = await response.json().catch(() => ({})) as { error?: string };
      throw new Error(payload.error || "Could not save the connection.");
    }
  } catch (error) {
    if (error instanceof Error && !/fetch|network|404/i.test(error.message)) throw error;
  }
  browserStorage()?.setItem(LOCAL_CONNECTION_KEY, JSON.stringify(normalized));
  return normalized;
}

export async function testConnection(connection: CmsConnection) {
  const client = getSupabaseClient(connection);
  const { error } = await client.from("site_content").select("key").limit(1);
  if (error) throw error;
}

export async function loadContent(connection?: CmsConnection | null): Promise<SiteContent> {
  if (connection) {
    const client = getSupabaseClient(connection);
    const { data, error } = await client.from("site_content").select("content").eq("key", "main").maybeSingle();
    if (!error && data?.content) return data.content as SiteContent;
    if (error && error.code !== "PGRST116") console.warn("Supabase content load failed", error.message);
  }
  const saved = browserStorage()?.getItem(LOCAL_CONTENT_KEY);
  if (saved) {
    try { return JSON.parse(saved) as SiteContent; } catch { /* Ignore invalid local draft. */ }
  }
  return cloneContent(defaultContent);
}

export async function saveContent(content: SiteContent, connection?: CmsConnection | null) {
  browserStorage()?.setItem(LOCAL_CONTENT_KEY, JSON.stringify(content));
  if (!connection) return { mode: "local" as const };
  const client = getSupabaseClient(connection);
  const { data: sessionData } = await client.auth.getSession();
  if (!sessionData.session) throw new Error("Sign in with your Supabase admin account before publishing.");
  const { error } = await client.from("site_content").upsert({ key: "main", content, updated_by: sessionData.session.user.id }, { onConflict: "key" });
  if (error) throw error;
  return { mode: "supabase" as const };
}

export function resetLocalContent() {
  browserStorage()?.removeItem(LOCAL_CONTENT_KEY);
  return cloneContent(defaultContent);
}

export async function temporaryLogin(username: string, password: string) {
  try {
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (response.ok && isJsonResponse(response)) {
      browserStorage()?.setItem(LOCAL_SESSION_KEY, "active");
      return;
    }
    if (response.status !== 404 && isJsonResponse(response)) {
      const payload = await response.json().catch(() => ({})) as { error?: string };
      throw new Error(payload.error || "Invalid username or password.");
    }
  } catch (error) {
    if (error instanceof Error && !/fetch|network|404/i.test(error.message)) throw error;
  }
  if (username !== "admin" || password !== "admin123") throw new Error("Invalid username or password.");
  browserStorage()?.setItem(LOCAL_SESSION_KEY, "active");
}

export const hasTemporaryLogin = () => browserStorage()?.getItem(LOCAL_SESSION_KEY) === "active";

export async function signInSupabase(connection: CmsConnection, email: string, password: string) {
  const client = getSupabaseClient(connection);
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw error;
  const { data: admin, error: adminError } = await client.from("site_admins").select("user_id").eq("user_id", data.user.id).maybeSingle();
  if (adminError || !admin) {
    await client.auth.signOut();
    throw new Error("This Supabase user is not listed in site_admins.");
  }
  return data.session;
}

export async function getSupabaseSession(connection: CmsConnection) {
  const { data } = await getSupabaseClient(connection).auth.getSession();
  return data.session;
}

export async function logout(connection?: CmsConnection | null) {
  browserStorage()?.removeItem(LOCAL_SESSION_KEY);
  await fetch("/api/admin/logout", { method: "POST" }).catch(() => undefined);
  if (connection) await getSupabaseClient(connection).auth.signOut();
}

export async function uploadImage(connection: CmsConnection, file: File) {
  const client = getSupabaseClient(connection);
  const cleanName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "image";
  const path = `uploads/${Date.now()}-${crypto.randomUUID()}-${cleanName}`;
  const { error } = await client.storage.from("site-assets").upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type });
  if (error) throw error;
  const { data } = client.storage.from("site-assets").getPublicUrl(path);
  return { url: data.publicUrl, path };
}

export async function deleteUploadedImage(connection: CmsConnection, imageUrl: string) {
  const marker = "/storage/v1/object/public/site-assets/";
  const markerIndex = imageUrl.indexOf(marker);
  if (markerIndex === -1) throw new Error("Only images uploaded to the site-assets bucket can be deleted from storage.");
  const path = decodeURIComponent(imageUrl.slice(markerIndex + marker.length));
  const { error } = await getSupabaseClient(connection).storage.from("site-assets").remove([path]);
  if (error) throw error;
}
