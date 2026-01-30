<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Consultant Schedule
    Route::get('/schedules', [\App\Http\Controllers\ScheduleController::class, 'index']);
    Route::post('/schedules', [\App\Http\Controllers\ScheduleController::class, 'store']);
    Route::delete('/schedules/{id}', [\App\Http\Controllers\ScheduleController::class, 'destroy']);

    // Appointments
    Route::get('/appointments', [\App\Http\Controllers\AppointmentController::class, 'index']);
    Route::post('/appointments', [\App\Http\Controllers\AppointmentController::class, 'store']);
    
    // Feedback
    Route::post('/daily-feedback', [\App\Http\Controllers\FeedbackController::class, 'storeDaily']);
    Route::get('/daily-feedback', [\App\Http\Controllers\FeedbackController::class, 'indexDaily']);
    Route::post('/user-feedback', [\App\Http\Controllers\FeedbackController::class, 'storeUser']);
    Route::get('/user-feedback', [\App\Http\Controllers\FeedbackController::class, 'indexUser']);

    // Admin
    Route::get('/admin/stats', [\App\Http\Controllers\AdminController::class, 'stats']);

    // Phase 2: Chat & Profile
    Route::post('/chat-ai', [\App\Http\Controllers\ChatController::class, 'chat']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);

    // Phase 3: Dashboard & User Management
    Route::get('/users', [\App\Http\Controllers\UserController::class, 'index']); // Admin only usually, middleware check in frontend/controller
    Route::put('/users/{id}', [\App\Http\Controllers\UserController::class, 'update']);
    
    Route::get('/dashboard/user-summary', [\App\Http\Controllers\DashboardController::class, 'userSummary']);
    Route::get('/dashboard/consultant-summary', [\App\Http\Controllers\DashboardController::class, 'consultantSummary']);
    
    // Phase 5A: Consultant Features
    Route::get('/consultant/appointments', [\App\Http\Controllers\ConsultantAnalyticsController::class, 'getMyAppointments']);
    Route::put('/consultant/appointments/{id}', [\App\Http\Controllers\ConsultantAnalyticsController::class, 'updateAppointmentStatus']);
    Route::get('/consultant/analytics', [\App\Http\Controllers\ConsultantAnalyticsController::class, 'getAggregateStudentData']);
});
