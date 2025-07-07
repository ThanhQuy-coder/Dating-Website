<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json");
session_start();
require_once dirname(__DIR__, 2) . "/core/db.php";

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Only POST method allowed"]);
    exit;
}

if (!isset($_SESSION['user'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "User not logged in"]);
    exit;
}

$userId = $_SESSION['user']['id'] ?? null;

// Đọc dữ liệu JSON
$data = json_decode(file_get_contents("php://input"), true);

// Lấy dữ liệu
if (isset($data["action"]) && $data["action"] === "get") {
    $stmt = $conn->prepare("SELECT platform, url FROM social_links WHERE user_id = ?");
    $stmt->execute([$userId]);

    $result = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);
    echo json_encode([
        "success" => true,
        "message" => "Retrieve data successfully",
        "data" => $result
    ]);

    exit;
}


// Đọc dữ liệu JSON
$data = json_decode(file_get_contents("php://input"), true);
$links = $data['links'] ?? null;

if (!is_array($links)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid data format"]);
    exit;
}

// Kiểm tra user tồn tại
$stmt = $conn->prepare("SELECT id FROM users WHERE id = ?");
$stmt->execute([$userId]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    http_response_code(404);
    echo json_encode(["success" => false, "message" => "User not found"]);
    exit;
}

if (is_array($links)) {
    foreach ($links as $platform => $url) {
        if (empty($platform) || empty($url)) continue;

        $stmt = $conn->prepare("SELECT id FROM social_links WHERE user_id = ? AND platform = ?");
        $stmt->execute([$userId, $platform]);
        $existingLink = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($existingLink) {
            $stmt = $conn->prepare("
                UPDATE social_links SET url = COALESCE(:url,url), updated_at = NOW()
                WHERE user_id = :user_id AND platform = :platform
            ");
            $stmt->execute([
                ':url' => $url,
                ':user_id' => $userId,
                ':platform' => $platform
            ]);
        } else {
            $stmt = $conn->prepare("
                INSERT INTO social_links (user_id, platform, url, updated_at, created_at)
                VALUES (:user_id, :platform, :url, NOW(), NOW())
            ");
            $stmt->execute([
                ':user_id' => $userId,
                ':platform' => $platform,
                ':url' => $url
            ]);
        }
    }

    echo json_encode(["success" => true, "message" => "Social links updated"]);
    exit;
}
