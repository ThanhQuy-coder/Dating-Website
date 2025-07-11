import { fetchCurrentUser } from "../../../models/messageModel.js";
import { loadProfileOther } from "../profile/profileViewOrther.js";
import { setCurrentChatUser, getChatProfiles } from "./messageHandler.js";
import { sendMessage, listenForMessages } from "./chatService.js";
import { initReportUsers } from "./reportUser/reportViewModel.js";
import { initBlockUsers } from "./blockUser/blockViewModel.js";
import { showTab } from "../tabControl.js";
import { listenToBlockStatus } from "../message/blockUser/blockService.js";
import {
  ref,
  set,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { db } from "../../../assets/js/firebase_config.js";

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
      // console.log("Bạn là user ID:", currentUserId);
    } else {
      console.error("Lỗi xác thực:", data.error);
    }
  } catch (err) {
    console.error("Lỗi khi gọi get-user.php:", err);
  }
}

// Gửi tin nhắn
let listenersAttached = false; // Cờ kiểm tra đã gắn sự kiện chưa

function setupMessageInputListeners() {
  const sendBtn = document.getElementById("chat-send-btn");
  const input = document.getElementById("chat-input");

  // Đảm bảo không gắn trùng listener
  if (sendBtn && !sendBtn.dataset.listenerAttached) {
    sendBtn.addEventListener("click", handleSendMessage);
    sendBtn.dataset.listenerAttached = "true";
  }

  if (input && !input.dataset.listenerAttached) {
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleSendMessage();
      }
    });
    input.dataset.listenerAttached = "true";
  }
}

setupMessageInputListeners();

function handleSendMessage() {
  const input = document.getElementById("chat-input");
  const text = input.value.trim();

  if (!text || !currentUserId || !window.currentChatUserId) return;

  const profiles = getChatProfiles();
  const currentChatProfile = Object.values(profiles).find(
    (profile) => profile.user_id === window.currentChatUserId
  );

  // Kiểm tra block
  if (currentChatProfile?.block === true) {
    alert("You can't message this person because they have been blocked.");
    return;
  }

  const chatId = [currentUserId, window.currentChatUserId].sort().join("_");
  sendMessage(chatId, currentUserId, text);
  input.value = "";
}

// UI: Hiển thị chat mới
function showNewMessage(msg) {
  const chatBody = document.getElementById("chat-body");
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${
    msg.sender == currentUserId ? "self" : "other"
  }`;
  messageDiv.innerHTML = `
     <div class="message-content">${msg.text}</div>
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

  listenToBlockStatus(currentUserId, profile.user_id, (isBlocked) => {
    const input = document.getElementById("chat-input");
    if (isBlocked) {
      alert("You have been blocked by this user.");
      input.disabled = true;
      input.placeholder = "You are blocked";
    } else {
      input.disabled = false;
      input.placeholder = "Type your message...";
    }
  });

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
  listenForMessages(chatId, showNewMessage, currentUserId);
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

// Chat options menu
export function toggleChatOptions() {
  const existingMenu = document.querySelector(".chat-options-menu");
  if (existingMenu) {
    closeChatOptions();
    return;
  }

  const menu = document.createElement("div");
  menu.className = "chat-options-menu";
  menu.innerHTML = `
    <div class="chat-options-overlay" onclick="closeChatOptions()"></div>
    <div class="chat-options-content">
      <div class="chat-option-item" onclick="viewProfile()">
        <i class="fas fa-user"></i>
        <span>View Profile</span>
      </div>
      <div class="chat-option-item danger" onclick="blockUser()">
        <i class="fas fa-ban"></i>
        <span>Block User</span>
      </div>
      <div class="chat-option-item danger" id="report-user" onclick="reportUser()">
        <i class="fas fa-flag"></i>
        <span>Report User</span>
      </div>
    </div>
  `;
  document.body.appendChild(menu);
}

window.toggleChatOptions = toggleChatOptions;

export function viewProfile() {
  closeChatOptions();

  if (!window.currentChatUserId) {
    console.error("Không có user đang được chọn");
    return;
  }
  try {
    loadProfileOther(window.currentChatUserId);
  } catch (err) {
    console.error(err);
  }
  showTab("profile");
}

export function blockUser() {
  closeChatOptions();

  if (!window.currentChatUserId) {
    console.error("Không có user đang được chọn để báo cáo.");
    return;
  }

  const confirmed = confirm(`Are you sure?`);

  if (confirmed) {
    initBlockUsers(window.currentChatUserId);
    blockOnFirebase(currentUserId, window.currentChatUserId);
  }
}

export function reportUser() {
  closeChatOptions();

  if (!window.currentChatUserId) {
    console.error("Không có user đang được chọn để báo cáo.");
    return;
  }

  const confirmed = prompt(
    `Report ${currentChatUser} for inappropriate behavior? Please enter your reason`
  );

  if (confirmed !== null) {
    initReportUsers(window.currentChatUserId, confirmed);
  } else {
    console.log("Người dùng đã huỷ");
  }
}

function closeChatOptions() {
  const menu = document.querySelector(".chat-options-menu");
  if (menu) {
    document.body.removeChild(menu);
  }
}

function blockOnFirebase(currentUserId, blockedId) {
  const blockRef = ref(db, `blocks/${currentUserId}/${blockedId}`);
  return set(blockRef, true);
}

window.reportUser = reportUser;
window.blockUser = blockUser;
window.viewProfile = viewProfile;
