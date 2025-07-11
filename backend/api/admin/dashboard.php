<?php
require_once realpath(__DIR__ . '/../../core/db.php');
header('Content-Type: application/json');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

try {
    $totalUsers = $pdo->query("SELECT COUNT(*) FROM users WHERE phan_loai = 'user'")->fetchColumn();
    $totalMatches = $pdo->query("SELECT COUNT(*) FROM matches")->fetchColumn();
    $pendingReports = $pdo->query("SELECT COUNT(*) FROM reports")->fetchColumn(); // ✅ Sửa ở đây

    echo json_encode([
        'success' => true,
        'totalUsers' => (int)$totalUsers,
        'totalMatches' => (int)$totalMatches,
        'pendingReports' => (int)$pendingReports
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Lỗi server: ' . $e->getMessage()
    ]);
    exit;
}
?>
