// Mobile menu functionality
document.addEventListener("DOMContentLoaded", function () {
  // Mobile menu toggle
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", function () {
      mobileMenu.classList.toggle("hidden");
    });

    // Close mobile menu when clicking on a link
    const mobileLinks = mobileMenu.querySelectorAll("a");
    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
      });
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Modal functionality
  const clientModal = document.getElementById("client-login-modal");
  const adminModal = document.getElementById("admin-login-modal");

  // Client booking buttons
  const bookButtons = [
    document.getElementById("book-appointment-btn"),
    document.getElementById("hero-book-btn"),
    document.getElementById("cta-book-btn"),
    document.getElementById("mobile-book-btn"),
  ];

  // Admin login buttons
  const adminButtons = [
    document.getElementById("admin-login-btn"),
    document.getElementById("mobile-admin-login"),
  ];

  // Close buttons
  const closeClientModal = document.getElementById("close-client-modal");
  const closeAdminModal = document.getElementById("close-admin-modal");

  // Open client modal
  bookButtons.forEach((button) => {
    if (button) {
      button.addEventListener("click", () => {
        if (clientModal) {
          clientModal.classList.remove("hidden");
          document.body.style.overflow = "hidden";
        }
      });
    }
  });

  // Open admin modal
  adminButtons.forEach((button) => {
    if (button) {
      button.addEventListener("click", () => {
        if (adminModal) {
          adminModal.classList.remove("hidden");
          document.body.style.overflow = "hidden";
        }
      });
    }
  });

  // Close modals
  if (closeClientModal) {
    closeClientModal.addEventListener("click", () => {
      if (clientModal) {
        clientModal.classList.add("hidden");
        document.body.style.overflow = "auto";
        resetClientForms();
      }
    });
  }

  if (closeAdminModal) {
    closeAdminModal.addEventListener("click", () => {
      if (adminModal) {
        adminModal.classList.add("hidden");
        document.body.style.overflow = "auto";
        resetAdminLoginForm();
      }
    });
  }

  // Close modals when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === clientModal) {
      clientModal.classList.add("hidden");
      document.body.style.overflow = "auto";
      resetClientForms();
    }
    if (e.target === adminModal) {
      adminModal.classList.add("hidden");
      document.body.style.overflow = "auto";
      resetAdminLoginForm();
    }
  });

  // Close modals with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (clientModal) clientModal.classList.add("hidden");
      if (adminModal) adminModal.classList.add("hidden");
      document.body.style.overflow = "auto";
      resetClientForms();
      resetAdminLoginForm();
    }
  });

  // Form toggle functionality for client modal
  const showSignupForm = document.getElementById("show-signup-form");
  const showLoginForm = document.getElementById("show-login-form");
  const clientEmailForm = document.getElementById("client-email-form");
  const clientSignupForm = document.getElementById("client-signup-form");

  if (showSignupForm && showLoginForm && clientEmailForm && clientSignupForm) {
    showSignupForm.addEventListener("click", () => {
      clientEmailForm.classList.add("hidden");
      clientSignupForm.classList.remove("hidden");
    });

    showLoginForm.addEventListener("click", () => {
      clientSignupForm.classList.add("hidden");
      clientEmailForm.classList.remove("hidden");
    });
  }

  // Name validation - allow only alphabets, spaces, hyphens, and apostrophes
  function initNameValidation() {
    const nameFields = document.querySelectorAll(
      'input[name="FirstName"], input[name="Surname"]'
    );

    nameFields.forEach((field) => {
      // Create error message element
      const errorElement = document.createElement("p");
      errorElement.className = "text-red-500 text-xs mt-1 hidden";
      errorElement.textContent = "Numbers are not allowed";
      field.parentNode.appendChild(errorElement);

      // Input event - filter characters in real-time
      field.addEventListener("input", function (e) {
        const originalValue = this.value;

        // Remove unwanted characters
        this.value = this.value.replace(/[^a-zA-Z\s\-']/g, "");

        // Show error if numbers were removed
        if (this.value !== originalValue) {
          showNameError(this, errorElement);
        } else {
          hideNameError(this, errorElement);
        }

        // Validate the final value
        validateNameField(this, errorElement);
      });

      // Blur event - final validation
      field.addEventListener("blur", function (e) {
        validateNameField(this, errorElement);
      });

      // Keydown event - prevent number keys
      field.addEventListener("keydown", function (e) {
        // Allow: backspace, delete, tab, escape, enter, arrows, home, end
        if (
          [8, 9, 13, 27, 46].includes(e.keyCode) ||
          (e.keyCode >= 35 && e.keyCode <= 40)
        ) {
          return;
        }

        // Prevent number keys (0-9) and numpad numbers
        if (
          (e.keyCode >= 48 && e.keyCode <= 57) ||
          (e.keyCode >= 96 && e.keyCode <= 105)
        ) {
          e.preventDefault();
          showNameError(this, errorElement);
        }
      });
    });
  }

  // Show name error
  function showNameError(field, errorElement) {
    field.classList.add("border-red-500", "bg-red-50");
    field.classList.remove("border-gray-300", "bg-white");
    errorElement.classList.remove("hidden");
  }

  // Hide name error
  function hideNameError(field, errorElement) {
    field.classList.remove("border-red-500", "bg-red-50");
    field.classList.add("border-gray-300", "bg-white");
    errorElement.classList.add("hidden");
  }

  // Validate name field
  function validateNameField(field, errorElement) {
    const value = field.value.trim();

    if (value === "" || !/^[a-zA-Z\s\-']+$/.test(value)) {
      showNameError(field, errorElement);
      return false;
    } else {
      hideNameError(field, errorElement);
      return true;
    }
  }

  // Initialize name validation
  initNameValidation();

  // Firebase initialization
  const firebaseConfig = {
    apiKey: "AIzaSyCkgSvUKoR0FCXARDmgOqoXySMbCh5EMY8",
    authDomain: "braids-by-zonke.firebaseapp.com",
    projectId: "braids-by-zonke",
    storageBucket: "braids-by-zonke.firebasestorage.app",
    messagingSenderId: "537270598591",
    appId: "1:537270598591:web:324dd06538c213627abf0a",
    measurementId: "G-NR21BKSR8N"
  };

  // Initialize Firebase
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const db = firebase.firestore();
  const auth = firebase.auth();

  // Admin Login Form Submission - UPDATED FIX
  const adminLoginForm = document.getElementById("admin-login-form");
  if (adminLoginForm) {
    adminLoginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("admin-email").value.trim();
      const password = document.getElementById("admin-password").value;
      const submitBtn = e.target.querySelector('button[type="submit"]');

      // Show loading state
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Signing in...';
      submitBtn.disabled = true;

      try {
        console.log("Admin login attempt:", { email });

        // Check if it's an admin email
        const adminEmails = [
          "zonkemiyashange@gmail.com",
          "zonke@braidsbyzonke.com",
          "admin@braidsbyzonke.com"
        ];

        if (!adminEmails.includes(email)) {
          showNotification("Access denied. Admin email required.", "error");
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          return;
        }

        // First, authenticate with Firebase Auth
        await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        
        try {
          const userCredential = await auth.signInWithEmailAndPassword(email, password);
          const user = userCredential.user;

          console.log("Admin Firebase Auth successful:", user);

          // Now verify admin credentials in Firestore
          const adminCreds = await getAdminCredentials();

          if (!adminCreds) {
            showNotification("Admin configuration error. Please contact support.", "error");
            await auth.signOut();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            return;
          }

          // Verify the credentials match
          if (email === adminCreds.email && password === adminCreds.password) {
            console.log("Admin credentials verified!");

            // Enhanced session storage
            const sessionData = {
              authenticated: true,
              email: email,
              displayName: "Zonke Miyashange",
              loginTime: new Date().toISOString(),
              expiresAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour
              sessionId: "admin_" + Date.now(),
              role: "admin",
              uid: user.uid
            };

            // Store in multiple places for redundancy
            localStorage.setItem("adminSession", JSON.stringify(sessionData));
            sessionStorage.setItem("adminSession", JSON.stringify(sessionData));
            document.cookie = `adminSession=${JSON.stringify(sessionData)}; path=/; max-age=3600; samesite=strict`;

            // Update admin last login in Firestore
            await db.collection("adminCredentials").doc("credentials").update({
              lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            });

            // Show success message
            showNotification("Login successful! Redirecting to admin dashboard...", "success");

            // Close modal
            if (adminModal) {
              adminModal.classList.add("hidden");
              document.body.style.overflow = "auto";
            }

            // Add delay before redirect
            setTimeout(() => {
              window.location.href = "admin.html";
            }, 1000);
          } else {
            console.log("Invalid admin credentials in Firestore");
            await auth.signOut();
            showNotification("Invalid admin credentials. Please check your email and password.", "error");
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
          }
        } catch (authError) {
          console.error("Firebase Auth error:", authError);
          
          // If authentication fails, fall back to direct Firestore check
          console.log("Falling back to direct Firestore credential check...");
          const adminCreds = await getAdminCredentials();
          
          if (adminCreds && email === adminCreds.email && password === adminCreds.password) {
            console.log("Direct Firestore check successful!");
            
            // Create admin session without Firebase Auth
            const sessionData = {
              authenticated: true,
              email: email,
              displayName: "Zonke Miyashange",
              loginTime: new Date().toISOString(),
              expiresAt: new Date(Date.now() + 3600000).toISOString(),
              sessionId: "admin_" + Date.now(),
              role: "admin",
              uid: "admin_user"
            };

            localStorage.setItem("adminSession", JSON.stringify(sessionData));
            sessionStorage.setItem("adminSession", JSON.stringify(sessionData));
            document.cookie = `adminSession=${JSON.stringify(sessionData)}; path=/; max-age=3600; samesite=strict`;

            // Update last login
            await db.collection("adminCredentials").doc("credentials").update({
              lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            });

            showNotification("Admin login successful! Redirecting...", "success");
            
            if (adminModal) {
              adminModal.classList.add("hidden");
              document.body.style.overflow = "auto";
            }

            setTimeout(() => {
              window.location.href = "admin.html";
            }, 1000);
          } else {
            throw authError; // Re-throw to be caught by outer catch
          }
        }
      } catch (error) {
        console.error("Login error:", error);
        
        let errorMessage = "Login failed. Please try again.";
        if (error.code === "auth/user-not-found") {
          errorMessage = "Admin account not found. Please check your email.";
        } else if (error.code === "auth/wrong-password") {
          errorMessage = "Incorrect password.";
        } else if (error.code === "auth/invalid-email") {
          errorMessage = "Invalid email format.";
        } else if (error.code === "auth/too-many-requests") {
          errorMessage = "Too many failed attempts. Please try again later.";
        } else if (error.message.includes("permission-denied")) {
          errorMessage = "Access denied. Please check Firestore security rules.";
        }
        
        showNotification(errorMessage, "error");
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // Function to get admin credentials from Firestore - UPDATED WITH DEBUG LOGS
  async function getAdminCredentials() {
    try {
      console.log("Attempting to fetch admin credentials from Firestore...");
      const docRef = db.collection("adminCredentials").doc("credentials");
      const doc = await docRef.get();
      
      console.log("Document exists:", doc.exists);
      if (doc.exists) {
        const data = doc.data();
        console.log("Retrieved admin credentials:", {
          email: data.email,
          password: data.password ? "***" + data.password.slice(-3) : "none"
        });
        return data;
      } else {
        console.error("No admin credentials found in Firestore");
        return null;
      }
    } catch (error) {
      console.error("Error fetching admin credentials:", error);
      console.error("Error details:", error.message, error.code);
      
      let errorMessage = "Error connecting to server. Please try again.";
      if (error.code === "permission-denied") {
        errorMessage = "Permission denied. Please check Firestore security rules.";
      } else if (error.code === "unavailable") {
        errorMessage = "Network error. Please check your connection.";
      }
      
      showNotification(errorMessage, "error");
      return null;
    }
  }

  // Function to update admin credentials (for admin settings page)
  async function updateAdminCredentials(newEmail, newPassword) {
    try {
      await db.collection("adminCredentials").doc("credentials").set(
        {
          email: newEmail,
          password: newPassword,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

      return true;
    } catch (error) {
      console.error("Error updating admin credentials:", error);
      return false;
    }
  }

  // Enhanced Google Sign-In functionality
  const googleSignInBtn = document.getElementById("google-signin-btn");

  if (googleSignInBtn) {
    googleSignInBtn.addEventListener("click", async () => {
      try {
        // Show loading state
        googleSignInBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Signing in...';
        googleSignInBtn.disabled = true;

        // Set persistence FIRST
        await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

        const provider = new firebase.auth.GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });

        // Sign in with popup
        const result = await auth.signInWithPopup(provider);
        const user = result.user;

        console.log("Google sign-in successful:", user);

        // Check if user is admin (should redirect to admin page)
        const adminEmails = [
          "zonkemiyashange@gmail.com",
          "zonke@braidsbyzonke.com",
          "admin@braidsbyzonke.com"
        ];

        if (adminEmails.includes(user.email)) {
          // Admin Google login
          const sessionData = {
            authenticated: true,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            loginTime: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 3600000).toISOString(),
            sessionId: "admin_" + Date.now(),
            role: "admin",
            uid: user.uid
          };

          localStorage.setItem("adminSession", JSON.stringify(sessionData));
          sessionStorage.setItem("adminSession", JSON.stringify(sessionData));

          showNotification("Admin login successful! Redirecting...", "success");
          
          if (clientModal) {
            clientModal.classList.add("hidden");
            document.body.style.overflow = "auto";
          }

          setTimeout(() => {
            window.location.href = "admin.html";
          }, 1000);
          return;
        }

        // Regular client Google login
        const userData = {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          isAdmin: false,
          loginTime: new Date().toISOString(),
          sessionId: "user_" + Date.now(),
        };

        localStorage.setItem("user", JSON.stringify(userData));
        sessionStorage.setItem("user", JSON.stringify(userData));

        // Create/update user in Firestore
        await db.collection("users").doc(user.uid).set({
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
          provider: "google"
        }, { merge: true });

        // Close modal and show success
        if (clientModal) {
          clientModal.classList.add("hidden");
          document.body.style.overflow = "auto";
        }

        showNotification(`Welcome ${user.displayName}! Redirecting...`, "success");
        updateUIForLoggedInUser(user);

        // Wait a bit to ensure everything is stored
        setTimeout(() => {
          window.location.href = "client.html";
        }, 1000);
      } catch (error) {
        console.error("Google sign-in error:", error);

        // Reset button
        googleSignInBtn.innerHTML = '<img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" class="w-5 h-5"><span class="font-medium text-gray-700">Continue with Google</span>';
        googleSignInBtn.disabled = false;

        // Error handling
        let errorMessage = "Sign-in failed. Please try again.";
        if (error.code === "auth/popup-closed-by-user") {
          errorMessage = "Sign-in was cancelled.";
        } else if (error.code === "auth/network-request-failed") {
          errorMessage = "Network error. Please check your connection.";
        } else if (error.code === "auth/popup-blocked") {
          errorMessage = "Popup was blocked. Please allow popups for this site.";
        } else if (error.code === "auth/unauthorized-domain") {
          errorMessage = "This domain is not authorized. Please contact support.";
        }

        showNotification(errorMessage, "error");
      }
    });
  }

  // Enhanced Client Email/Password Login
  if (clientEmailForm) {
    clientEmailForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = clientEmailForm.querySelector('input[type="email"]').value.trim();
      const password = clientEmailForm.querySelector('input[type="password"]').value;

      try {
        // Check if it's an admin email
        const adminEmails = [
          "zonkemiyashange@gmail.com",
          "zonke@braidsbyzonke.com",
          "admin@braidsbyzonke.com"
        ];

        if (adminEmails.includes(email)) {
          showNotification("Please use the admin login for admin access.", "error");
          return;
        }

        // Set persistence
        await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

        // Sign in with email/password
        const result = await auth.signInWithEmailAndPassword(email, password);
        const user = result.user;

        console.log("Client email login successful:", user);

        // Store user data
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          isAdmin: false,
          loginTime: new Date().toISOString(),
          sessionId: "user_" + Date.now(),
        };

        localStorage.setItem("user", JSON.stringify(userData));
        sessionStorage.setItem("user", JSON.stringify(userData));

        // Update user in Firestore
        await db.collection("users").doc(user.uid).set({
          email: user.email,
          displayName: user.displayName,
          lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
          provider: "email"
        }, { merge: true });

        showNotification("Login successful! Redirecting...", "success");
        if (clientModal) {
          clientModal.classList.add("hidden");
          document.body.style.overflow = "auto";
        }

        updateUIForLoggedInUser(user);

        // Redirect after ensuring data is stored
        setTimeout(() => {
          window.location.href = "client.html";
        }, 1000);
      } catch (error) {
        console.error("Email login error:", error);
        
        let errorMessage = "Invalid email or password. Please try again.";
        if (error.code === "auth/user-not-found") {
          errorMessage = "No account found with this email. Please sign up first.";
        } else if (error.code === "auth/wrong-password") {
          errorMessage = "Incorrect password.";
        } else if (error.code === "auth/invalid-email") {
          errorMessage = "Invalid email format.";
        } else if (error.code === "auth/too-many-requests") {
          errorMessage = "Too many failed attempts. Please try again later.";
        }
        
        showNotification(errorMessage, "error");
      }
    });
  }

  // Enhanced Client Signup
  if (clientSignupForm) {
    clientSignupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = clientSignupForm.querySelector('input[type="email"]').value.trim();
      const password = clientSignupForm.querySelector('input[type="password"]').value;
      const name = clientSignupForm.querySelector('input[type="text"]').value.trim();

      // Validate name
      if (!/^[a-zA-Z\s\-']+$/.test(name)) {
        showNotification("Please enter a valid name (letters only).", "error");
        return;
      }

      try {
        // Check if it's an admin email
        const adminEmails = [
          "zonkemiyashange@gmail.com",
          "zonke@braidsbyzonke.com",
          "admin@braidsbyzonke.com"
        ];

        if (adminEmails.includes(email)) {
          showNotification("This email is reserved for admin. Please use a different email.", "error");
          return;
        }

        // Set persistence
        await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

        // Create user with email/password
        const result = await auth.createUserWithEmailAndPassword(email, password);
        const user = result.user;

        // Update profile with name
        await user.updateProfile({
          displayName: name,
        });

        console.log("Client signup successful:", user);

        // Store user data
        const userData = {
          uid: user.uid,
          displayName: name,
          email: user.email,
          isAdmin: false,
          loginTime: new Date().toISOString(),
          sessionId: "user_" + Date.now(),
        };

        localStorage.setItem("user", JSON.stringify(userData));
        sessionStorage.setItem("user", JSON.stringify(userData));

        // Create user in Firestore
        await db.collection("users").doc(user.uid).set({
          email: user.email,
          displayName: name,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
          provider: "email",
          hairType: "",
          hairLength: "",
          phone: ""
        });

        showNotification("Account created successfully! Redirecting...", "success");
        if (clientModal) {
          clientModal.classList.add("hidden");
          document.body.style.overflow = "auto";
        }

        updateUIForLoggedInUser(user);

        // Redirect after ensuring data is stored
        setTimeout(() => {
          window.location.href = "client.html";
        }, 1000);
      } catch (error) {
        console.error("Signup error:", error);
        let errorMessage = "Signup failed. Please try again.";

        if (error.code === "auth/email-already-in-use") {
          errorMessage = "This email is already registered. Please sign in instead.";
        } else if (error.code === "auth/weak-password") {
          errorMessage = "Password should be at least 6 characters.";
        } else if (error.code === "auth/invalid-email") {
          errorMessage = "Invalid email address.";
        } else if (error.code === "auth/operation-not-allowed") {
          errorMessage = "Email/password signup is not enabled.";
        }

        showNotification(errorMessage, "error");
      }
    });
  }

  // Notification function
  function showNotification(message, type = "info") {
    const existingNotification = document.getElementById("auth-notification");
    if (existingNotification) existingNotification.remove();

    const notification = document.createElement("div");
    notification.id = "auth-notification";
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform transition-transform duration-300 ${
      type === "success"
        ? "bg-green-500 text-white"
        : type === "error"
        ? "bg-red-500 text-white"
        : "bg-blue-500 text-white"
    }`;

    notification.innerHTML = `
      <div class="flex items-center space-x-2">
        <i class="fas ${
          type === "success"
            ? "fa-check-circle"
            : type === "error"
            ? "fa-exclamation-circle"
            : "fa-info-circle"
        }"></i>
        <span class="text-sm">${message}</span>
        <button onclick="this.parentElement.parentElement.remove()" class="ml-4">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;

    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 5000);
  }

  // Enhanced Auth State Check
  function checkAuthState() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("User is logged in:", user);

        // Check if user is admin
        const adminEmails = [
          "zonkemiyashange@gmail.com",
          "zonke@braidsbyzonke.com",
          "admin@braidsbyzonke.com"
        ];

        if (adminEmails.includes(user.email)) {
          // Admin user
          const sessionData = {
            authenticated: true,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            isAdmin: true,
            loginTime: new Date().toISOString(),
            sessionId: "admin_" + Date.now(),
            uid: user.uid
          };

          localStorage.setItem("adminSession", JSON.stringify(sessionData));
          
          // Redirect to admin page if not already there
          if (!window.location.pathname.includes("admin")) {
            window.location.href = "admin.html";
          }
        } else {
          // Regular user
          const userData = {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            isAdmin: false,
            loginTime: new Date().toISOString(),
          };

          localStorage.setItem("user", JSON.stringify(userData));
          updateUIForLoggedInUser(user);
        }
      } else {
        console.log("User is logged out");
        localStorage.removeItem("user");
        localStorage.removeItem("adminSession");
        updateUIForLoggedOutUser();
      }
    });
  }

  // Update UI for logged-in user
  function updateUIForLoggedInUser(user) {
    const navButtons = document.querySelectorAll(
      "#book-appointment-btn, #hero-book-btn, #cta-book-btn"
    );
    navButtons.forEach((button) => {
      if (button) {
        button.innerHTML = `<i class="fas fa-calendar-check mr-2"></i>My Dashboard`;
        button.onclick = () => (window.location.href = "client.html");
      }
    });

    const mobileBookBtn = document.getElementById("mobile-book-btn");
    if (mobileBookBtn) {
      mobileBookBtn.innerHTML = `<i class="fas fa-calendar-check mr-2"></i>My Dashboard`;
      mobileBookBtn.onclick = () => (window.location.href = "client.html");
    }

    // Update user info in header if exists
    const userInfoElement = document.getElementById("user-info");
    if (userInfoElement && user.displayName) {
      userInfoElement.textContent = `Hi, ${user.displayName}`;
    }
  }

  // Update UI for logged-out user
  function updateUIForLoggedOutUser() {
    const navButtons = document.querySelectorAll(
      "#book-appointment-btn, #hero-book-btn, #cta-book-btn"
    );
    navButtons.forEach((button) => {
      if (button) {
        button.innerHTML = `<i class="fas fa-calendar-check mr-2"></i>Book Now`;
        button.onclick = () => {
          if (clientModal) clientModal.classList.remove("hidden");
        };
      }
    });

    const mobileBookBtn = document.getElementById("mobile-book-btn");
    if (mobileBookBtn) {
      mobileBookBtn.innerHTML = `<i class="fas fa-calendar-check mr-2"></i>Book Now`;
      mobileBookBtn.onclick = () => {
        if (clientModal) clientModal.classList.remove("hidden");
      };
    }

    // Reset user info in header
    const userInfoElement = document.getElementById("user-info");
    if (userInfoElement) {
      userInfoElement.textContent = "";
    }
  }

  // Sign out function
  window.signOut = function () {
    auth.signOut().then(() => {
      localStorage.removeItem("user");
      localStorage.removeItem("adminSession");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("adminSession");
      document.cookie = "adminSession=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      
      showNotification("Successfully signed out", "success");
      updateUIForLoggedOutUser();
      
      // Redirect to home page after sign out
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
    }).catch((error) => {
      console.error("Sign out error:", error);
      showNotification("Error signing out", "error");
    });
  };

  // Check admin session validity
  function checkAdminSession() {
    const adminSession = localStorage.getItem("adminSession");
    if (adminSession) {
      try {
        const session = JSON.parse(adminSession);
        const expiresAt = new Date(session.expiresAt || 0);
        const now = new Date();
        
        if (expiresAt > now) {
          return session;
        } else {
          // Session expired
          localStorage.removeItem("adminSession");
          sessionStorage.removeItem("adminSession");
          return null;
        }
      } catch (error) {
        console.error("Error parsing admin session:", error);
        return null;
      }
    }
    return null;
  }

  // Check if already authenticated - Enhanced
  function checkExistingAuth() {
    // Check admin session first
    const adminSession = checkAdminSession();
    if (adminSession) {
      // If on admin page, stay; if on client page, redirect to admin
      if (!window.location.pathname.includes("admin")) {
        window.location.href = "admin.html";
      }
      return;
    }

    // Check regular user session
    const userSession = localStorage.getItem("user");
    if (userSession) {
      try {
        const session = JSON.parse(userSession);
        // If on admin page but not admin, redirect to client
        if (window.location.pathname.includes("admin") && !session.isAdmin) {
          window.location.href = "client.html";
        }
      } catch (error) {
        console.error("Error parsing user session:", error);
      }
    }
  }

  function resetAdminLoginForm() {
    const adminEmail = document.getElementById("admin-email");
    const adminPassword = document.getElementById("admin-password");
    if (adminEmail) adminEmail.value = "";
    if (adminPassword) adminPassword.value = "";
  }

  function resetClientForms() {
    if (clientEmailForm && clientSignupForm) {
      clientEmailForm.classList.remove("hidden");
      clientSignupForm.classList.add("hidden");
      clientEmailForm.reset();
      clientSignupForm.reset();
    }
  }

  // Initialize auth with persistence
  async function initializeAuth() {
    try {
      await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      checkAuthState();
      checkExistingAuth();
    } catch (error) {
      console.error("Auth initialization error:", error);
    }
  }

  // Initialize auth
  initializeAuth();

  // Global notification functions
  window.hideNotification = function () {
    const notification = document.getElementById("notification");
    if (notification) {
      notification.classList.add("hidden");
    }
  };
});

