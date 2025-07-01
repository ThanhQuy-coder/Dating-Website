<?php
session_start();
require_once __DIR__ . '/../../../vendor/autoload.php';

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../../../');
$dotenv->load();

// Gán biến môi trường
define('FB_APP_ID', $_ENV['FACEBOOK_APP_ID']);
define('FB_APP_SECRET', $_ENV['FACEBOOK_APP_SECRET']);
define('FB_REDIRECT_URI', $_ENV['FACEBOOK_REDIRECT_URI']);

$fb = new \Facebook\Facebook([
    'app_id' => FB_APP_ID,
    'app_secret' => FB_APP_SECRET,
    'default_graph_version' => 'v19.0',
]);

$helper = $fb->getRedirectLoginHelper();

//  Nếu frontend gọi file này mà chưa đăng nhập → chuyển hướng qua Facebook
if (!isset($_GET['code'])) {
    $permissions = ['email'];
    $loginUrl = $helper->getLoginUrl(FB_REDIRECT_URI, $permissions);
    header('Location: ' . $loginUrl);
    exit;
}

//  Sau khi đăng nhập Facebook redirect lại với ?code=...
try {
    $accessToken = $helper->getAccessToken();
    if (!isset($accessToken)) {
        throw new Exception("Lỗi khi lấy access token");
    }

    $_SESSION['fb_access_token'] = (string) $accessToken;

    // Lấy thông tin người dùng
    $response = $fb->get('/me?fields=id,name,email', $accessToken);
    $user = $response->getGraphUser();

    // Gán thông tin người dùng vào session nếu cần
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_name'] = $user['name'];
    $_SESSION['user_email'] = $user['email'];

    // Chuyển hướng sang trang match
    header('Location: /Dating-Website/index.php?page=match');
    exit;

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
