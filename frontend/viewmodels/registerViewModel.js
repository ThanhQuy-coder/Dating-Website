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
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      const response = await register(email, password);
      const result = await response.json();

      if (response.ok && result.success) {
        alert("Đăng ký thành công!");
        window.location.href = "index.php?page=login";
      } else {
        alert(result.message || "Đăng ký thất bại");
      }
    } catch (err) {
      console.error("Lỗi đăng ký: ", err);
      alert("Đã xảy ra lỗi khi đăng ký.");
    }
  });
});
