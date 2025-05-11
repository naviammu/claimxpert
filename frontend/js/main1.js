// Load header.html into #header-placeholder1 and bind logout handler after insertion
fetch('header1.html')
  .then(res => res.text())
  .then(data => {
    document.getElementById('header-placeholder1').innerHTML = data;

    // After loading the header, attach the logout function
    const logoutLink = document.querySelector('a[href="#"][onclick="logout()"]');
    if (logoutLink) {
      logoutLink.addEventListener('click', logout);
    }
  });

// Logout function
function logout(event) {
  event.preventDefault(); // Prevent default link behavior

  // Clear session/local storage
  sessionStorage.clear();
  localStorage.clear();

  // Redirect to login page
  window.location.href = 'login.html'; // Change to your actual login page
}
