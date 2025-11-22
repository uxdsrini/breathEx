import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC0gJSuMCMGObskbuVtDuUb8jKBd6TTKKM",
  authDomain: "breathapp-22d14.firebaseapp.com",
  projectId: "breathapp-22d14",
  storageBucket: "breathapp-22d14.firebasestorage.app",
  messagingSenderId: "774243606714",
  appId: "1:774243606714:web:9d9f221c2e936d787d6283"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);