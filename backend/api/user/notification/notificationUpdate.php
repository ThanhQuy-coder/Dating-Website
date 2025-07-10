<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();

require_once dirname(__DIR__, 3) . '/core/db.php';
header("Content-Type: application/json");

// Chỉ chấp nhận phương thức POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Only POST method allowed"]);
    exit;
}

// Kiểm tra đăng nhập
if (!isset($_SESSION['user'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "User not logged in"]);
    exit;
}

$userId = $_SESSION['user']['id'];
$input = json_decode(file_get_contents("php://input"), true);

// Kiểm tra dữ liệu
$id_notification = $input['id'] ?? null;
if (!$id_notification) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Missing notification ID"
    ]);
    exit;
}

try {
    // Cập nhật is_read = TRUE cho thông báo cụ thể
    $updateStmt = $conn->prepare("UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?");
    $updateStmt->execute([$id_notification, $userId]);

    // Lấy lại toàn bộ danh sách thông báo
    $selectStmt = $conn->prepare("SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC");
    $selectStmt->execute([$userId]);
    $notifications = $selectStmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "message" => "Notification marked as read",
        "notifications" => $notifications
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error",
        "error" => $e->getMessage()
    ]);
}
