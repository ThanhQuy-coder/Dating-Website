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
        alert("Đăng nhập thành công!");
        window.location.href = "index.php?page=match";
      } else {
        alert(result.message || "Sai tài khoản hoặc mật khẩu!");
      }
    } catch (err) {
      console.error("Lỗi đăng nhập: ", err);
      alert("Đã xảy ra lỗi khi đăng nhập.");
    }
  });
});

document.getElementById("google-login-btn").addEventListener("click", () => {
  window.location.href =
    "http://localhost/Dating-Website/backend/api/auth/googleLogin.php";
});
