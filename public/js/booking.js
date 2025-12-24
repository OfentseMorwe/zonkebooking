import { db, auth } from "./firebase-config.js";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const dateInput = document.getElementById("booking-date");
const timeSlotsDiv = document.getElementById("time-slots");
const confirmBtn = document.getElementById("confirm-booking");

let selectedSlot = null;
let selectedDate = null;

dateInput.addEventListener("change", async (e) => {
  selectedDate = e.target.value;
  loadAvailability(selectedDate);
});

async function loadAvailability(date) {
  const docRef = doc(db, "availability", date);
  const snap = await getDoc(docRef);

  timeSlotsDiv.innerHTML = "";

  if (snap.exists()) {
    const data = snap.data().slots;
    Object.keys(data).forEach((time) => {
      const available = data[time];
      const btn = document.createElement("button");
      btn.textContent = time;
      btn.className =
        "p-2 rounded border " +
        (available
          ? "bg-green-100 hover:bg-green-200"
          : "bg-gray-200 cursor-not-allowed");
      btn.disabled = !available;

      btn.addEventListener("click", () => {
        selectedSlot = time;
        confirmBtn.disabled = false;
        document
          .querySelectorAll("#time-slots button")
          .forEach((b) => b.classList.remove("bg-pink-200"));
        btn.classList.add("bg-pink-200");
      });

      timeSlotsDiv.appendChild(btn);
    });
  } else {
    timeSlotsDiv.innerHTML =
      "<p class='text-sm text-red-500'>No availability set for this day.</p>";
  }
}

confirmBtn.addEventListener("click", async () => {
  if (!selectedSlot || !selectedDate) return;

  const user = auth.currentUser;
  if (!user) {
    alert("Please log in first");
    return;
  }

  // Save booking
  const bookingId = `${selectedDate}-${selectedSlot}-${user.uid}`;
  await setDoc(doc(db, "bookings", bookingId), {
    clientId: user.uid,
    date: selectedDate,
    time: selectedSlot,
    status: "confirmed",
  });

  // Mark slot as unavailable
  const availRef = doc(db, "availability", selectedDate);
  await updateDoc(availRef, {
    [`slots.${selectedSlot}`]: false,
  });

  alert(`Booking confirmed for ${selectedDate} at ${selectedSlot}`);
  confirmBtn.disabled = true;
});
