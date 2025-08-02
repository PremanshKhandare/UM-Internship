const membersRef = db.collection('members');

function logout() {
    auth.signOut().then(() => {
        window.location.href = "index.html";
    });
}

async function submitMember() {
    const memberId = document.getElementById('memberId').value;
    const name = document.getElementById('memberName').value;
    const email = document.getElementById('memberEmail').value;
    const feePackage = document.getElementById('feePackage').value;

    if (!name || !email || !feePackage) {
        document.getElementById('add-msg').innerText = "All fields are required.";
        return;
    }

    try {
        if (memberId) {
            // Update
            await membersRef.doc(memberId).update({ name, email, feePackage });
            document.getElementById('add-msg').innerText = "Member updated!";
        } else {
            // Add
            await membersRef.add({ name, email, feePackage, createdAt: new Date() });
            document.getElementById('add-msg').innerText = "Member added!";
        }
        resetForm();
        loadMembers();
    } catch (err) {
        document.getElementById('add-msg').innerText = "Error: " + err.message;
    }
}

function resetForm() {
    document.getElementById('memberId').value = "";
    document.getElementById('memberName').value = "";
    document.getElementById('memberEmail').value = "";
    document.getElementById('feePackage').value = "";
    document.getElementById('formTitle').innerText = "Add Member";
}

async function deleteMember(id) {
  if (!confirm("Delete this member and all related records?")) return;

  try {
    // Delete member
    await membersRef.doc(id).delete();

    // Delete related bills
    const billSnap = await db.collection("bills").where("memberId", "==", id).get();
    const billDeletes = billSnap.docs.map(doc => doc.ref.delete());

    // Delete related notifications
    const notifSnap = await db.collection("notifications").where("memberId", "==", id).get();
    const notifDeletes = notifSnap.docs.map(doc => doc.ref.delete());

    // Delete related diet
    const dietSnap = await db.collection("diets").doc(id).get();
    const dietDelete = dietSnap.exists ? db.collection("diets").doc(id).delete() : Promise.resolve();

    // Wait for all deletions
    await Promise.all([...billDeletes, ...notifDeletes, dietDelete]);

    alert("Member and related records deleted!");

    // Refresh UI
    resetForm();
    loadMembers();
    loadBills();
    populateMemberDropdown();
    populateNotifyDropdown();
    populateDietDropdown();
    loadDietPlans();
  } catch (err) {
    alert("Error deleting: " + err.message);
  }
}

/* -------------------------------------------------------------------- */

/* --- change loadMembers() so every list item gets fresh buttons ----- */
async function loadMembers() {
  const list = document.getElementById("memberList");
  list.innerHTML = "";

  const snap = await membersRef.orderBy("createdAt", "desc").get();
  snap.forEach(doc => {
    const m = doc.data();
    const li = document.createElement("li");
    li.textContent = `${m.name} (${m.email}) - ${m.feePackage}`;

    const btnBox = document.createElement("div");
    btnBox.style.marginTop = "6px";

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.onclick = () => editMember(doc.id);

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.onclick = () => deleteMember(doc.id);

    btnBox.append(editBtn, delBtn);
    li.appendChild(btnBox);
    list.appendChild(li);
  });
}


async function editMember(id) {
    const doc = await membersRef.doc(id).get();
    const data = doc.data();
    document.getElementById('memberId').value = id;
    document.getElementById('memberName').value = data.name;
    document.getElementById('memberEmail').value = data.email;
    document.getElementById('feePackage').value = data.feePackage;
    document.getElementById('formTitle').innerText = "Edit Member";
}

async function loadMembers() {
    const list = document.getElementById('memberList');
    list.innerHTML = '';

    const snapshot = await membersRef.orderBy('createdAt', 'desc').get();
    snapshot.forEach(doc => {
        const data = doc.data();
        const li = document.createElement('li');
        li.innerHTML = `
      ${data.name} (${data.email}) - ${data.feePackage}
      <button onclick="editMember('${doc.id}')">Edit</button>
      <button onclick="deleteMember('${doc.id}')">Delete</button>
    `;
        list.appendChild(li);
    });
}

const billsRef = db.collection('bills');

async function populateMemberDropdown() {
  const select = document.getElementById('billMemberSelect');
  select.innerHTML = '<option value="">Select Member</option>';
  const snapshot = await membersRef.get();
  snapshot.forEach(doc => {
    const data = doc.data();
    const option = document.createElement('option');
    option.value = doc.id;
    option.textContent = `${data.name} (${data.email})`;
    select.appendChild(option);
  });
}

async function createBill() {
  const memberId = document.getElementById('billMemberSelect').value;
  const amount = document.getElementById('billAmount').value;
  const feePackage = document.getElementById('billPackage').value;

  if (!memberId || !amount || !feePackage) {
    document.getElementById('bill-msg').innerText = "All fields required.";
    return;
  }

  try {
    await billsRef.add({
      memberId,
      amount: parseFloat(amount),
      feePackage,
      createdAt: new Date()
    });
    document.getElementById('bill-msg').innerText = "Bill created!";
    document.getElementById('billAmount').value = "";
    document.getElementById('billPackage').value = "";
    loadBills();
  } catch (err) {
    document.getElementById('bill-msg').innerText = "Error: " + err.message;
  }
}

