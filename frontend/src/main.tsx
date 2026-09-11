import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./live.css";
import "./workspace.css";
import "./tailwind.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

if ("serviceWorker" in navigator) {
  if (import.meta.env.PROD) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    });
  } else {
    // A production worker can otherwise keep serving an old app shell on localhost.
    void navigator.serviceWorker.getRegistrations().then((registrations) =>
      Promise.all(registrations.map((registration) => registration.unregister())),
    );
  }
}
