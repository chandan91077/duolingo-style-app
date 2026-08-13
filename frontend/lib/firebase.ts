import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBsfzl2DHfWQid2PeEyj-cejI_i061w1wI",
  authDomain: "duolingo-a3e29.firebaseapp.com",
  projectId: "duolingo-a3e29",
  storageBucket: "duolingo-a3e29.firebasestorage.app",
  messagingSenderId: "691063033756",
  appId: "1:691063033756:web:1cf89f60fc90a8f5aec259",
  measurementId: "G-3589ZDJ7HB",
};

// Prevent duplicate initialization in Next.js hot-reload
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
