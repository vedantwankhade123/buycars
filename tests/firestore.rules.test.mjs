import { readFileSync } from "node:fs";
import {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
} from "@firebase/rules-unit-testing";
import {
  doc,
  deleteDoc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
const env = await initializeTestEnvironment({
  projectId: "demo-buycars",
  firestore: { rules: readFileSync("firebase/firestore.rules", "utf8") },
});
const seller = env.authenticatedContext("seller").firestore(),
  buyer = env.authenticatedContext("buyer").firestore(),
  other = env.authenticatedContext("other").firestore(),
  guest = env.unauthenticatedContext().firestore();
try {
  await assertSucceeds(
    setDoc(doc(seller, "users/seller"), {
      name: "Seller",
      city: "Pune",
      intent: "both",
      sellerOnboarded: true,
    }),
  );
  await assertFails(
    setDoc(doc(other, "users/seller"), {
      name: "Other",
      city: "Pune",
      intent: "both",
      sellerOnboarded: true,
    }),
  );
  await assertFails(
    setDoc(doc(seller, "users/seller"), {
      name: "Seller",
      city: "Pune",
      intent: "both",
      sellerOnboarded: true,
      admin: true,
    }),
  );
  const images = [0, 1, 2, 3].map((i) => ({
    url: `https://res.cloudinary.com/test/image/upload/v1/buycars/seller/car/${i}.jpg`,
    publicId: `buycars/seller/car/${i}`,
    alt: "Car photo",
  }));
  const car = {
    sellerId: "seller",
    make: "Tata",
    model: "Nexon",
    variant: "XZ",
    year: 2024,
    price: 900000,
    mileageKm: 10000,
    fuelType: "Petrol",
    transmission: "Manual",
    bodyType: "SUV",
    ownershipCount: 1,
    registrationState: "MH",
    color: "White",
    city: "Pune",
    state: "Maharashtra",
    description: "A well maintained car with a full service history.",
    features: [],
    images,
    coverImage: images[0].url,
    status: "active",
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await assertSucceeds(setDoc(doc(seller, "cars/car"), car));
  await assertSucceeds(getDocs(query(collection(guest, "cars"), where("status", "==", "active"))));
  await assertFails(setDoc(doc(other, "cars/forged"), car));
  await assertFails(setDoc(doc(seller, "cars/featured"), { ...car, featured: true }));
  await assertFails(setDoc(doc(seller, "cars/invalid"), { ...car, images: images.slice(0, 3) }));
  await assertFails(updateDoc(doc(seller, "cars/car"), { featured: true }));
  const inquiry = {
    carId: "car",
    carTitle: "Tata Nexon",
    buyerId: "buyer",
    sellerId: "seller",
    participants: ["buyer", "seller"],
    createdAt: serverTimestamp(),
  };
  await assertSucceeds(getDoc(doc(buyer, "inquiries/car_buyer")));
  await assertSucceeds(setDoc(doc(buyer, "inquiries/car_buyer"), inquiry));
  await assertSucceeds(
    getDocs(
      query(collection(seller, "inquiries"), where("participants", "array-contains", "seller")),
    ),
  );
  await assertFails(getDoc(doc(other, "inquiries/car_buyer")));
  await assertFails(
    setDoc(doc(other, "inquiries/car_other"), {
      ...inquiry,
      buyerId: "other",
      participants: ["other", "buyer"],
      sellerId: "buyer",
    }),
  );
  await assertSucceeds(
    setDoc(doc(buyer, "inquiries/car_buyer/messages/one"), {
      senderId: "buyer",
      text: "Would you accept ₹8.5 lakh?",
      createdAt: serverTimestamp(),
    }),
  );
  await assertSucceeds(getDocs(collection(seller, "inquiries/car_buyer/messages")));
  await assertFails(getDocs(collection(other, "inquiries/car_buyer/messages")));
  await assertFails(
    setDoc(doc(seller, "inquiries/car_buyer/messages/spoof"), {
      senderId: "buyer",
      text: "Spoof",
      createdAt: serverTimestamp(),
    }),
  );
  await assertFails(
    setDoc(doc(other, "inquiries/car_other"), {
      carId: "car",
      carTitle: "Incorrect car",
      buyerId: "other",
      sellerId: "seller",
      participants: ["other", "seller"],
      createdAt: serverTimestamp(),
    }),
  );
  const saved = { carId: "car", createdAt: serverTimestamp() };
  await assertSucceeds(setDoc(doc(buyer, "users/buyer/wishlist/car"), saved));
  await assertSucceeds(getDocs(collection(buyer, "users/buyer/wishlist")));
  await assertFails(getDocs(collection(other, "users/buyer/wishlist")));
  await assertFails(setDoc(doc(other, "users/buyer/wishlist/car"), saved));
  await assertFails(setDoc(doc(guest, "users/buyer/wishlist/car"), saved));
  await assertFails(setDoc(doc(buyer, "users/buyer/wishlist/car"), { ...saved, admin: true }));
  await assertFails(
    setDoc(doc(buyer, "users/buyer/wishlist/missing"), { ...saved, carId: "missing" }),
  );
  await assertFails(setDoc(doc(buyer, "users/buyer/wishlist/car"), { ...saved, carId: "forged" }));
  await assertSucceeds(
    updateDoc(doc(seller, "cars/car"), { status: "sold", updatedAt: new Date().toISOString() }),
  );
  await assertFails(getDoc(doc(guest, "cars/car")));
  await assertSucceeds(getDoc(doc(seller, "cars/car")));
  await assertFails(getDoc(doc(guest, "users/seller")));
  await assertFails(getDoc(doc(other, "users/seller")));
  await assertFails(setDoc(doc(seller, "uploadQuotas/seller"), { hour: 1, count: 0 }));
  await assertFails(getDoc(doc(seller, "uploadQuotas/seller")));
  await assertFails(setDoc(doc(other, "unrecognized/path"), { public: true }));
  await assertFails(setDoc(doc(other, "users/other/wishlist/car"), saved));
  await assertFails(deleteDoc(doc(other, "users/buyer/wishlist/car")));
  await assertSucceeds(deleteDoc(doc(buyer, "users/buyer/wishlist/car")));
  console.log("Passed 38 Firestore access and validation checks.");
} finally {
  await env.cleanup();
}
