import { getDatingUsers, sendLike } from "../../../models/matchModel.js";
import { listenForMessages } from "../message/chatService.js";
import { fetchCurrentUser } from "../../../models/messageModel.js";
import { notificationUpload } from "../../../models/notificationModel.js";
import {
  renderUserCard,
  attachSwipeHandlers,
  showLikeAnimation,
  showSuperLikeAnimation,
  showMatchAnimation,
} from "./uiHandlers.js";

let users = [];
let currentIndex = 0;

export async function loadUsers() {
  try {
    users = await getDatingUsers();

    // XÁO TRỘN MẢNG USERS Fisher-Yates Shuffle
    for (let i = users.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [users[i], users[j]] = [users[j], users[i]];
    }

    currentIndex = -1;
    loadNextCard();
  } catch (error) {
    console.error("Lỗi khi tải danh sách người dùng:", error);
  }
}

export function loadNextCard() {
  if (!users || users.length === 0) return;

  currentIndex = (currentIndex + 1) % users.length;
  const user = users[currentIndex];
  renderUserCard(user);

  // Re-bind swipe gestures to new card
  attachSwipeHandlers(
    () => swipeCard("like"),
    () => swipeCard("dislike"),
    () => swipeCard("super-like")
  );
}

export async function swipeCard(action) {
  const card = document.getElementById("dating-card");
  if (!card) return;

  const toUserId = parseInt(card.dataset.userid);
  const name = card.querySelector(".card-name")?.textContent ?? "someone";

  // 1. Thêm animation
  if (action === "like") {
    card.style.transform = "translateX(100%) rotate(20deg)";
    card.style.opacity = "0";
  } else if (action === "dislike") {
    card.style.transform = "translateX(-100%) rotate(-20deg)";
    card.style.opacity = "0";
  } else if (action === "super-like") {
    card.style.transform = "translateY(-100%) rotate(10deg)";
    card.style.opacity = "0";
  }

  // 2. Gửi like lên server nếu là like hoặc super-like
  let result = {};
  if (action === "like" || action === "super-like") {
    result = await sendLike(toUserId);
  }

  // 3. Animation phản hồi
  if (result.match) {
    showMatchAnimation(name);

    const data = await fetchCurrentUser();
    const currentUserId = data.user.id;
    // console.log(currentUserId);
    const otherUserId = users[currentIndex]["user_id"];
    const chatId =
      currentUserId < otherUserId
        ? `${currentUserId}_${otherUserId}`
        : `${otherUserId}_${currentUserId}`;

    listenForMessages(chatId, null, currentUserId);
    await notificationUpload("new_match", {
      chatId,
      sender: otherUserId,
      timestamp: Date.now(),
      text: `${name} just matched with you!`,
    });
  } else if (action === "like") {
    showLikeAnimation();
  } else if (action === "super-like") {
    showSuperLikeAnimation();
  }

  // 4. Load thẻ tiếp theo
  setTimeout(() => {
    loadNextCard();
  }, 600);
}

export function showNextCard() {
  const hiddenCards = document.querySelectorAll(".user-card.hidden");
  if (hiddenCards.length > 0) {
    hiddenCards[0].classList.remove("hidden");
    hiddenCards[0].classList.add("show");
  }
}
