<?php
    require_once "../database/db.php";

    $data = json_decode(file_get_contents("php://input"), true);
    $username = $data["username"];
    $password = $data["password"];

    // Tìm người dùng
    $stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->execute(["$username"]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user["password"])){
        echo json_encode(["success" => true, "userId" => $user["id"]]);
    }
    else {
        echo json_encode(["success" => false, "Sai thông tin đăng nhập"]);
    }
?>