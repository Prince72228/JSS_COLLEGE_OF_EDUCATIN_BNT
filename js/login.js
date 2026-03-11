document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("loginBtn");
  const form = document.getElementById("loginForm");

  // Safety: if the button exists, wire click handler
  if (btn) btn.addEventListener("click", login);

  // Also handle Enter key / form submit without changing UI
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      login();
    });
  }
});

function login() {
  const usernameEl = document.getElementById("username");
  const passwordEl = document.getElementById("password");

  const username = usernameEl ? usernameEl.value : "";
  const password = passwordEl ? passwordEl.value : "";

  const ok = username === "admin" && password === "Admin";

  // Store session if auth helper is present
  if (ok && window.FMAuth?.login) {
    window.FMAuth.login(username, password);
  }

  if (ok) {
    window.location.href = "admin.html";
  } else {
    alert("Invalid username or password");
  }
}
