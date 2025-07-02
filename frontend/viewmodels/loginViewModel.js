import { login } from "../models/userModel.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-pass").value;

    try {
      const response = await login(email, password);
      const result = await response.json();

      if (response.ok && result.success) {
        showNotification("Login successful!");
        setTimeout(() => {
          window.location.href = "index.php?page=match";
        }, 3000);
      } else {
        showNotification("Login failed. Please try again!", true);
      }
    } catch (err) {
      console.error("Lỗi đăng nhập: ", err);
      alert("An error occurred while logging in.");
    }
  });
});

document.getElementById("google-login-btn").addEventListener("click", () => {
  window.location.href =
    "http://localhost/Dating-Website/backend/api/auth/googleLogin.php";
});

document.getElementById("fb-login-btn").addEventListener("click", () => {
  window.location.href =
    "http://localhost/Dating-Website/backend/api/auth/fb-login.php";
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

// Nếu có lỗi được truyền từ server, hiển thị lên
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const errorMessage = params.get("error");

  if (errorMessage) {
    showNotification(decodeURIComponent(errorMessage), true);
  }
});
