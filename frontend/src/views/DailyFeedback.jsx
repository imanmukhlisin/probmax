import { useState, useEffect } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";

const questionnaire = [
  {
    question: "Bagaimana perasaan Anda dalam 7 hari terakhir?",
    options: [
      { label: "Merasa bahagia dan seimbang", score: 0 },
      { label: "Baik-baik saja, namun kadang merasa bosan", score: 1 },
      { label: "Lelah, kurang semangat, atau mudah tersinggung", score: 2 },
      { label: "Sering cemas atau khawatir berlebihan", score: 3 }
    ]
  },
  {
    question: "Apakah Anda memiliki seseorang untuk diajak berbicara saat sedang stres atau sedih?",
    options: [
      { label: "Ya, saya punya teman/keluarga yang bisa dipercaya", score: 0 },
      { label: "Hanya kadang-kadang, tidak selalu", score: 1 },
      { label: "Tidak, saya cenderung memendam semuanya sendiri", score: 2 },
      { label: "Saya lebih suka menulis atau mengalihkan perhatian ke hobi", score: 3 }
    ]
  },
  {
    question: "Berapa jam tidur Anda rata-rata setiap malam?",
    options: [
      { label: "Kurang dari 5 jam", score: 3 },
      { label: "5 - 6 jam", score: 2 },
      { label: "7 - 8 jam", score: 1 },
      { label: "Lebih dari 8 jam", score: 0 }
    ]
  },
  {
    question: "Apa yang biasanya Anda lakukan untuk mengatasi stres?",
    options: [
      { label: "Olahraga atau melakukan aktivitas fisik", score: 0 },
      { label: "Bermeditasi, membaca, atau melakukan hobi", score: 1 },
      { label: "Menonton film, bermain game, atau makan camilan", score: 2 },
      { label: "Tidak melakukan apa pun, hanya membiarkan stres menumpuk", score: 3 }
    ]
  },
  {
    question: "Seberapa sering Anda merasa kewalahan dengan rutinitas sehari-hari?",
    options: [
      { label: "Jarang atau tidak pernah", score: 0 },
      { label: "Kadang-kadang", score: 1 },
      { label: "Beberapa kali dalam seminggu", score: 2 },
      { label: "Hampir setiap hari", score: 3 }
    ]
  },
  {
    question: "Apakah Anda merasa puas dengan kualitas hubungan Anda dengan keluarga atau teman?",
    options: [
      { label: "Ya, sangat puas", score: 0 },
      { label: "Cukup puas", score: 1 },
      { label: "Tidak terlalu puas", score: 2 },
      { label: "Tidak puas sama sekali", score: 3 }
    ]
  },
  {
    question: "Saat menghadapi masalah, bagaimana reaksi Anda?",
    options: [
      { label: "Menghadapinya dengan berpikir positif dan tenang", score: 0 },
      { label: "Menunda penyelesaian masalah hingga terasa mendesak", score: 1 },
      { label: "Cemas atau panik, tapi tetap mencoba menyelesaikannya", score: 2 },
      { label: "Menghindari masalah sepenuhnya", score: 3 }
    ]
  },
  {
    question: "Seberapa sering Anda meluangkan waktu untuk diri sendiri (self-care)?",
    options: [
      { label: "Setiap hari", score: 0 },
      { label: "Beberapa kali seminggu", score: 1 },
      { label: "Jarang, mungkin hanya sebulan sekali", score: 2 },
      { label: "Tidak pernah sama sekali", score: 3 }
    ]
  },
  {
    question: "Apakah Anda merasa terbebani oleh ekspektasi dari orang lain (keluarga, teman, atau pekerjaan)?",
    options: [
      { label: "Tidak pernah", score: 0 },
      { label: "Kadang-kadang", score: 1 },
      { label: "Cukup sering", score: 2 },
      { label: "Sangat sering", score: 3 }
    ]
  },
  {
    question: "Apakah Anda kehilangan minat untuk melakukan kegiatan sehari-hari?",
    options: [
      { label: "Tidak", score: 0 },
      { label: "Tidak yakin", score: 1 },
      { label: "Kadang-kadang", score: 2 },
      { label: "Ya, saya tidak memiliki minat", score: 3 }
    ]
  },
  {
    question: "Apakah Anda sering merasa lelah secara fisik dan mental?",
    options: [
      { label: "Tidak", score: 0 },
      { label: "Tidak yakin", score: 1 },
      { label: "Kadang-kadang", score: 2 },
      { label: "Selalu merasa lelah", score: 3 }
    ]
  },
  {
    question: "Apakah Anda merasa kesepian satu minggu terakhir ini?",
    options: [
      { label: "Tidak", score: 0 },
      { label: "Tidak yakin", score: 1 },
      { label: "Lumayan kesepian", score: 2 },
      { label: "Sangat kesepian", score: 3 }
    ]
  },
  {
    question: "Apakah Anda memiliki harapan yang dicapai?",
    options: [
      { label: "Ya, banyak harapan", score: 0 },
      { label: "Ya, beberapa harapan", score: 1 },
      { label: "Tidak yakin", score: 2 },
      { label: "Tidak ada harapan", score: 3 }
    ]
  },
  {
    question: "Apakah Anda merasa kehilangan suatu harapan?",
    options: [
      { label: "Tidak", score: 0 },
      { label: "Tidak yakin", score: 1 },
      { label: "Ya, beberapa harapan", score: 2 },
      { label: "Ya, harapan yang sangat penting", score: 3 }
    ]
  },
  {
    question: "Seberapa sering Anda kesulitan untuk berkonsentrasi dalam kegiatan sehari-hari?",
    options: [
      { label: "Tidak pernah", score: 0 },
      { label: "Tidak yakin", score: 1 },
      { label: "Kadang-kadang", score: 2 },
      { label: "Saya kesulitan", score: 3 }
    ]
  },
  {
    question: "Apakah Anda merasa sulit untuk mengambil keputusan akhir-akhir ini?",
    options: [
      { label: "Tidak pernah", score: 0 },
      { label: "Jarang", score: 1 },
      { label: "Sering", score: 2 },
      { label: "Sangat sulit", score: 3 }
    ]
  },
  {
    question: "Apakah Anda merasa kurang percaya diri dalam melakukan aktivitas?",
    options: [
      { label: "Tetap percaya diri", score: 0 },
      { label: "Sedikit kurang yakin", score: 1 },
      { label: "Sering merasa ragu", score: 2 },
      { label: "Sangat rendah diri", score: 3 }
    ]
  },
  {
    question: "Apakah Anda sering merasa tegang atau sulit untuk rileks?",
    options: [
      { label: "Tidak pernah", score: 0 },
      { label: "Kadang-kadang", score: 1 },
      { label: "Sering", score: 2 },
      { label: "Hampir setiap saat", score: 3 }
    ]
  },
  {
    question: "Apakah Anda merasa terasing dari orang-orang di sekitar Anda?",
    options: [
      { label: "Tidak, saya merasa terhubung", score: 0 },
      { label: "Sedikit terasing", score: 1 },
      { label: "Cukup terasing", score: 2 },
      { label: "Sangat terisolasi", score: 3 }
    ]
  },
  {
    question: "Apakah Anda merasa pesimis terhadap masa depan?",
    options: [
      { label: "Optimis", score: 0 },
      { label: "Cukup optimis", score: 1 },
      { label: "Sedikit pesimis", score: 2 },
      { label: "Sangat pesimis", score: 3 }
    ]
  },
  {
    question: "Apakah Anda sering merasa pusing atau sakit perut saat stres?",
    options: [
      { label: "Tidak pernah", score: 0 },
      { label: "Jarang", score: 1 },
      { label: "Sering", score: 2 },
      { label: "Hampir setiap kali stres", score: 3 }
    ]
  },
  {
    question: "Apakah Anda mengalami perubahan nafsu makan (makan terlalu banyak atau terlalu sedikit)?",
    options: [
      { label: "Normal", score: 0 },
      { label: "Kadang berubah", score: 1 },
      { label: "Sering berubah", score: 2 },
      { label: "Berubah drastis", score: 3 }
    ]
  },
  {
    question: "Apakah Anda merasa lebih suka menarik diri dari lingkungan sosial?",
    options: [
      { label: "Tidak suka menyendiri", score: 0 },
      { label: "Kadang ingin sendiri", score: 1 },
      { label: "Sering menyendiri", score: 2 },
      { label: "Selalu menarik diri", score: 3 }
    ]
  },
  {
    question: "Apakah Anda merasa hidup Anda penuh dengan beban yang berat?",
    options: [
      { label: "Terasa ringan", score: 0 },
      { label: "Masih bisa diatasi", score: 1 },
      { label: "Terasa cukup berat", score: 2 },
      { label: "Sangat berat beban hidup", score: 3 }
    ]
  },
  {
    question: "Apakah Anda merasa memerlukan teman curhat atau bantuan profesional saat ini?",
    options: [
      { label: "Tidak butuh", score: 0 },
      { label: "Mungkin suatu saat", score: 1 },
      { label: "Mulai membutuhkan", score: 2 },
      { label: "Sangat membutuhkan sekarang", score: 3 }
    ]
  }
];

