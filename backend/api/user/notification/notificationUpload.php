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

// Lấy dữ liệu từ client
$input = json_decode(file_get_contents("php://input"), true);
$type = $input['type'] ?? null;
$data = $input['data'] ?? null;
$chatId = $data['chatId'] ?? null;
$senderId = $data['sender'] ?? null;
$existingIds = $input['existingIds'] ?? [];

if (!$type || !is_array($data)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Missing or invalid notification type or data",
    ]);
    exit;
}

if (!$chatId || !$senderId) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Missing chatId or sender in data"
    ]);
    exit;
}

// Mã hóa data thành JSON để lưu và kiểm tra
$jsonData = json_encode($data, JSON_UNESCAPED_UNICODE);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Invalid JSON format",
        "error" => json_last_error_msg()
    ]);
    exit;
}

// Kiểm tra xem đã có thông báo tương tự chưa (dựa vào chatId và sender trong JSON)
$sql = "SELECT id FROM notifications 
        WHERE user_id = ? 
        AND type = ? 
        AND JSON_UNQUOTE(JSON_EXTRACT(data, '$.chatId')) = ? 
        AND JSON_UNQUOTE(JSON_EXTRACT(data, '$.sender')) = ?
        AND is_read IN (0, 1)";
$stmt = $conn->prepare($sql);
$stmt->execute([$userId, $type, $chatId, $senderId]);
$duplicate = $stmt->fetch();

if ($duplicate) {
    echo json_encode([
        "success" => false,
        "message" => "Notification already exists",
        "notificationId" => null
    ]);
    exit;
}

// Tạo thông báo mới
try {
    $data = [
        "chatId" => $chatId,
        "sender" => $senderId,
        // bạn có thể thêm "content" nếu cần
    ];
    $dataJson = json_encode($data);

    $insertSql = "INSERT INTO notifications (user_id, type, data, is_read, created_at) 
              VALUES (?, ?, ?, 0, NOW())";
    $insertStmt = $conn->prepare($insertSql);
    $insertStmt->execute([$userId, $type, $dataJson]);
    $notificationId = $conn->lastInsertId();

    echo json_encode([
        "success" => true,
        "message" => "Notification created successfully",
        "notificationId" => $notificationId
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error",
        "error" => $e->getMessage()
    ]);
}
