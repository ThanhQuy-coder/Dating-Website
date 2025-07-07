<?php
session_start();
require_once dirname(__DIR__, 3) . "/core/db.php";

// Kiểm tra đăng nhập
if (!isset($_SESSION['user'])) {
    http_response_code(401);
    echo "Unauthorized";
    exit;
}

// Lấy userId người muốn xem ảnh
$targetUserId = $_GET['user'] ?? null;
$fileName = $_GET['file'] ?? '';

if (!$targetUserId || !$fileName) {
    http_response_code(400);
    echo "Missing user or file";
    exit;
}

// Đường dẫn tới file
$filePath = dirname(__DIR__, 4) . '/storage/uploads/' . $targetUserId . '/' . basename($fileName);

// Truy vấn xem ảnh này có phải avatar của người đó không
$stmt = $conn->prepare("SELECT avatar_url FROM profiles WHERE user_id = ? AND avatar_url LIKE ?");
$stmt->execute([$targetUserId, '%/storage/uploads/' . $targetUserId . '/' . basename($fileName)]);
$avatarPath = $stmt->fetchColumn();

if (!$avatarPath) {
    error_log("Avatar not matched for file: $fileName and user: $targetUserId");
}

// Cho phép nếu:
// 1. Đây là avatar công khai (dù người xem là ai)
// 2. Hoặc người xem chính là chủ sở hữu
if (($avatarPath && file_exists($filePath)) || $_SESSION['user']['id'] == $targetUserId) {
    $ext = pathinfo($filePath, PATHINFO_EXTENSION);
    header('Content-Type: image/' . $ext);
    header('Cache-Control: public, max-age=31536000'); // Cache 1 năm
    readfile($filePath);
    exit;
}

// Nếu không hợp lệ
if (!file_exists($filePath)) {
    http_response_code(404);
    echo "File not found";
} else {
    http_response_code(403);
    echo "Forbidden";
}
exit;
