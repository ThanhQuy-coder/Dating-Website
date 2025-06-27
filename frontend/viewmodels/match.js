// ----- Hàm khởi tạo carousel ảnh tự động -----
function initCarousel(selector, interval = 10000) {
  const img = document.querySelector(selector);
  if (!img || !img.dataset.images) return;

  const images = img.dataset.images.split(",");
  let current = 0;

  function showNextImage() {
    current = (current + 1) % images.length;
    img.src = images[current];
  }

  setInterval(showNextImage, interval);
}

// ----- Hàm khởi tạo animation cho nút like -----
function initLikeAnimation(
  selector,
  animationClass = "animate",
  duration = 300
) {
  const likeBtn = document.querySelector(selector);
  if (!likeBtn) return;

  likeBtn.addEventListener("click", () => {
    likeBtn.classList.add(animationClass);
    setTimeout(() => {
      likeBtn.classList.remove(animationClass);
    }, duration);
  });
}

// ----- Hàm chạy khi DOM đã sẵn sàng -----
document.addEventListener("DOMContentLoaded", () => {
  initCarousel(".carousel-img", 10000); // 10 giây đổi ảnh
  initLikeAnimation(".like");
});

// ----- conditional rendering -----
function showTab(tabName = "match") {
  // 1. Lưu tab hiện tại
  localStorage.setItem("activeTab", tabName);

  // 2. Ẩn toàn bộ nội dung chính (tab-content)
  document.querySelectorAll(".tab-content").forEach((tab) => {
    tab.style.display = "none";
  });

  // 3. Ẩn toàn bộ tab ở thanh nav (nav-tab)
  document.querySelectorAll(".nav-tab").forEach((nav) => {
    nav.style.display = "none";
  });

  // 4. Hiện nội dung và nav tương ứng nếu có
  if (tabName === "notification") {
    const content = document.getElementById("match-tab");
    content.style.display = "block";
    const nav = document.getElementById(`nav-${tabName}-tab`);
    nav.style.display = "block";
    return;
  }
  const content = document.getElementById(`${tabName}-tab`);
  const nav = document.getElementById(`nav-${tabName}-tab`);

  if (content) content.style.display = "block";
  if (nav) nav.style.display = "block";
}

// ----- Hàm hiển thị phần cài đặt chat -----
function setupChatSettingToggle() {
  const chatPage = document.getElementById("chat");
  const settingPage = document.getElementById("setting-chat");

  const toggleButton = document.getElementById("toggle-chat-setting");
  const backButton = document.getElementById("back-to-chat");

  if (toggleButton) {
    toggleButton.addEventListener("click", () => {
      const isChatVisible =
        window.getComputedStyle(chatPage).display !== "none";

      if (isChatVisible) {
        chatPage.style.display = "none";
        settingPage.style.display = "block";
        settingChatPage(true);
        localStorage.setItem("activeChatPage", "setting");
      } else {
        chatPage.style.display = "block";
        settingPage.style.display = "none";
        settingChatPage(false);
        localStorage.setItem("activeChatPage", "chat");
      }
    });
  }

  if (backButton) {
    backButton.addEventListener("click", () => {
      chatPage.style.display = "flex";
      settingPage.style.display = "none";
      settingChatPage(false);
      localStorage.setItem("activeChatPage", "chat");
    });
  }
}

// ----- Lắng nghe sự kiện tải lại trang -----
window.addEventListener("DOMContentLoaded", () => {
  setupChatSettingToggle();
  const savedTab = localStorage.getItem("activeTab") || "match";
  showTab(savedTab);
});
