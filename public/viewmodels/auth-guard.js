document.addEventListener("DOMContentLoaded", () => {
  fetch("/api/check_auth.php")
    .then((res) => res.json())
    .then((data) => {
      if (data.error === "Unauthorized") {
        window.location.href = "/index.php?page=login";
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const currentPage = params.get("page"); // lấy giá trị từ ?page=...

      if (data.next === "create-profile" && currentPage !== "create-profile") {
        window.location.href = "/index.php?page=create-profile";
      } else if (data.next === "create-avt1" && currentPage !== "create-avt1") {
        window.location.href = "/index.php?page=create-avt1";
      } else if (data.next === "home" && currentPage !== "home") {
        window.location.href = "/index.php?page=home";
      }
    })
    .catch((error) => {
      console.error("Lỗi kiểm tra quyền truy cập:", error);
    });
});
