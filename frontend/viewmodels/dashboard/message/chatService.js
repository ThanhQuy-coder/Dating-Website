// chatService.js
import { db } from "../../../assets/js/firebase_config.js";
import {
  ref,
  push,
  onChildAdded,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// Gửi tin nhắn
export function sendMessage(chatId, sender, text) {
  const chatRef = ref(db, `messages/${chatId}`);
  const message = {
    sender,
    text,
    timestamp: Date.now(),
  };

  console.log("Sending message:", message); // Debug trước khi gửi

  return push(chatRef, message)
    .then((res) => {
      console.log("Message sent successfully:", res.key); // Key của message mới
    })
    .catch((err) => {
      console.error("Error sending message:", err);
    });
}

// Lắng nghe tin nhắn mới
export function listenForMessages(chatId, callback) {
  const chatRef = ref(db, `messages/${chatId}`);
  console.log(`Listening for messages in chat: ${chatId}`);

  onChildAdded(chatRef, (snapshot) => {
    const message = snapshot.val();
    console.log("New message received:", message); // Debug mỗi lần nhận tin
    callback(message);
  });
}