async function loadBills() {
  const billList = document.getElementById('billList');
  billList.innerHTML = '';
  const snapshot = await billsRef.orderBy('createdAt', 'desc').get();
  for (const doc of snapshot.docs) {
    const bill = doc.data();
    const memberDoc = await membersRef.doc(bill.memberId).get();
    const member = memberDoc.data();

    const li = document.createElement('li');
    li.textContent = `${member?.name || 'Unknown'} - ₹${bill.amount} (${bill.feePackage})`;
    billList.appendChild(li);
  }
}

const notificationsRef = db.collection('notifications');

async function populateNotifyDropdown() {
  const select = document.getElementById('notifyMemberSelect');
  select.innerHTML = '<option value="">Select Member</option>';
  const snapshot = await membersRef.get();
  snapshot.forEach(doc => {
    const data = doc.data();
    const option = document.createElement('option');
    option.value = doc.id;
    option.textContent = `${data.name} (${data.email})`;
    select.appendChild(option);
  });
}

async function sendNotification() {
  const memberId = document.getElementById('notifyMemberSelect').value;
  const message = document.getElementById('notifyMessage').value;

  if (!memberId || !message) {
    document.getElementById('notify-msg').innerText = "All fields are required.";
    return;
  }

  try {
    await notificationsRef.add({
      memberId,
      message,
      createdAt: new Date()
    });
    document.getElementById('notify-msg').innerText = "Notification sent!";
    document.getElementById('notifyMessage').value = "";
  } catch (err) {
    document.getElementById('notify-msg').innerText = "Error: " + err.message;
  }
}

const supplementsRef = db.collection('supplements');

async function addSupplement() {
  const name = document.getElementById('supplementName').value;
  const desc = document.getElementById('supplementDesc').value;
  const price = parseFloat(document.getElementById('supplementPrice').value);

  if (!name || !desc || !price) {
    document.getElementById('supp-msg').innerText = "All fields are required.";
    return;
  }

  try {
    await supplementsRef.add({
      name,
      desc,
      price,
      createdAt: new Date()
    });
    document.getElementById('supp-msg').innerText = "Supplement added!";
    document.getElementById('supplementName').value = "";
    document.getElementById('supplementDesc').value = "";
    document.getElementById('supplementPrice').value = "";
    loadSupplements();
  } catch (err) {
    document.getElementById('supp-msg').innerText = "Error: " + err.message;
  }
}

async function loadSupplements() {
  const list = document.getElementById('supplementList');
  list.innerHTML = "";

  const snapshot = await supplementsRef.orderBy('createdAt', 'desc').get();
  snapshot.forEach(doc => {
    const data = doc.data();
    const li = document.createElement('li');
    li.textContent = `${data.name} - ₹${data.price} | ${data.desc}`;
    list.appendChild(li);
  });
}

const dietsRef = db.collection('diets');

async function populateDietDropdown() {
  const select = document.getElementById('dietMemberSelect');
  select.innerHTML = '<option value="">Select Member</option>';
  const snapshot = await membersRef.get();
  snapshot.forEach(doc => {
    const data = doc.data();
    const option = document.createElement('option');
    option.value = doc.id;
    option.textContent = `${data.name} (${data.email})`;
    select.appendChild(option);
  });
}

async function assignDiet() {
  const memberId = document.getElementById('dietMemberSelect').value;
  const plan = document.getElementById('dietPlan').value;

  if (!memberId || !plan) {
    document.getElementById('diet-msg').innerText = "All fields are required.";
    return;
  }

  try {
    await dietsRef.doc(memberId).set({ plan, createdAt: new Date() });
    document.getElementById('diet-msg').innerText = "Diet assigned!";
    document.getElementById('dietPlan').value = "";
    loadDietPlans();
  } catch (err) {
    document.getElementById('diet-msg').innerText = "Error: " + err.message;
  }
}

async function loadDietPlans() {
  const list = document.getElementById('dietList');
  list.innerHTML = "";

  const snapshot = await dietsRef.get();
  for (const doc of snapshot.docs) {
    const data = doc.data();
    const memberDoc = await membersRef.doc(doc.id).get();
    const member = memberDoc.data();

    const li = document.createElement('li');
    li.textContent = `${member?.name || 'Unknown'} → ${data.plan}`;
    list.appendChild(li);
  }
}

async function exportBillingReport() {
  const snapshot = await billsRef.orderBy('createdAt').get();
  let csv = "Member Name,Email,Fee Package,Amount,Date\n";

  for (const doc of snapshot.docs) {
    const bill = doc.data();
    const memberDoc = await membersRef.doc(bill.memberId).get();
    const member = memberDoc.data();

    const row = [
      member?.name || "Unknown",
      member?.email || "Unknown",
      bill.feePackage,
      bill.amount,
      bill.createdAt.toDate().toLocaleDateString()
    ];
    csv += row.join(",") + "\n";
  }

  // Create a downloadable file
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'billing_report.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  document.getElementById('export-msg').innerText = "Report downloaded!";
}


// Finally, on page load
auth.onAuthStateChanged((user) => {
  if (user) {
    loadMembers();
    populateMemberDropdown();
    loadBills();
    populateNotifyDropdown();
    loadSupplements();
    populateDietDropdown();
    loadDietPlans();
  } else {
    window.location.href = "index.html"; // Redirect if not logged in
  }
});

