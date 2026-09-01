import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";

import {
  deleteUploadedImage,
  getSupabaseSession,
  hasTemporaryLogin,
  loadConnection,
  loadContent,
  logout,
  resetLocalContent,
  saveConnection,
  saveContent,
  signInSupabase,
  temporaryLogin,
  testConnection,
  uploadImage,
  type CmsConnection,
} from "./cms";
import { cloneContent, defaultContent, type SiteContent } from "./content";

type AuthMode = "loading" | "logged-out" | "temporary" | "supabase";

const sectionLabels: Record<keyof SiteContent, string> = {
  brand: "Header & links",
  hero: "Hero",
  results: "Results carousel",
  services: "Services",
  interactive: "Interactive section",
  caseStudies: "Case studies",
  process: "Process",
  proofWall: "More results",
  leadResults: "Lead results",
  pricing: "Pricing",
  faq: "FAQ",
  book: "Booking & footer",
};

const humanize = (value: string) => value.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_-]/g, " ").replace(/^./, (letter) => letter.toUpperCase());

const cloneUnknown = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const blankLike = (value: unknown): unknown => {
  if (typeof value === "string") return "";
  if (typeof value === "number") return 0;
  if (typeof value === "boolean") return false;
  if (Array.isArray(value)) return [];
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, blankLike(child)]));
  }
  return "";
};

function Login({ connection, onLogin }: { connection: CmsConnection | null; onLogin: (mode: AuthMode) => void }) {
  const [identity, setIdentity] = useState(connection ? "" : "admin");
  const [password, setPassword] = useState(connection ? "" : "admin123");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (connection) {
        await signInSupabase(connection, identity, password);
        onLogin("supabase");
      } else {
        await temporaryLogin(identity, password);
        onLogin("temporary");
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Sign-in failed.");
    } finally { setBusy(false); }
  };

  return (
    <main className="admin-login-shell">
      <a className="admin-back-link" href="/">← Back to website</a>
      <form className="admin-login-card" onSubmit={submit}>
        <span className="admin-kicker">INVICTI CMS</span>
        <h1>{connection ? "Supabase admin sign in" : "Admin access"}</h1>
        <p>{connection ? "Use the email and password you created in Supabase Auth." : "Temporary access is active until this site is connected to Supabase."}</p>
        <label>{connection ? "Email" : "Username"}<input type={connection ? "email" : "text"} value={identity} onChange={(event) => setIdentity(event.target.value)} autoComplete="username" required /></label>
        <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /></label>
        {error && <div className="admin-alert error">{error}</div>}
        <button className="admin-primary" type="submit" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
        {!connection && <small>Temporary credentials: admin / admin123</small>}
      </form>
    </main>
  );
}

