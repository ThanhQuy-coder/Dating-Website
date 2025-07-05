import { showProfile } from "../models/userModel.js";

// Giả sử hàm showNotification được định nghĩa ở nơi khác hoặc thêm vào
function showNotification(message, isError = false) {
  const notification = document.getElementById("notification");
  if (notification) {
    notification.textContent = message;
    notification.className = "notification " + (isError ? "error" : "success");
    notification.style.display = "block";
    setTimeout(() => {
      notification.style.display = "none";
    }, 3000);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const avatarSections = document.getElementsByClassName("avatarSection"); // Sửa tên biến
  const displayName = document.getElementById("displayName");
  const birthDate = document.getElementById("birthDate");
  const bio = document.getElementById("bio");

  // Kiểm tra phần tử DOM
  if (avatarSections.length === 0 || !displayName || !birthDate || !bio) {
    console.error("Một hoặc nhiều phần tử không tồn tại:", {
      avatarSections,
      displayName,
      birthDate,
      bio,
    });
    return;
  }

  try {
    const response = await showProfile();
    const result = await response.json();

    if (response.ok && result.success) {
      const profile = result.data;
      if (profile.avatar_url) {
        const imageUrl = `/backend/api/user/serve_image.php?file=${encodeURIComponent(
          basename(profile.avatar_url)
        )}`; // Sửa đường dẫn
        Array.from(avatarSections).forEach((section, index) => {
          section.innerHTML = `<img src="${imageUrl}" alt="Ảnh đại diện" class="avatar">`;
          console.log(
            `Đã chèn ảnh vào phần tử ${index + 1}:`,
            section.innerHTML
          );
        });
      } else {
        Array.from(avatarSections).forEach((section) => {
          section.innerHTML = "<p>Chưa có ảnh đại diện.</p>";
        });
      }

      displayName.textContent = profile.full_name || "Chưa cập nhật";
      birthDate.textContent = profile.birth_date || "Chưa cập nhật";
      bio.textContent = profile.bio || "Chưa cập nhật";
    } else {
      showNotification(
        "Không thể tải thông tin hồ sơ: " + (result.message || "Không rõ"),
        true
      );
    }
  } catch (error) {
    console.error("Lỗi khi tải hồ sơ:", error);
    showNotification("Đã xảy ra lỗi khi tải thông tin hồ sơ!", true);
  }
});

// Hàm helper để lấy basename
function basename(path) {
  return path.split("/").pop();
}