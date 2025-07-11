<?php
require_once __DIR__ . '/../../core/db.php';
header('Content-Type: application/json');

try {
    // Thống kê số hoạt động theo từng giờ hôm nay
    $stmt = $conn->prepare("
        SELECT HOUR(created_at) as hour, COUNT(*) as total
        FROM activity_logs
        WHERE DATE(created_at) = CURDATE()
        GROUP BY HOUR(created_at)
        ORDER BY hour ASC
    ");
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Init mảng 7 giờ chính
    $hours = [6, 9, 12, 15, 18, 21, 24];
    $data = array_fill(0, count($hours), 0);

    foreach ($results as $row) {
        $hour = (int)$row['hour'];
        foreach ($hours as $i => $h) {
            if ($hour == $h) {
                $data[$i] = (int)$row['total'];
                break;
            }
        }
    }

    echo json_encode([
        'status' => 'success',
        'data' => $data
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
