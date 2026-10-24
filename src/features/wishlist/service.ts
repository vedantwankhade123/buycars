import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { database, getCar } from "@/features/marketplace/service";
export function watchWishlist(
  uid: string,
  next: (ids: string[]) => void,
  fail: (error: Error) => void,
) {
  return onSnapshot(
    query(collection(database(), "users", uid, "wishlist"), orderBy("createdAt", "desc")),
    (snapshot) => next(snapshot.docs.map((row) => row.id)),
    fail,
  );
}
export async function saveCar(uid: string, carId: string) {
  await setDoc(doc(database(), "users", uid, "wishlist", carId), {
    carId,
    createdAt: serverTimestamp(),
  });
}
export async function removeCar(uid: string, carId: string) {
  await deleteDoc(doc(database(), "users", uid, "wishlist", carId));
}
export async function readSavedCar(id: string) {
  try {
    const car = await getCar(id);
    return car?.status === "active" ? car : null;
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      ["permission-denied", "not-found"].includes(String(error.code))
    )
      return null;
    throw error;
  }
}
