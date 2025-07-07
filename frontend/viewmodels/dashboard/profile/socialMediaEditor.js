import { setSocialLinks, getSocialLinks } from "../../../models/userModel.js";

export function setupSocialMedia() {
  const connectBtn = document.getElementById("connect-social-btn");
  const socialOptions = document.getElementById("social-media-options");
  const saveBtn = document.getElementById("save-social-btn");
  const cancelBtn = document.getElementById("cancel-social-btn");

  socialOptions.style.display = "block";
  loadingSocialMedia();

  document.querySelectorAll(".connect-btn").forEach((btn) => {
    btn.style.display = "none";
  });
  if (saveBtn) saveBtn.style.display = "none";
  if (cancelBtn) cancelBtn.style.display = "none";

  if (connectBtn) {
    let isEditingSocial = false;
    connectBtn.addEventListener("click", () => {
      socialOptions.style.display = "block";

      if (!isEditingSocial) {
        isEditingSocial = true;

        document.querySelectorAll(".connect-btn").forEach((btn) => {
          btn.style.display = "inline-block";
        });
        if (saveBtn) saveBtn.style.display = "inline-block";
        if (cancelBtn) cancelBtn.style.display = "inline-block";

        document.querySelectorAll(".info-row").forEach((row) => {
          const input = row.querySelector("input.social-input");
          const link = row.querySelector("a.social-link");
          if (input && link) {
            link.style.display = "none";
            input.style.display = "inline-block";
            input.removeAttribute("readonly");
          }
        });
      } else {
        isEditingSocial = false;

        document.querySelectorAll(".connect-btn").forEach((btn) => {
          btn.style.display = "none";
        });
        if (saveBtn) saveBtn.style.display = "none";
        if (cancelBtn) cancelBtn.style.display = "none";

        document.querySelectorAll(".info-row").forEach((row) => {
          const input = row.querySelector("input.social-input");
          const link = row.querySelector("a.social-link");
          if (input && link) {
            input.setAttribute("readonly", true);
            input.style.display = "none";
            link.innerText = input.value;
            link.href = input.value.startsWith("http")
              ? input.value
              : "https://" + input.value;
            link.style.display = "inline";
          }
        });
      }
    });
  }

  const connectButtons = document.querySelectorAll(".connect-btn");
  connectButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const platform = btn.dataset.platform;
      const row = btn.closest(".info-row");
      const content = row.querySelector(".info-content");

      if (btn.innerText === "Add") {
        btn.innerText = "Delete";
        row.classList.add("connected");

        if (!row.querySelector("input")) {
          const input = document.createElement("input");
          input.className = "social-input";
          input.placeholder = `Enter link ${platform}`;
          input.name = platform;
          content.appendChild(input);
        }
      } else {
        btn.innerText = "Add";
        row.classList.remove("connected");

        const input = row.querySelector("input");
        const link = row.querySelector("a");
        if (input) input.remove();
        if (link) link.remove();
      }
    });
  });

  if (saveBtn) {
    saveBtn.addEventListener("click", async () => {
      const inputs = document.querySelectorAll(".social-input");
      const socialLinks = {};

      inputs.forEach((input) => {
        const platform = input.name;
        const url = input.value.trim();
        if (url) {
          socialLinks[platform] = url;
        }
      });

      try {
        const response = await setSocialLinks(socialLinks);
        const result = await response.json();

        if (response.ok && result.success) {
          showNotification("Link saved successfully!");
        } else {
          showNotification(
            "Save failed: " + (result.message || "Unknown error!"),
            true
          );
        }
      } catch (err) {
        console.error("Lỗi fetch:", err);
        showNotification("An error occurred while saving the link!", true);
      }

      document.querySelectorAll(".connect-btn").forEach((btn) => {
        btn.style.display = "none";
      });
      if (saveBtn) saveBtn.style.display = "none";
      if (cancelBtn) cancelBtn.style.display = "none";

      document.querySelectorAll(".info-row").forEach((row) => {
        const input = row.querySelector("input.social-input");
        const link = row.querySelector("a.social-link");

        if (input && link) {
          input.setAttribute("readonly", true);
          input.style.display = "none";
          link.innerText = input.value;
          link.href = input.value.startsWith("http")
            ? input.value
            : "https://" + input.value;
          link.style.display = "inline";
        }
      });
    });

    loadingSocialMedia();
  }

  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      document.querySelectorAll(".info-row").forEach((row) => {
        row.classList.remove("connected");

        const input = row.querySelector("input");
        const link = row.querySelector("a");
        if (input) input.remove();
        if (link) link.remove();

        const btn = row.querySelector(".connect-btn");
        if (btn) {
          btn.innerText = "Add";
          btn.style.display = "none";
        }
      });

      if (saveBtn) saveBtn.style.display = "none";
      if (cancelBtn) cancelBtn.style.display = "none";

      // Reload lại dữ liệu ban đầu
      loadingSocialMedia();
    });
  }
}

async function loadingSocialMedia() {
  try {
    const response = await getSocialLinks();
    const result = await response.json();

    if (
      response.ok &&
      result.success &&
      typeof result.data === "object" &&
      result.data !== null
    ) {
      const links = Object.entries(result.data);

      links.forEach(([platform, url]) => {
        const row = document.querySelector(
          `.info-row[data-platform="${platform}"]`
        );
        if (!row) return;

        const content = row.querySelector(".info-content");
        content.innerHTML = "";

        const link = document.createElement("a");
        link.href = url.startsWith("http") ? url : "https://" + url;
        link.target = "_blank";
        link.className = "social-link";
        link.innerText = url;
        link.style.display = "inline";

        const input = document.createElement("input");
        input.className = "social-input";
        input.name = platform;
        input.value = url;
        input.setAttribute("readonly", true);
        input.style.display = "none";

        content.appendChild(link);
        content.appendChild(input);

        row.classList.add("connected");

        const btn = row.querySelector(".connect-btn");
        if (btn) {
          btn.innerText = "Delete";
        }
      });
    } else {
      console.warn("No social links found or failed to load.");
    }
  } catch (err) {
    console.error("Lỗi khi lấy dữ liệu social links:", err);
    showNotification("An error occurred while loading the social links!", true);
  }
}
