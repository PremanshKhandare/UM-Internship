import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";
import { db } from './firebase.js';

async function loadMenuItems() {
  const menuContainer = document.getElementById("menu-container");
  menuContainer.innerHTML = "<p>Loading menu...</p>";

  try {
    const querySnapshot = await getDocs(collection(db, "products"));

    if (querySnapshot.empty) {
      menuContainer.innerHTML = "<p>No menu items available yet.</p>";
      return;
    }

    menuContainer.innerHTML = ""; // Clear loading text

    querySnapshot.forEach((doc) => {
      const item = doc.data();

      const itemDiv = document.createElement("div");
      itemDiv.className = "menu-item";

      // Image
      const image = document.createElement("img");
      image.src = item.image || "assets/default.jpg"; // Provide fallback
      image.alt = item.name;
      image.style.width = "100%";
      image.style.height = "180px";
      image.style.objectFit = "cover";
      image.style.borderRadius = "8px";
      image.style.marginBottom = "0.8rem";

      // Title
      const title = document.createElement("h3");
      title.textContent = item.name;

      // Price
      const price = document.createElement("p");
      price.innerHTML = `<strong>₹${item.price}</strong>`;

      // Add to Cart Button
      const button = document.createElement("button");
      button.textContent = "Add to Cart";
      button.onclick = () => addToCart(doc.id, item.name, item.price, item.image);

      // Append all elements to the item card
      itemDiv.appendChild(image);
      itemDiv.appendChild(title);
      itemDiv.appendChild(price);
      itemDiv.appendChild(button);

      // Append card to the menu container
      menuContainer.appendChild(itemDiv);
    });

  } catch (error) {
    console.error("Error fetching products:", error);
    menuContainer.innerHTML = "<p>Error loading menu items.</p>";
  }
}

// Load menu items on DOM ready
window.addEventListener("DOMContentLoaded", loadMenuItems);

// Add to Cart function
window.addToCart = function (id, name, price, image) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push({ id, name, price, image }); // ✅ include image
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${name} added to cart!`);
};

