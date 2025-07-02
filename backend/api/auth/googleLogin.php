<?php
require_once __DIR__ . '/../../../vendor/autoload.php';
require_once dirname(__DIR__, 2) . "/core/db.php";

use Dotenv\Dotenv;
use Google\Client as Google_Client;
use Google\Service\Oauth2 as Google_Service_Oauth2;

session_start();

// Load biến môi trường
$dotenv = Dotenv::createImmutable(__DIR__ . '/../../../');
$dotenv->load();

$client = new Google_Client();
$client->setClientId($_ENV['GOOGLE_CLIENT_ID']);
$client->setClientSecret($_ENV['GOOGLE_CLIENT_SECRET']);
$client->setRedirectUri($_ENV['GOOGLE_REDIRECT_URI']);
$client->addScope("email");
$client->addScope("profile");

if (isset($_GET['code'])) {
    try {
        $token = $client->fetchAccessTokenWithAuthCode($_GET['code']);

        if (isset($token['error'])) {
            header('Location: /Dating-Website/index.php?page=login');
            exit;
        }

        $client->setAccessToken($token['access_token']);

        $google_oauth = new Google_Service_Oauth2($client);
        $google_account_info = $google_oauth->userinfo->get();

        $email = $google_account_info->email;
        $name = $google_account_info->name;
        $avatar = $google_account_info->picture;

        // Kiểm tra user tồn tại chưa
        $stmt = $conn->prepare("SELECT id FROM users WHERE email = :email");
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            // Thêm vào bảng users (không có password)
            $stmt = $conn->prepare("INSERT INTO users (email, password_hash, created_at, last_login) VALUES (:email, NULL, NOW(), NOW())");
            $stmt->bindParam(':email', $email);
            $stmt->execute();
            $userId = $conn->lastInsertId();

            // Thêm vào bảng profiles
            $stmt = $conn->prepare("INSERT INTO profiles (user_id, full_name, avatar_url) VALUES (:user_id, :full_name, :avatar)");
            $stmt->bindParam(':user_id', $userId);
            $stmt->bindParam(':full_name', $name);
            $stmt->bindParam(':avatar', $avatar);
            $stmt->execute();
        } else {
            $userId = $user['id'];

            // Cập nhật thời gian đăng nhập
            $stmt = $conn->prepare("UPDATE users SET last_login = NOW() WHERE id = :id");
            $stmt->bindParam(':id', $userId);
            $stmt->execute();
        }

        // Lưu session
        $_SESSION['user'] = [
            'id' => $userId,
            'email' => $email,
            'name' => $name,
            'avatar' => $avatar
        ];

        header('Location: /Dating-Website/index.php?page=match');
        exit;
    } catch (Exception $e) {
        header('Location: /Dating-Website/index.php?page=login&error=' . urlencode($e->getMessage()));
        exit;
    }
} else {
    header('Location: ' . $client->createAuthUrl());
    exit;
}
