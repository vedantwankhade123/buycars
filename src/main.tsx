import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "@/app/App";
import "@/styles/globals.css";

const container = document.getElementById("root");
if (!container) throw new Error("Root container #root is missing from index.html");

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Optional production-only analytics; loaded after render and never blocks first paint.
void import("@/lib/firebase").then(({ initAnalytics }) => initAnalytics()).catch(() => {});
