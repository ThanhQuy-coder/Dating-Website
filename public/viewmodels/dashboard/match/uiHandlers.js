import { openChatFromMatch } from "../message/messageUI.js";

// ==============================
// Hiển thị thẻ hồ sơ người dùng
// ==============================
export function renderUserCard(user) {
  const cardContainer = document.querySelector(".card-container");
  if (!cardContainer) return;

  cardContainer.innerHTML = "";

  const birthDate = new Date(user.birth_date);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;

  let imageUrl = "/default-avatar.png";
  if (user.avatar_url) {
    imageUrl = `/api/user/profile/serve_image.php?user=${
      user.user_id
    }&file=${encodeURIComponent(basename(user.avatar_url))}`;
  }

  const hobbiesHTML = user.hobbies
    .split(",")
    .map((hobby) => `<span class="hobby-tag">${hobby.trim()}</span>`)
    .join("");

  const card = document.createElement("div");
  card.classList.add("dating-card");
  card.id = "dating-card";
  card.setAttribute("data-userid", user.user_id);

  card.innerHTML = `
    <img src="${imageUrl}" alt="Profile" class="card-image" />
    <div class="card-gradient"></div>
    <div class="card-info">
      <div class="card-name">${user.full_name}</div>
      <div class="card-details">${age} years old • ${
    user.distance ?? "?"
  }km away</div>
      <div class="card-hobbies">${hobbiesHTML}</div>
    </div>
  `;

  card.style.animation = "slideIn 0.6s ease-out";
  setTimeout(() => (card.style.animation = ""), 600);

  cardContainer.appendChild(card);
}

// ==============================
// Swipe gesture cho mobile/PC
// ==============================
export function attachSwipeHandlers(onLike, onDislike, onSuperLike) {
  const card = document.getElementById("dating-card");
  if (!card) return;

  let startX = 0,
    startY = 0,
    currentX = 0,
    currentY = 0,
    isDragging = false;

  function start(e) {
    isDragging = true;
    startX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
    startY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;
  }

  function move(e) {
    if (!isDragging) return;
    e.preventDefault();
    currentX =
      (e.type === "touchmove" ? e.touches[0].clientX : e.clientX) - startX;
    currentY =
      (e.type === "touchmove" ? e.touches[0].clientY : e.clientY) - startY;

    const rotation = currentX * 0.1;
    const opacity = 1 - Math.abs(currentX) / 300;
    card.style.transform = `translateX(${currentX}px) translateY(${currentY}px) rotate(${rotation}deg)`;
    card.style.opacity = Math.max(opacity, 0.5);
  }

  function end() {
    if (!isDragging) return;
    isDragging = false;

    const threshold = 100;
    if (Math.abs(currentX) > threshold) {
      currentX > 0 ? onLike() : onDislike();
    } else if (currentY < -threshold) {
      onSuperLike();
    } else {
      card.style.transform = "";
      card.style.opacity = "";
    }
  }

  card.addEventListener("touchstart", start, { passive: false });
  card.addEventListener("touchmove", move, { passive: false });
  card.addEventListener("touchend", end, { passive: false });

  card.addEventListener("mousedown", start);
  card.addEventListener("mousemove", move);
  card.addEventListener("mouseup", end);
  card.addEventListener("mouseleave", end);
}

// ==============================
// Hiệu ứng animation: like / super like / match
// ==============================
export function showLikeAnimation() {
  showFloatingIcon("❤️", "#ff6b9d");
}

export function showSuperLikeAnimation() {
  showFloatingIcon("⭐", "#74b9ff");
}

export function showMatchAnimation(name = "your match", userId = null) {
  const overlay = document.createElement("div");
  overlay.className = "match-overlay";
  overlay.innerHTML = `
    <div class="match-content">
      <h2>It's a Match! 💕</h2>
      <p>You and ${name} liked each other</p>
      <div class="match-actions">
        <button class="match-btn secondary" id="keepSwipingBtn">Keep Swiping</button>
        <button class="match-btn primary" id="sendMessageBtn">Send Message</button>
      </div>
    </div>
  `;

  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 107, 157, 0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    animation: fadeIn 0.5s ease-out;
  `;

  document.body.appendChild(overlay);

  document.getElementById("keepSwipingBtn")?.addEventListener("click", () => {
    overlay.remove();
  });

  document.getElementById("sendMessageBtn")?.addEventListener("click", () => {
    overlay.remove();
    openChatFromMatch(name); // Tên người dùng từ hồ sơ match
  });
}

// ==============================
// Hàm hỗ trợ hiệu ứng nổi
// ==============================
function showFloatingIcon(icon, color) {
  const floatingIcon = document.createElement("div");
  floatingIcon.textContent = icon;
  floatingIcon.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 60px;
    color: ${color};
    z-index: 1000;
    animation: floatUp 1s ease-out forwards;
    pointer-events: none;
  `;

  document.body.appendChild(floatingIcon);
  setTimeout(() => document.body.removeChild(floatingIcon), 1000);
}

// ==============================
// Hàm đóng overlay match
// ==============================
function closeMatchOverlay() {
  const overlay = document.querySelector(".match-overlay");
  if (overlay) {
    overlay.style.animation = "fadeOut 0.3s ease-out";
    setTimeout(() => document.body.removeChild(overlay), 300);
  }
}
// ==============================
// Tiện ích phụ
// ==============================
function basename(path) {
  return path.split("/").pop();
}
