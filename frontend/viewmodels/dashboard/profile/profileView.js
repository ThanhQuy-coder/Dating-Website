import { showProfile } from "../../../models/userModel.js";
import { setupHobbiesEditor, updateHobbiesDisplay } from "./hobbiesEditor.js";

export async function loadProfile() {
  const avatarSection = document.getElementsByClassName("avatarSection");
  const displayName = document.getElementById("displayName");
  //   const gender = document.getElementById("gender");
  const birthDate = document.getElementById("birthDate");
  const bio = document.getElementById("bio");
  const hobbies = document.getElementsByClassName("hobbies");
  const location = document.getElementById("location");
  const occupation = document.getElementById("occupation");
  const education = document.getElementById("education");

  try {
    const response = await showProfile();
    const result = await response.json();
    window.profile = result.data || {};

    if (response.ok && result.success) {
      const profile = result.data;
      if (profile.avatar_url) {
        // Sử dụng serve_image.php để truy cập ảnh từ /storage/uploads/
        const imageUrl = `/api/user/profile/serve_image.php?user=${
          profile.user_id
        }&file=${encodeURIComponent(basename(profile.avatar_url))}`;

        // Hiển thị ảnh
        Array.from(avatarSection).forEach((section, index) => {
          section.innerHTML = `<img src="${imageUrl}" alt="Profile" class="profile-avatar">`;
          // DEBUG
          //   console.log(
          //     `Da chen anh vao phan tu ${index + 1}: `,
          //     section.innerHTML
          //   );
        });
      } else {
        // avatarSection.innerHTML = "<p>Chưa có ảnh đại diện.</p>";
        Array.from(avatarSection).forEach((section, index) => {
          section.innerHTML = "<p>Chua co anh dai dien.</p>";
        });
      }

      displayName.textContent = profile.full_name || "Not updated yet";
      updateHobbiesDisplay(window.profile.hobbies || "");
      setupHobbiesEditor();
      //   gender.textContent = profile.gender || "Not updated yet";
      birthDate.textContent = profile.birth_date || "Not updated yet";
      bio.textContent = profile.bio || "Not updated yet";
      location.textContent = profile.location || "Not updated yet";
      occupation.textContent = profile.occupation || "Not updated yet";
      education.textContent = profile.education || "Not updated yet";
    } else {
      showNotification(
        "Không thể tải thông tin hồ sơ: " + result.message,
        true
      );
    }
  } catch (error) {
    console.error("Lỗi khi tải hồ sơ:", error);
    showNotification(
      "An error occurred while loading profile information!",
      true
    );
  }
}

function basename(path) {
  return path.split("/").pop();
}
