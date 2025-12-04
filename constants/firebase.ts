import { getApps, getApp, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database"; // Import getDatabase

// ---- KONFIGURASI FIREBASE ----
const firebaseConfig = {
  apiKey: "AIzaSyDtTMFDqCWZbwdNMckY7Mp53uQ2Qn8pY-U",
  authDomain: "reactnative-pgpbl25.firebaseapp.com",
  projectId: "reactnative-pgpbl25",
  storageBucket: "reactnative-pgpbl25.appspot.com",
  messagingSenderId: "819071108875",
  appId: "1:819071108875:web:17285f5b3449d0b2e2040e",
};

// ---- INISIALISASI FIREBASE SEKALI SAJA ----
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// ---- EXPORT AUTH, FIRESTORE, AND REALTIME DATABASE ----
export const auth = getAuth(app);
export const db = getFirestore(app);
export const database = getDatabase(app); // Export Realtime Database
