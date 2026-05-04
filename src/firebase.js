import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDqS9O-ORFM_OIDaDEFjp3HB9hcDGTBZVQ",
  authDomain: "imabari-frontend-9d568.firebaseapp.com",
  projectId: "imabari-frontend-9d568",
  storageBucket: "imabari-frontend-9d568.firebasestorage.app",
  messagingSenderId: "295505989939",
  appId: "1:295505989939:web:9435af92f163d5967bee46",
  measurementId: "G-XW2R8EYVF4"
};

const app = initializeApp(firebaseConfig);

// 🔐 ログイン
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// 🌐 データベース（レビュー用）
export const db = getFirestore(app);