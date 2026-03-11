// Simple client-side session for admin
(function () {
  const KEY = "fm:isAdmin";

  function isAdmin() {
    return localStorage.getItem(KEY) === "true";
  }

  function login(username, password) {
    if (username === "admin" && password === "Admin") {
      localStorage.setItem(KEY, "true");
      return true;
    }
    return false;
  }

  function logout() {
    localStorage.removeItem(KEY);
  }

  function requireAdmin() {
    if (!isAdmin()) window.location.href = "login.html";
  }

  window.FMAuth = { isAdmin, login, logout, requireAdmin };
})();
