<?php

namespace App\Http\Controllers;

use App\Models\DailyFeedback;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class StudentMonitoringController extends Controller
{
    /**
     * Get all daily feedback records grouped by month
     */
    public function index(Request $request)
    {
        // Get all daily feedback with user data, ordered by date descending
        $feedbacks = DailyFeedback::with('user:id,username')
            ->orderBy('created_at', 'desc')
            ->get();

        // Group by month (format: YYYY-MM)
        $groupedData = [];
        
        foreach ($feedbacks as $feedback) {
            $monthKey = $feedback->created_at->format('Y-m');
            $monthLabel = $feedback->created_at->locale('id')->isoFormat('MMMM YYYY');
            
            if (!isset($groupedData[$monthKey])) {
                $groupedData[$monthKey] = [
                    'month_label' => $monthLabel,
                    'records' => []
                ];
            }
            
            $groupedData[$monthKey]['records'][] = [
                'id' => $feedback->id,
                'user_name' => $feedback->user->username ?? 'Unknown',
                'date' => $feedback->created_at->format('d/m/Y'),
                'total_score' => $feedback->total_score,
                'stress_level' => $feedback->stress_level,
                'created_at' => $feedback->created_at->toISOString()
            ];
        }

        return response()->json([
            'success' => true,
            'data' => $groupedData
        ]);
    }

    /**
     * Export all monitoring data to CSV (Excel-compatible)
     */
    public function exportCsv()
    {
        try {
            // Get all daily feedback with user data
            $feedbacks = DailyFeedback::with('user:id,username')
                ->orderBy('created_at', 'desc')
                ->get();

            $filename = 'Monitoring_Mahasiswa_' . date('Y-m-d_His') . '.csv';

            // Create CSV content
            $csvContent = "\xEF\xBB\xBF"; // UTF-8 BOM for Excel
            
            // Add headers
            $headers = ['No', 'Bulan', 'Nama Mahasiswa', 'Tanggal', 'Skor Total', 'Kategori Stress'];
            $csvContent .= implode(',', array_map(function($header) {
                return '"' . str_replace('"', '""', $header) . '"';
            }, $headers)) . "\n";

            // Add data rows
            $no = 1;
            foreach ($feedbacks as $feedback) {
                $monthLabel = $feedback->created_at->locale('id')->isoFormat('MMMM YYYY');
                
                $row = [
                    $no,
                    $monthLabel,
                    $feedback->user->username ?? 'Unknown',
                    $feedback->created_at->format('d/m/Y'),
                    $feedback->total_score,
                    $feedback->stress_level
                ];
                
                $csvContent .= implode(',', array_map(function($field) {
                    return '"' . str_replace('"', '""', $field) . '"';
                }, $row)) . "\n";
                
                $no++;
            }

            // Return CSV response
            return Response::make($csvContent, 200, [
                'Content-Type' => 'text/csv; charset=UTF-8',
                'Content-Disposition' => 'attachment; filename="' . $filename . '"',
                'Cache-Control' => 'no-cache, must-revalidate',
                'Pragma' => 'no-cache',
                'Expires' => '0'
            ]);

        } catch (\Exception $e) {
            \Log::error('CSV Export Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengekspor data: ' . $e->getMessage()
            ], 500);
        }
    }
}
