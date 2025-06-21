const BASE_URL = "/Dating-Website/backend/api/auth/";

export async function register(email, password) {
  const res = await fetch(BASE_URL + "register.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res;
}

export async function login(email, password) {
  const res = await fetch(BASE_URL + "login.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res;
}
