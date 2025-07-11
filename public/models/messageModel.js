import { setChatProfiles } from "/viewmodels/dashboard/message/messageHandler.js";
const BASE_URL = "/api/";

export async function initMessages() {
  try {
    const res = await fetch(BASE_URL + "user/message/list.php");
    const data = await res.json();

    if (data.error) throw new Error(data.error);

    setChatProfiles(data);
  } catch (error) {
    console.error("Lỗi khi tải danh sách chat:", error);
  }
}

export async function fetchMessageList() {
  return await fetch(BASE_URL + "user/message/list.php");
}

export async function fetchCurrentUser() {
  try {
    const res = await fetch(BASE_URL + "user/message/get-user.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if (!res.ok) throw new Error("Failed to send.");

    return await res.json();
  } catch (err) {
    console.error("Lỗi khi gửi:", err);
    return { error: true };
  }
}
