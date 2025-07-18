<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');

require_once realpath(__DIR__ . '/../../core/db.php');

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // ✅ GET: lấy danh sách user
        $stmt = $conn->query("SELECT id, username, email, status, created_at FROM users WHERE phan_loai = 'user'");

        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($users);
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $raw = file_get_contents("php://input");
        $data = json_decode($raw, true);

        if (isset($data['id'], $data['status'])) {
            // ✅ Validate status
            if (!in_array($data['status'], ['active', 'banned'])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Trạng thái không hợp lệ']);
                exit;
            }

            // ✅ Cập nhật trạng thái user
            $stmt = $conn->prepare("UPDATE users SET status = ? WHERE id = ?");
            $stmt->execute([$data['status'], $data['id']]);
            echo json_encode(['success' => true, 'message' => 'Cập nhật trạng thái thành công']);
            exit;
        }

        if (isset($data['id'], $data['username'], $data['email'])) {
            // ✅ Cập nhật thông tin user
            $stmt = $conn->prepare("UPDATE users SET username = ?, email = ? WHERE id = ?");
            $stmt->execute([$data['username'], $data['email'], $data['id']]);
            echo json_encode(['success' => true, 'message' => 'Cập nhật thông tin thành công']);
            exit;
        }

        // ❌ Thiếu dữ liệu
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Thiếu dữ liệu']);
        exit;
    }

    // ❌ Method không được hỗ trợ
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    exit;

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Lỗi server: ' . $e->getMessage()
    ]);
    exit;
}
