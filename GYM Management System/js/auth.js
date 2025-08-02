async function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    const doc = await db.collection("users").doc(user.uid).get();
    const userData = doc.data();

    if (!userData || !userData.role) {
      document.getElementById('login-msg').innerText = "No role found. Contact admin.";
      return;
    }

    // Redirect based on role
    if (userData.role === "admin") {
      window.location.href = "dashboard.html";
    } else if (userData.role === "member") {
      window.location.href = "member.html";
    } else {
      window.location.href = "user.html";
    }

  } catch (error) {
    document.getElementById('login-msg').innerText = "Login failed: " + error.message;
  }
}


async function register() {
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  const role = document.getElementById('regRole').value;

  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // Save role to Firestore
    await db.collection("users").doc(user.uid).set({
      email,
      role,
      createdAt: new Date()
    });

    document.getElementById('reg-msg').innerText = "Registration successful! Redirecting...";
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);

  } catch (error) {
    document.getElementById('reg-msg').innerText = "Error: " + error.message;
  }
}

