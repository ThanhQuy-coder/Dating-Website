<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once dirname(__DIR__, 4) . "/core/db.php";

$input = json_decode(file_get_contents("php://input"), true);
session_start();

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

$user_id = $_SESSION['user']['id'] ?? null;
$reported_id = $input['reported_id'] ?? null;
$reason = $input['reason'] ?? 'Unknown reason';

if (!$user_id || !$reported_id) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Thiếu thông tin báo cáo"]);
    exit;
}

try {
    // Kiểm tra xem đã report chưa
    $checkStmt = $conn->prepare("SELECT COUNT(*) FROM reports WHERE reporter_id = :reporter_id AND reported_id = :reported_id");
    $checkStmt->bindParam(':reporter_id', $user_id, PDO::PARAM_INT);
    $checkStmt->bindParam(':reported_id', $reported_id, PDO::PARAM_INT);
    $checkStmt->execute();
    $alreadyReported = $checkStmt->fetchColumn();

    if ($alreadyReported) {
        echo json_encode(["success" => false, "message" => "Bạn đã báo cáo người này rồi."]);
        exit;
    }

    // Thêm report mới
    $stmt = $conn->prepare("INSERT INTO reports (reporter_id, reported_id, reason) VALUES (:reporter_id, :reported_id, :reason)");
    $stmt->bindParam(':reporter_id', $user_id, PDO::PARAM_INT);
    $stmt->bindParam(':reported_id', $reported_id, PDO::PARAM_INT);
    $stmt->bindParam(':reason', $reason, PDO::PARAM_STR);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Đã gửi báo cáo thành công"]);
    } else {
        echo json_encode(["success" => false, "message" => "Lỗi khi gửi báo cáo"]);
    }

    $stmt = null;
    $checkStmt = null;
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Lỗi máy chủ: " . $e->getMessage()]);
}
