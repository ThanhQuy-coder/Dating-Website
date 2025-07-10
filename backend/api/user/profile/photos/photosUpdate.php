<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once dirname(__DIR__, 4) . '/core/db.php';
header("Content-Type: application/json");

session_start();

// Ưu tiên $_POST nếu có, nếu không thì dùng JSON
if ($_SERVER["CONTENT_TYPE"] === "application/json") {
    $data = json_decode(file_get_contents("php://input"), true);
    $userId = $data['user_id'] ?? null;
    $idImage = $data['idImage'] ?? null;
} else {
    $userId = $_POST['user_id'] ?? null;
    $idImage = $_POST['idImage'] ?? null;
}

if (!$userId || !$idImage) {
    echo json_encode(["success" => false, "message" => "Thiếu user_id hoặc idImage"]);
    exit;
}

// Đường dẫn thư mục lưu ảnh
$uploadDir = dirname(__DIR__, 5) . "/storage/uploads/" . $userId . "/";
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

try {
    // 1. Tìm ảnh cũ cần xóa
    $stmt = $conn->prepare("SELECT url FROM photos WHERE user_id = ? AND id = ?");
    $stmt->execute([$userId, $idImage]);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $deleted = 0;
    foreach ($results as $row) {
        $filePath = dirname(__DIR__, 5) . "/" . $row["url"];
        if (file_exists($filePath)) {
            if (unlink($filePath)) {
                $deleted++;
            }
        }
    }

    // 2. Xóa ảnh trong DB
    $deleteStmt = $conn->prepare("DELETE FROM photos WHERE user_id = ? AND id = ?");
    $deleteStmt->execute([$userId, $idImage]);

    // 3. Kiểm tra có file upload mới không
    if (empty($_FILES['photo']['tmp_name'])) {
        echo json_encode(["success" => false, "message" => "Không có file nào được tải lên"]);
        exit;
    }

    // 4. Lưu ảnh mới
    $filename = basename($_FILES['photo']['name']);
    $tmpPath = $_FILES['photo']['tmp_name'];
    $ext = pathinfo($filename, PATHINFO_EXTENSION);
    $newFileName = uniqid('photo_') . '.' . $ext;
    $uploadPath = $uploadDir . $newFileName;

    if (!move_uploaded_file($tmpPath, $uploadPath)) {
        echo json_encode(["success" => false, "message" => "Không thể lưu ảnh mới"]);
        exit;
    }

    // 5. Lưu đường dẫn ảnh mới vào DB
    $relativePath = "/storage/uploads/" . $userId . "/" . $newFileName;
    $insert = $conn->prepare("INSERT INTO photos (user_id, url) VALUES (?, ?)");
    $insert->execute([$userId, $relativePath]);

    echo json_encode([
        "success" => true,
        "message" => "Cập nhật ảnh thành công",
        "deleted" => $deleted,
        "uploaded" => 1,
        "new_url" => $relativePath
    ]);
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Lỗi xử lý ảnh",
        "error" => $e->getMessage()
    ]);
}
