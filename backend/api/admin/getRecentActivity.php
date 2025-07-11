<?php
require_once __DIR__ . '/../../core/db.php';
header('Content-Type: application/json');

try {
    // Lấy 10 hoạt động gần nhất
    $stmt = $pdo->query("
        SELECT type, description, created_at
        FROM activity_logs
        ORDER BY created_at DESC
        LIMIT 10
    ");
    $activities = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'status' => 'success',
        'data' => $activities
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
