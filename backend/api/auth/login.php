<?php
    require_once "../core/db.php";

    $data = json_decode(file_get_contents("php://input"), true);
    $email = $data["email"];
    $password = $data["password"];

    // Tìm người dùng
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute(["$email"]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user["password"])){
        echo json_encode(["success" => true, "userId" => $user["id"]]);
    }
    else {
        echo json_encode(["success" => false, "Incorrect login information"]);
    }
?>