<?php
// backend/api/admin/activities.php
header('Content-Type: application/json');
require_once '../../core/db.php';

$response = ["success" => false, "activities" => [], "message" => ""];

try {
    global $pdo;
    // Lấy tối đa 30 hoạt động gần đây, sắp xếp mới nhất trước
    $stmt = $pdo->prepare("SELECT id, type, title, description, created_at FROM activities ORDER BY created_at DESC LIMIT 30");
    $stmt->execute();
    $activities = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $response["success"] = true;
    $response["activities"] = $activities;
} catch (Exception $e) {
    $response["message"] = $e->getMessage();
}

echo json_encode($response);
