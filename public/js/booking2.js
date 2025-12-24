import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
  deleteDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCkgSvUKoR0FCXARDmgOqoXySMbCh5EMY8",
  authDomain: "braids-by-zonke.firebaseapp.com",
  projectId: "braids-by-zonke",
  storageBucket: "braids-by-zonke.firebasestorage.app",
  messagingSenderId: "537270598591",
  appId: "1:537270598591:web:324dd06538c213627abf0a",
  measurementId: "G-NR21BKSR8N",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
let currentUser = null;

// Mobile sidebar functionality
const mobileMenuButton = document.getElementById("menuBtn");
const closeSidebar = document.getElementById("close-sidebar");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

function openSidebar() {
  sidebar.classList.add("open");
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeMobileSidebar() {
  sidebar.classList.remove("open");
  overlay.classList.remove("open");
  document.body.style.overflow = "auto";
}

mobileMenuButton.addEventListener("click", openSidebar);
closeSidebar.addEventListener("click", closeMobileSidebar);
overlay.addEventListener("click", closeMobileSidebar);

// Navigation functionality
document.querySelectorAll(".sidebar-item").forEach((item) => {
  item.addEventListener("click", function (e) {
    e.preventDefault();
    const target = this.getAttribute("href").substring(1);

    // Update active state
    document
      .querySelectorAll(".sidebar-item")
      .forEach((i) => i.classList.remove("active"));
    this.classList.add("active");

    // Show target section
    document.querySelectorAll("section").forEach((section) => {
      section.classList.add("hidden");
    });
    document.getElementById(target).classList.remove("hidden");

    // Update page title
    updatePageTitle(target);

    // Load section-specific data
    if (target === "bookings") {
      loadBookings();
    }

    // Close sidebar on mobile after clicking
    if (window.innerWidth < 768) {
      closeMobileSidebar();
    }
  });
});

// Tab functionality for bookings
document.querySelectorAll(".tab-button").forEach((button) => {
  button.addEventListener("click", function () {
    const tab = this.getAttribute("data-tab");

    // Update active tab
    document.querySelectorAll(".tab-button").forEach((b) => {
      b.classList.remove("border-b-2", "border-pink-500", "text-pink-600");
      b.classList.add("text-gray-500");
    });
    this.classList.add("border-b-2", "border-pink-500", "text-pink-600");
    this.classList.remove("text-gray-500");

    // Show corresponding content
    document.getElementById("upcoming-bookings").classList.add("hidden");
    document.getElementById("past-bookings").classList.add("hidden");
    document.getElementById(`${tab}-bookings`).classList.remove("hidden");
  });
});

// Update page title based on section
function updatePageTitle(section) {
  const titles = {
    dashboard: {
      title: "Dashboard",
      subtitle: "Welcome to your client portal",
    },
    bookings: {
      title: "My Bookings",
      subtitle: "Manage your upcoming and past appointments",
    },
    "new-booking": {
      title: "New Booking",
      subtitle: "Schedule your next braiding session",
    },
  };

  document.getElementById("page-title").textContent = titles[section].title;
  document.getElementById("welcome-user").textContent =
    titles[section].subtitle;
}

// Auth
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    document.getElementById("userEmail").textContent = user.email;
    document.getElementById("user-name").textContent = user.email;
    document.getElementById("user-initial").textContent = user.email
      .charAt(0)
      .toUpperCase();
    document.getElementById(
      "welcome-user"
    ).textContent = `Hello, ${user.email}, ready for your next beautiful style?`;
    loadDashboardData();
    loadBookings();
  } else {
    window.location.href = "index.html";
  }
});

window.logout = () => signOut(auth);

// Set minimum date to today
document.getElementById("date").min = new Date().toISOString().split("T")[0];

// Save Booking
document.getElementById("bookingForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const submitBtn = document.getElementById("submit-booking");
  const submitText = document.getElementById("submit-text");
  const submitLoading = document.getElementById("submit-loading");

  // Show loading state
  submitBtn.disabled = true;
  submitText.textContent = "Processing...";
  submitLoading.classList.remove("hidden");

  const styleSelect = document.getElementById("style");
  const style = styleSelect.value;
  const price = parseInt(
    styleSelect.options[styleSelect.selectedIndex].dataset.price
  );
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const specialRequests = document.getElementById("specialRequests").value;

  try {
    await addDoc(collection(db, "bookings"), {
      userId: currentUser.uid,
      userName: currentUser.email,
      style,
      price,
      date,
      time,
      specialRequests,
      status: "upcoming",
      createdAt: Timestamp.now(),
    });

    // Reset form
    document.getElementById("bookingForm").reset();

    // Show success modal
    document.getElementById("success-modal").classList.remove("hidden");
  } catch (error) {
    console.error("Error creating booking:", error);
    alert("There was an error creating your booking. Please try again.");
  } finally {
    // Reset button state
    submitBtn.disabled = false;
    submitText.textContent = "Book Now";
    submitLoading.classList.add("hidden");
  }
});

// Close success modal
document.getElementById("close-success-modal").addEventListener("click", () => {
  document.getElementById("success-modal").classList.add("hidden");
  loadDashboardData();
  loadBookings();

  // Switch to bookings view
  document.querySelector('a[href="#bookings"]').click();
});

