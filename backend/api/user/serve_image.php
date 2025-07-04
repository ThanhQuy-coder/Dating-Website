<?php
session_start();
require_once dirname(__DIR__, 2) . "/core/db.php";

if (!isset($_SESSION['user'])) {
    http_response_code(401);
    exit;
}

$userId = $_SESSION['user']['id'];
$fileName = $_GET['file'] ?? '';
$filePath = dirname(__DIR__, 3) . '/storage/uploads/' . $userId . '/' . basename($fileName);

$stmt = $conn->prepare("SELECT avatar_url FROM profiles WHERE user_id = ? AND avatar_url LIKE ?");
$stmt->execute([$userId, '/storage/uploads/' . $userId . '/%' . basename($fileName)]);
if ($stmt->fetchColumn() && file_exists($filePath)) {
    $ext = pathinfo($filePath, PATHINFO_EXTENSION);
    header('Content-Type: image/' . $ext);
    header('Cache-Control: public, max-age=31536000'); // Cache one year
    readfile($filePath);
} else {
    http_response_code(403);
    echo "Access denied";
}
exit;
