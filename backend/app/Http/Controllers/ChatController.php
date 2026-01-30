<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ChatController extends Controller
{
    public function chat(Request $request)
    {
        $request->validate([
            'message' => 'required|string'
        ]);

        $userMessage = $request->message;
        
        // Get Gemini API Key from .env
        $apiKey = env('GEMINI_API_KEY');
        
        if (!$apiKey) {
            return response()->json([
                'message' => 'Maaf, layanan AI belum dikonfigurasi. Silakan hubungi administrator.'
            ], 500);
        }

        // System prompt untuk konteks aplikasi
        $systemPrompt = "Kamu adalah Probmax AI, asisten kesehatan mental untuk mahasiswa keperawatan di aplikasi ProbmaxCare. 

Konteks Aplikasi:
- ProbmaxCare adalah platform edukasi kesehatan mental untuk mahasiswa keperawatan
- Fitur utama: Cek Kesehatan Harian (self-assessment), PMC Game (mood tracker), LiveChat AI (kamu), dan Buat Janji (konseling dengan dosen/psikolog)
- Tujuan: membantu mahasiswa memahami dan mengelola kesehatan mental mereka

Peranmu:
1. Berikan dukungan emosional yang hangat dan empati
2. Edukasi tentang kesehatan mental dengan bahasa yang mudah dipahami
3. Sarankan fitur ProbmaxCare yang relevan (misalnya: jika stres, sarankan Cek Harian atau Buat Janji)
4. Jangan diagnosa atau berikan saran medis spesifik
5. Jika kondisi serius, sarankan untuk konsultasi profesional via fitur Buat Janji
6. Gunakan bahasa Indonesia yang ramah dan tidak kaku
7. Jawab singkat dan to-the-point (maksimal 3-4 kalimat)

PENTING: Kamu BUKAN pengganti konselor profesional, hanya memberikan dukungan awal dan edukasi umum.";

        try {
            // Call Gemini API
            $response = Http::timeout(30)->post(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={$apiKey}",
                [
                    'contents' => [
                        [
                            'parts' => [
                                ['text' => $systemPrompt],
                                ['text' => "User: " . $userMessage]
                            ]
                        ]
                    ],
                    'generationConfig' => [
                        'temperature' => 0.7,
                        'maxOutputTokens' => 200,
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
            return "Halo! Saya Probmax AI 🤖. Ada yang bisa saya bantu terkait kesehatan mental hari ini?";
        }
        
        if (str_contains($message, 'stres') || str_contains($message, 'tertekan')) {
            return "Saya mengerti perasaan stres bisa sangat berat. Cobalah teknik pernapasan dalam atau istirahat sejenak. Kamu juga bisa gunakan fitur 'Cek Harian' untuk memahami kondisimu lebih baik, atau 'Buat Janji' untuk konsultasi dengan profesional.";
        }
        
        if (str_contains($message, 'cemas') || str_contains($message, 'khawatir')) {
            return "Perasaan cemas itu wajar, tapi jangan biarkan menguasai dirimu. Coba fokus pada hal-hal yang bisa kamu kontrol. Fitur 'PMC Game' bisa membantu kamu tracking mood harian. Jika cemas berlanjut, pertimbangkan untuk konsultasi via 'Buat Janji'.";
        }
        
        if (str_contains($message, 'sedih') || str_contains($message, 'depresi')) {
            return "Saya turut prihatin mendengarnya. Perasaan sedih yang berkepanjangan perlu perhatian serius. Yuk gunakan fitur 'Cek Harian' untuk monitor kondisimu, dan jangan ragu untuk 'Buat Janji' konseling dengan profesional kami.";
        }
        
        if (str_contains($message, 'terima kasih') || str_contains($message, 'makasih')) {
            return "Sama-sama! Senang bisa membantu. Jangan ragu untuk chat lagi kapan saja ya 😊";
        }
        
        return "Terima kasih sudah berbagi. Saya di sini untuk mendengarkan. Kalau kamu butuh bantuan lebih lanjut, coba gunakan fitur 'Cek Harian' atau 'Buat Janji' untuk konsultasi dengan profesional.";
    }
}
