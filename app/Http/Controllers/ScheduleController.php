<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ConsultantSchedule;
use Illuminate\Support\Facades\Auth;

class ScheduleController extends Controller
{
    public function index()
    {
        // If consultant, return own schedule. If user, return all future schedules.
        $user = Auth::user();
        if ($user->role_id == 2) { // Consultant
            return ConsultantSchedule::where('consultant_id', $user->id)
                ->orderBy('date', 'asc')
                ->get();
        }

        // For users, show all available schedules
        return ConsultantSchedule::with('consultant:id,username')
            ->where('date', '>=', now()->toDateString())
            ->orderBy('date', 'asc')
            ->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'start_time' => 'required',
            'end_time' => 'required',
        ]);

        $schedule = ConsultantSchedule::create([
            'consultant_id' => Auth::id(),
            'date' => $request->date,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'description' => $request->description
        ]);

        return response($schedule, 201);
    }

    public function destroy($id)
    {
        $schedule = ConsultantSchedule::where('consultant_id', Auth::id())->where('id', $id)->firstOrFail();
        $schedule->delete();
        return response(['message' => 'Schedule deleted']);
    }
}
