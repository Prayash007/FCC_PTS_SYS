import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyChe7zhdgRKk8dU27ShHs-u_0o4zq4jsjg",
  authDomain: "fcc-web-db254.firebaseapp.com",
  projectId: "fcc-web-db254",
  storageBucket: "fcc-web-db254.firebasestorage.app",
  messagingSenderId: "544424451812",
  appId: "1:544424451812:web:7d3afaa4aebb06f51496f1",
  measurementId: "G-TK52ZPKEPQ"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);