const supplementsRef = db.collection('supplements');
const membersRef = db.collection('members');

auth.onAuthStateChanged((user) => {
  if (!user) {
    window.location.href = "index.html";
  } else {
    loadSupplements();
  }
});

function logout() {
  auth.signOut().then(() => window.location.href = "index.html");
}

async function loadSupplements() {
  const list = document.getElementById('storeSupplements');
  list.innerHTML = "";

  const snapshot = await supplementsRef.orderBy("createdAt", "desc").get();
  snapshot.forEach(doc => {
    const data = doc.data();
    const li = document.createElement('li');
    li.textContent = `${data.name} - ₹${data.price} | ${data.desc}`;
    list.appendChild(li);
  });
}

async function searchMember() {
  const input = document.getElementById('searchInput').value.toLowerCase();
  const results = document.getElementById('searchResults');
  results.innerHTML = "";

  if (!input.trim()) return;

  const snapshot = await membersRef.get();
  snapshot.forEach(doc => {
    const data = doc.data();
    if (
      data.name.toLowerCase().includes(input) ||
      data.email.toLowerCase().includes(input)
    ) {
      const li = document.createElement('li');
      li.textContent = `${data.name} (${data.email}) - ${data.feePackage}`;
      results.appendChild(li);
    }
  });
}
