import { updateProfileImage } from "../../models/userModel.js";

export async function setupAvatarUpload() {
  const cameraBtn = document.querySelector(".camera-btn");
  const fileInput = document.getElementById("avatar-input");
  const avatarImage = document.getElementById("avatar-image");

  // Khi bấm vào nút camera, mở hộp thoại chọn ảnh
  cameraBtn.addEventListener("click", () => {
    fileInput.click();
  });

  // Khi người dùng chọn ảnh
  fileInput.addEventListener("change", async () => {
    const file = fileInput.files[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      avatarImage.src = e.target.result; // Cập nhật ảnh đại diện
    };
    reader.readAsDataURL(file);

    // Kiểm tra kích thước file (ví dụ: giới hạn 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showNotification(
        "Photo is too large, please choose a photo under 5MB!",
        true
      );
      return;
    }

    try {
      const response = await updateProfileImage(file);
      const result = await response.json();
      if (response.ok && result.success) {
        showNotification("Profile photo has been uploaded successfully!");
        setTimeout(() => {
          window.location.href = "index.php?page=match"; // Chuyển hướng
        }, 1500);
      } else {
        showNotification("Image upload failed!", true);
      }
    } catch (err) {
      console.error("Error when loading photos:", err);
      showNotification("An error occurred while loading the photo!");
    }
  });
}
