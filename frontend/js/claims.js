import { auth, db } from './firebase-config.js';
import { getDoc, doc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { getDatabase, ref, query, orderByChild, equalTo, get } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

window.addEventListener("DOMContentLoaded", async () => {
  const tbody = document.getElementById("claims-table-body");

  // Listen for authentication state changes
  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      console.error("No user is logged in");
      tbody.innerHTML = "<tr><td colspan='4'>User not logged in</td></tr>";
      
      // Redirect to login page if not logged in
      setTimeout(() => {
        window.location.href = "login.html"; // Assuming login page is login.html
      }, 1500);
      return;
    }

    try {
      // Step 1: Get companyName from sessionStorage
      const insuranceCompany = sessionStorage.getItem("insuranceCompany");

      if (!insuranceCompany) {
        throw new Error("Insurance company not found in sessionStorage");
      }
      console.log("Insurance Company from sessionStorage:", insuranceCompany);

      // Step 2: Query Realtime Database for matching claims
      const database = getDatabase();
      const claimsQuery = query(
        ref(database, "claims"),
        orderByChild("insuranceCompany"),
        equalTo(insuranceCompany) // Use companyName from sessionStorage
      );

      const snapshot = await get(claimsQuery);

      if (snapshot.exists()) {
        const claims = snapshot.val();
        tbody.innerHTML = ""; // Clear previous rows

        // Loop through claims and display them in the table
        Object.keys(claims).forEach(claimId => {
          const claim = claims[claimId];
          const row = document.createElement("tr");
          row.innerHTML = `
            <td><a href="details.html?id=${claimId}">${claim.policyNumber || "N/A"}</a></td>
            <td>${claim.accountHolderName || "N/A"}</td>
            <td>${claim.hospitalizationCause || "N/A"}</td>
            <td>${claim.status || "Yet to process"}</td>
          `;
          tbody.appendChild(row);
        });
      } else {
        tbody.innerHTML = "<tr><td colspan='4'>No claims found for this insurance company.</td></tr>";
      }
    } catch (err) {
      console.error("Failed to fetch claims:", err);
      tbody.innerHTML = "<tr><td colspan='4'>Error loading claims</td></tr>";
    }
  });
});
