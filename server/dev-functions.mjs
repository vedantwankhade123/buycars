import { loadEnv } from "vite";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import handler from "../netlify/functions/sign-upload.mjs";

// This plugin runs in Vite's Node process, never in the browser bundle.
export function localFunctions() {
  return {
    name: "buycars-local-functions",
    apply: "serve",
    configureServer(server) {
      const env = loadEnv(server.config.mode, server.config.envDir, "");
      const keys = [
        "CLOUDINARY_CLOUD_NAME",
        "CLOUDINARY_API_KEY",
        "CLOUDINARY_API_SECRET",
        "CLOUDINARY_UPLOAD_PRESET",
        "FIREBASE_SERVICE_ACCOUNT",
      ];
      for (const key of keys) if (env[key]) process.env[key] = env[key];
      const accountFile =
        env.FIREBASE_SERVICE_ACCOUNT_FILE || process.env.FIREBASE_SERVICE_ACCOUNT_FILE;
      if (!process.env.FIREBASE_SERVICE_ACCOUNT && accountFile) {
        // A local JSON file avoids copying private-key contents into an environment editor.
        process.env.FIREBASE_SERVICE_ACCOUNT = readFileSync(
          resolve(server.config.root, accountFile),
          "utf8",
        );
      }
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.split("?")[0] !== "/.netlify/functions/sign-upload") return next();
        try {
          let size = 0;
          const chunks = [];
          for await (const chunk of req) {
            size += chunk.length;
            if (size > 16384) {
              res.writeHead(413, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "Upload request is too large." }));
              return;
            }
            chunks.push(chunk);
          }
          const headers = new Headers();
          for (const [name, value] of Object.entries(req.headers)) {
            if (value !== undefined)
              headers.set(name, Array.isArray(value) ? value.join(", ") : value);
          }
          const method = req.method || "GET";
          const body = Buffer.concat(chunks);
          const request = new Request("http://localhost/.netlify/functions/sign-upload", {
            method,
            headers,
            ...(method !== "GET" && method !== "HEAD" ? { body } : {}),
          });
          const result = await handler(request);
          res.statusCode = result.status;
          result.headers.forEach((value, name) => res.setHeader(name, value));
          res.setHeader("Cache-Control", "no-store");
          res.end(Buffer.from(await result.arrayBuffer()));
        } catch {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              error: "The image upload service could not start. Check server configuration.",
            }),
          );
        }
      });
    },
  };
}
