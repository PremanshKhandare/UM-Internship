import {
    addDoc,
    collection,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";
import { auth, db } from './firebase.js';

document.getElementById("reserve-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const guests = document.getElementById("guests").value;
  const notes = document.getElementById("notes").value;

  const user = auth.currentUser;

  if (!user) {
    alert("Please login to make a reservation.");
    return;
  }

  try {
    await addDoc(collection(db, "reservations"), {
      uid: user.uid,
      date,
      time,
      guests: parseInt(guests),
      notes,
      status: "pending",
      createdAt: serverTimestamp()
    });

    alert("🎉 Reservation successfully placed!");
    document.getElementById("reserve-form").reset();
  } catch (error) {
    console.error("Error placing reservation: ", error);
    alert("Something went wrong. Try again later.");
  }
});
