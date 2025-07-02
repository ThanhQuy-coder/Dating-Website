const BASE_URL = "/Dating-Website/backend/api/";

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
  imageProfile = null
) {
  const res = await fetch(BASE_URL + "user/profile.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      displayName,
      hobbies,
      gender,
      birth_day,
      bio,
      imageProfile,
    }),
  });
  return res;
}
