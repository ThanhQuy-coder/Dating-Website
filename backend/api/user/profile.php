<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json");
session_start();

require_once dirname(__DIR__, 2) . "/core/db.php";

// Chỉ chấp nhận phương thức POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Only POST method allowed"]);
    exit;
}

// Kiểm tra đăng nhập
if (!isset($_SESSION['user'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "User not logged in"]);
    exit;
}

$userId = $_SESSION['user']['id'];

// Lấy dữ liệu từ FormData
$displayName = $_POST['displayName'] ?? null;
$gender = $_POST['gender'] ?? null;
$dob = $_POST['birth_day'] ?? null;
$bio = $_POST['bio'] ?? null;
$hobbies = $_POST['hobbies'] ?? null;
$imagePath = null;

// Chuẩn hóa giá trị gender
switch ($gender) {
    case "male":
        $gender = "M";
        break;
    case "female":
        $gender = "F";
        break;
    default:
        $gender = "O";
        break;
}

// Xử lý ảnh
if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $file = $_FILES['image'];
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

    // Tạo thư mục theo id
    $uploadDir = dirname(__DIR__, 3) . '/storage/uploads/' . $userId . '/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    // Xóa ảnh cũ nếu có
    $stmt = $conn->prepare("SELECT avatar_url FROM profiles WHERE user_id = ?");
    $stmt->execute([$userId]);
    $oldImage = $stmt->fetchColumn();
    if ($oldImage && file_exists(dirname(__DIR__, 3) . $oldImage)) {
        unlink(dirname(__DIR__, 3) . $oldImage);
    }

    // Vệ sinh tên file
    $fileName = preg_replace("/[^a-zA-Z0-9.-]/", "_", basename($file['name']));
    $fileName = uniqid() . '-' . $fileName;
    $uploadPath = $uploadDir . $fileName;

    if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
        $imagePath = '/storage/uploads/' . $userId . '/' . $fileName; // Đường dẫn tương đối
    } else {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Failed to upload image"]);
        exit;
    }
}

// Kiểm tra user có tồn tại
$stmt = $conn->prepare("SELECT id FROM users WHERE id = ?");
$stmt->execute([$userId]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    http_response_code(404);
    echo json_encode(["success" => false, "message" => "User not found"]);
    exit;
}

// Kiểm tra hồ sơ đã tồn tại chưa
$stmt = $conn->prepare("SELECT user_id FROM profiles WHERE user_id = ?");
$stmt->execute([$userId]);
$profileExists = $stmt->fetch(PDO::FETCH_ASSOC);

// Tạo hoặc cập nhật hồ sơ
if ($profileExists && ($imagePath || !empty($displayName))) {
    // Cập nhật
    $stmt = $conn->prepare("
        UPDATE profiles 
        SET 
            full_name = COALESCE(:full_name, full_name),
            gender = COALESCE(:gender, gender),
            birth_date = COALESCE(:birth_date, birth_date),
            bio = COALESCE(:bio, bio),
            hobbies = COALESCE(:hobbies, hobbies),
            avatar_url = COALESCE(:avatar_url, avatar_url)
        WHERE user_id = :user_id
    ");
} elseif (!$profileExists && !empty($displayName)) {
    // Tạo mới
    $stmt = $conn->prepare("
        INSERT INTO profiles (user_id, full_name, gender, birth_date, bio, hobbies, avatar_url)
        VALUES (:user_id, :full_name, :gender, :birth_date, :bio, :hobbies, :avatar_url)
    ");
} else {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "No valid data provided"]);
    exit;
}

// Gán giá trị
$stmt->bindParam(':user_id', $userId);
$stmt->bindParam(':full_name', $displayName);
$stmt->bindParam(':gender', $gender);
$stmt->bindParam(':birth_date', $dob);
$stmt->bindParam(':bio', $bio);
$stmt->bindParam(':hobbies', $hobbies);
$stmt->bindParam(':avatar_url', $imagePath);

// Thực thi
$stmt->execute();

// Trả về phản hồi
echo json_encode(["success" => true, "message" => "Profile updated successfully"]);
exit;
