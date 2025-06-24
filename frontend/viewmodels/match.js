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
  if (tabName === "messages") {
    // Ẩn tất cả các tab
    const tabs = document.querySelectorAll(".tab-content");
    tabs.forEach((tab) => (tab.style.display = "none"));
  }
  // Ẩn tab ở thanh điều hướng bên trái
  const navTabs = document.querySelectorAll(".nav-tab");
  navTabs.forEach((tab) => (tab.style.display = "none"));

  // Hiện tab được chọn
  document.getElementById(tabName + "-tab").style.display = "block";
}

// ----- Lắng nghe sự kiện tải lại trang -----
window.addEventListener("DOMContentLoaded", () => {
  const savedTab = localStorage.getItem("activeTab") || "match";
  showTab(savedTab);
});

// ----- Hàm xử lý sự kiện active giữa các nút -----
// Khi người dùng nhấn vào một tab, hàm này sẽ được gọi để đánh dấu tab đó là active
// Hoạt động ở cả thanh điều hướng bên trái và các tab nội dung
function setActive(element) {
  // Xóa class active khỏi tất cả các tab
  const tabs = document.querySelectorAll(".tab-btn");
  tabs.forEach((tab) => tab.classList.remove("active"));

  // Thêm class active cho tab được nhấn
  element.classList.add("active");
}