function ImageEditor({ value, connection, onChange }: { value: string; connection: CmsConnection | null; onChange: (value: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const onFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !connection) return;
    setBusy(true);
    setError("");
    try {
      const image = await uploadImage(connection, file);
      onChange(image.url);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Upload failed."); }
    finally { setBusy(false); event.target.value = ""; }
  };

  const removeFromStorage = async () => {
    if (!connection || !value || !window.confirm("Delete this uploaded image from Supabase Storage? This cannot be undone.")) return;
    setBusy(true);
    setError("");
    try { await deleteUploadedImage(connection, value); onChange(""); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Delete failed."); }
    finally { setBusy(false); }
  };

  return (
    <div className="admin-image-field">
      {value ? <img src={value} alt="Current content preview" /> : <div className="admin-image-empty">No image selected</div>}
      <input type="url" value={value} onChange={(event) => onChange(event.target.value)} placeholder="https://… or /images/…" />
      <div className="admin-inline-actions">
        <label className={connection ? "admin-upload-button" : "admin-upload-button disabled"}>{busy ? "Uploading…" : "Upload image"}<input type="file" accept="image/*" onChange={onFile} disabled={!connection || busy} /></label>
        <button type="button" className="admin-quiet" onClick={() => onChange("")} disabled={!value || busy}>Clear field</button>
        {value.includes("/storage/v1/object/public/site-assets/") && <button type="button" className="admin-danger-text" onClick={removeFromStorage} disabled={busy}>Delete from storage</button>}
      </div>
      {!connection && <small>Connect Supabase to upload files. You can still paste a hosted image URL.</small>}
      {error && <small className="admin-error-text">{error}</small>}
    </div>
  );
}

function ValueEditor({ label, value, template, connection, onChange, depth = 0 }: { label: string; value: unknown; template: unknown; connection: CmsConnection | null; onChange: (value: unknown) => void; depth?: number }) {
  const fieldLabel = humanize(label);
  if (Array.isArray(value)) {
    const templateItems = Array.isArray(template) ? template : [];
    return (
      <div className={`admin-array depth-${Math.min(depth, 2)}`}>
        <div className="admin-array-heading"><div><strong>{fieldLabel}</strong><span>{value.length} item{value.length === 1 ? "" : "s"}</span></div><button type="button" className="admin-add" onClick={() => onChange([...value, blankLike(templateItems[0] ?? value[0] ?? "")])}>＋ Add item</button></div>
        {value.length === 0 && <p className="admin-empty-copy">No items yet. Add one to start.</p>}
        {value.map((item, index) => (
          <div className="admin-array-item" key={`${label}-${index}`}>
            <div className="admin-item-toolbar"><span>{fieldLabel} {index + 1}</span><div><button type="button" onClick={() => index > 0 && onChange([...value.slice(0, index - 1), item, value[index - 1], ...value.slice(index + 1)])} disabled={index === 0} aria-label="Move up">↑</button><button type="button" onClick={() => index < value.length - 1 && onChange([...value.slice(0, index), value[index + 1], item, ...value.slice(index + 2)])} disabled={index === value.length - 1} aria-label="Move down">↓</button><button type="button" onClick={() => onChange([...value.slice(0, index + 1), cloneUnknown(item), ...value.slice(index + 1)])}>Duplicate</button><button type="button" className="danger" onClick={() => onChange(value.filter((_, itemIndex) => itemIndex !== index))}>Delete</button></div></div>
            <ValueEditor label={typeof item === "object" ? "details" : "value"} value={item} template={templateItems[index] ?? templateItems[0] ?? item} connection={connection} depth={depth + 1} onChange={(next) => onChange(value.map((current, itemIndex) => itemIndex === index ? next : current))} />
          </div>
        ))}
      </div>
    );
  }
  if (value && typeof value === "object") {
    const objectValue = value as Record<string, unknown>;
    const objectTemplate = template && typeof template === "object" && !Array.isArray(template) ? template as Record<string, unknown> : {};
    return (
      <div className={depth ? "admin-object nested" : "admin-object"}>
        {label !== "details" && depth > 0 && <strong className="admin-object-label">{fieldLabel}</strong>}
        {Object.entries(objectValue).map(([key, child]) => <ValueEditor key={key} label={key} value={child} template={objectTemplate[key]} connection={connection} depth={depth + 1} onChange={(next) => onChange({ ...objectValue, [key]: next })} />)}
      </div>
    );
  }
  if (typeof value === "boolean") {
    return <label className="admin-toggle"><input type="checkbox" checked={value} onChange={(event) => onChange(event.target.checked)} /><span>{fieldLabel}</span></label>;
  }
  if (typeof value === "number") {
    return <label className="admin-field"><span>{fieldLabel}</span><input type="number" value={value} onChange={(event) => onChange(Number(event.target.value))} /></label>;
  }
  const stringValue = String(value ?? "");
  const isImage = /(^|\s)(image|preview image)/i.test(fieldLabel);
  if (isImage) return <label className="admin-field"><span>{fieldLabel}</span><ImageEditor value={stringValue} connection={connection} onChange={onChange} /></label>;
  const long = stringValue.length > 80 || /copy|intro|lede|description|note|answer|quote/i.test(label);
  return <label className="admin-field"><span>{fieldLabel}</span>{long ? <textarea rows={3} value={stringValue} onChange={(event) => onChange(event.target.value)} /> : <input type="text" value={stringValue} onChange={(event) => onChange(event.target.value)} />}</label>;
}

function ConnectionPanel({ connection, onConnected }: { connection: CmsConnection | null; onConnected: (connection: CmsConnection) => void }) {
  const [projectUrl, setProjectUrl] = useState(connection?.projectUrl || "");
  const [publishableKey, setPublishableKey] = useState(connection?.publishableKey || "");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => { setProjectUrl(connection?.projectUrl || ""); setPublishableKey(connection?.publishableKey || ""); }, [connection]);

  const connect = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const candidate = { projectUrl, publishableKey };
      await testConnection(candidate);
      const session = connection ? await getSupabaseSession(connection) : null;
      const saved = await saveConnection(candidate, session?.access_token);
      setMessage("Connection verified and saved. Sign in with your Supabase admin account next.");
      onConnected(saved);
    } catch (caught) { setMessage(caught instanceof Error ? caught.message : "Connection failed."); }
    finally { setBusy(false); }
  };

  const downloadSql = () => {
    const anchor = document.createElement("a");
    anchor.href = "/supabase-setup.sql";
    anchor.download = "invicti-supabase-setup.sql";
    anchor.click();
  };

  const copySql = async () => {
    const sql = await fetch("/supabase-setup.sql").then((response) => response.text());
    await navigator.clipboard.writeText(sql);
    setMessage("Full SQL copied to clipboard.");
  };

  return (
    <div className="admin-connection-panel">
      <div className="admin-panel-intro"><span className="admin-kicker">DATABASE & STORAGE</span><h2>Connect Supabase</h2><p>Run the provided SQL first, create your first Auth user, then add that user to <code>site_admins</code>. Only a publishable key belongs here—never paste a secret or service-role key.</p></div>
      <div className="admin-setup-steps"><span>1</span><p>Run the complete SQL in Supabase SQL Editor.</p><span>2</span><p>Create an email/password user in Authentication → Users.</p><span>3</span><p>Run the final commented admin insert after replacing the email.</p><span>4</span><p>Paste the Project URL and publishable key below.</p></div>
      <div className="admin-inline-actions"><button type="button" className="admin-quiet" onClick={copySql}>Copy full SQL</button><button type="button" className="admin-quiet" onClick={downloadSql}>Download SQL</button></div>
      <form className="admin-connection-form" onSubmit={connect}>
        <label>Project URL<input type="url" placeholder="https://your-project.supabase.co" value={projectUrl} onChange={(event) => setProjectUrl(event.target.value)} required /></label>
        <label>Publishable key<input type="password" placeholder="sb_publishable_…" value={publishableKey} onChange={(event) => setPublishableKey(event.target.value)} required /></label>
        <button className="admin-primary" type="submit" disabled={busy}>{busy ? "Testing connection…" : connection ? "Test & update connection" : "Test & connect"}</button>
      </form>
      {message && <div className={message.includes("saved") || message.includes("copied") ? "admin-alert success" : "admin-alert error"}>{message}</div>}
    </div>
  );
}

