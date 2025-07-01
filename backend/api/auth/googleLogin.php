<?php
require_once __DIR__ . '/../../../vendor/autoload.php';

use Dotenv\Dotenv;
use Google\Client as Google_Client;
use Google\Service\Oauth2 as Google_Service_Oauth2;

session_start();

// Load biến môi trường từ file .env
$dotenv = Dotenv::createImmutable(__DIR__ . '/../../../');
$dotenv->load();

// Tạo Google Client
$client = new Google_Client();
$client->setClientId($_ENV['GOOGLE_CLIENT_ID']);
$client->setClientSecret($_ENV['GOOGLE_CLIENT_SECRET']);
$client->setRedirectUri($_ENV['GOOGLE_REDIRECT_URI']);
$client->addScope("email");
$client->addScope("profile");

// Nếu đã nhận mã xác thực từ Google
if (isset($_GET['code'])) {
    try {
        $token = $client->fetchAccessTokenWithAuthCode($_GET['code']);

        if (isset($token['error'])) {
            // Nếu có lỗi khi lấy access token → quay lại login
            header('Location: /login.php');
            exit;
        }

        $client->setAccessToken($token['access_token']);

        // Lấy thông tin người dùng
        $google_oauth = new Google_Service_Oauth2($client);
        $google_account_info = $google_oauth->userinfo->get();

        $email = $google_account_info->email;
        $name = $google_account_info->name;
        $picture = $google_account_info->picture;

        // Lưu thông tin vào session (hoặc bạn có thể lưu DB tại đây)
        $_SESSION['user'] = [
            'email' => $email,
            'name' => $name,
            'picture' => $picture
        ];

        // Đăng nhập thành công → chuyển đến trang match
        header('Location: /Dating-Website/frontend/views/match.html');
        exit;
    } catch (Exception $e) {
        // Có lỗi xảy ra trong quá trình xác thực
        header('Location: /Dating-Website/frontend/views/login.html');
        exit;
    }
} else {
    header('Location: ' . $client->createAuthUrl());
    exit;
}
