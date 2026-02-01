<?php

// --- DEBUG MODE (Temporarily see fatal errors) ---
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', 'php://stderr');

// --- CORS HANDLER ---
function sendCorsHeaders() {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin) {
        header("Access-Control-Allow-Origin: $origin");
    } else {
        header("Access-Control-Allow-Origin: *");
    }
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-CSRF-Token, Accept");
    header("Access-Control-Allow-Credentials: true");
}

// Global Error/Exception Handler to prevent silent 500s
set_exception_handler(function ($e) {
    error_log("FATAL EXCEPTION: " . $e->getMessage() . " in " . $e->getFile() . ":" . $e->getLine());
    sendCorsHeaders(); // Ensure CORS is sent even on error
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'type' => 'Exception',
        'message' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine(),
        'trace' => explode("\n", $e->getTraceAsString())
    ]);
    exit;
});

set_error_handler(function ($errno, $errstr, $errfile, $errline) {
    if (!(error_reporting() & $errno)) return false;
    error_log("PHP ERROR: [$errno] $errstr in $errfile:$errline");
    return false;
});

// Send headers immediately
sendCorsHeaders();

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
