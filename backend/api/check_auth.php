<?php
// Trong check_auth.php
session_start();
header('Content-Type: application/json');

// DEBUG tạm
// file_put_contents('debug.txt', print_r($_SESSION, true));

if (!isset($_SESSION['user'])) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

$response = ["status" => "ok"];

if (empty($_SESSION['profile_created'])) {
    $response["next"] = "create-profile";
} elseif (empty($_SESSION['avatar_uploaded'])) {
    $response["next"] = "create-avt1";
} else {
    $response["next"] = "home";
}


// Gửi JSON về client
echo json_encode($response);
