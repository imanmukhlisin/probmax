<?php

// 1. Manually load autoload from the root vendor directory
require __DIR__ . '/vendor/autoload.php';

// 2. Bootstrap Laravel and explicitly set the base path to the backend directory
$app = require_once __DIR__ . '/backend/bootstrap/app.php';

// 3. Keep the kernel running
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
)->send();

$kernel->terminate($request, $response);