// Global utility functions
function showNotification(message, type = "info") {
  const notification = document.getElementById("notification");
  const messageElement = document.getElementById("notification-message");

  if (notification && messageElement) {
    messageElement.textContent = message;

    // Update styles based on type
    const borderColor =
      type === "error"
        ? "border-red-500"
        : type === "success"
        ? "border-green-500"
        : "border-blue-500";

    notification.querySelector(".border-l-4").className = `border-l-4 ${borderColor}`;
    notification.classList.remove("hidden");

    // Auto-hide after 5 seconds
    setTimeout(() => {
      notification.classList.add("hidden");
    }, 5000);
  }
}

// Admin session check for admin pages - UPDATED
if (window.location.pathname.includes("admin")) {
  document.addEventListener("DOMContentLoaded", function() {
    const adminSession = localStorage.getItem("adminSession");
    if (!adminSession) {
      console.log("No admin session found, redirecting to login...");
      // No admin session, redirect to login
      window.location.href = "index.html";
      return;
    }

    try {
      const session = JSON.parse(adminSession);
      const expiresAt = new Date(session.expiresAt || 0);
      const now = new Date();
      
      if (expiresAt <= now) {
        console.log("Admin session expired, redirecting...");
        // Session expired
        localStorage.removeItem("adminSession");
        sessionStorage.removeItem("adminSession");
        showNotification("Session expired. Please login again.", "error");
        setTimeout(() => {
          window.location.href = "index.html";
        }, 1500);
      } else {
        console.log("Admin session valid, continuing...");
        // Session is valid
        // Update admin UI elements if they exist
        const adminNameElement = document.getElementById("admin-name");
        if (adminNameElement && session.displayName) {
          adminNameElement.textContent = session.displayName;
        }
      }
    } catch (error) {
      console.error("Error checking admin session:", error);
      showNotification("Session error. Please login again.", "error");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);
    }
  });
}

// User session check for client pages
if (window.location.pathname.includes("client")) {
  document.addEventListener("DOMContentLoaded", function() {
    const userSession = localStorage.getItem("user");
    const adminSession = localStorage.getItem("adminSession");
    
    // If admin is logged in but on client page, redirect to admin
    if (adminSession) {
      console.log("Admin detected on client page, redirecting to admin...");
      window.location.href = "admin.html";
      return;
    }
    
    if (!userSession) {
      console.log("No user session found, redirecting to login...");
      // No user session, redirect to login
      window.location.href = "index.html";
    } else {
      try {
        const session = JSON.parse(userSession);
        // Update client UI elements if they exist
        const clientNameElement = document.getElementById("client-name");
        if (clientNameElement && session.displayName) {
          clientNameElement.textContent = session.displayName;
        }
      } catch (error) {
        console.error("Error parsing user session:", error);
      }
    }
  });
}