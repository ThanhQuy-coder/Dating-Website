import { createProfile } from "../../models/userModel.js";

export function setupBasicInfoEditor() {
  const displayName = document.getElementById("displayName");
  const editBtn = document.querySelector("#edit-basic-info-btn .edit-btn");

  const fields = [
    { id: "birthDate", label: "Age" },
    { id: "location", label: "Location" },
    { id: "occupation", label: "Occupation" },
    { id: "education", label: "Education" },
  ];

  let isEditing = false;
  let originalValues = {};

  editBtn.addEventListener("click", () => {
    if (!isEditing) {
      fields.forEach(({ id }) => {
        const span = document.getElementById(id);
        if (!span) return;

        originalValues[id] = span.textContent.trim();

        const input = document.createElement("input");
        input.type = "text";
        input.value = originalValues[id];
        input.id = `${id}-input`;
        input.classList.add("basic-info-input");

        // Nếu là birthDate thì dùng input type="date"
        if (id === "birthDate") {
          input.type = "date";
          const parts = originalValues[id].split("-");
          if (parts.length === 3) {
            input.value = originalValues[id]; // dạng yyyy-mm-dd
          }
        } else {
          input.type = "text";
        }

        span.replaceWith(input);
      });

      const saveBtn = document.createElement("button");
      saveBtn.textContent = "Save";
      saveBtn.id = "basic-info-save";
      saveBtn.className = "save-btn";

      const cancelBtn = document.createElement("button");
      cancelBtn.textContent = "Cancel";
      cancelBtn.id = "basic-info-cancel";
      cancelBtn.className = "cancel-btn";
      cancelBtn.style.marginLeft = "10px";

      const btnWrapper = document.createElement("div");
      btnWrapper.classList.add("button-wrapper");
      btnWrapper.style.marginTop = "10px";

      btnWrapper.appendChild(saveBtn);
      btnWrapper.appendChild(cancelBtn);

      // Đặt nút dưới cùng form
      const section = document.getElementById("edit-basic-info-btn");
      section.appendChild(btnWrapper);
      section.classList.add("edit-mode");

      isEditing = true;

      //   Sự kiện save
      saveBtn.addEventListener("click", async () => {
        const formData = {};

        // Thu thập dữ liệu từ input nhưng KHÔNG thay thế thành <span> vội
        fields.forEach(({ id }) => {
          const input = document.getElementById(`${id}-input`);
          if (!input) return;

          formData[id] = input.value.trim();
        });

        // Kiểm tra tuổi
        const birthDate = new Date(formData["birthDate"]);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();

        const isOver18 =
          age > 18 ||
          (age === 18 && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)));

        if (!isOver18) {
          showNotification("You must be 18 years of age to register.");

          // Phục hồi lại các span (khôi phục dữ liệu ban đầu)
          fields.forEach(({ id }) => {
            const input = document.getElementById(`${id}-input`);
            if (!input) return;

            const span = document.createElement("span");
            span.id = id;
            span.textContent = originalValues[id];
            input.replaceWith(span);
          });
          section.classList.remove("edit-mode");
          cleanup();
          return;
        }

        // Nếu hợp lệ: thay thế input bằng span và lưu dữ liệu
        fields.forEach(({ id }) => {
          const input = document.getElementById(`${id}-input`);
          if (!input) return;

          const newSpan = document.createElement("span");
          newSpan.id = id;
          newSpan.textContent = formData[id];
          input.replaceWith(newSpan);
        });

        try {
          const response = await createProfile(
            displayName.textContent,
            null,
            null,
            formData["birthDate"],
            formData["location"],
            null,
            formData["occupation"],
            formData["education"]
          );
          const result = await response.json();
          if (response.ok && result.success) {
            showNotification("Basic information uploaded successfully!");
          } else {
            showNotification("Basic information upload failed!");
          }
        } catch (err) {
          console.error("Error when loading basic information:", err);
          showNotification("An error occurred while loading the bio!");
        }
        section.classList.remove("edit-mode");
        cleanup();
      });

      //   Sự kiện cancel
      cancelBtn.addEventListener("click", () => {
        fields.forEach(({ id }) => {
          const input = document.getElementById(`${id}-input`);
          if (!input) return;

          const span = document.createElement("span");
          span.id = id;
          span.textContent = originalValues[id];
          input.replaceWith(span);
        });
        section.classList.remove("edit-mode");
        cleanup();
      });
    } else {
      document.getElementById("basic-info-cancel")?.click();
    }
  });

  function cleanup() {
    document.getElementById("basic-info-save")?.remove();
    document.getElementById("basic-info-cancel")?.remove();
    document.querySelector(".button-wrapper")?.remove();
    isEditing = false;
  }
}
