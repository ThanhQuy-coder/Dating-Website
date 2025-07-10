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

$user_id = $_SESSION['user']['id'];
$blocked_id = $input['blocked_id'];

if (!$user_id || !$blocked_id) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Thiếu thông tin"]);
    exit;
}

try {
    // Kiểm tra xem đã block chưa
    $checkStmt = $conn->prepare("SELECT COUNT(*) 
    FROM blocks WHERE blocker_id = :blocker_id
    AND blocked_id = :blocked_id");
    $checkStmt->bindParam(':blocker_id', $user_id, PDO::PARAM_INT);
    $checkStmt->bindParam(':blocked_id', $blocked_id, PDO::PARAM_INT);
    $checkStmt->execute();
    $alreadyReported = $checkStmt->fetchColumn();

    if ($alreadyReported) {
        try {
            $handleBlockStmt = $conn->prepare("DELETE FROM blocks WHERE blocker_id = :blocker_id AND blocked_id = :blocked_id");
            $handleBlockStmt->bindParam(':blocker_id', $user_id, PDO::PARAM_INT);
            $handleBlockStmt->bindParam(':blocked_id', $blocked_id, PDO::PARAM_INT);
            $handleBlockStmt->execute();
            echo json_encode(["success" => true, "message" => "remote"]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Lỗi khi gỡ block: " . $e->getMessage()]);
        }
        exit;
    }


    // Thêm report mới
    $stmt = $conn->prepare("INSERT INTO blocks (blocker_id, blocked_id) VALUES (:blocker_id, :blocked_id)");
    $stmt->bindParam(':blocker_id', $user_id, PDO::PARAM_INT);
    $stmt->bindParam(':blocked_id', $blocked_id, PDO::PARAM_INT);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "block"]);
    } else {
        echo json_encode(["success" => false, "message" => "Lỗi khi block"]);
    }

    $stmt = null;
    $checkStmt = null;
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Lỗi máy chủ: " . $e->getMessage()]);
}
