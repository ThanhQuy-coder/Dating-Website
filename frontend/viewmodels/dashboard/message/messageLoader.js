import {
  fetchMessageList,
  fetchCurrentUser,
} from "../../../models/messageModel.js";
import { setChatProfiles } from "./messageHandler.js";
import { renderChatList, renderMatchesSidebar } from "./messageUI.js";
import { listenForMessages } from "./chatService.js";
import { loadNotifications } from "../notification/notificationLoader.js";

export async function initMessages() {
  try {
    const res = await fetchMessageList();
    const data = await res.json();
    let currentUserId = null;

    if (data.error) throw new Error(data.error);

    const profiles = {};

    Object.entries(data).forEach(([name, profile]) => {
      const avatarFile = basename(profile.avatar_url || "");
      const avatarUrl = profile.avatar_url
        ? `/api/user/profile/serve_image.php?user=${
            profile.user_id
          }&file=${encodeURIComponent(avatarFile)}`
        : "/default-avatar.png";

      profiles[name] = {
        avatar: avatarUrl,
        status: profile.status || "Active now",
        messages: profile.messages || [],
        user_id: profile.user_id,
        lastMessage: profile.last_message || "",
        time: profile.last_time || "",
      };
    });

    // Lấy thông tin user hiện tại
    try {
      const data = await fetchCurrentUser();
      if (data.success) {
        currentUserId = data.user.id;
        console.log("Lấy id hiện tại thành công");
      } else {
        console.error("Lỗi xác thực:", data.error);
      }
    } catch (err) {
      console.error("Lỗi khi gọi get-user.php:", err);
    }

    Object.values(profiles).forEach((profile) => {
      const chatId = [currentUserId, profile.user_id].sort().join("_");

      // Lắng nghe tất cả các cuộc chat để biết có tin nhắn mới
      listenForMessages(
        chatId,
        null,
        currentUserId,
        (senderName, message) => {
          loadNotifications(profiles);
        },
        profiles
      );
    });

    setChatProfiles(profiles);
    renderChatList(profiles);
    renderMatchesSidebar();
  } catch (error) {
    console.error("Lỗi khi tải danh sách chat:", error);
  }
}

export function basename(path) {
  if (!path || typeof path !== "string") return "";
  return path.split("/").pop();
}
