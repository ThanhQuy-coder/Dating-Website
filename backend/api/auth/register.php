<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

session_start();

header("Content-Type: application/json");
require_once dirname(__DIR__, 2) . "/core/db.php";

$data = json_decode(file_get_contents("php://input"), true);
$username = $data["username"]; // đang nhận username từ frontend
$password = $data["password"];

if (!$username || !$password) {
    echo json_encode(["success" => false, "error" => "Missing username or password."]);
    exit;
}

// Kiểm tra trùng username
$stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
$stmt->execute([$username]);
if ($stmt->rowCount() > 0) {
    echo json_encode(["success" => false, "message" => "Account already exists"]);
    exit;
}

// Hash mật khẩu
$hashed = password_hash($password, PASSWORD_DEFAULT);

// Thêm user vào DB
$stmt = $pdo->prepare("INSERT INTO users (email, password_hash, created_at) VALUES (?, ?, NOW())");
$stmt->execute([$email, $hashed]);

$userId = $pdo->lastInsertId();

// Lưu vào session
$_SESSION['user'] = ['id' => $userId];

// Xóa session tạm
unset($_SESSION['profile_created']);
unset($_SESSION['avatar_uploaded']);

echo json_encode(["success" => true]);
exit;
