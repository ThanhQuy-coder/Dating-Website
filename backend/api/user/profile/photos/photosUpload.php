<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once dirname(__DIR__, 4) . '/core/db.php';
header("Content-Type: application/json");

session_start();

// Giả sử bạn lấy userId từ session hoặc POST
$userId = $_POST['user_id'] ?? null;
if (!$userId) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "User ID is required"]);
    exit;
}

// Xử lý ảnh
if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
    $file = $_FILES['photo'];
    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

    if (!in_array($file['type'], $allowedTypes)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Invalid image type"]);
        exit;
    }

    if ($file['size'] > 5 * 1024 * 1024) { // 5MB
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Image too large, max 5MB"]);
        exit;
    }

    // Tạo thư mục theo user_id
    $uploadDir = dirname(__DIR__, 5) . '/storage/uploads/' . $userId . '/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    // Vệ sinh và tạo tên file duy nhất
    $fileName = preg_replace("/[^a-zA-Z0-9.-]/", "_", basename($file['name']));
    $fileName = uniqid() . '-' . $fileName;
    $uploadPath = $uploadDir . $fileName;

    if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
        // Đường dẫn lưu vào DB (tương đối)
        $imagePath = '/storage/uploads/' . $userId . '/' . $fileName;

        // Lưu vào bảng photos
        $stmt = $conn->prepare("INSERT INTO photos (user_id, url) VALUES (?, ?)");
        $stmt->execute([$userId, $imagePath]);

        echo json_encode(["success" => true, "url" => $imagePath]);
        exit;
    } else {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Failed to save image"]);
        exit;
    }
} else {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "No image uploaded"]);
    exit;
}
