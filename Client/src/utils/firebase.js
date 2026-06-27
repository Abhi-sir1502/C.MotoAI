import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "motoai-9b032.firebaseapp.com",
  projectId: "motoai-9b032",
  storageBucket: "motoai-9b032.firebasestorage.app",
  messagingSenderId: "342528877154",
  appId: "1:342528877154:web:956ee145fbf614edf6273b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const provider = new GoogleAuthProvider()

provider.setCustomParameters({
  prompt: "select_account"
})

export {auth , provider}