let currentChatUser = null;
let chatProfiles = {}; // lấy từ server khi load trang

export function setCurrentChatUser(name) {
  currentChatUser = name;
}

export function getCurrentChatUser() {
  return currentChatUser;
}

export function setChatProfiles(data) {
  chatProfiles = data;
}

export function getChatProfiles() {
  return chatProfiles;
}
