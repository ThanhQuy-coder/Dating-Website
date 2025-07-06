<?php
header("Content-Type: application/json");
require_once dirname(__DIR__, 2) . "/core/db.php";

session_start();

$data = json_decode(file_get_contents("php://input"), true);
$username = $data["username"] ?? null;
$password = $data["password"] ?? null;

if (!$username || !$password) {
    echo json_encode(["success" => false, "error" => "Missing username or password."]);
    exit;
}

// Tim nguoi dung
$stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
$stmt->execute(["$username"]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (password_verify($password, $user["password_hash"])) {
    // Cập nhật thời gian đăng nhập cuối
    $updateStmt = $conn->prepare("UPDATE users SET last_login = NOW() WHERE id = ?");
    $updateStmt->execute([$user["id"]]);

    // Lưu vào session
    $_SESSION['user'] = [
        'id' => $user["id"]
    ];

    echo json_encode([
        "success" => true,
        "userId" => $user["id"],
        "lastLogin" => $user["last_login"]
    ]);
} else {
    echo json_encode(["success" => false, "error" => "Wrong username or password."]);
}
