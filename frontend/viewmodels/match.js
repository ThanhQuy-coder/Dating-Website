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
  // Lưu tên tab vào localStorage
  localStorage.setItem("activeTab", tabName);

  // Nếu tab là notification, setting hoặc premium, chỉ cần hiển thị tab đó
  // và không cần ẩn các tab khác
  if (
    tabName === "notification" ||
    tabName === "setting" ||
    tabName === "premium"
  ) {
    showTabNav(tabName);
    return;
  }

  // Ẩn tất cả các tab
  const tabs = document.querySelectorAll(".tab-content");
  tabs.forEach((tab) => (tab.style.display = "none"));
  showTabNav(tabName);
  function showTabNav(tabNameNav) {
    // Ẩn tab ở thanh điều hướng bên trái
    const navTabs = document.querySelectorAll(".nav-tab");
    navTabs.forEach((tab) => (tab.style.display = "none"));

    document.getElementById("nav-" + tabName + "-tab").style.display = "block";
  }

  // Hiện tab được chọn
  document.getElementById(tabName + "-tab").style.display = "block";
}

// ----- Lắng nghe sự kiện tải lại trang -----
window.addEventListener("DOMContentLoaded", () => {
  const savedTab = localStorage.getItem("activeTab") || "match";
  showTab(savedTab);
});
