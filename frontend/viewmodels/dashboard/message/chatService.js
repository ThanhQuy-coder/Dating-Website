// chatService.js
import { db } from "../../../assets/js/firebase_config.js";
import {
  ref,
  push,
  onChildAdded,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

import {
  notificationUpload,
  getListNotification,
} from "../../../models/notificationModel.js";

/**
 * Gửi tin nhắn vào Firebase Realtime Database
 * @param {string} chatId
 * @param {string} sender
 * @param {string} text
 */
export function sendMessage(chatId, sender, text) {
  const chatRef = ref(db, `messages/${chatId}`);
  const message = {
    sender,
    text,
    timestamp: Date.now(),
  };

  return push(chatRef, message)
    .then(() => {
      console.log("Message sent");
    })
    .catch((err) => {
      console.error("Error sending message:", err);
    });
}

/**
 * Lắng nghe tin nhắn mới trong đoạn chat
 * @param {string} chatId
 * @param {Function} callback – Gọi mỗi khi có tin nhắn mới
 * @param {string|null} currentUserId – ID người dùng hiện tại để không gửi thông báo cho chính mình
 * @param {Function|null} onNotify – Hàm để xử lý khi cần hiển thị thông báo
 * @param {Object} chatProfiles – Danh sách user đã match
 */
export async function listenForMessages(
  chatId,
  callback = null,
  currentUserId = null
) {
  const chatRef = ref(db, `messages/${chatId}`);

  // Lấy danh sách thông báo hiện tại để kiểm tra trùng (nếu cần)
  let existingNotificationIds = [];

  const res = await getListNotification();
  const result = await res;

  if (result.success && result.notifications.length >= 0) {
    result.notifications.forEach((notification) => {
      if (notification.id && notification.is_read !== 1) {
        existingNotificationIds.push(notification.id); // Lấy ID
      }
    });

    console.log("Get Notification IDs:", existingNotificationIds);
  } else {
    console.log("No notifications found");
  }

  const notifiedMessageKeys = new Set();

  onChildAdded(chatRef, async (snapshot) => {
    const message = snapshot.val();
    const messageKey = snapshot.key;
    if (!message) return;

    // Đã gửi thông báo cho tin nhắn này chưa?
    if (notifiedMessageKeys.has(messageKey)) return;

    if (callback) {
      callback(message); // Gọi hàm callback nếu có
    }

    // Nếu người gửi khác với người dùng hiện tại → thông báo
    if (message.sender !== currentUserId) {
      try {
        const newNotificationId = await notificationUpload(
          "new_message",
          {
            chatId,
            sender: message.sender,
            text: message.text,
            timestamp: message.timestamp,
          },
          existingNotificationIds
        );
        if (newNotificationId) {
          existingNotificationIds.push(newNotificationId);
          notifiedMessageKeys.add(messageKey); // vẫn giữ cái này
        }
      } catch (error) {
        console.error("Error handling notification:", error);
      }
    }
  });
}
