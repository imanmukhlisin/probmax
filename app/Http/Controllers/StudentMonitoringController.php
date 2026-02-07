<?php

namespace App\Http\Controllers;

use App\Models\DailyFeedback;
use Illuminate\Http\Request;

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
        // Get all daily feedback with user data
        $feedbacks = DailyFeedback::with('user:id,username')
            ->orderBy('created_at', 'desc')
            ->get();

        $filename = 'Monitoring_Mahasiswa_' . date('Y-m-d_His') . '.csv';

        // Set headers for CSV download
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename="' . $filename . '"');
        header('Cache-Control: max-age=0');

        // Open output stream
        $output = fopen('php://output', 'w');

        // Add BOM for proper UTF-8 encoding in Excel
        fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF));

        // Write CSV headers
        fputcsv($output, ['No', 'Bulan', 'Nama Mahasiswa', 'Tanggal', 'Skor Total', 'Kategori Stress']);

        // Write data rows
        $no = 1;
        foreach ($feedbacks as $feedback) {
            $monthLabel = $feedback->created_at->locale('id')->isoFormat('MMMM YYYY');
            
            fputcsv($output, [
                $no,
                $monthLabel,
                $feedback->user->username ?? 'Unknown',
                $feedback->created_at->format('d/m/Y'),
                $feedback->total_score,
                $feedback->stress_level
            ]);
            
            $no++;
        }

        fclose($output);
        exit;
    }
}
