import { auth, firestoreDB } from './firebase-config.js';
import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const companyName = document.getElementById("companyName").value.trim();
  const companyId = document.getElementById("companyId").value.trim();
  const loginMsg = document.getElementById("loginMsg");

  // Clear any previous login messages
  loginMsg.textContent = "";

  // Basic validation
  if (!email || !password || !companyName || !companyId) {
    loginMsg.style.color = "red";
    loginMsg.textContent = "Please fill in all fields.";
    return;
  }

  try {
    // Sign in with Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get user document from Firestore
    const userDocRef = doc(firestoreDB, "providers", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      throw new Error("User record not found in Firestore.");
    }

    const userData = userDoc.data();

    // Validate company name and ID
    if (userData.companyName !== companyName || userData.companyId !== companyId) {
      throw new Error("Company name or ID mismatch.");
    }

    // Store session data
    sessionStorage.setItem("loggedIn", "true");
    sessionStorage.setItem("userEmail", email);
    sessionStorage.setItem("userName", userData.name || "User");
    sessionStorage.setItem("insuranceCompany", companyName);

    // Success message and redirect
    loginMsg.style.color = "green";
    loginMsg.textContent = "Login successful! Redirecting...";

    setTimeout(() => {
      window.location.href = "claims.html";
    }, 1500);

  } catch (error) {
    console.error("Login Error:", error.message);
    loginMsg.style.color = "red";
    loginMsg.textContent = `Error: ${error.message}`;
  }
});
