import { createProfile, showProfile } from "../../../models/userModel.js";

export function setupHobbiesEditor() {
  const displayName = document.getElementById("displayName");
  const editBtn = document.getElementById("edit-btn-hobbies");
  const modal = document.getElementById("hobbies-modal");
  const textarea = document.getElementById("hobbies-input");
  const saveBtn = document.getElementById("save-hobbies-btn");
  const cancelBtn = document.getElementById("cancel-hobbies-btn");
  const hobbiesGrid = document.querySelector(".hobbies-grid");
  const hobbiesListSuggested = document.querySelectorAll(".suggested-chip");

  //   Cho phép click vào gợi ý để thêm vào textarea
  hobbiesListSuggested.forEach((chip) => {
    chip.addEventListener("click", () => {
      const textarea = document.getElementById("hobbies-input");
      const hobbyText = removeEmojis(chip.textContent.trim());

      const current = textarea.value.split(",").map((item) => item.trim());
      if (!current.includes(hobbyText)) {
        textarea.value += (textarea.value.trim() ? ", " : "") + hobbyText;
      }
    });
  });

  //   const currentHobbies = "Học, ngủ";
  const currentHobbies = window.profile?.hobbies || "";
  const hobbyArray = currentHobbies.split(",").map((h) => h.trim());
  const stringHobbies = hobbyArray.join(",");
  // console.log(stringHobbies);
  updateHobbiesDisplay(stringHobbies);

  // Mở modal và load danh sách hiện tại
  editBtn.addEventListener("click", () => {
    textarea.value = hobbyArray.join(", ");
    modal.classList.remove("hidden");
  });

  // Hủy modal
  cancelBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  // Lưu lại khi nhấn Save
  saveBtn.addEventListener("click", async () => {
    const newHobbiesRaw = textarea.value;
    const cleanHobbies = newHobbiesRaw
      .split(",")
      .map((h) => removeEmojis(h.trim()))
      .join(", ");

    window.profile.hobbies = cleanHobbies; // gán chuỗi đã loại emoji
    console.log(window.profile.hobbies);
    updateHobbiesDisplay(window.profile.hobbies);
    modal.classList.add("hidden");

    // Lưu vào cơ sở dữ liệu
    try {
      const response = await createProfile(
        displayName.textContent,
        window.profile.hobbies
      );
      const result = await response.json();

      if (response.ok && result.success) {
        showNotification("hobbies editor uploaded successfully!");
      } else {
        showNotification("hobbies editor upload failed!");
      }
    } catch (err) {
      console.error("error: ", err);
      showNotification("hobbies editor error!");
    }
  });
}

// Hàm loại bỏ emoji/icon khỏi một chuỗi
function removeEmojis(str) {
  return str.replace(/[\p{Emoji}]/gu, "").trim();
}

export function updateHobbiesDisplay(hobbiesStr) {
  const hobbyIcons = {
    Gaming: "🎮",
    Sports: "⚽",
    Coding: "💻",
    Photography: "📸",
    Travel: "✈️",
    Music: "🎵",
    Coffee: "☕",
    Cooking: "🍳",
    Reading: "📚",
    Movies: "🎬",
  };

  const hobbyContainer = document.getElementById("hobby-container");
  hobbyContainer.innerHTML = "";

  if (!hobbiesStr || typeof hobbiesStr !== "string") return;

  const hobbyArray = hobbiesStr.split(",").map((h) => h.trim());

  hobbyArray.forEach((hobby) => {
    const icon = hobbyIcons[hobby] || "✨";
    const div = document.createElement("div");
    div.className = "hobby-chip";
    div.textContent = `${icon} ${hobby}`;
    hobbyContainer.appendChild(div);
  });
}
