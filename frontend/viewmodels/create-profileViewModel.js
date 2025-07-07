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

    // Kiểm tra ràng buộc
    // hobbies
    const hobbiesPattern = /^([\p{L}\d ]+)(, [\p{L}\d ]+)*$/u;

    if (!hobbiesPattern.test(hobbies.trim())) {
      showNotification(
        "Invalid preference format. Please use ',' between preferences",
        true
      );
      return;
    }

    // birth_day (Phải đủ 18 tuổi)
    const birthDate = new Date(birth_day);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    // console.log(age);
    const isOver18 =
      age > 18 ||
      (age === 18 && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)));

    if (!isOver18) {
      showNotification("You must be 18 years of age to register.", true);
      return;
    }

    try {
      const response = await createProfile(
        displayName,
        hobbies,
        gender,
        birth_day,
        null,
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

  // Thêm hoặc xóa class error
  notification.classList.toggle("error", isError);
  notification.classList.remove("hidden");

  // Tự động ẩn sau 3 giây
  setTimeout(() => {
    notification.classList.add("hidden");
  }, 2000);
}
