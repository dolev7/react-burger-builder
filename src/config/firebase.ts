// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA6dowgDk_O5vkf_1gskDnqsVa_UDRC-tM",
  authDomain: "burger-react-course-ad413.firebaseapp.com",
  databaseURL: "https://burger-react-course-ad413-default-rtdb.firebaseio.com",
  projectId: "burger-react-course-ad413",
  storageBucket: "burger-react-course-ad413.firebasestorage.app",
  messagingSenderId: "710652569728",
  appId: "1:710652569728:web:dc9e2a52783a8014cb9e65",
  measurementId: "G-BCV6NLS4T4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Firebase Realtime Database URL for axios
export const FIREBASE_DB_URL = 'https://burger-react-course-ad413-default-rtdb.firebaseio.com';

export { app, analytics, auth, db };
