import { logout } from "../../models/userModel.js";

export async function setupLogout() {
  const logoutBtn = document.querySelector(".settings-item.danger");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        const response = await logout();
        const result = await response.json();

        if (response.ok && result.success) {
          showNotification("Logout successful!");
          setTimeout(() => {
            window.location.href = "index.php?page";
          }, 2000);
        } else {
          showNotification("failed. Please try again!");
        }
      } catch (error) {
        console.error("Lỗi khi tải hồ sơ:", error);
        showNotification(
          "An error occurred while loading profile information!",
          true
        );
      }
    });
  }
}
