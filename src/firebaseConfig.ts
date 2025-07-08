// src/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "regenflix.firebaseapp.com",
  projectId: "regenflix",
  storageBucket: "regenflix.firebasestorage.app",
  messagingSenderId: "931133911724",
  appId: "1:931133911724:web:f35bf7ae90d69260b82509",
  measurementId: "G-RXHN5GPT09"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, app, storage };