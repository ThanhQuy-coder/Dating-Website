// dashboard
import { checkAuth } from "./dashboard/auth.js";
import { setupLogout } from "./dashboard/logoutHandler.js";
// dashboard/profile
import { loadProfile } from "./dashboard/profile/profileView.js";
import { setupAvatarUpload } from "./dashboard/profile/avatarHandler.js";
import { setupBioEditor } from "./dashboard/profile/bioEditor.js";
import { setupBasicInfoEditor } from "./dashboard/profile/basicInfoEditor.js";
import { setupSocialMedia } from "./dashboard/profile/socialMediaEditor.js";

// dashboard/match
import { loadUsers, swipeCard } from "./dashboard/match/loadUsers.js";
// dashboard/message
import { initMessages } from "./dashboard/message/messageLoader.js";

document.addEventListener("DOMContentLoaded", () => {
  initAuth();
  initProfileSection();
  initMatchSection();
  initMessages();
});

function initAuth() {
  checkAuth();
  setupLogout();
}

function initProfileSection() {
  loadProfile();
  setupAvatarUpload();
  setupBioEditor();
  setupBasicInfoEditor();
  setupSocialMedia();
}

function initMatchSection() {
  loadUsers();
  bindSwipeButtons();
}

function bindSwipeButtons() {
  const actions = [
    { id: "likeBtn", type: "like" },
    { id: "dislikeBtn", type: "dislike" },
    { id: "superLikeBtn", type: "super-like" },
  ];

  actions.forEach(({ id, type }) => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener("click", () => swipeCard(type));
    } else {
      console.warn(` Không tìm thấy nút có id "${id}"`);
    }
  });
}
