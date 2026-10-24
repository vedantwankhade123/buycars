import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  setDoc,
  addDoc,
  updateDoc,
  onSnapshot,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { auth, firebaseApp } from "@/lib/firebase";
import type { Car, CarImage } from "@/types/car.types";
export function database() {
  if (!firebaseApp) throw new Error("Firebase is not configured.");
  return getFirestore(firebaseApp);
}
export interface Profile {
  name: string;
  city: string;
  intent: string;
  sellerOnboarded: boolean;
}
export async function saveProfile(profile: Profile) {
  if (!auth?.currentUser) throw new Error("Please sign in.");
  await setDoc(doc(database(), "users", auth.currentUser.uid), profile);
}
export async function getProfile(uid: string) {
  const data = await getDoc(doc(database(), "users", uid));
  return data.exists() ? (data.data() as Profile) : null;
}
export async function liveCars() {
  const snap = await getDocs(
    query(collection(database(), "cars"), where("status", "==", "active")),
  );
  return snap.docs.map((d) => ({ ...d.data(), id: d.id }) as Car);
}
export async function getCar(id: string) {
  const snap = await getDoc(doc(database(), "cars", id));
  return snap.exists() ? ({ ...snap.data(), id: snap.id } as Car) : null;
}
export async function myCars(uid: string) {
  const snap = await getDocs(query(collection(database(), "cars"), where("sellerId", "==", uid)));
  return snap.docs.map((d) => ({ ...d.data(), id: d.id }) as Car);
}
export async function publishCar(car: Omit<Car, "id">, id: string) {
  await setDoc(doc(database(), "cars", id), car);
}
export async function markSold(id: string) {
  await updateDoc(doc(database(), "cars", id), {
    status: "sold",
    updatedAt: new Date().toISOString(),
  });
}
export async function uploadImage(file: File, listingId: string, slot: number): Promise<CarImage> {
  if (!auth?.currentUser) throw new Error("Please sign in.");
  const token = await auth.currentUser.getIdToken();
  const signatureResponse = await fetch("/.netlify/functions/sign-upload", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ listingId, slot }),
  });
  if (!signatureResponse.headers.get("content-type")?.includes("application/json")) {
    throw new Error("Photo uploads are temporarily unavailable. Please try again later.");
  }
  const signed = await signatureResponse.json();
  if (!signatureResponse.ok) {
    if (
      import.meta.env.DEV &&
      signed.code === "UPLOAD_NOT_CONFIGURED" &&
      Array.isArray(signed.missing)
    ) {
      throw new Error(
        `Photo uploads need these server settings in .env: ${signed.missing.join(", ")}. Restart npm run dev after adding them.`,
      );
    }
    const diagnostic =
      import.meta.env.DEV && signed.stage
        ? ` (Step: ${signed.stage}; code: ${signed.reason || signed.code || "unknown"})`
        : "";
    throw new Error((signed.error || "Image service unavailable.") + diagnostic);
  }
  const body = new FormData();
  body.append("file", file);
  for (const [key, value] of Object.entries(signed.params)) body.append(key, String(value));
  body.append("api_key", signed.apiKey);
  body.append("signature", signed.signature);
  const response = await fetch(`https://api.cloudinary.com/v1_1/${signed.cloudName}/image/upload`, {
    method: "POST",
    body,
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error?.message || "Upload failed.");
  return { url: result.secure_url, publicId: result.public_id, alt: `Car photo ${slot + 1}` };
}
export interface Inquiry {
  id: string;
  carId: string;
  carTitle: string;
  buyerId: string;
  sellerId: string;
  participants: string[];
  createdAt: unknown;
}
export async function enquire(car: Car) {
  const uid = auth?.currentUser?.uid;
  if (!uid) throw new Error("Please sign in.");
  if (uid === car.sellerId) throw new Error("This is your listing.");
  const id = `${car.id}_${uid}`;
  const ref = doc(database(), "inquiries", id);
  if (!(await getDoc(ref)).exists())
    await setDoc(ref, {
      carId: car.id,
      carTitle: `${car.make} ${car.model}`,
      buyerId: uid,
      sellerId: car.sellerId,
      participants: [uid, car.sellerId],
      createdAt: serverTimestamp(),
    });
  return id;
}
export function watchInquiries(
  uid: string,
  next: (rows: Inquiry[]) => void,
  fail: (e: Error) => void,
) {
  return onSnapshot(
    query(collection(database(), "inquiries"), where("participants", "array-contains", uid)),
    (snap) => next(snap.docs.map((d) => ({ ...d.data(), id: d.id }) as Inquiry)),
    fail,
  );
}
export interface Message {
  id: string;
  senderId: string;
  text: string;
  createdAt: { toDate: () => Date } | null;
}
export function watchMessages(
  id: string,
  next: (rows: Message[]) => void,
  fail: (e: Error) => void,
) {
  return onSnapshot(
    query(
      collection(database(), "inquiries", id, "messages"),
      orderBy("createdAt", "desc"),
      limit(100),
    ),
    (snap) => next(snap.docs.map((d) => ({ ...d.data(), id: d.id }) as Message).reverse()),
    fail,
  );
}
export async function sendMessage(id: string, text: string) {
  if (!text.trim() || text.trim().length > 2000)
    throw new Error("Write a message of up to 2,000 characters.");
  await addDoc(collection(database(), "inquiries", id, "messages"), {
    senderId: auth!.currentUser!.uid,
    text: text.trim(),
    createdAt: serverTimestamp(),
  });
}
