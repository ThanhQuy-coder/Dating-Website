import { fetchMessageList } from "../../../models/messageModel.js";
import { setChatProfiles } from "./messageHandler.js";
import { renderChatList, renderMatchesSidebar } from "./messageUI.js";

export async function initMessages() {
  try {
    const res = await fetchMessageList();
    const data = await res.json();

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

    setChatProfiles(profiles);
    renderChatList(profiles);
    renderMatchesSidebar();
  } catch (error) {
    console.error("Lỗi khi tải danh sách chat:", error);
  }
}

function basename(path) {
  if (!path || typeof path !== "string") return "";
  return path.split("/").pop();
}
