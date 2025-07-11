<?php
header('Content-Type: application/json');

try {
    // Kết nối DB
    require_once '../../core/db.php';

    // Query dữ liệu (ví dụ: số user mới theo ngày)
    $stmt = $pdo->query("SELECT DAYOFWEEK(created_at) as day, COUNT(*) as count FROM users GROUP BY day");
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $data = array_fill(0, 7, 0); // T2->CN
    foreach ($result as $row) {
        $data[$row['day'] - 1] = (int)$row['count'];
    }

    echo json_encode([
        'success' => true,
        'data' => $data
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
