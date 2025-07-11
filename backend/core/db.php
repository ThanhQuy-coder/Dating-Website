<?php
require_once __DIR__ . '/../../vendor/autoload.php';

// Load .env
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->load();

// Kiểm tra .env có load thành công không
if (!isset($_ENV['DB_NAME']) || empty($_ENV['DB_NAME'])) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => '❌ Không load được .env hoặc DB_NAME rỗng']);
    exit;
}

// Lấy thông tin DB từ .env
$host    = $_ENV['DB_HOST'] ?? '127.0.0.1';
$db      = $_ENV['DB_NAME'] ?? 'dating_app';
$user    = $_ENV['DB_USER'] ?? 'root';
$pass    = $_ENV['DB_PASS'] ?? '';
$charset = $_ENV['DB_CHARSET'] ?? 'utf8mb4';

try {
    // Kết nối PDO
    $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
    $pdo = new PDO($dsn, $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);



} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => '❌ Lỗi kết nối DB: ' . $e->getMessage()
    ]);
    exit;
}
