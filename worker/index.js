const TEMP_USERNAME = "admin";
const TEMP_PASSWORD = "admin123";
const TEMP_COOKIE = "invicti_admin";
const TEMP_SALT = "invicti-temporary-admin-v1";

const json = (data, init = {}) => {
  const headers = new Headers(init.headers || {});
  headers.set("Content-Type", "application/json; charset=utf-8");
  headers.set("Cache-Control", "no-store");
  return new Response(JSON.stringify(data), { ...init, headers });
};

const digest = async (value) => {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, "0")).join("");
};

const temporaryToken = () => digest(`${TEMP_USERNAME}:${TEMP_PASSWORD}:${TEMP_SALT}`);

const hasTemporarySession = async (request) => {
  const expected = await temporaryToken();
  const cookie = request.headers.get("Cookie") || "";
  return cookie.split(";").some((part) => part.trim() === `${TEMP_COOKIE}=${expected}`);
};

const normalizeConnection = (body) => {
  const projectUrl = String(body?.projectUrl || "").trim().replace(/\/$/, "");
  const publishableKey = String(body?.publishableKey || "").trim();
  let parsed;
  try { parsed = new URL(projectUrl); } catch { return null; }
  if (parsed.protocol !== "https:" || !publishableKey || /service[_-]?role|secret/i.test(publishableKey)) return null;
  return { projectUrl, publishableKey };
};

const getConnection = async (environment) => {
  const row = await environment.DB.prepare("select project_url, publishable_key, updated_at from site_connections where id = 1").first();
  return row ? { projectUrl: row.project_url, publishableKey: row.publishable_key, updatedAt: row.updated_at } : null;
};

const hasSupabaseAdminSession = async (request, environment) => {
  const authorization = request.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer ")) return false;
  const connection = await getConnection(environment);
  if (!connection) return false;
  const userResponse = await fetch(`${connection.projectUrl}/auth/v1/user`, {
    headers: { apikey: connection.publishableKey, Authorization: authorization },
  });
  if (!userResponse.ok) return false;
  const user = await userResponse.json();
  if (!user?.id) return false;
  const adminResponse = await fetch(`${connection.projectUrl}/rest/v1/site_admins?select=user_id&user_id=eq.${encodeURIComponent(user.id)}&limit=1`, {
    headers: { apikey: connection.publishableKey, Authorization: authorization },
  });
  if (!adminResponse.ok) return false;
  const rows = await adminResponse.json();
  return Array.isArray(rows) && rows.length === 1;
};

const handleApi = async (request, environment, url) => {
  if (url.pathname === "/api/admin/login" && request.method === "POST") {
    if (await getConnection(environment)) {
      return json({ error: "Temporary login is disabled. Use your Supabase admin account." }, { status: 410 });
    }
    const body = await request.json().catch(() => ({}));
    if (body?.username !== TEMP_USERNAME || body?.password !== TEMP_PASSWORD) {
      return json({ error: "Invalid username or password." }, { status: 401 });
    }
    const token = await temporaryToken();
    return json({ ok: true, mode: "temporary" }, {
      headers: { "Set-Cookie": `${TEMP_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400` },
    });
  }

  if (url.pathname === "/api/admin/logout" && request.method === "POST") {
    return json({ ok: true }, { headers: { "Set-Cookie": `${TEMP_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0` } });
  }

  if (url.pathname === "/api/connection" && request.method === "GET") {
    return json({ connection: await getConnection(environment) }, { headers: { "Cache-Control": "public, max-age=60" } });
  }

  if (url.pathname === "/api/connection" && request.method === "POST") {
    const currentConnection = await getConnection(environment);
    const authorized = currentConnection ? await hasSupabaseAdminSession(request, environment) : await hasTemporarySession(request);
    if (!authorized) return json({ error: "Admin sign-in required." }, { status: 401 });
    const connection = normalizeConnection(await request.json().catch(() => null));
    if (!connection) return json({ error: "Use a valid HTTPS Project URL and publishable key. Secret/service-role keys are not allowed." }, { status: 400 });
    const updatedAt = new Date().toISOString();
    await environment.DB.prepare(`insert into site_connections (id, project_url, publishable_key, updated_at)
      values (1, ?, ?, ?)
      on conflict(id) do update set project_url = excluded.project_url, publishable_key = excluded.publishable_key, updated_at = excluded.updated_at`)
      .bind(connection.projectUrl, connection.publishableKey, updatedAt).run();
    return json({ connection: { ...connection, updatedAt } });
  }

  return json({ error: "Not found." }, { status: 404 });
};

export default {
  async fetch(request, environment) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) {
      try { return await handleApi(request, environment, url); }
      catch (error) { return json({ error: error instanceof Error ? error.message : "Unexpected server error." }, { status: 500 }); }
    }

    const isAdminRoute = url.pathname === "/admin" || url.pathname === "/admin/" || url.pathname === "/admin.html";
    let response = await environment.ASSETS.fetch(request);
    if (isAdminRoute && !response.ok) {
      response = await environment.ASSETS.fetch(new Request(new URL("/", url), { method: "GET", headers: request.headers }));
    }
    if (isAdminRoute && response.ok) {
      const headers = new Headers(response.headers);
      headers.set("X-Robots-Tag", "noindex, nofollow");
      headers.set("Cache-Control", "no-store");
      return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
    }
    if (!url.pathname.startsWith("/images/") || !response.ok) return response;
    const headers = new Headers(response.headers);
    headers.set("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  },
};
