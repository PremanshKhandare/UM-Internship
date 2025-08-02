import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";
import { auth, db } from './firebase.js';

// Admin Auth Check
auth.onAuthStateChanged(async (user) => {
  if (!user) {
    alert("Login required.");
    return (window.location.href = "login.html");
  }

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists() || userSnap.data().role !== "admin") {
    alert("Access denied: Admins only.");
    return (window.location.href = "login.html");
  }

  // Load Admin Data if verified
  loadReservations();
  loadOrders();
  loadProducts();
});

// Load Reservations
async function loadReservations() {
  const resContainer = document.getElementById("admin-reservations");
  try {
    const querySnapshot = await getDocs(collection(db, "reservations"));
    resContainer.innerHTML = "";

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      resContainer.innerHTML += `
        <div class="admin-card">
          <h3>${data.date} at ${data.time}</h3>
          <p>Guests: ${data.guests}</p>
          <p>Status: ${data.status}</p>
          <p>UserID: ${data.uid}</p>
        </div>
      `;
    });
  } catch (error) {
    console.error("Error loading reservations:", error);
    resContainer.innerHTML = "<p>Error loading reservations.</p>";
  }
}

// Load Orders
async function loadOrders() {
  const orderContainer = document.getElementById("admin-orders");
  try {
    const snapshot = await getDocs(collection(db, "orders"));
    orderContainer.innerHTML = "";

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const itemList = data.items.map(item => `<li>${item.name} (₹${item.price})</li>`).join("");

      orderContainer.innerHTML += `
        <div class="admin-card">
          <p><strong>UserID:</strong> ${data.uid}</p>
          <p><strong>Status:</strong> ${data.status}</p>
          <ul>${itemList}</ul>
          <p><strong>Total:</strong> ₹${data.total}</p>
          <button onclick="deleteOrder('${docSnap.id}')">Delete</button>
        </div>
      `;
    });
  } catch (error) {
    console.error("Error loading orders:", error);
    orderContainer.innerHTML = "<p>Error loading orders.</p>";
  }
}

// Delete Order
window.deleteOrder = async function (id) {
  try {
    await deleteDoc(doc(db, "orders", id));
    alert("Order deleted.");
    loadOrders(); // Reload
  } catch (err) {
    console.error("Failed to delete order:", err);
    alert("Failed to delete order.");
  }
}

// Load Products
async function loadProducts() {
  const productContainer = document.getElementById("admin-products");
  try {
    const snapshot = await getDocs(collection(db, "products"));
    productContainer.innerHTML = "";

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      productContainer.innerHTML += `
        <div class="admin-card">
          <h3>${data.name}</h3>
          <p>₹${data.price}</p>
        </div>
      `;
    });
  } catch (error) {
    console.error("Error loading products:", error);
    productContainer.innerHTML = "<p>Error loading products.</p>";
  }
}
