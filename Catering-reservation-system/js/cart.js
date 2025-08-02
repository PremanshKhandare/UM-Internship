import { addDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";
import { auth, db } from './firebase.js';

const cartContainer = document.getElementById("cart-container");
const totalBox = document.getElementById("total-price");
const placeOrderBtn = document.getElementById("place-order-btn");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function renderCart() {
  cartContainer.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    totalBox.innerText = "";
    placeOrderBtn.style.display = "none";
    return;
  }

  cart.forEach((item, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";

    // Item Image
    const img = document.createElement("img");
    img.src = item.image || "assets/default.jpg";
    img.alt = item.name;
    img.style.width = "70px";
    img.style.height = "70px";
    img.style.objectFit = "cover";
    img.style.borderRadius = "8px";

    // Item Details
    const detailsDiv = document.createElement("div");
    detailsDiv.className = "item-details";

    const name = document.createElement("h3");
    name.textContent = item.name;

    const price = document.createElement("p");
    price.textContent = `Price: ₹${item.price}`;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.onclick = () => removeItem(index);
    removeBtn.style.marginTop = "0.5rem";

    detailsDiv.appendChild(name);
    detailsDiv.appendChild(price);
    detailsDiv.appendChild(removeBtn);

    itemDiv.appendChild(img);
    itemDiv.appendChild(detailsDiv);
    cartContainer.appendChild(itemDiv);

    total += item.price;
  });

  totalBox.innerHTML = `<h3>Total: ₹${total}</h3>`;
  placeOrderBtn.style.display = "block";
}

window.removeItem = function(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
};

placeOrderBtn.addEventListener("click", async () => {
  const user = auth.currentUser;

  if (!user) {
    alert("Please login to place an order.");
    window.location.href = "login.html";
    return;
  }

  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  try {
    await addDoc(collection(db, "orders"), {
      uid: user.uid,
      items: cart,
      total,
      status: "placed",
      placedAt: serverTimestamp()
    });

    alert("🎉 Order placed successfully!");
    localStorage.removeItem("cart");
    cart = [];
    renderCart();
  } catch (err) {
    alert("❌ Error placing order. Try again.");
    console.error(err);
  }
});

renderCart();
