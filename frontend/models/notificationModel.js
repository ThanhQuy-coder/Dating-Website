const BASE_URL = "/api/";

export const notificationUpload = async (
  type = null,
  data = null,
  existingIds = [null]
) => {
  const response = await fetch(
    BASE_URL + "user/notification/notificationUpload.php",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type, data, existingIds }),
    }
  );

  return response.json();
};

export const getListNotification = async () => {
  const response = await fetch(
    BASE_URL + "user/notification/listNotification.php",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    }
  );

  return response.json();
};

export const getAvatar = async (id) => {
  const response = await fetch(
    BASE_URL + "user/notification/get-avatar-user.php",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    }
  );
  return response.json();
};

export const isReadNotification = async (id) => {
  const response = await fetch(
    BASE_URL + "user/notification/notificationUpdate.php",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    }
  );
  return await response.json();
};
