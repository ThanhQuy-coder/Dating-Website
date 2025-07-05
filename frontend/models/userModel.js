const BASE_URL = "/api/";

export async function register(email, password) {
  const res = await fetch(BASE_URL + "auth/register.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res;
}

export async function login(email, password) {
  const res = await fetch(BASE_URL + "auth/login.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res;
}

export async function createProfile(
  displayName = null,
  hobbies = null,
  gender = null,
  birth_day = null,
  bio = null,
  imageFile = null
) {
  const formData = new FormData();
  if (displayName) formData.append("displayName", displayName);
  if (hobbies) formData.append("hobbies", hobbies);
  if (gender) formData.append("gender", gender);
  if (birth_day) formData.append("birth_day", birth_day);
  if (bio) formData.append("bio", bio);
  if (imageFile) formData.append("image", imageFile);

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
