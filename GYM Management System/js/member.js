/* ---------------- Firebase refs ------------------ */
const billsRef         = db.collection("bills");
const notificationsRef = db.collection("notifications");
const dietsRef         = db.collection("diets");
const membersRef       = db.collection("members");

/* ---------------- AUTH / ROLE GUARD -------------- */
auth.onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  try {
    const userSnap = await db.collection("users").doc(user.uid).get();
    const userData = userSnap.data();
    if (!userData || userData.role !== "member") {
      alert("Access denied");
      await auth.signOut();
      window.location.href = "index.html";
      return;
    }

    /* map email → memberId */
    const memSnap = await membersRef.where("email", "==", user.email).get();
    if (memSnap.empty) {
      document.getElementById("memberBills").innerHTML =
        "<li>No member record found – contact admin.</li>";
      return;
    }
    const memberId = memSnap.docs[0].id;
    console.log("memberId found =", memberId);

    /* load sections */
    await Promise.all([
      loadMemberBills(memberId),
      loadMemberNotifications(memberId),
      loadMemberDiet(memberId),
    ]);
  } catch (err) {
    console.error("Member‑dashboard error:", err);
    alert("Something went wrong; check console.");
  }
});

/* ---------------- helper functions --------------- */
function logout() {
  auth.signOut().then(() => (window.location.href = "index.html"));
}

/* Bills */
async function loadMemberBills(memberId) {
  const ul = document.getElementById("memberBills");
  ul.innerHTML = "";
  const snap = await billsRef
    .where("memberId", "==", memberId)
    .orderBy("createdAt", "desc")
    .get();

  if (snap.empty) {
    ul.innerHTML = "<li>No bills yet</li>";
    return;
  }

  snap.forEach((d) => {
    const b  = d.data();
    const ts = b.createdAt ? b.createdAt.toDate().toLocaleDateString() : "";
    const li = document.createElement("li");
    li.textContent = `₹${b.amount} – ${b.feePackage} ${ts && "(" + ts + ")"}`;
    ul.appendChild(li);
  });
}

/* Notifications */
async function loadMemberNotifications(memberId) {
  const ul = document.getElementById("memberNotifications");
  ul.innerHTML = "";
  const snap = await notificationsRef
    .where("memberId", "==", memberId)
    .orderBy("createdAt", "desc")
    .get();

  if (snap.empty) {
    ul.innerHTML = "<li>No notifications</li>";
    return;
  }

  snap.forEach((d) => {
    const n  = d.data();
    const ts = n.createdAt ? n.createdAt.toDate().toLocaleDateString() : "";
    const li = document.createElement("li");
    li.textContent = `${n.message} ${ts && "(" + ts + ")"}`;
    ul.appendChild(li);
  });
}

/* Diet */
async function loadMemberDiet(memberId) {
  const p = document.getElementById("memberDiet");
  const doc = await dietsRef.doc(memberId).get();
  p.textContent = doc.exists ? doc.data().plan : "No diet assigned yet.";
}
