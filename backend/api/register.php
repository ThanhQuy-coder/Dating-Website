<?php
    require_once "../../db.php";

    $data = json_decode(file_get_contents("php://input"), true);
    $username = $data["username"];
    $password = $data["password"];

    //Kiem tra trung ten
    $stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->execute([$username]);
    if ($stmt->rowCount() > 0) {
        echo json_encode(["success" => false, "message" => "Account already exits"]);
        exit;
    }

    // Hash mat khau
    $hashed = password_hash($password, PASSWORD_DEFAULT);

    //Them DB
    $stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?,?)");
    $stmt->execute([$username, $hashed]);

    echo json_encode(["success" => true]);
?>