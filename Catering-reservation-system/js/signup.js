import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import { auth } from './firebase.js';

document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // ✅ Store UID in localStorage
    localStorage.setItem("uid", user.uid);

    alert("🎉 Account created!");
    window.location.href = "index.html";
  } catch (err) {
    alert("❌ Signup failed: " + err.message);
  }
});
