<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../../core/db.php';

session_start();

$data = json_decode(file_get_contents("php://input"), true);
$username = trim($data["username"] ?? '');
$password = trim($data["password"] ?? '');

if (empty($username) || empty($password)) {
    echo json_encode(["success" => false, "error" => "Missing username or password."]);
    exit;
}

// Tìm người dùng
$stmt = $pdo->prepare("SELECT * FROM users WHERE username = :username");
$stmt->execute(['username' => $username]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    echo json_encode(["success" => false, "error" => "Không tìm thấy người dùng"]);
    exit;
}

if (!isset($user["password_hash"])) {
    echo json_encode(["success" => false, "error" => "Người dùng không có password_hash"]);
    exit;
}

// Kiểm tra mật khẩu
if (!password_verify($password, $user["password_hash"])) {
    echo json_encode([
        "success" => false,
        "error" => "Sai mật khẩu",
        "debug" => [
            "nhap_vao" => $password,
            "hash" => $user["password_hash"]
        ]
    ]);
    exit;
}

// Cập nhật thời gian đăng nhập cuối
$updateStmt = $pdo->prepare("UPDATE users SET last_login = NOW() WHERE id = :id");
$updateStmt->execute(['id' => $user["id"]]);

// Lưu vào session
$_SESSION['user'] = [
    'id' => $user["id"],
    'username' => $user["username"],
    'phan_loai' => $user["phan_loai"]
];

// ✅ Trả dữ liệu đầy đủ
echo json_encode([
    "success" => true,
    "userId" => $user["id"],
    "phan_loai" => $user["phan_loai"],
    "lastLogin" => $user["last_login"]
]);
