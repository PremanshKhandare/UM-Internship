import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

import { auth, db } from './firebase.js';

const authForm = document.getElementById("authForm");
const registerBtn = document.getElementById("registerBtn");

// Login (on form submit)
authForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = authForm.email.value;
  const password = authForm.password.value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Fetch role from Firestore
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const userRole = docSnap.data().role;
      if (userRole === "admin") {
        window.location.href = "admin.html";
      } else {
        window.location.href = "index.html";
      }
    } else {
      alert("No role assigned. Contact support.");
    }
  } catch (error) {
    alert("Login Failed: " + error.message);
  }
});

// Register (independent of form submit)
registerBtn.addEventListener("click", async () => {
  const email = authForm.email.value;
  const password = authForm.password.value;
  const role = authForm.role.value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save role in Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: email,
      role: role
    });

    alert("Registered successfully! Now please log in.");
  } catch (error) {
    alert("Registration Failed: " + error.message);
  }
});
