import { test } from "node:test";
import assert from "node:assert/strict";
import handler, { createUploadHandler } from "../netlify/functions/sign-upload.mjs";
test("rejects methods other than POST", async () => {
  const r = await handler(new Request("http://localhost/sign-upload"));
  assert.equal(r.status, 405);
});
test("unconfigured uploads return an actionable error without secrets", async () => {
  const keys = [
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "CLOUDINARY_UPLOAD_PRESET",
    "FIREBASE_SERVICE_ACCOUNT",
  ];
  const original = keys.map((k) => process.env[k]);
  try {
    keys.forEach((k) => delete process.env[k]);
    const r = await handler(new Request("http://localhost/sign-upload", { method: "POST" }));
    assert.equal(r.status, 503);
    assert.match((await r.json()).error, /not configured/);
  } finally {
    keys.forEach((k, i) => {
      if (original[i] === undefined) delete process.env[k];
      else process.env[k] = original[i];
    });
  }
});

test("Admin snapshot exists is a boolean: unpublished listings receive signatures", async () => {
  const keys = [
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "CLOUDINARY_UPLOAD_PRESET",
    "FIREBASE_SERVICE_ACCOUNT",
  ];
  const previous = keys.map((key) => process.env[key]);
  let published = false;
  const database = () => ({
    doc(path) {
      return {
        path,
        async get() {
          if (path.startsWith("users/")) return { data: () => ({ sellerOnboarded: true }) };
          return { exists: published };
        },
      };
    },
    async runTransaction(run) {
      return run({ get: async () => ({ data: () => undefined }), set() {} });
    },
  });
  const run = createUploadHandler({ authenticate: async () => ({ uid: "seller" }), database });
  try {
    keys.forEach((key) => (process.env[key] = "test-only"));
    const request = () =>
      new Request("http://localhost/sign-upload", {
        method: "POST",
        headers: { Authorization: "Bearer test-token", "Content-Type": "application/json" },
        body: JSON.stringify({ listingId: "00000000-0000-0000-0000-000000000000", slot: 0 }),
      });
    const response = await run(request());
    assert.equal(response.status, 200);
    const signed = await response.json();
    assert.ok(signed.signature);
    assert.equal(signed.params.public_id, "buycars/seller/00000000-0000-0000-0000-000000000000/0");
    published = true;
    assert.equal((await run(request())).status, 409);
  } finally {
    keys.forEach((key, i) => {
      if (previous[i] === undefined) delete process.env[key];
      else process.env[key] = previous[i];
    });
  }
});
