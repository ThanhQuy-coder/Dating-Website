<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

session_start();

header("Content-Type: application/json");
require_once dirname(__DIR__, 2) . "/core/db.php";

$data = json_decode(file_get_contents("php://input"), true);
$username = $data["username"];
$password = $data["password"];

//Kiem tra trung username
$stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
$stmt->execute([$username]);
if ($stmt->rowCount() > 0) {
    echo json_encode(["success" => false, "message" => "Account already exits"]);
    exit;
}

// Hash mat khau
$hashed = password_hash($password, PASSWORD_DEFAULT);

//Them DB
$stmt = $conn->prepare("INSERT INTO users (username, password_hash) VALUES (?,?)");
$stmt->execute([$username, $hashed]);

$userId = $conn->lastInsertId();

// Lưu vào session
$_SESSION['user'] = [
    'id' => $userId
];

// Xóa session cụ thể
unset($_SESSION['profile_created']);
unset($_SESSION['avatar_uploaded']);

echo json_encode(["success" => true]);
exit;
