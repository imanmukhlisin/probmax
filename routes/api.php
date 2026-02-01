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
Route::get('/ping', function () {
    return response()->json(['status' => 'success', 'message' => 'Laravel on Vercel is alive!']);
});
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Diagnostic & Database Management (Production Fixes)
Route::get('/test-db', function () {
    try {
        \Illuminate\Support\Facades\DB::connection()->getPdo();
        return response()->json([
            'status' => 'success',
            'message' => 'Database connection established!',
            'db_name' => \Illuminate\Support\Facades\DB::connection()->getDatabaseName()
        ]);
    } catch (\Exception $e) {
        return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
    }
});

Route::get('/check-tables', function () {
    try {
        $tables = \Illuminate\Support\Facades\DB::select('SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname != \'pg_catalog\' AND schemaname != \'information_schema\'');
        return response()->json(['status' => 'success', 'tables' => array_column($tables, 'tablename')]);
    } catch (\Exception $e) {
        return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
    }
});

Route::get('/force-migrate', function () {
    try {
        \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
        return response()->json(['status' => 'success', 'output' => \Illuminate\Support\Facades\Artisan::output()]);
    } catch (\Exception $e) {
        return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
    }
});

Route::get('/check-schema', function () {
    try {
        $columns = \Illuminate\Support\Facades\DB::select('SELECT column_name, data_type FROM information_schema.columns WHERE table_name = \'users\'');
        $rolesCount = \Illuminate\Support\Facades\DB::table('roles')->count();
        return response()->json(['status' => 'success', 'users_columns' => $columns, 'roles_count' => $rolesCount]);
    } catch (\Exception $e) {
        return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
    }
});

Route::get('/force-seed', function () {
    try {
        config(['app.debug' => true]);
        
        // Direct seeding logic to bypass Artisan overhead
        $seeder = new \Database\Seeders\DatabaseSeeder();
        $seeder->run();

        return response()->json([
            'status' => 'success',
            'message' => 'Database direct seeding completed!'
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine()
        ], 500);
    }
});

Route::get('/phpinfo', function () {
    phpinfo();
});

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
    Route::get('/admin/users', [\App\Http\Controllers\AdminUserController::class, 'index']);
    Route::post('/admin/users', [\App\Http\Controllers\AdminUserController::class, 'store']);
    Route::put('/admin/users/{user}', [\App\Http\Controllers\AdminUserController::class, 'update']);
    Route::delete('/admin/users/{user}', [\App\Http\Controllers\AdminUserController::class, 'destroy']);
    Route::get('/admin/roles', [\App\Http\Controllers\AdminUserController::class, 'roles']);

    Route::get('/dashboard/user-summary', [\App\Http\Controllers\DashboardController::class, 'userSummary']);
    Route::get('/dashboard/consultant-summary', [\App\Http\Controllers\DashboardController::class, 'consultantSummary']);

    // Phase 5A: Consultant Features
    Route::get('/consultant/appointments', [\App\Http\Controllers\ConsultantAnalyticsController::class, 'getMyAppointments']);
    Route::put('/consultant/appointments/{id}', [\App\Http\Controllers\ConsultantAnalyticsController::class, 'updateAppointmentStatus']);
    Route::get('/consultant/analytics', [\App\Http\Controllers\ConsultantAnalyticsController::class, 'getAggregateStudentData']);
});
