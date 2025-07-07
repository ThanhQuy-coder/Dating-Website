const BASE_URL = "/api/";

export async function register(username, password) {
  const res = await fetch(BASE_URL + "auth/register.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return res;
}

export async function login(username, password) {
  const res = await fetch(BASE_URL + "auth/login.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return res;
}

export async function createProfile(
  displayName = null,
  hobbies = null,
  gender = null,
  birth_day = null,
  location = null,
  bio = null,
  occupation = null,
  education = null,
  imageFile = null
) {
  const formData = new FormData();
  if (displayName) formData.append("displayName", displayName);
  if (hobbies) formData.append("hobbies", hobbies);
  if (gender) formData.append("gender", gender);
  if (birth_day) formData.append("birth_day", birth_day);
  if (bio) formData.append("bio", bio);
  if (imageFile) formData.append("image", imageFile);
  if (location) formData.append("location", location);
  if (occupation) formData.append("occupation", occupation);
  if (education) formData.append("education", education);

  const res = await fetch(BASE_URL + "user/profile.php", {
    method: "POST",
    body: formData,
  });
  return res;
}

export async function updateProfileImage(imageFile) {
  const formData = new FormData();
  formData.append("image", imageFile);

  const res = await fetch(BASE_URL + "user/profile.php", {
    method: "POST",
    body: formData,
  });
  return res;
}

export async function showProfile() {
  const res = await fetch(BASE_URL + "user/profile.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  return res;
}

export async function logout() {
  const res = await fetch(BASE_URL + "auth/logout.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  return res;
}

export async function setSocialLinks(socialLinks) {
  const res = await fetch(BASE_URL + "user/social_links.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ links: socialLinks }),
  });
  return res;
}

export async function getSocialLinks() {
  const res = await fetch(BASE_URL + "user/social_links.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action: "get" }),
  });
  return res;
}
