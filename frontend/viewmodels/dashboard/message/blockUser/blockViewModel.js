import { sendBlockUser } from "../../../../models/userModel.js";

export async function initBlockUsers(reported_id) {
  try {
    const res = await sendBlockUser(reported_id);

    if (res.success) {
      if (res.message === "block") {
        showNotification("Block submitted");
        // console.log("Lưu cơ sở dữ liệu thành công!");
      } else {
        showNotification("Block removed");
      }
    } else {
      console.log("Lưu cơ sở dữ liệu thất bại!");
    }
  } catch (err) {
    console.error(err);
  }
}
