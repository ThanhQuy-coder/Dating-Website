<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json");
session_start();

require_once dirname(__DIR__, 2) . "/core/db.php";

// Chỉ cho phép POST
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

$userId = $_SESSION['user']['id'];
$data = json_decode(file_get_contents("php://input"), true);

// Lấy dữ liệu từ client
$displayName = $data["displayName"] ?? null;
if ($data["gender"] === "male") {
    $gender = "M";
} else if ($data["gender"] === "female") {
    $gender = 'F';
} else {
    $gender = 'O';
}
$dob = $data["birth_day"] ?? null;
$bio = $data["bio"] ?? null;



// Kiểm tra dữ liệu bắt buộc
if (empty($userId) || empty($displayName)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
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

// Tạo profile
$stmt = $conn->prepare("INSERT INTO profiles (user_id, full_name, gender, birth_date, bio) 
    VALUES (:user_id, :full_name, :gender, :dob, :bio)");
$stmt->bindParam(':user_id', $userId);
$stmt->bindParam(':full_name', $displayName);
$stmt->bindParam(':gender', $gender);
$stmt->bindParam(':dob', $dob);
$stmt->bindParam(':bio', $bio);
$stmt->execute();

echo json_encode(["success" => true, "message" => "Profile created successfully"]);
exit;
