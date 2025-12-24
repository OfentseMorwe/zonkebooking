// admin-auth.js
document.addEventListener("DOMContentLoaded", function () {
  function checkAdminAuth() {
    // Check multiple storage locations
    const adminSession =
      localStorage.getItem("adminSession") ||
      sessionStorage.getItem("adminSession");

    if (!adminSession) {
      return null;
    }

    const session = JSON.parse(adminSession);

    // Check session expiration (1 hour)
    const loginTime = new Date(session.loginTime);
    const now = new Date();
    const hoursDiff = (now - loginTime) / (1000 * 60 * 60);

    if (hoursDiff >= 1) {
      // Session expired
      localStorage.removeItem("adminSession");
      sessionStorage.removeItem("adminSession");
      return null;
    }

    return session;
  }

  function protectAdminPage() {
    const adminSession = checkAdminAuth();

    if (!adminSession) {
      showNotification("Admin authentication required", "error");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 2000);
      return false;
    }

    console.log("Admin authenticated:", adminSession);
    return true;
  }

  // Initialize admin page protection
  if (!protectAdminPage()) {
    document.body.innerHTML = `
      <div class="min-h-screen flex items-center justify-center bg-gray-50">
        <div class="text-center">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-shield-alt text-red-500 text-2xl"></i>
          </div>
          <h2 class="text-2xl font-bold text-gray-800 mb-2">Admin Access Required</h2>
          <p class="text-gray-600 mb-4">Please log in with admin credentials.</p>
          <button onclick="window.location.href='index.html'" class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
            Go to Login
          </button>
        </div>
      </div>
    `;
  }

  // Admin logout function
  window.adminLogout = function () {
    localStorage.removeItem("adminSession");
    sessionStorage.removeItem("adminSession");
    document.cookie =
      "adminSession=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "index.html";
  };
});
