<?php
    $host = "127.0.0.1";
    $db = "dating_app";
    $user = "ThanhQuy";
    $pass = "Htq@12a2mysql";

    try {
        $conn = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }
    catch (PDOException $e){
        echo "Lỗi kết nối" . $e->getMessage();
    }
?>