const BASE_URL = "/api/";

export async function getDatingUsers() {
  const res = await fetch(BASE_URL + "user/match/get-dating-users.php");

  if (!res.ok) {
    throw new Error("Lỗi mạng hoặc server!");
  }

  const data = await res.json();
  return data;
}

export async function sendLike(liked_id) {
  try {
    const res = await fetch(BASE_URL + "user/match/likes.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        liked_id: liked_id,
      }),
    });

    if (!res.ok) throw new Error("Failed to send like.");

    return await res.json(); // sẽ trả về { match: true } hoặc { liked: true }
  } catch (err) {
    console.error("Lỗi khi gửi like:", err);
    return { error: true };
  }
}
