<?php
require_once dirname(__DIR__, 3) . "/core/db.php";
session_start();

// Kiểm tra đăng nhập
if (!isset($_SESSION['user'])) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

$liker_id = $_SESSION['user']['id'];
$data = json_decode(file_get_contents("php://input"), true);
$liked_id = $data['liked_id'] ?? null;
$type = $data['type'] ?? 'like'; // Mặc định là 'like'

// Kiểm tra dữ liệu đầu vào
if (!$liker_id || !$liked_id || !in_array($type, ['like', 'super-like'])) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid request"]);
    exit;
}

// 1. Insert like (hoặc super-like)
$stmt = $conn->prepare("
    INSERT INTO likes (from_user_id, to_user_id, type)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE type = VALUES(type), created_at = NOW()
");
$stmt->execute([$liker_id, $liked_id, $type]);

// 2. Kiểm tra xem người kia đã like lại chưa
$check = $conn->prepare("
    SELECT * FROM likes
    WHERE from_user_id = ? AND to_user_id = ?
");
$check->execute([$liked_id, $liker_id]);
$isMutual = $check->rowCount() > 0;

// 3. Nếu match, tạo match mới
if ($isMutual) {
    $u1 = min($liker_id, $liked_id);
    $u2 = max($liker_id, $liked_id);

    $insertMatch = $conn->prepare("
        INSERT IGNORE INTO matches (user_a_id, user_b_id)
        VALUES (?, ?)
    ");
    $insertMatch->execute([$u1, $u2]);

    echo json_encode(["match" => true]);
} else {
    echo json_encode(["liked" => true, "type" => $type]);
}
