<?php
require_once __DIR__ . '/../../core/db.php';
header('Content-Type: application/json');

try {
    // Thống kê số hoạt động theo từng giờ hôm nay
    $stmt = $pdo->prepare("
        SELECT HOUR(created_at) as hour, COUNT(*) as total
        FROM activity_logs
        WHERE DATE(created_at) = CURDATE()
        GROUP BY HOUR(created_at)
        ORDER BY hour ASC
    ");
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Init mảng 7 giờ chính
    $hours = ['6h', '9h', '12h', '15h', '18h', '21h', '24h'];
    $data = array_fill(0, count($hours), 0);

    foreach ($results as $row) {
        $hour = (int)$row['hour'];
        foreach ([6, 9, 12, 15, 18, 21, 24] as $i => $h) {
            if ($hour == $h) $data[$i] = (int)$row['total'];
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
echo json_encode($data); // ✅ chỉ trả mảng, không bọc "success"