if (Auth.isLoggedIn()) window.location.href = '/dashboard.html';

const form = document.getElementById('loginForm');
const errEl = document.getElementById('loginError');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errEl.textContent = '';
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  try {
    const data = await api('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    Auth.setToken(data.token);
    Auth.setUser(data.user);
    const redirect = sessionStorage.getItem('redirectAfterLogin') || '/dashboard.html';
    sessionStorage.removeItem('redirectAfterLogin');
    window.location.href = redirect;
  } catch (err) {
    errEl.textContent = err.message;
  }
});
