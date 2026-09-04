import { lazy, StrictMode, Suspense, useState } from "react";
import { createRoot } from "react-dom/client";

import { Scene } from "./Scene";
import { Preloader } from "./Preloader";
import "./app.css";

const Admin = lazy(() => import("./Admin").then((module) => ({ default: module.Admin })));

if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    void navigator.serviceWorker.register("/sw.js");
  });
}

const normalizedPath = window.location.pathname.replace(/\/+$/, "") || "/";
const isAdmin = normalizedPath === "/admin" || normalizedPath === "/admin.html";

function App() {
  const [preloaderDone, setPreloaderDone] = useState(false);
  if (isAdmin) {
    return (
      <Suspense fallback={<main className="admin-loading">Loading INVICTI CMS…</main>}>
        <Admin />
      </Suspense>
    );
  }
  return (
    <>
      {!preloaderDone && <Preloader onComplete={() => setPreloaderDone(true)} />}
      <Scene />
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
