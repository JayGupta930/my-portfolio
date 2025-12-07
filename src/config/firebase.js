import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your Firebase configuration
// Replace these values with your actual Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyB01GqrqbC3jetIyvrDuQsdgBYjunqf1Ns",
  authDomain: "jaygupta.firebaseapp.com",
  projectId: "jaygupta",
  storageBucket: "jaygupta.firebasestorage.app",
  messagingSenderId: "143411184364",
  appId: "1:143411184364:web:4c2b580dc09b609e1e9bc9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

export default app;
