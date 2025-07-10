// blockService.js
import {
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { db } from "../../../../assets/js/firebase_config.js";

export function listenToBlockStatus(currentUserId, targetUserId, callback) {
  const blockPath = `blocks/${targetUserId}/${currentUserId}`;
  const blockRef = ref(db, blockPath);

  onValue(blockRef, (snapshot) => {
    callback(snapshot.exists()); // true nếu bạn bị block
  });
}
