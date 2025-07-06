import { createProfile } from "../../models/userModel.js";

export function setupBioEditor() {
  const displayName = document.getElementById("displayName");
  const editBtn = document.getElementById("edit-btn-aboutMe");
  const bioElement = document.getElementById("bio");

  let isEditing = false;
  let textarea, saveBtn, cancelBtn;

  editBtn.addEventListener("click", () => {
    if (!isEditing) {
      const currentText = bioElement.textContent.trim();

      // Tạo textarea
      textarea = document.createElement("textarea");
      textarea.value = currentText;
      textarea.style.width = "100%";
      textarea.style.height = "80px";
      textarea.style.lineHeight = "1.6";
      textarea.id = "bio-edit";

      // Nút Save
      saveBtn = document.createElement("button");
      saveBtn.textContent = "Save";
      saveBtn.className = "save-btn";
      saveBtn.style.marginRight = "8px";

      // Nút Cancel
      cancelBtn = document.createElement("button");
      cancelBtn.textContent = "Cancel";
      cancelBtn.className = "cancel-btn";

      // Sự kiện Save
      saveBtn.addEventListener("click", async () => {
        const newText = textarea.value.trim();
        bioElement.textContent = newText;
        // Lưu vào cơ sở dữ liệu
        try {
          const response = await createProfile(
            displayName.textContent,
            null,
            null,
            null,
            null,
            bioElement.textContent
          );
          const result = await response.json();
          if (response.ok && result.success) {
            showNotification("Bio uploaded successfully!");
          } else {
            showNotification("Bio upload failed!");
          }
        } catch (err) {
          console.error("Error when loading bio:", err);
          showNotification("An error occurred while loading the bio!");
        }
        exitEditMode();
      });

      // Sự kiện Cancel
      cancelBtn.addEventListener("click", () => {
        exitEditMode();
      });

      // Ẩn đoạn bio cũ, hiển thị textarea + nút
      bioElement.style.display = "none";
      bioElement.parentNode.insertBefore(textarea, bioElement);
      bioElement.parentNode.insertBefore(saveBtn, textarea.nextSibling);
      bioElement.parentNode.insertBefore(cancelBtn, saveBtn.nextSibling);

      isEditing = true;
    } else {
      // Đang chỉnh sửa -> ấn lại sẽ hủy
      exitEditMode();
    }
  });

  function exitEditMode() {
    if (textarea) textarea.remove();
    if (saveBtn) saveBtn.remove();
    if (cancelBtn) cancelBtn.remove();
    bioElement.style.display = "block";
    isEditing = false;
  }
}
