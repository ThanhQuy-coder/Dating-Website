import { sendReportUser } from "../../../../models/userModel.js";

export async function initReportUsers(reported_id, reason) {
  try {
    const res = await sendReportUser(reported_id, reason);

    if (res.success) {
      showNotification(
        "Report submitted",
        "Thank you for helping keep our community safe"
      );
      console.log("Lưu cơ sở dữ liệu thành công!");
    } else {
      console.log("Thất bại khi lưu cơ sở dữ liệu");
    }
  } catch (err) {
    console.error(err);
  }
}
