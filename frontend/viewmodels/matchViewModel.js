import { checkAuth } from "./dashboard/auth.js";
import { setupLogout } from "./dashboard/logoutHandler.js";

import { loadProfile } from "./dashboard/profile/profileView.js";
import { setupAvatarUpload } from "./dashboard/profile/avatarHandler.js";
import { setupBioEditor } from "./dashboard/profile/bioEditor.js";
import { setupBasicInfoEditor } from "./dashboard/profile/basicInfoEditor.js";
import { setupSocialMedia } from "./dashboard/profile/socialMediaEditor.js";

document.addEventListener("DOMContentLoaded", () => {
  checkAuth(); // from auth.js
  loadProfile(); // from profileView.js
  setupLogout(); // from logoutHandler.js
  setupAvatarUpload(); // from avatarHandler.js
  setupBioEditor(); // from bioEditor.js
  setupBasicInfoEditor(); // from basicInfoEditor.js
  setupSocialMedia(); // form socialMediaEditor.js
});
