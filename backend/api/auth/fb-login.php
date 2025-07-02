<?php
session_start();
require_once __DIR__ . '/../../../vendor/autoload.php';
require_once dirname(__DIR__, 2) . "/core/db.php";

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../../../');
$dotenv->load();

define('FB_APP_ID', $_ENV['FACEBOOK_APP_ID']);
define('FB_APP_SECRET', $_ENV['FACEBOOK_APP_SECRET']);
define('FB_REDIRECT_URI', $_ENV['FACEBOOK_REDIRECT_URI']);

$fb = new \Facebook\Facebook([
    'app_id' => FB_APP_ID,
    'app_secret' => FB_APP_SECRET,
    'default_graph_version' => 'v19.0',
]);

$helper = $fb->getRedirectLoginHelper();

// Nếu chưa đăng nhập → chuyển hướng qua Facebook
if (!isset($_GET['code'])) {
    $permissions = ['email'];
    $loginUrl = $helper->getLoginUrl(FB_REDIRECT_URI, $permissions);
    header('Location: ' . $loginUrl);
    exit;
}

// Sau khi đăng nhập Facebook → xử lý
try {
    $accessToken = $helper->getAccessToken();
    if (!isset($accessToken)) {
        throw new Exception("Lỗi khi lấy access token");
    }

    $_SESSION['fb_access_token'] = (string) $accessToken;

    // Lấy thông tin người dùng
    $response = $fb->get('/me?fields=id,name,email', $accessToken);
    $user = $response->getGraphUser();

    $fb_id = $user['id'];
    $name = $user['name'];
    $email = $user->getField('email');

    if (!$email) {
        header('Location: /Dating-Website/index.php?page=login&error=' . urlencode("Your Facebook account does not provide email. Please use another account."));
        exit;
    }

    // Kiểm tra email đã tồn tại chưa
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = :email");
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    $existingUser = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$existingUser) {
        // Thêm user mới
        $stmt = $conn->prepare("INSERT INTO users (email, password_hash, created_at, last_login) VALUES (:email, NULL, NOW(), NOW())");
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        $userId = $conn->lastInsertId();

        // Thêm profile
        $stmt = $conn->prepare("INSERT INTO profiles (user_id, full_name, facebook) VALUES (:user_id, :full_name, :facebook)");
        $stmt->bindParam(':user_id', $userId);
        $stmt->bindParam(':full_name', $name);
        $stmt->bindParam(':facebook', $fb_id);
        $stmt->execute();
    } else {
        $userId = $existingUser['id'];

        // Cập nhật last_login
        $stmt = $conn->prepare("UPDATE users SET last_login = NOW() WHERE id = :id");
        $stmt->bindParam(':id', $userId);
        $stmt->execute();
    }

    // Lưu vào session
    $_SESSION['user'] = [
        'id' => $userId,
        'email' => $email,
        'name' => $name,
        'facebook_id' => $fb_id
    ];

    // Chuyển hướng sang trang match
    header('Location: /Dating-Website/index.php?page=match');
    exit;
} catch (Facebook\Exceptions\FacebookResponseException $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    exit;
} catch (Facebook\Exceptions\FacebookSDKException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    exit;
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    exit;
}
