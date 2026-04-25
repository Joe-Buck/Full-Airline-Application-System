(function renderNav() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  const user = Auth.getUser();
  const links = [
    `<a href="/">Search</a>`,
  ];
  if (Auth.isLoggedIn()) {
    links.push(`<a href="/dashboard.html">My Bookings</a>`);
    if (Auth.isAdmin()) links.push(`<a href="/admin.html">Admin</a>`);
    links.push(`<span class="user-pill">${user.username} (${user.role})</span>`);
    links.push(`<a href="#" id="logoutLink">Log out</a>`);
  } else {
    links.push(`<a href="/login.html">Log in</a>`);
    links.push(`<a href="/register.html">Register</a>`);
  }
  nav.className = 'topnav';
  nav.innerHTML = `
    <a href="/" class="brand">SkyBook</a>
    <div class="nav-links">${links.join('')}</div>
  `;
  const logoutLink = document.getElementById('logoutLink');
  if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      Auth.logout();
      window.location.href = '/';
    });
  }
})();
