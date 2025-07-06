import { checkAuth } from "./dashboard/auth.js";
import { loadProfile } from "./dashboard/profileView.js";
import { setupAvatarUpload } from "./dashboard/avatarHandler.js";
import { setupLogout } from "./dashboard/logoutHandler.js";
import { setupBioEditor } from "./dashboard/bioEditor.js";
import { setupBasicInfoEditor } from "./dashboard/basicInfoEditor.js";

document.addEventListener("DOMContentLoaded", () => {
  checkAuth(); // from auth.js
  loadProfile(); // from profileView.js
  setupLogout(); // from logoutHandler.js
  setupAvatarUpload(); // from avatarHandler.js
  setupBioEditor(); // from bioEditor.js
  setupBasicInfoEditor(); // from basicInfoEditor.js
});
