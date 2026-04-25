if (Auth.isLoggedIn()) window.location.href = '/dashboard.html';

const form = document.getElementById('registerForm');
const errEl = document.getElementById('registerError');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errEl.textContent = '';
  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  try {
    await api('/api/users/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
    const data = await api('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    Auth.setToken(data.token);
    Auth.setUser(data.user);
    window.location.href = '/dashboard.html';
  } catch (err) {
    errEl.textContent = err.message;
  }
});
