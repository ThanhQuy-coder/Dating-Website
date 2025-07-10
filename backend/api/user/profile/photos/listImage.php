<?php
require_once dirname(__DIR__, 4) . '/core/db.php';
header("Content-Type: application/json");

$userId = $_GET['user_id'] ?? null;
if (!$userId) {
    echo json_encode(["success" => false, "message" => "Thiếu user_id"]);
    exit;
}

$stmt = $conn->prepare("SELECT id, url FROM photos WHERE user_id = ? ORDER BY uploaded_at DESC");
$stmt->execute([$userId]);
$photos = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode(["success" => true, "photos" => $photos]);
