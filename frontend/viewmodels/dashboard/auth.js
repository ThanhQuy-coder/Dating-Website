export function checkAuth() {
  fetch("/api/check_auth.php")
    .then((res) => res.json())
    .then((data) => {
      if (data.error === "Unauthorized") {
        window.location.href = "/index.php?page";
      } else {
        console.log("Đã đăng nhập rồi, tiếp tục sử dụng trang");
      }
    })
    .catch((err) => {
      console.error("Lỗi khi kiểm tra đăng nhập:", err);
    });
}
