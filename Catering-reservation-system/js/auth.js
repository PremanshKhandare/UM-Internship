import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import { auth } from './firebase.js';

// DOM elements
const logoutBtn = document.getElementById("logout-btn");
const loginBtn = document.getElementById("login-btn");

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is logged in
    if (logoutBtn) logoutBtn.style.display = "inline-block";
    if (loginBtn) loginBtn.style.display = "none";
  } else {
    // Not logged in
    if (logoutBtn) logoutBtn.style.display = "none";
    if (loginBtn) loginBtn.style.display = "inline-block";
  }
});

if (logoutBtn) {
  logoutBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      await signOut(auth);
      alert("👋 Logged out successfully.");
      window.location.href = "index.html";
    } catch (error) {
      console.error("Logout failed:", error);
      alert("❌ Logout failed. Try again.");
    }
  });
}
