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
    return response()->json(['message' => 'CodeFit Innovate Backend is Running']);
});


// Fallback jika api.php tidak terbaca
Route::get('/api/ping', function () {
    return response()->json(['status' => 'success', 'message' => 'Laravel on Vercel is alive!']);
});
