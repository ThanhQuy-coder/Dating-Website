import { showProfile } from "../models/userModel.js";

document.addEventListener("DOMContentLoaded", async () => {
  const avatarSection = document.getElementsByClassName("avatarSection");
  const displayName = document.getElementById("displayName");
  //   const gender = document.getElementById("gender");
  const birthDate = document.getElementById("birthDate");
  const bio = document.getElementById("bio");
  //   const hobbies = document.getElementById("hobbies");
  // const location = document.getElementById("location");
  // const occupation = document.getElementById("occupation");
  // const education = document.getElementById("education");

  try {
    const response = await showProfile();
    const result = await response.json();

    if (response.ok && result.success) {
      const profile = result.data;
      if (profile.avatar_url) {
        // Sử dụng serve_image.php để truy cập ảnh từ /storage/uploads/
        const imageUrl = `/api/user/serve_image.php?file=${encodeURIComponent(
          basename(profile.avatar_url)
        )}`;
        Array.from(avatarSection).forEach((section, index) => {
          section.innerHTML = `<img src="${imageUrl}" alt="Profile" class="profile-avatar">`;
          //   console.log(
          //     `Da chen anh vao phan tu ${index + 1}: `,
          //     section.innerHTML
          //   );
        });
        // avatarSection.innerHTML = `<img src="${imageUrl}" alt="Profile" class="profile-avatar">`;
        // console.log(
        //   "Đã chèn ảnh vào DOM, kiểm tra Elements:",
        //   avatarSection.innerHTML
        // );
      } else {
        // avatarSection.innerHTML = "<p>Chưa có ảnh đại diện.</p>";
        Array.from(avatarSection).forEach((section, index) => {
          section.innerHTML = "<p>Chua co anh dai dien.</p>";
        });
      }

      displayName.textContent = profile.full_name || "Chưa cập nhật";
      //   gender.textContent = profile.gender || "Chưa cập nhật";
      birthDate.textContent = profile.birth_date || "Chưa cập nhật";
      bio.textContent = profile.bio || "Chưa cập nhật";
      //   hobbies.textContent = profile.hobbies || "Chưa cập nhật";
    } else {
      showNotification(
        "Không thể tải thông tin hồ sơ: " + result.message,
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
