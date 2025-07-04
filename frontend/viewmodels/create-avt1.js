import { updateProfileImage } from "../models/userModel.js";

const avatarInput = document.getElementById("avatarInput");
const avatarImg = document.querySelector(".avatar-upload img");
const uploadButton = document.querySelector("#uploadAvatarButton button");

avatarInput.addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (evt) {
      avatarImg.src = evt.target.result; // Hiển thị xem trước
    };
    reader.readAsDataURL(file);
  }
});

uploadButton.addEventListener("click", async () => {
  const file = avatarInput.files[0];
  if (!file) {
    showNotification("Please select a photo!", true);
    return;
  }

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
      }, 2000);
    } else {
      showNotification("Image upload failed!", true);
    }
  } catch (err) {
    console.error("Error when loading photos:", err);
    showNotification("An error occurred while loading the photo!", true);
  }
});

function showNotification(message, isError = false) {
  const notification = document.getElementById("notification");
  const messageElement = document.getElementById("notification-message");

  messageElement.textContent = message;

  notification.classList.toggle("error", isError);
  notification.classList.remove("hidden");

  setTimeout(() => {
    notification.classList.add("hidden");
  }, 3000);
}
