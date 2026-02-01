<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return response()->json(['message' => 'ProbmaxCare Backend is Running']);
});


// Fallback jika api.php tidak terbaca
Route::get('/api/ping', function () {
    return response()->json(['status' => 'success', 'message' => 'Laravel on Vercel is alive!']);
});

// Database Test Route
Route::get('/api/test-db', function () {
    try {
        \Illuminate\Support\Facades\DB::connection()->getPdo();
        return response()->json([
            'status' => 'success',
            'message' => 'Database connection established!',
            'db_name' => \Illuminate\Support\Facades\DB::connection()->getDatabaseName()
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'Database connection failed: ' . $e->getMessage()
        ], 500);
    }
});
