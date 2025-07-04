<?php
$page = $_GET['page'] ?? 'home';

switch ($page) {
    // Authentication pages
    case 'login':
        include 'views/auth/login.html';
        break;
    case 'register':
        include 'views/auth/register.html';
        break;
    // Information pages
    case 'about':
        include 'views/info/about.html';
        break;
    case 'help':
        include 'views/info/help.html';
        break;
    case 'privacyPolicy':
        include 'views/info/privacyPolicy.html';
        break;
    case 'support':
        include 'views/info/support.html';
        break;
    case 'termsOfUse':
        include 'views/info/termsOfUse.html';
        break;
    // Match pages
    case 'match':
        include 'views/match/match.html';
        break;
    // profile pages
    case 'create-avt1':
        include 'views/profile/create-avt1.html';
        break;
    case 'create-profile':
        include 'views/profile/create-profile.html';
        break;
    case 'premium':
        include 'views/profile/premium.html';
        break;
    case 'select-avatar':
        include 'views/profile/select-avatar.html';
        break;
    case 'match-setup':
        include 'views/profile/match-setup.html';
        break;
    // home page
    default:
        include 'views/home.html';
        break;
}
