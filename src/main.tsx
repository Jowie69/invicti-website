import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";

import { Scene } from "./Scene";
import "./app.css";

const Admin = lazy(() => import("./Admin").then((module) => ({ default: module.Admin })));

if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    void navigator.serviceWorker.register("/sw.js");
  });
}

const normalizedPath = window.location.pathname.replace(/\/+$/, "") || "/";
const isAdmin = normalizedPath === "/admin" || normalizedPath === "/admin.html";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {isAdmin ? <Suspense fallback={<main className="admin-loading">Loading INVICTI CMS…</main>}><Admin /></Suspense> : <Scene />}
  </StrictMode>,
);
