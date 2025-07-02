import { createProfile } from "../models/userModel.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("profileForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const displayName = document.getElementById("display-name").value;
    const hobbies = document.getElementById("hobbies").value;
    const gender = document.getElementById("gender").value;
    const birth_day = document.getElementById("date-of-birth").value;
    const bio = document.getElementById("description").value;

    try {
      const response = await createProfile(
        displayName,
        hobbies,
        gender,
        birth_day,
        bio
      );
      const result = await response.json();
      if (response.ok && result.success) {
        showNotification("Profile created successfully");
        setTimeout(() => {
          window.location.href = "index.php?page=create-avt1";
        }, 3000);
      } else {
        showNotification("Creating profile failed", true);
      }
    } catch (err) {
      console.error("Lỗi khi tạo profile: ", err);
      alert("An error occurred while registering.");
    }
  });
});

function showNotification(message, isError = false) {
  const notification = document.getElementById("notification");
  const messageElement = document.getElementById("notification-message");

  messageElement.textContent = message;

  notification.classList.toggle("error", isError);
  notification.classList.remove("hidden");

  setTimeout(() => {
    notification.classList.add("hidden");
  }, 3000);
}
