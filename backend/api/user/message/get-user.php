<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
session_start();

if (isset($_SESSION['user'])) {
    echo json_encode([
        "success" => true,
        "user" => $_SESSION['user']
    ]);
} else {
    echo json_encode([
        "success" => false,
        "error" => "Not logged in"
    ]);
}
