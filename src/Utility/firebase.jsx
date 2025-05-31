// firebase.js (or firebaseConfig.js)
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APIKEY,
  authDomain: "clone-69546.firebaseapp.com",
  projectId: "clone-69546",
  storageBucket: "clone-69546.appspot.com", // Fixed storage bucket URL
  messagingSenderId: "70411282250",
  appId: "1:70411282250:web:7691c6562c84b0784703b3",
  measurementId: "G-STB5S70CD5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
export default app;
