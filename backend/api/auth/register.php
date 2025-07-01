<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json");
require_once dirname(__DIR__, 2) . "/core/db.php";

$data = json_decode(file_get_contents("php://input"), true);
$email = $data["email"];
$password = $data["password"];

//Kiem tra trung ten
$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->rowCount() > 0) {
    echo json_encode(["success" => false, "message" => "Account already exits"]);
    exit;
}

// Hash mat khau
$hashed = password_hash($password, PASSWORD_DEFAULT);

//Them DB
$stmt = $conn->prepare("INSERT INTO users (email, password_hash) VALUES (?,?)");
$stmt->execute([$email, $hashed]);

echo json_encode(["success" => true]);
exit;
