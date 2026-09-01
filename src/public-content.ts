import { cloneContent, defaultContent, type SiteContent } from "./content";

type PublicConnection = { projectUrl: string; publishableKey: string };

const LOCAL_CONNECTION_KEY = "invicti-cms-connection";
const LOCAL_CONTENT_KEY = "invicti-cms-content";

const localValue = <T,>(key: string): T | null => {
  try {
    const saved = window.localStorage.getItem(key);
    return saved ? JSON.parse(saved) as T : null;
  } catch { return null; }
};

export async function loadPublicContent(): Promise<SiteContent> {
  let connection: PublicConnection | null = null;
  try {
    const response = await fetch("/api/connection", { headers: { Accept: "application/json" } });
    if (response.ok && response.headers.get("Content-Type")?.includes("application/json")) {
      const payload = await response.json() as { connection?: PublicConnection | null };
      connection = payload.connection || null;
    }
  } catch { /* The local Vite server has no Worker API. */ }
  connection ||= localValue<PublicConnection>(LOCAL_CONNECTION_KEY);

  if (connection) {
    try {
      const endpoint = `${connection.projectUrl.replace(/\/$/, "")}/rest/v1/site_content?select=content&key=eq.main&limit=1`;
      const response = await fetch(endpoint, {
        headers: { apikey: connection.publishableKey, Authorization: `Bearer ${connection.publishableKey}` },
      });
      if (response.ok) {
        const rows = await response.json() as Array<{ content?: SiteContent }>;
        if (rows[0]?.content) return rows[0].content;
      }
    } catch { /* Keep the public site available with its built-in content. */ }
  }

  return localValue<SiteContent>(LOCAL_CONTENT_KEY) || cloneContent(defaultContent);
}

