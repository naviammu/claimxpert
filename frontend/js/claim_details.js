import { db } from './firebase-config.js';
import { ref, get, child, update } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js';

const container = document.getElementById("claimDetailsContainer");
const urlParams = new URLSearchParams(window.location.search);
const claimId = urlParams.get("id");

if (!claimId) {
  container.innerHTML = '<p class="error-message">Claim ID missing in URL.</p>';
} else {
  const dbRef = ref(db);
  get(child(dbRef, `claims/${claimId}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const claim = snapshot.val();
        const fields = Object.entries(claim);
        let tableRows = '';
        
        for (let i = 0; i < fields.length; i++) {
          const [key, value] = fields[i];
          tableRows += `
            <tr>
              <td>${formatKey(key)}</td>
              <td>${formatValue(key, value)}</td>
            </tr>
          `;
        }

        // Append status dropdown row
        tableRows += `
          <tr>
            <td>Status</td>
            <td>
              <select id="statusDropdown" class="status-select">
                <option value="Yet to process">Yet to process</option>
                <option value="On process">On process</option>
                <option value="Verified">Verified</option>
                <option value="Rejected">Rejected</option>
              </select>
            </td>
          </tr>
        `;

        container.innerHTML = `
          <h2 class="claim-title">Claim Details</h2>
          <table class="details-table">
            ${tableRows}
          </table>
          <button id="saveStatusBtn" class="save-button">Save</button>
          <p id="saveMsg" class="save-message"></p>
        `;

        // Save button logic
        document.getElementById("saveStatusBtn").addEventListener("click", () => {
          const selectedStatus = document.getElementById("statusDropdown").value;
          const claimRef = ref(db, `claims/${claimId}`);
          update(claimRef, { status: selectedStatus })
            .then(() => {
              document.getElementById("saveMsg").style.color = "green";
              document.getElementById("saveMsg").textContent = "Status updated successfully!";
            })
            .catch((error) => {
              console.error("Error updating status:", error);
              document.getElementById("saveMsg").style.color = "red";
              document.getElementById("saveMsg").textContent = "Error updating status.";
            });
        });

      } else {
        container.innerHTML = `<p class="error-message">No claim found for ID: ${claimId}</p>`;
      }
    })
    .catch((error) => {
      console.error("Error fetching claim:", error);
      container.innerHTML = '<p class="error-message">Error fetching claim details.</p>';
    });
}

function formatKey(key) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace('Pan Card', 'PAN Card')
    .replace('Iob', 'IOB');
}

function formatValue(key, value) {
  if (value === undefined || value === null || value === '') return 'N/A';
  
  if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return new Date(value).toLocaleDateString();
  }

  if (key.toLowerCase().includes('charge') || 
      key.toLowerCase().includes('bill') || 
      key.toLowerCase().includes('expense')) {
    return `₹${Number(value).toLocaleString('en-IN')}`;
  }

  return value;
}
