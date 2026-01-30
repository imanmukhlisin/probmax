<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DailyFeedback;
use App\Models\UserFeedback;
use App\Models\Appointment;
use App\Models\ConsultantSchedule;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    // Summary for Student/User
    public function userSummary()
    {
        $userId = Auth::id();

        // Last Daily Check
        $lastDailyCheck = DailyFeedback::where('user_id', $userId)
                            ->orderBy('created_at', 'desc')
                            ->first();

        // Last Mood (PMC Game)
        $lastMood = UserFeedback::where('user_id', $userId)
                            ->orderBy('created_at', 'desc')
                            ->first();

        // Next Appointment
        $nextAppointment = Appointment::where('user_id', $userId)
                            ->where('appointment_date', '>=', now()->toDateString())
                            ->orderBy('appointment_date', 'asc')
                            ->orderBy('appointment_time', 'asc')
                            ->first();

        return response([
            'last_daily_check' => $lastDailyCheck,
            'last_mood' => $lastMood,
            'next_appointment' => $nextAppointment
        ]);
    }

    // Summary for Consultant
    public function consultantSummary()
    {
        // Note: Currently appointments don't have consultant_id directly, 
        // effectively all appointments or we filter by schedule. 
        // For now, returning general stats as placeholder or if schema updated.
        // Assuming we show all upcoming appointments for the consultant to pick/manage.
        
        $upcomingAppointments = Appointment::where('appointment_date', '>=', now()->toDateString())
                                ->count();
        
        $mySchedules = ConsultantSchedule::where('consultant_id', Auth::id())
                        ->where('date', '>=', now()->toDateString())
                        ->count();

        return response([
            'upcoming_appointments_count' => $upcomingAppointments,
            'my_schedules_count' => $mySchedules
        ]);
    }
}
