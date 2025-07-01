import { register } from "../models/userModel.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("register-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-pass").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    // Kiem tra xac nhan mat khau
    if (password !== confirmPassword) {
      alert("Confirmation password does not match!");
      return;
    }

    try {
      const response = await register(email, password);
      const result = await response.json();

      if (response.ok && result.success) {
        showNotification("Registration successful");
        setTimeout(() => {
          window.location.href = "index.php?page=login";
        }, 3000);
      } else {
        showNotification("Registration failed. Please try again!", true);
      }
    } catch (err) {
      console.error("Lỗi đăng ký: ", err);
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
  }, 3000);
}
