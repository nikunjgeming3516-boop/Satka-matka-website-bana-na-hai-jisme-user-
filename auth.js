// auth.js
function registerUser(e) {
  e.preventDefault();
  const username = document.getElementById('regUser').value;
  const email = document.getElementById('regEmail').value;
  const pass = document.getElementById('regPass').value;

  let users = JSON.parse(localStorage.getItem('royal_users')) || [];
  if (users.find(u => u.username === username)) {
    alert('Username already exists!');
    return;
  }

  users.push({ username, email, pass, balance: 0 });
  localStorage.setItem('royal_users', JSON.stringify(users));
  alert('Registration successful! Please login.');
  window.location.href = 'login.html';
}

function loginUser(e) {
  e.preventDefault();
  const username = document.getElementById('loginUser').value;
  const pass = document.getElementById('loginPass').value;

  let users = JSON.parse(localStorage.getItem('royal_users')) || [];
  // Default demo admin
  if (username === 'admin' && pass === 'admin') {
    localStorage.setItem('royal_currentUser', JSON.stringify({ username: 'admin', isAdmin: true }));
    window.location.href = 'admin.html';
    return;
  }

  const user = users.find(u => u.username === username && u.pass === pass);
  if (user) {
    localStorage.setItem('royal_currentUser', JSON.stringify(user));
    window.location.href = 'dashboard.html';
  } else {
    alert('Invalid credentials!');
  }
}

function logout() {
  localStorage.removeItem('royal_currentUser');
  window.location.href = 'login.html';
}

// Check if logged in (Call on protected pages)
function checkAuth() {
  const user = localStorage.getItem('royal_currentUser');
  if (!user) {
    window.location.href = 'login.html';
  }
}