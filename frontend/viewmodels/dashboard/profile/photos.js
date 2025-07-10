import {
  uploadPhotos,
  getListImage,
  updatePhotos,
  deletePhotos,
} from "../../../models/userModel.js";
import { showTab } from "../tabControl.js";

export async function setupImageUpload(user_id) {
  document.querySelector(".edit-btn").addEventListener("click", () => {
    if (currentPhotoCount >= 3) {
      showTab("premium");
      return;
    }
    document.getElementById("photoInput").click();
  });

  document.querySelector(".photo-grid").addEventListener("click", async (e) => {
    // Nút Thêm ảnh
    const addPhotoBtn = e.target.closest(".add-photo");
    if (addPhotoBtn) {
      document.getElementById("photoInput").click();
      return;
    }

    // Nút Sửa ảnh
    const editBtn = e.target.closest(".edit-photo");
    if (editBtn) {
      const filename = editBtn.dataset.filename;
      handleEditPhoto(user_id, filename);
      return;
    }

    // Nút Xoá ảnh
    const deleteBtn = e.target.closest(".delete-photo");
    if (deleteBtn) {
      const filename = deleteBtn.dataset.filename;
      if (confirm("Are you sure you want to delete this image?")) {
        await handleDeletePhoto(user_id, filename);
        await reloadPhotos(user_id);
      }
      return;
    }
  });

  // Xử lý sự kiện thêm ảnh
  document
    .getElementById("photoInput")
    .addEventListener("change", async function () {
      const file = this.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("photo", file);

      formData.append("user_id", user_id);

      try {
        const res = await uploadPhotos(formData);

        const result = await res.json();
        if (result.success) {
          // Thêm ảnh vào photo-grid
          const photoGrid = document.querySelector(".photo-grid");
          const photoItem = document.createElement("div");
          photoItem.className = "photo-item";
          const imageUrl = `/api/user/profile/serve_image.php?user=${user_id}&file=${encodeURIComponent(
            basename(result.url)
          )}`;

          photoItem.innerHTML = `
        <img src="${imageUrl}" alt="User photo" />
        <div class="photo-overlay">
          <div class="photo-actions">
            <button class="photo-action"><i class="fas fa-edit"></i></button>
            <button class="photo-action"><i class="fas fa-trash"></i></button>
          </div>
        </div>`;
          photoGrid.insertBefore(
            photoItem,
            document.querySelector(".add-photo")
          );
          showNotification("Upload success!");
          await reloadPhotos(user_id);
        } else {
          showNotification("Upload failed: " + result.message);
        }
      } catch (err) {
        console.error("Upload error:", err);
      }
    });
}

export let currentPhotoCount = 0;

export async function reloadPhotos(user_id) {
  try {
    const res = await getListImage(user_id);
    const result = await res.json();
    if (!result.success) {
      showNotification("Unable to load photo: " + result.message);
      return;
    }

    currentPhotoCount = result.photos.length;

    const photoGrid = document.querySelector(".photo-grid");
    photoGrid.innerHTML = "";

    result.photos.forEach((photo) => {
      const photoItem = document.createElement("div");
      photoItem.className = "photo-item";

      const imageUrl = `/api/user/profile/serve_image.php?user=${user_id}&file=${encodeURIComponent(
        basename(photo.url)
      )}`;

      photoItem.innerHTML = `
    <img src="${imageUrl}" alt="User photo" />
    <div class="photo-overlay">
      <div class="photo-actions">
        <button class="photo-action edit-photo" data-filename="${basename(
          photo.url
        )}"><i class="fas fa-edit"></i></button>
        <button class="photo-action delete-photo" data-filename="${basename(
          photo.url
        )}"><i class="fas fa-trash"></i></button>
      </div>
    </div>`;
      photoGrid.appendChild(photoItem);
    });
    // Chỉ thêm nút add-photo nếu chưa đủ 3 ảnh
    if (currentPhotoCount < 3) {
      const addPhoto = document.createElement("div");
      addPhoto.className = "photo-item add-photo";
      addPhoto.innerHTML = `<i class="fas fa-plus"></i>`;
      photoGrid.appendChild(addPhoto);
    }
  } catch (err) {
    console.error("Error reloading image:", err);
    showNotification("System error when loading images.");
  }
}

function basename(path) {
  return path.split("/").pop();
}

async function handleDeletePhoto(user_id, filename) {
  try {
    const getIdImage = await getListImage(user_id);
    const resultId = await getIdImage.json();
    // Tìm ảnh có filename khớp
    const matched = resultId.photos.find(
      (photo) => basename(photo.url) === filename
    );
    if (!matched) {
      showNotification("No photo found to delete.");
      return;
    }

    const idImage = matched.id;
    console.log(idImage);

    const res = deletePhotos(user_id, filename, idImage);
    const result = await res;
    if (!result.success) {
      showNotification("Delete photo failed: " + result.message);
    } else {
      showNotification("Delete photo success");
    }
  } catch (err) {
    console.error("Delete error:", err);
    showNotification("System error when deleting photos.");
  }
}

function handleEditPhoto(user_id, filename) {
  const input = document.createElement("input");

  input.type = "file";
  input.accept = "image/*";
  input.onchange = async function () {
    const getIdImage = await getListImage(user_id);
    const resultId = await getIdImage.json();

    const matched = resultId.photos.find(
      (photo) => basename(photo.url) === filename
    );
    if (!matched) {
      showNotification("No photo found to edit.");
      return;
    }

    const idImage = matched.id;

    const file = input.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);
    formData.append("user_id", user_id);
    formData.append("filename", filename);
    formData.append("idImage", idImage);

    try {
      const res = await updatePhotos(formData);
      const result = await res.json();
      if (result.success) {
        showNotification("Image update success");
        await reloadPhotos(user_id);
      } else {
        showNotification("Image update failed: " + result.message);
      }
    } catch (err) {
      console.error("Update error:", err);
      showNotification("System error when updating photos.");
    }
  };
  input.click();
}
