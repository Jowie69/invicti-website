import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { Scene } from "./Scene";
import "./app.css";

if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    void navigator.serviceWorker.register("/sw.js");
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Scene />
  </StrictMode>,
);
