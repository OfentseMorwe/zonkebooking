// booking-auth.js
document.addEventListener("DOMContentLoaded", function () {
  // Check if user is authenticated
  function checkUserAuth() {
    return new Promise((resolve) => {
      const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
        unsubscribe();
        if (user) {
          resolve(user);
        } else {
          // Check localStorage as backup
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            resolve(JSON.parse(storedUser));
          } else {
            resolve(null);
          }
        }
      });
    });
  }

  async function protectPage() {
    const user = await checkUserAuth();

    if (!user) {
      showNotification("Please log in to book appointments", "error");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 2000);
      return false;
    }

    console.log("User authenticated:", user);
    return true;
  }

  // Initialize page protection
  protectPage().then((isAuthenticated) => {
    if (!isAuthenticated) {
      // Hide booking form or show login prompt
      document.body.innerHTML = `
        <div class="min-h-screen flex items-center justify-center bg-gray-50">
          <div class="text-center">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-exclamation-triangle text-red-500 text-2xl"></i>
            </div>
            <h2 class="text-2xl font-bold text-gray-800 mb-2">Authentication Required</h2>
            <p class="text-gray-600 mb-4">Please log in to access the booking system.</p>
            <button onclick="window.location.href='index.html'" class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
              Go to Login
            </button>
          </div>
        </div>
      `;
    }
  });
});
