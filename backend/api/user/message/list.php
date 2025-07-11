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

  // Kiểm tra xem có bị block không (một chiều: người dùng hiện tại đã block người kia)
  $blockStmt = $conn->prepare("
  SELECT COUNT(*) FROM blocks 
  WHERE 
    (blocker_id = :uid AND blocked_id = :other)
    OR
    (blocker_id = :other AND blocked_id = :uid)
");

  $blockStmt->execute([
    'uid' => $userId,
    'other' => $matchedUserId
  ]);
  $isBlocked = $blockStmt->fetchColumn() > 0;

  $response[$name] = [
    "avatar_url" => $row['avatar_url'],
    "status" => "Active now",
    "messages" => [],
    "user_id" => $matchedUserId,
    "blocked" => $isBlocked
  ];
}


header('Content-Type: application/json');
echo json_encode($response);
