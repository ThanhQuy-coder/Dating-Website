import { login } from "../models/userModel";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("login-email");
    const password = document.getElementById("login-pass");

    try {
      const response = await login(email, password);
      const result = await response.json();

      if (response.ok && result.success) {
        alert("Đăng nhập thành công!");
        window.location.href = "home.html"; // sau nay chuyen thanh dashboard
      } else {
        alert(result.message || "Sai tài khoản hoặc mật khẩu!");
      }
    } catch (err) {
      console.error("Lỗi đăng nhập: ", err);
      alert("Đã xảy ra lỗi khi đăng nhập.");
    }
  });
});
