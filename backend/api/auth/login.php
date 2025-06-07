<?php
    header("Content-Type: application/json");
    require_once dirname(__DIR__, 2) . "/core/db.php";

    $data = json_decode(file_get_contents("php://input"), true);
    $email = $data["email"];
    $password = $data["password"];

    // Tim nguoi dung
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute(["$email"]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (password_verify($password, $user["password_hash"])) {
        echo json_encode(["success" => true, "userId" => $user["id"]]);
    } else {
        echo json_encode(["success" => false]);
    }
?>