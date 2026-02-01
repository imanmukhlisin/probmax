<?php

// --- FORCE CORS HEADERS (Fix for Vercel/Serverless) ---
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header("Access-Control-Allow-Origin: $origin");
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
