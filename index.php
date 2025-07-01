<?php
$page = $_GET['page'] ?? 'home';

switch ($page) {
    // Authentication pages
    case 'login':
        include 'frontend/views/auth/login.html';
        break;
    case 'register':
        include 'frontend/views/auth/register.html';
        break;
    // Information pages
    case 'about':
        include 'frontend/views/info/about.html';
        break;
    case 'help':
        include 'frontend/views/info/help.html';
        break;
    case 'privacyPolicy':
        include 'frontend/views/info/privacyPolicy.html';
        break;
    case 'support':
        include 'frontend/views/info/support.html';
        break;
    case 'termsOfUse':
        include 'frontend/views/info/termsOfUse.html';
        break;
    // Match pages
    case 'match':
        include 'frontend/views/match/match.html';
        break;
    // profile pages
    case 'create-avt1':
        include 'frontend/views/profile/create-avt1.html';
        break;
    case 'create-profile':
        include 'frontend/views/profile/create-profile.html';
        break;
    case 'premium':
        include 'frontend/views/profile/premium.html';
        break;
    case 'select-avatar':
        include 'frontend/views/profile/select-avatar.html';
        break;
    case 'match-setup':
        include 'frontend/views/profile/match-setup.html';
        break;
    // home page
    default:
        include 'frontend/views/home.html';
        break;
}
