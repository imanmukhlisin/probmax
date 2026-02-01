<?php

// Fix Vercel Path Detection
// Laravel kadang menganggap app berjalan di subfolder '/api' karena file ini ada di sana.
// Kita paksa agar dia berpikir berjalan di root '/index.php'.
$_SERVER['SCRIPT_NAME'] = '/index.php';
$_SERVER['SCRIPT_FILENAME'] = __DIR__ . '/../public/index.php';

// Langsung panggil index utama Laravel
require __DIR__ . '/../public/index.php';
