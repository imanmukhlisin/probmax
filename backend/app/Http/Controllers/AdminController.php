<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Appointment;
use App\Models\DailyFeedback;

class AdminController extends Controller
{
    public function stats()
    {
        return response([
            'total_users' => User::count(),
            'total_appointments' => Appointment::count(),
            'total_feedbacks' => DailyFeedback::count(),
            'appointments_today' => Appointment::where('appointment_date', date('Y-m-d'))->count()
        ]);
    }
}