// Load Dashboard
async function loadDashboardData() {
  const q = query(
    collection(db, "bookings"),
    where("userId", "==", currentUser.uid)
  );
  const snapshot = await getDocs(q);

  let upcoming = 0,
    completed = 0,
    total = 0;
  let activities = [];

  snapshot.forEach((doc) => {
    const b = doc.data();
    activities.push({ ...b, id: doc.id });
    if (b.status === "upcoming") upcoming++;
    if (b.status === "completed") {
      completed++;
      total += b.price;
    }
  });

  document.getElementById("upcoming-count").textContent = upcoming;
  document.getElementById("completed-count").textContent = completed;
  document.getElementById("total-spent").textContent = "R" + total;

  const activityDiv = document.getElementById("recent-activity");
  activityDiv.innerHTML = "";

  if (activities.length === 0) {
    activityDiv.innerHTML = `
          <div class="p-6 text-center text-gray-500">
            <i class="fas fa-calendar-times text-3xl mb-3"></i>
            <p>No activity yet. Book your first appointment!</p>
          </div>`;
    return;
  }

  activities
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3)
    .forEach((act) => {
      activityDiv.innerHTML += `
          <div class="p-4 flex items-center booking-card">
            <div class="${
              act.status === "completed" ? "bg-green-100" : "bg-blue-100"
            } p-3 rounded-full mr-4">
              <i class="fas ${
                act.status === "completed"
                  ? "fa-check text-green-600"
                  : "fa-calendar-plus text-blue-600"
              }"></i>
            </div>
            <div class="flex-1">
              <p class="font-medium">${
                act.status === "completed"
                  ? "Appointment Completed"
                  : "New Booking"
              }</p>
              <p class="text-sm text-gray-600">${act.style} on ${formatDate(
        act.date
      )} at ${act.time}</p>
            </div>
            <span class="px-2 py-1 text-xs rounded-full ${
              act.status === "upcoming"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-green-100 text-green-800"
            }">
              ${act.status}
            </span>
          </div>`;
    });
}

// Load Bookings
async function loadBookings() {
  const q = query(
    collection(db, "bookings"),
    where("userId", "==", currentUser.uid)
  );
  const snapshot = await getDocs(q);

  const upcomingDiv = document.getElementById("upcoming-bookings");
  const pastDiv = document.getElementById("past-bookings");
  upcomingDiv.innerHTML = "";
  pastDiv.innerHTML = "";

  if (snapshot.empty) {
    upcomingDiv.innerHTML = `
          <div class="p-6 md:p-8 text-center">
            <i class="fas fa-calendar-times text-3xl text-gray-400 mb-3"></i>
            <h3 class="font-bold text-gray-700 mb-2">No Bookings Yet</h3>
            <p class="text-gray-600 mb-4">You haven't booked any appointments yet.</p>
            <a href="#new-booking" class="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-4 py-2 rounded-lg font-medium inline-flex items-center">
              <i class="fas fa-plus-circle mr-2"></i> Book Your First Appointment
            </a>
          </div>`;
    pastDiv.innerHTML = `<div class="p-6 md:p-8 text-center"><p class="text-gray-500">No past appointments found.</p></div>`;
    return;
  }

  snapshot.forEach((doc) => {
    const b = doc.data();
    const html = `
          <div class="booking-card p-4 md:p-6 flex flex-col md:flex-row md:justify-between md:items-center">
            <div class="mb-3 md:mb-0">
              <div class="flex items-center mb-2">
                <p class="font-bold text-gray-800">${b.style}</p>
                <span class="ml-3 px-2 py-1 text-xs rounded-full ${
                  b.status === "upcoming"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }">
                  ${b.status}
                </span>
              </div>
              <p class="text-sm text-gray-600">
                <i class="fas fa-calendar-alt mr-2"></i>${formatDate(b.date)} 
                | <i class="fas fa-clock mr-2"></i>${b.time}
                | <i class="fas fa-tag mr-2"></i>R${b.price}
                ${
                  b.specialRequests
                    ? `<br><i class="fas fa-sticky-note mr-2"></i>${b.specialRequests}`
                    : ""
                }
              </p>
            </div>
            <div class="flex space-x-2 mt-3 md:mt-0">
              ${
                b.status === "upcoming"
                  ? `
                <button onclick="cancelBooking('${doc.id}')" class="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm">
                  <i class="fas fa-times mr-1"></i> Cancel
                </button>
              `
                  : `
                <button onclick="bookAgain('${b.style}')" class="px-3 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition text-sm">
                  <i class="fas fa-redo mr-1"></i> Book Again
                </button>
              `
              }
            </div>
          </div>`;
    if (b.status === "upcoming") upcomingDiv.innerHTML += html;
    else pastDiv.innerHTML += html;
  });

  if (!upcomingDiv.innerHTML)
    upcomingDiv.innerHTML = `
        <div class="p-6 md:p-8 text-center">
          <i class="fas fa-calendar-check text-3xl text-gray-400 mb-3"></i>
          <h3 class="font-bold text-gray-700 mb-2">No Upcoming Bookings</h3>
          <p class="text-gray-600">You don't have any upcoming appointments.</p>
        </div>`;

  if (!pastDiv.innerHTML)
    pastDiv.innerHTML = `
        <div class="p-6 md:p-8 text-center">
          <p class="text-gray-500">No past appointments found.</p>
        </div>`;
}

// Format date for display
function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Cancel booking
window.cancelBooking = async (id) => {
  if (confirm("Are you sure you want to cancel this booking?")) {
    try {
      await deleteDoc(doc(db, "bookings", id));
      loadDashboardData();
      loadBookings();
    } catch (error) {
      console.error("Error canceling booking:", error);
      alert("There was an error canceling your booking. Please try again.");
    }
  }
};

// Book again function
window.bookAgain = (style) => {
  document.querySelector('a[href="#new-booking"]').click();
  // In a real app, you would pre-fill the form with the selected style
  setTimeout(() => {
    document.getElementById("style").value = style;
  }, 300);
};
