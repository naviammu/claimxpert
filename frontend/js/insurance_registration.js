import { auth, db } from './firebase-config.js';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

// No need for reCAPTCHA or phone verification anymore
window.onload = () => {
  // reCAPTCHA is not required anymore, so no need to initialize it
};

document.getElementById("registrationForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Cache DOM elements
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const companyNameInput = document.getElementById("companyName");
  const companyIdInput = document.getElementById("companyId");
  const responseMsg = document.getElementById("responseMsg");
  const submitBtn = document.querySelector("#registrationForm button[type='submit']");

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const companyName = companyNameInput.value.trim();
  const companyId = companyIdInput.value.trim();

  // Reset and disable
  responseMsg.textContent = "";
  submitBtn.disabled = true;

  try {
    if (!name || !email || !password || !companyName || !companyId) {
      responseMsg.textContent = "Please fill in all fields.";
      submitBtn.disabled = false;
      return;
    }

    // Step 1: Create account with email/password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Step 2: Send email verification
    await sendEmailVerification(user);

    // Step 3: Save data to Firestore
    await setDoc(doc(db, "providers", user.uid), {
      name,
      email,
      companyName,
      companyId,
      uid: user.uid,
      createdAt: serverTimestamp()
    });

    responseMsg.textContent = "Registration successful! Redirecting...";
    setTimeout(() => {
      window.location.href = "claims.html"; // Redirect to the claim page
    }, 2000);

  } catch (error) {
    console.error("Registration Error:", error.code, error.message);
    responseMsg.textContent = `Error: ${error.message}`;
  } finally {
    submitBtn.disabled = false;
  }
});