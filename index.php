<?php
$page = $_GET['page'] ?? 'home';

switch ($page) {
    case 'login':
        include 'frontend/views/login.html';
        break;
    case 'register':
        include 'frontend/views/register.html';
        break;
    default:
        include 'frontend/views/home.html';
        break;
}
?>