export function Admin() {
  const [authMode, setAuthMode] = useState<AuthMode>("loading");
  const [connection, setConnection] = useState<CmsConnection | null>(null);
  const [content, setContent] = useState<SiteContent>(() => cloneContent(defaultContent));
  const [activeSection, setActiveSection] = useState<keyof SiteContent>("brand");
  const [showConnection, setShowConnection] = useState(false);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    document.title = "INVICTI Admin";
    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const previousRobots = robots?.content;
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.appendChild(robots);
    }
    robots.content = "noindex, nofollow";
    void (async () => {
      const savedConnection = await loadConnection();
      setConnection(savedConnection);
      setContent(await loadContent(savedConnection));
      if (savedConnection) setAuthMode(await getSupabaseSession(savedConnection) ? "supabase" : "logged-out");
      else setAuthMode(hasTemporaryLogin() ? "temporary" : "logged-out");
    })();
    return () => {
      if (robots && previousRobots !== undefined) robots.content = previousRobots;
    };
  }, []);

  const activeValue = useMemo(() => content[activeSection], [activeSection, content]);

  if (authMode === "loading") return <main className="admin-loading">Loading INVICTI CMS…</main>;
  if (authMode === "logged-out") return <Login connection={connection} onLogin={setAuthMode} />;

  const publish = async () => {
    setSaving(true);
    setStatus("");
    try {
      const result = await saveContent(content, connection);
      setStatus(result.mode === "supabase" ? "Published to Supabase. The public site now uses this content." : "Saved on this device. Connect Supabase to publish it for everyone.");
    } catch (caught) { setStatus(caught instanceof Error ? caught.message : "Save failed."); }
    finally { setSaving(false); }
  };

  const signOut = async () => { await logout(connection); setAuthMode("logged-out"); };

  const handleConnected = (saved: CmsConnection) => {
    setConnection(saved);
    setShowConnection(false);
    setAuthMode("logged-out");
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div><a className="admin-brand" href="/"><strong>INVICTI</strong><span>Content manager</span></a><span className={connection ? "admin-mode connected" : "admin-mode"}>{connection ? "● Supabase connected" : "● Local draft mode"}</span></div>
        <nav aria-label="Content sections">
          {(Object.keys(sectionLabels) as Array<keyof SiteContent>).map((key) => <button type="button" className={!showConnection && activeSection === key ? "active" : ""} key={key} onClick={() => { setActiveSection(key); setShowConnection(false); }}>{sectionLabels[key]}</button>)}
          <button type="button" className={showConnection ? "active" : ""} onClick={() => setShowConnection(true)}>Supabase setup</button>
        </nav>
        <div className="admin-sidebar-actions"><a href="/" target="_blank" rel="noreferrer">Preview website ↗</a><button type="button" onClick={signOut}>Sign out</button></div>
      </aside>
      <main className="admin-main">
        <header className="admin-topbar"><div><span className="admin-kicker">{showConnection ? "SETTINGS" : "EDITING"}</span><h1>{showConnection ? "Supabase setup" : sectionLabels[activeSection]}</h1></div>{!showConnection && <button className="admin-primary" type="button" onClick={publish} disabled={saving}>{saving ? "Saving…" : connection ? "Publish changes" : "Save draft"}</button>}</header>
        {status && !showConnection && <div className={/Published|Saved/.test(status) ? "admin-alert success" : "admin-alert error"}>{status}<button type="button" onClick={() => setStatus("")}>×</button></div>}
        {showConnection ? <ConnectionPanel connection={connection} onConnected={handleConnected} /> : (
          <section className="admin-editor-card">
            <div className="admin-editor-note"><p>Every field below maps directly to the public page. Lists support add, duplicate, reorder, and delete.</p><button type="button" className="admin-danger-text" onClick={() => { if (window.confirm("Reset all local content fields to the original site defaults?")) { setContent(resetLocalContent()); setStatus("Defaults restored. Save or publish to apply them."); } }}>Reset all to defaults</button></div>
            <ValueEditor label={activeSection} value={activeValue} template={defaultContent[activeSection]} connection={connection} onChange={(next) => setContent((current) => ({ ...current, [activeSection]: next } as SiteContent))} />
          </section>
        )}
      </main>
    </div>
  );
}
