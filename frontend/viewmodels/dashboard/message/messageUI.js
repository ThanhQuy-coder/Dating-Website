import { fetchCurrentUser } from "../../../models/messageModel.js";
import { setCurrentChatUser, getChatProfiles } from "./messageHandler.js";
import { sendMessage, listenForMessages } from "./chatService.js";
import { showTab } from "../tabControl.js";

document.addEventListener("DOMContentLoaded", async () => {
  await getCurrentUser();
});

let currentUserId = null;
window.currentChatUserId = null; // người đang chat

// Lấy thông tin user hiện tại
async function getCurrentUser() {
  try {
    const data = await fetchCurrentUser();
    if (data.success) {
      currentUserId = data.user.id;
      console.log("Bạn là user ID:", currentUserId);
    } else {
      console.error("Lỗi xác thực:", data.error);
    }
  } catch (err) {
    console.error("Lỗi khi gọi get-user.php:", err);
  }
}

// Gửi tin nhắn
document.getElementById("chat-send-btn").addEventListener("click", () => {
  const input = document.getElementById("chat-input");
  const text = input.value.trim();
  if (text && currentUserId && window.currentChatUserId) {
    const chatId = [currentUserId, window.currentChatUserId].sort().join("_");
    sendMessage(chatId, currentUserId, text);
    input.value = "";
  }
});

// UI: Hiển thị chat mới
function showNewMessage(msg) {
  const chatBody = document.getElementById("chat-body");
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${
    msg.sender == currentUserId ? "self" : "other"
  }`;
  messageDiv.innerHTML = `
    ${msg.text}
    <div class="message-time">${new Date(
      msg.timestamp
    ).toLocaleTimeString()}</div>
  `;
  chatBody.appendChild(messageDiv);
  chatBody.scrollTop = chatBody.scrollHeight;
}

// UI: Show chat list
export function showChatList() {
  document.getElementById("chat-list-view").style.display = "flex";
  document.getElementById("individual-chat-view").style.display = "none";
}

// UI: Show 1-on-1 chat
export function showIndividualChat() {
  document.getElementById("chat-list-view").style.display = "none";
  document.getElementById("individual-chat-view").style.display = "flex";
}

// Mở chat từ trang Match
export function openChatFromMatch(name) {
  openChat(name);
  showTab("messages");
  showIndividualChat();
}

// Mở chat từ danh sách
export function openChatFromList(name, event = window.event) {
  if (!event) return;
  document.querySelectorAll(".chat-list-item").forEach((item) => {
    item.classList.remove("active");
  });
  event.target.closest(".chat-list-item")?.classList.add("active");

  openChat(name);
  showIndividualChat();
}

// Mở 1 cuộc chat
export function openChat(name) {
  setCurrentChatUser(name);
  const chatProfiles = getChatProfiles();
  const profile = chatProfiles[name];
  if (!profile) return;

  window.currentChatUserId = profile.user_id;

  const chatId = [currentUserId, profile.user_id].sort().join("_");
  const chatName = document.getElementById("current-chat-name");
  const chatStatus = document.getElementById("current-chat-status");
  const chatAvatar = document.querySelector(".chat-avatar");
  const chatBody = document.getElementById("chat-body");

  if (chatName) chatName.textContent = name;
  if (chatStatus) chatStatus.textContent = profile.status;
  if (chatAvatar) chatAvatar.src = profile.avatar;
  if (chatBody) chatBody.innerHTML = "";

  // Lắng nghe tin nhắn
  listenForMessages(chatId, showNewMessage);
}

export function renderChatList(profiles) {
  const container = document.querySelector(".chat-list-content");
  container.innerHTML = "";

  Object.entries(profiles).forEach(([name, profile]) => {
    const div = document.createElement("div");
    div.className = "chat-list-item";
    div.onclick = (e) => openChatFromList(name, e);

    div.innerHTML = `
      <div class="chat-list-avatar-container">
        <img src="${profile.avatar}" alt="${name}" class="chat-list-avatar" />
        <div class="online-indicator"></div>
      </div>
      <div class="chat-list-info">
        <div class="chat-list-name">${name}</div>
        <div class="chat-list-message">${profile.lastMessage || ""}</div>
      </div>
      <div class="chat-list-meta">
        <div class="chat-list-time">${formatTime(profile.time)}</div>
      </div>
    `;

    container.appendChild(div);
  });
}

// Hiển thị thời gian
function formatTime(timestamp) {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const now = new Date();
  const diff = (now - date) / 1000;

  if (diff < 60) return "Just now";
  if (diff < 3600) return Math.floor(diff / 60) + "m";
  if (diff < 86400) return Math.floor(diff / 3600) + "h";
  return date.toLocaleDateString();
}

// render danh sách match
export function renderMatchesSidebar() {
  const matchContainer = document.getElementById("matches-sidebar");
  if (!matchContainer) return;

  const profiles = getChatProfiles();

  // Xóa các item cũ (nếu có)
  matchContainer
    .querySelectorAll(".match-item")
    .forEach((item) => item.remove());

  Object.entries(profiles).forEach(([name, profile]) => {
    const matchItem = document.createElement("div");
    matchItem.className = "match-item";
    matchItem.onclick = () => openChatFromMatch(name);

    matchItem.innerHTML = `
      <div style="position: relative">
        <img src="${profile.avatar}" alt="${name}" class="match-avatar" />
        <div class="online-indicator"></div>
      </div>
      <div class="match-info">
        <h4>${name}</h4>
        <p>${profile.lastMessage || "Say hi!"}</p>
      </div>
      <div class="match-time">${profile.time || ""}</div>
    `;

    matchContainer.appendChild(matchItem);
  });
}
