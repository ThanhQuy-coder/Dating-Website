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