// Helper to determine score color/category
const getResultCategory = (score) => {
    // adjusted threshold for 25 questions (max score 75)
    if (score <= 18) return { category: 'Normal', color: 'bg-green-100 text-green-800', border: 'border-green-500', icon: '😊' };
    if (score <= 37) return { category: 'Stres Ringan', color: 'bg-yellow-100 text-yellow-800', border: 'border-yellow-500', icon: '😐' };
    if (score <= 56) return { category: 'Stres Sedang', color: 'bg-orange-100 text-orange-800', border: 'border-orange-500', icon: '😟' };
    return { category: 'Stres Berat', color: 'bg-red-100 text-red-800', border: 'border-red-500', icon: '😰' };
};

export default function DailyFeedback() {
    const { setNotification } = useStateContext();
    const [answers, setAnswers] = useState(Array(questionnaire.length).fill(null));
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    const handleOptionChange = (qIndex, score) => {
        const newAnswers = [...answers];
        newAnswers[qIndex] = score;
        setAnswers(newAnswers);
    };

    const submitFeedback = (ev) => {
        ev.preventDefault();
        
        if (answers.includes(null)) {
            alert("Harap jawab semua pertanyaan.");
            return;
        }

        const total_score = answers.reduce((a, b) => a + (b || 0), 0);
        const cat = getResultCategory(total_score);

        setLoading(true);
        axiosClient.post('/daily-feedback', {
            total_score,
            stress_level: cat.category,
            color: cat.color,
            answers_json: answers
        })
            .then(({data}) => {
                setLoading(false);
                setResult(data);
                setSubmitted(true);
                setNotification("Cek harian berhasil disimpan!");
            })
            .catch(err => {
                setLoading(false);
                console.error(err);
                alert("Gagal menyimpan data.");
            });
    };

    if (submitted && result) {
        const cat = getResultCategory(result.total_score);
        return (
            <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-up">
                <div className={`card text-center p-10 border-t-8 ${cat.border} relative overflow-hidden`}>
                     <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-gradient-to-b from-current to-transparent pointer-events-none"></div>
                     
                     <div className="text-6xl mb-4">{cat.icon}</div>
                     <h2 className="text-2xl font-bold text-gray-800 mb-2">Hasil Cek Harian Kamu</h2>
                     
                     <div className="my-6">
                        <span className={`text-5xl font-extrabold ${cat.color.split(' ')[1]}`}>{result.total_score}</span>
                        <p className="text-gray-400 text-sm mt-1">Skor Total</p>
                     </div>

                     <div className={`inline-block px-6 py-2 rounded-full text-lg font-bold mb-6 ${cat.color}`}>
                         {cat.category}
                     </div>

                     <p className="text-gray-600 mb-8 max-w-lg mx-auto leading-relaxed">
                         {cat.category === 'Normal' ? "Kondisi mentalmu tampak stabil. Pertahankan gaya hidup sehatmu!" :
                          cat.category === 'Stres Ringan' ? "Kamu mungkin sedang banyak pikiran. Istirahat sejenak dan lakukan hobi ya." :
                          "Sepertinya kamu sedang dalam tekanan cukup berat. Jangan ragu konsultasi dengan profesional."}
                     </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/appointments" className="btn-primary">
                             {cat.category.includes('Berat') ? 'Jadwalkan Konsultasi Darurat' : 'Buat Janji Temu'}
                        </Link>
                         <Link to="/dashboard" className="btn-secondary">
                             Kembali ke Dashboard
                        </Link>
                    </div>
                </div>
                
                 <div className="text-center">
                    <Link to="/daily-check/history" className="text-primary hover:text-primary-dark underline font-medium">Lihat Riwayat Saya</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#F0F4F8] -mt-8 -mx-4 sm:-mx-8 p-4 sm:p-10">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-sm mb-4 text-primary">
                         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                    </div>
                    <h1 className="text-3xl font-black text-gray-800 mb-3 tracking-tight">Cek Kesehatan Mental</h1>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-sm mx-auto">
                        Jawab pertanyaan di bawah dengan jujur untuk mengetahui tingkat stres Anda hari ini.
                    </p>
                </div>

                <form onSubmit={submitFeedback} className="card bg-white shadow-2xl border-none p-8 sm:p-12 rounded-[3rem] space-y-12 animate-fade-in-up">
                    {questionnaire.map((q, qIndex) => (
                        <div key={qIndex} className="space-y-6">
                            <h3 className="text-lg font-bold text-gray-800 leading-snug">
                                {qIndex + 1}. {q.question}
                            </h3>
                            <div className="space-y-4">
                                {q.options.map((option, oIndex) => (
                                    <label 
                                        key={oIndex}
                                        className={`flex items-start gap-4 p-2 -ml-2 rounded-2xl cursor-pointer group transition-all hover:bg-gray-50`}
                                    >
                                        <div className="relative flex items-center mt-1 shrink-0">
                                            <input 
                                                type="radio"
                                                name={`question-${qIndex}`}
                                                value={option.score}
                                                required
                                                checked={answers[qIndex] === option.score}
                                                onChange={() => handleOptionChange(qIndex, option.score)}
                                                className="peer appearance-none w-6 h-6 border-2 border-gray-300 rounded-full checked:border-primary transition-all cursor-pointer"
                                            />
                                            <div className="absolute inset-0 m-auto w-3 h-3 bg-primary rounded-full scale-0 peer-checked:scale-100 transition-transform"></div>
                                        </div>
                                        <span className={`text-base font-medium leading-relaxed transition-colors ${
                                            answers[qIndex] === option.score ? 'text-gray-900 font-bold' : 'text-gray-600 group-hover:text-gray-800'
                                        }`}>
                                            {option.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="pt-8">
                        <button 
                            disabled={loading || answers.includes(null)}
                            className="btn-primary w-full py-5 text-xl font-black shadow-xl shadow-primary/40 rounded-3xl"
                        >
                            {loading ? 'Menyimpan...' : 'Selesai & Lihat Hasil ✨'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
