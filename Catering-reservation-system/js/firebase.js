// Your Firebase Web App Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

// Replace with your own Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBllwCRbPIV9d1W21SfXx5SisBCtnvMJy4",
  authDomain: "catering-system-247e8.firebaseapp.com",
  projectId: "catering-system-247e8",
  storageBucket: "catering-system-247e8.firebasestorage.app",
  messagingSenderId: "802572349351",
  appId: "1:802572349351:web:4fbf696310e3ff76d05082"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { auth, db };

