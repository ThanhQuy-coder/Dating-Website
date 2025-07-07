<?php
require_once dirname(__DIR__, 3) . "/core/db.php";
session_start();

$userId = $_SESSION["user"]["id"] ?? null;

if (!$userId) {
  http_response_code(401);
  echo json_encode(["error" => "Unauthorized"]);
  exit;
}

// Lấy danh sách những người đã match với user hiện tại
$stmt = $conn->prepare("
  SELECT 
    p.user_id,
    p.full_name,
    p.avatar_url,
    p.bio,
    CASE
      WHEN m.user_a_id = :uid THEN m.user_b_id
      ELSE m.user_a_id
    END AS matched_user_id
  FROM matches m
  JOIN profiles p ON p.user_id = (
    CASE
      WHEN m.user_a_id = :uid THEN m.user_b_id
      ELSE m.user_a_id
    END
  )
  WHERE m.user_a_id = :uid OR m.user_b_id = :uid
");
$stmt->execute(['uid' => $userId]);
$matches = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Chuẩn bị phản hồi JSON dạng chatProfiles
$response = [];

foreach ($matches as $row) {
  $name = $row['full_name'];
  $matchedUserId = $row['matched_user_id'];

  // Lấy tin nhắn cuối cùng nếu có (nếu bạn có bảng messages thì thêm đoạn này)
  // Giả sử không có bảng messages thì trả về messages rỗng
  $response[$name] = [
    "avatar_url" => $row['avatar_url'],
    "status" => "Active now", // có thể cập nhật bằng online-tracking sau
    "messages" => [], // bạn có thể fill bằng các tin nhắn thật sau
    "user_id" => $matchedUserId
  ];
}

header('Content-Type: application/json');
echo json_encode($response);
