// firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDS3G3KI06cwQSrRa4mRgfmoaIZDXwvazE",
  authDomain: "tutor-link-000c.firebaseapp.com",
  databaseURL: "https://tutor-link-000c-default-rtdb.firebaseio.com",
  projectId: "tutor-link-000c",
  storageBucket: "tutor-link-000c.firebasestorage.app",
  messagingSenderId: "588602475858",
  appId: "1:588602475858:web:b692c22a8b8704e67f668b",
  measurementId: "G-8VRVCRS1LL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const rtdb = getDatabase(app); // Initialize Realtime Database

export { auth, db, rtdb };

