import {
  getListNotification,
  getAvatar,
} from "../../../models/notificationModel.js";
import { openChatFromMatch } from "../message/messageUI.js";
import { isReadNotification } from "../../../models/notificationModel.js";
import { showIndividualChat, showTab } from "../../dashboard/tabControl.js";

/**
 * Tải và hiển thị danh sách thông báo ở sidebar (nav) và tab chính (main)
 */
export async function loadNotifications(chatProfiles = {}) {
  const sidebar = document.getElementById("notifications-sidebar");
  if (!sidebar) return;
  const tabContent = document.querySelector(
    "#notifications-tab .notifications-content"
  );

  if (!sidebar || !tabContent) return;

  try {
    const res = await getListNotification();
    if (!res.success || !res.notifications) {
      sidebar.innerHTML += "<p>Không có thông báo nào.</p>";
      tabContent.innerHTML += "<p>Không có thông báo nào.</p>";
      return;
    }

    // Xóa thông báo cũ ở cả 2 nơi
    sidebar.querySelectorAll(".match-item").forEach((el) => el.remove());
    tabContent
      .querySelectorAll(".notification-item")
      .forEach((el) => el.remove());

    res.notifications.forEach(async (notification) => {
      const data = JSON.parse(notification.data);
      const avatarRes = await getAvatar(data.sender);
      const avatarPath =
        Array.isArray(avatarRes) && avatarRes.length > 0
          ? avatarRes[0].avatar_url
          : "";
      const fileName = basename(avatarPath);
      const imageUrl = `/api/user/profile/serve_image.php?user=${
        data.sender
      }&file=${encodeURIComponent(fileName)}`;
      const timeFormatted = formatTime(data.timestamp);

      // Tìm username từ senderId
      const entry = Object.entries(chatProfiles).find(
        ([, profile]) => profile.user_id === data.sender
      );
      const username = entry ? entry[0] : null;

      // Giao diện match-item (sidebar)
      const sidebarItem = document.createElement("div");
      sidebarItem.className = "match-item";
      sidebarItem.onclick = () =>
        handleNotificationClick(username, notification.id);
      sidebarItem.innerHTML = `
        <img src="${imageUrl}" alt="Notification" class="match-avatar" />
        <div class="match-info">
          <h4>${
            notification.type === "new_message"
              ? "New message! 💬"
              : "New Match! ❤️"
          }</h4>
          <p>${data.text || "Bạn có thông báo mới"}</p>
        </div>
        <div class="match-time">${timeFormatted}</div>
      `;
      sidebar.appendChild(sidebarItem);

      // 🔹 Giao diện notification-item (main tab)
      const tabItem = document.createElement("div");
      tabItem.className = "notification-item";
      tabItem.innerHTML = `
        <img src="${imageUrl}" alt="Notification" class="notification-avatar" />
        <div class="notification-content">
          <h4>${
            notification.type === "new_message"
              ? "New Message 💬"
              : "New Match! ❤️"
          }</h4>
          <p>${data.text || "Bạn có thông báo mới"}</p>
        </div>
        <div class="notification-time">${timeFormatted}</div>
      `;
      tabContent.appendChild(tabItem);
    });
  } catch (err) {
    console.error("Lỗi khi tải thông báo:", err);
    sidebar.innerHTML += "<p>Lỗi khi tải thông báo.</p>";
    tabContent.innerHTML += "<p>Lỗi khi tải thông báo.</p>";
  }
}

/**
 * Định dạng thời gian
 */
function formatTime(timestamp) {
  const diff = Date.now() - timestamp;
  if (!timestamp || isNaN(timestamp)) return "Không rõ";
  if (diff < 60000) return "vừa xong";
  if (diff < 3600000) return `${Math.floor(diff / 60000)} phút trước`;
  return `${Math.floor(diff / 3600000)} giờ trước`;
}

function basename(path) {
  if (typeof path !== "string") return "";
  return path.split("/").pop();
}

export async function handleNotificationClick(username, id) {
  // 1. Chuyển sang tab messages
  showTab("messages");
  // console.log(id);
  // 2. Mở giao diện chat cá nhân
  showIndividualChat();

  // 3. Mở đoạn chat tương ứng
  openChatFromMatch(username);

  // 4. Ẩn thông báo (nếu muốn ẩn thêm UI khác thì thêm ở đây)
  const notificationsSidebar = document.getElementById("notifications-sidebar");
  const notificationsTab = document.getElementById("notifications-tab");

  notificationsSidebar?.classList.remove("active");
  notificationsTab?.classList.remove("active");

  try {
    // Cập nhật đã đọc thông báo
    const res = await isReadNotification(id);
    const result = await res;

    if (result.success) {
      showNotification("Notice read");
    } else {
      console.log("Đọc thông báo thất bại");
    }
  } catch (err) {
    console.error("Lỗi khi đọc thông báo" + err);
    showNotification(err);
  }
}
