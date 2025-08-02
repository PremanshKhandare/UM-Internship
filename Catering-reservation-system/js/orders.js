import {
    collection,
    getDocs,
    orderBy,
    query,
    where
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";
import { auth, db } from './firebase.js';

document.addEventListener("DOMContentLoaded", async () => {
  const user = auth.currentUser;

  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      alert("Please login to view your reservations.");
      window.location.href = "login.html";
      return;
    }

    const ordersContainer = document.getElementById("orders-container");
    ordersContainer.innerHTML = "<p>Loading...</p>";

    const q = query(
      collection(db, "reservations"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      ordersContainer.innerHTML = "<p>No reservations found.</p>";
      return;
    }

    ordersContainer.innerHTML = "";
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const date = data.date;
      const time = data.time;
      const guests = data.guests;
      const notes = data.notes;
      const status = data.status;

      ordersContainer.innerHTML += `
        <div class="order-card">
          <h3>📅 ${date} at ${time}</h3>
          <p><strong>Guests:</strong> ${guests}</p>
          <p><strong>Notes:</strong> ${notes || "None"}</p>
          <p><strong>Status:</strong> ${status}</p>
        </div>
      `;
    });
  });
});
