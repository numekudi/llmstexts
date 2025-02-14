import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
const config = JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG);

export const app = initializeApp({
  storageBucket: config.storageBucket,
});

export const serverAuth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);
