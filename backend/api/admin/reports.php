<?php
require_once realpath(__DIR__ . '/../../core/db.php');
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $stmt = $pdo->query("
            SELECT 
                r.id, 
                r.reporter_id, 
                r.reported_id, 
                r.reason, 
                r.created_at, 
                COALESCE(r.status, 'pending') AS status,
                u1.username AS reporter_name,
                u2.username AS reported_name
            FROM reports r
            LEFT JOIN users u1 ON r.reporter_id = u1.id
            LEFT JOIN users u2 ON r.reported_id = u2.id
        ");

        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($data);
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);

        if (!isset($data['id'], $data['status'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Thiếu dữ liệu']);
            exit;
        }

        $allowedStatus = ['pending', 'resolved', 'dismissed'];
        if (!in_array($data['status'], $allowedStatus)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Trạng thái không hợp lệ']);
            exit;
        }

        $stmt = $pdo->prepare("UPDATE reports SET status = ? WHERE id = ?");
        $stmt->execute([$data['status'], $data['id']]);

        echo json_encode(['success' => true, 'message' => 'Cập nhật trạng thái thành công']);
        exit;
    }

    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Phương thức không hỗ trợ']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Lỗi server: ' . $e->getMessage()]);
}
