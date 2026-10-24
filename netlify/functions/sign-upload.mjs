import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { v2 as cloudinary } from "cloudinary";
async function verifyUser(token, serviceAccount) {
  if (!getApps().length) initializeApp({ credential: cert(JSON.parse(serviceAccount)) });
  return getAuth().verifyIdToken(token, true);
}

// Dependencies are injectable for isolated tests; production always verifies Firebase tokens.
export function createUploadHandler({ authenticate = verifyUser, database = getFirestore } = {}) {
  return async function handler(request) {
    const json = (body, status = 200) => Response.json(body, { status });
    if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
    const {
      CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET,
      CLOUDINARY_UPLOAD_PRESET,
      FIREBASE_SERVICE_ACCOUNT,
    } = process.env;
    const settings = {
      CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET,
      CLOUDINARY_UPLOAD_PRESET,
      FIREBASE_SERVICE_ACCOUNT,
    };
    const missing = Object.keys(settings).filter((key) => !settings[key]);
    if (missing.length)
      return json(
        {
          error: "Image uploads are not configured yet. Please contact the site owner.",
          code: "UPLOAD_NOT_CONFIGURED",
          missing,
        },
        503,
      );
    let decoded;
    try {
      const token = request.headers.get("authorization")?.match(/^Bearer (.+)$/)?.[1];
      if (!token) return json({ error: "Please sign in." }, 401);
      decoded = await authenticate(token, FIREBASE_SERVICE_ACCOUNT);
    } catch {
      return json({ error: "Please sign in again." }, 401);
    }
    let stage = "request";
    try {
      const { listingId, slot } = await request.json();
      if (!/^[a-f0-9-]{36}$/.test(listingId) || !Number.isInteger(slot) || slot < 0 || slot > 3)
        return json({ error: "Invalid photo slot." }, 400);
      stage = "seller-profile";
      const db = database();
      const profile = await db.doc(`users/${decoded.uid}`).get();
      if (!profile.data()?.sellerOnboarded)
        return json({ error: "Complete seller onboarding first." }, 403);
      // A transactional quota persists across cold starts and bounds signature requests per account.
      stage = "upload-quota";
      const counter = db.doc(`uploadQuotas/${decoded.uid}`);
      await db.runTransaction(async (tx) => {
        const snap = await tx.get(counter);
        const current = snap.data();
        const hour = Math.floor(Date.now() / 3600000);
        const count = current?.hour === hour ? current.count : 0;
        if (count >= 24) throw new Error("quota");
        tx.set(counter, { hour, count: count + 1 });
      });
      stage = "listing-check";
      if ((await db.doc(`cars/${listingId}`).get()).exists)
        return json({ error: "This listing is already published." }, 409);
      stage = "signature";
      const params = {
        timestamp: Math.floor(Date.now() / 1000),
        upload_preset: CLOUDINARY_UPLOAD_PRESET,
        public_id: `buycars/${decoded.uid}/${listingId}/${slot}`,
        overwrite: false,
      };
      return json({
        params,
        signature: cloudinary.utils.api_sign_request(params, CLOUDINARY_API_SECRET),
        cloudName: CLOUDINARY_CLOUD_NAME,
        apiKey: CLOUDINARY_API_KEY,
      });
    } catch (e) {
      console.error("sign-upload failed", { stage, code: e.code || e.name });
      return json(
        {
          code: e.message === "quota" ? "UPLOAD_QUOTA_EXCEEDED" : "UPLOAD_PREPARATION_FAILED",
          stage,
          reason: typeof e.code === "string" || typeof e.code === "number" ? e.code : e.name,
          error:
            e.message === "quota"
              ? "Upload limit reached. Try again in an hour."
              : "Could not prepare upload. Try again.",
        },
        e.message === "quota" ? 429 : 500,
      );
    }
  };
}

export default createUploadHandler();
