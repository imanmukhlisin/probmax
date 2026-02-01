<?php

// --- DEBUG MODE (Temporarily see fatal errors) ---
error_reporting(E_ALL);
ini_set('display_errors', 1);

// --- FORCE CORS HEADERS (Fix for Vercel/Serverless) ---
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
// If credentials are true, Origin cannot be '*'
if ($origin) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header("Access-Control-Allow-Origin: *");
}
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

// Handle Preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Fix Vercel Path Detection
// Laravel kadang menganggap app berjalan di subfolder '/api' karena file ini ada di sana.
// Kita paksa agar dia berpikir berjalan di root '/index.php'.
$_SERVER['SCRIPT_NAME'] = '/index.php';
$_SERVER['SCRIPT_FILENAME'] = __DIR__ . '/../public/index.php';

// Langsung panggil index utama Laravel
require __DIR__ . '/../public/index.php';
