<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once dirname(__DIR__, 3) . "/core/db.php";

session_start();
$currentUserId =  $_SESSION['user']['id'];

$sql = "SELECT user_id, full_name, birth_date, avatar_url, hobbies 
        FROM profiles 
        WHERE user_id != :currentUserId";

$stmt = $conn->prepare($sql);
$stmt->bindParam(":currentUserId", $currentUserId, PDO::PARAM_INT);
$stmt->execute();

$users = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($users);
