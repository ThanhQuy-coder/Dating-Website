import { register } from "../models/userModel.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("register-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("register").value;
    const password = document.getElementById("register-pass").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    // Kiểm tra ràng buộc
    // Kiểm tra độ dài của mật khẩu
    if (password.length < 5) {
      showNotification(
        "Password length must be greater than 5 characters",
        true
      );
      return;
    }

    // Kiểm tra lại mật khẩu người dùng đăng ký
    if (password !== confirmPassword) {
      showNotification("Confirmation password does not match!", true);
      return;
    }

    try {
      const response = await register(username, password);
      const result = await response.json();

      if (response.ok && result.success) {
        showNotification("Registration successful");
        setTimeout(() => {
          window.location.href = "index.php?page=create-profile";
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
