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
$existingIds = $input['existingIds'] ?? [];

if (!$type || !is_array($data)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Missing or invalid notification type or data",
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

if (!empty($existingIds)) {
    // Kiểm tra xem trong bảng đã có thông báo nào trong mảng này chưa
    $placeholders = implode(',', array_fill(0, count($existingIds), '?'));
    $sql = "SELECT id FROM notifications WHERE id IN ($placeholders) AND user_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->execute([...$existingIds, $userId]);
    $duplicate = $stmt->fetch();

    if ($duplicate) {
        echo json_encode([
            "success" => false,
            "message" => "Notification already exists",
            "notificationId" => $duplicate['id']
        ]);
        exit;
    }
}

// Tạo thông báo mới
try {
    $stmt = $conn->prepare("
        INSERT INTO notifications (user_id, type, data) 
        VALUES (:user_id, :type, :data)
    ");
    $stmt->execute([
        ":user_id" => $userId,
        ":type" => $type,
        ":data" => $jsonData
    ]);

    echo json_encode(["success" => true, "message" => "Notification created successfully"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error",
        "error" => $e->getMessage()
    ]);
}
