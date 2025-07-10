<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once dirname(__DIR__, 3) . "/core/db.php";
$input = json_decode(file_get_contents("php://input"), true);

session_start();
$otherUserId =  $input['id'];

$sql = "SELECT avatar_url 
        FROM profiles 
        WHERE user_id = :otherUserId";

$stmt = $conn->prepare($sql);
$stmt->bindParam(":otherUserId", $otherUserId, PDO::PARAM_INT);
$stmt->execute();

$users = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($users);
