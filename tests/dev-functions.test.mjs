import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, unlink, rmdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createServer } from "vite";
import { localFunctions } from "../server/dev-functions.mjs";

test("Vite serves the real upload function without exposing server credentials", async () => {
  const keys = [
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "CLOUDINARY_UPLOAD_PRESET",
    "FIREBASE_SERVICE_ACCOUNT",
    "FIREBASE_SERVICE_ACCOUNT_FILE",
  ];
  const previous = keys.map((k) => process.env[k]);
  const root = await mkdtemp(join(tmpdir(), "buycars-functions-test-"));
  let server;
  try {
    keys.forEach((k) => delete process.env[k]);
    await writeFile(
      join(root, ".env"),
      "CLOUDINARY_API_KEY=test-key\nCLOUDINARY_API_SECRET=server-only-test-secret\nCLOUDINARY_UPLOAD_PRESET=buycars_signed\n",
    );
    server = await createServer({
      configFile: false,
      root,
      plugins: [localFunctions()],
      server: { port: 0 },
      logLevel: "silent",
    });
    await server.listen();
    const url = `http://localhost:${server.httpServer.address().port}/.netlify/functions/sign-upload`;
    const result = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slot: 0, listingId: "00000000-0000-0000-0000-000000000000" }),
    });
    assert.equal(result.status, 503);
    const data = await result.json();
    assert.equal(data.code, "UPLOAD_NOT_CONFIGURED");
    assert.deepEqual(data.missing, ["CLOUDINARY_CLOUD_NAME", "FIREBASE_SERVICE_ACCOUNT"]);
    assert.ok(!JSON.stringify(data).includes("server-only-test-secret"));
    assert.equal((await fetch(url)).status, 405);
    const oversized = await fetch(url, { method: "POST", body: "x".repeat(16385) });
    assert.equal(oversized.status, 413);
  } finally {
    await server?.close();
    keys.forEach((key, i) => {
      if (previous[i] === undefined) delete process.env[key];
      else process.env[key] = previous[i];
    });
    await unlink(join(root, ".env"));
    await rmdir(root);
  }
});
