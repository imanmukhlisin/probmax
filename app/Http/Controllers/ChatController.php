<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ChatController extends Controller
{
    public function chat(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
            'history' => 'nullable|array'
        ]);

        $user = $request->user();
        $userMessage = $request->message;
        $apiKey = env('GEMINI_API_KEY');

        if (!$apiKey) {
            return response()->json([
                'message' => 'Maaf, layanan AI belum dikonfigurasi. Silakan hubungi administrator.'
            ], 500);
        }

        $lastCheck = \App\Models\DailyFeedback::where('user_id', $user->id)->orderBy('created_at', 'desc')->first();
        
        $userContext = "Nama Pengguna: {$user->username}\n";
        if ($lastCheck) {
            $userContext .= "Status Kesehatan Mental Terakhir (Cek Harian): {$lastCheck->stress_level} (Skor: {$lastCheck->total_score})\n";
        } else {
            $userContext .= "Status Kesehatan Mental Terakhir: Belum ada data.\n";
        }

        // System prompt untuk konteks aplikasi
        $systemPrompt = "Kamu adalah CodeFit AI, teman curhat dan asisten kesehatan mental khusus untuk mahasiswa keperawatan di aplikasi CodeFit Innovate.

KONTEKS PENGGUNA SAAT INI:
{$userContext}

PRINSIP KOMUNIKASI:
1. Jawab secara kontekstual dan empati, bukan jawaban template.
2. Gunakan Bahasa Indonesia yang hangat, ramah, dan natural (seperti teman bicara), tidak kaku/medis berat.
3. Jika pengguna menyebutkan masalah mental (stres, cemas, sedih, dll), jelaskan secara singkat dan mudah dipahami.
4. Di akhir setiap jawaban, WAJIB ajukan SATU pertanyaan lanjutan yang relevan dan reflektif untuk memancing pengguna bercerita lebih lanjut.
5. Gunakan nama ({$user->username}) secara alami dalam percakapan agar terasa personal.

LARANGAN KERAS:
1. JANGAN memberikan jawaban template seperti 'terima kasih sudah berbagi'.
2. JANGAN langsung menyarankan fitur aplikasi (kecuali pengguna bertanya atau percakapan sudah sangat mendalam).
3. JANGAN melakukan diagnosa medis atau memberikan label penyakit.
4. JANGAN memutus percakapan secara sepihak.
5. JANGAN menyebutkan ini hanya saran umum kecuali sangat terpaksa.

Tujuanmu adalah menjadi pendengar yang baik bagi para calon perawat.";

        // Prepare context/history for Gemini
        $contents = [];
        $history = $request->history ?? [];
        foreach ($history as $msg) {
            if ($msg['sender'] === 'bot' || $msg['sender'] === 'user') {
                $contents[] = [
                    'role' => $msg['sender'] === 'bot' ? 'model' : 'user',
                    'parts' => [['text' => $msg['text']]]
                ];
            }
        }

        // Add the current user message
        $contents[] = [
            'role' => 'user',
            'parts' => [['text' => $userMessage]]
        ];

        try {
            // Call Gemini API with proper System Instruction
            $response = Http::timeout(40)->post(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={$apiKey}",
                [
                    'system_instruction' => [
                        'parts' => [
                            ['text' => $systemPrompt]
                        ]
                    ],
                    'contents' => $contents,
                    'generationConfig' => [
                        'temperature' => 0.8,
                        'maxOutputTokens' => 300,
                    ]
                ]
            );

            if ($response->successful()) {
                $data = $response->json();
                $aiResponse = $data['candidates'][0]['content']['parts'][0]['text'] ?? 'Maaf, saya tidak bisa memproses pesan Anda saat ini.';
                
                return response()->json([
                    'message' => trim($aiResponse)
                ]);
            } else {
                // Fallback to simple responses if API fails
                return response()->json([
                    'message' => $this->getFallbackResponse($userMessage)
                ]);
            }
        } catch (\Exception $e) {
            \Log::error('Gemini API Error: ' . $e->getMessage());
            
            return response()->json([
                'message' => $this->getFallbackResponse($userMessage)
            ]);
        }
    }

    private function getFallbackResponse($message)
    {
        $message = strtolower($message);
        
        if (str_contains($message, 'halo') || str_contains($message, 'hai')) {
            return "Halo! Senang bisa ngobrol sama kamu hari ini. Gimana kabarmu, ada sesuatu yang lagi ada di pikiran?";
        }
        
        if (str_contains($message, 'stres') || str_contains($message, 'tertekan')) {
            return "Aku mengerti banget, stres itu rasanya berat banget ya di badan sama pikiran. Biasanya kalau lagi tertekan gini, apa sih hal utama yang bikin kamu rasa terbebani banget?";
        }
        
        if (str_contains($message, 'cemas') || str_contains($message, 'khawatir')) {
            return "Rasa cemas itu emang gak enak banget, kayak ada yang ngeganjel terus ya. Boleh tau nggak, apa yang biasanya muncul di pikiran kamu pas rasa cemas itu dateng?";
        }
        
        if (str_contains($message, 'sedih') || str_contains($message, 'depresi')) {
            return "Makasih ya udah mau cerita ke aku. Sedih yang dalam emang butuh waktu buat dipahami. Sejak kapan perasaan ini mulai terasa berat buat kamu?";
        }
        
        if (str_contains($message, 'terima kasih') || str_contains($message, 'makasih')) {
            return "Sama-sama! Aku seneng bisa nemenin kamu cerita. Apa ada hal lain yang pengen kamu obrolin atau luapin ke aku?";
        }
        
        return "Aku dengerin kok. Kayaknya itu emang bukan hal yang gampang buat dihadapi ya. Boleh ceritain lebih lanjut nggak soal apa yang lagi kamu rasain sekarang?";
    }
}
