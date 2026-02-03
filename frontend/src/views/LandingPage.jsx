import { Link } from "react-router-dom";
import { useState } from "react";

export default function LandingPage() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      image: "/features/game.png",
      title: "PMC Game",
      description: "Isi hal-hal menarik, cari tahu mood kamu hari ini, dan temukan aktivitas seru buat ngisi waktu!",
      color: "from-blue-400 to-cyan-400",
    },
    {
      image: "/features/check.png",
      title: "Cek Kesehatan Mental",
      description: "Pantau kesehatan mentalmu secara rutin dengan tes yang tervalidasi secara klinis.",
      color: "from-purple-400 to-pink-400",
    },
    {
      image: "/features/consultation.png",
      title: "Konsultasi Ahli",
      description: "Jadwalkan sesi bincang santai dengan konselor atau psikolog profesional kami.",
      color: "from-orange-400 to-red-400",
    },
    {
      image: "/features/ai.png",
      title: "Chat AI",
      description: "Teman bicara AI yang siap mendengarkan dan memberimu saran positif 24/7.",
      color: "from-green-400 to-teal-400",
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-white to-secondary-light">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <img src="/logo-unriyo.png" alt="Logo UNRIYO" className="w-10 h-10 object-contain" onError={(e) => e.target.style.display='none'} />
              <span className="text-xl md:text-2xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                ProbMaxCare
              </span>
            </div>
          </div>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="text-center animate-fade-in-up">
          <h1 className="text-3xl md:text-5xl font-black text-gray-800 mb-6 tracking-tight">
            ProbMaxCare
          </h1>
          <p className="text-base md:text-lg text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed px-4 font-medium italic">
            "Kesehatan mental adalah fondasi kebahagiaan dan keberhasilan anda. <br className="hidden md:block"/> Bersama, kita temukan jalan menuju keseimbangan dan ketenangan jiwa."
          </p>
          
          {/* Proposal Style Hero Card - Responsive Fix */}
          <div className="relative max-w-4xl mx-auto min-h-[350px] md:aspect-[21/9] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white mb-16 group flex items-center justify-center">
            <img 
              src="/welcome-bg.png" 
              alt="Ocean Sunrise" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/10"></div>
            
            <div className="relative z-10 w-full p-4 sm:p-10 flex justify-center">
              <div className="bg-white/95 backdrop-blur-md p-6 sm:p-12 rounded-[2rem] shadow-xl max-w-lg w-full text-center border border-white/50 animate-fade-in mx-auto">
                <h2 className="text-xl sm:text-2xl font-black text-gray-800 mb-3">
                  Hai, Selamat Datang di ProbMaxCare! ☀️
                </h2>
                <p className="text-gray-600 text-sm sm:text-base font-medium mb-8 leading-relaxed">
                  Ayo mulai perjalananmu bersama kami. Silakan login atau registrasi untuk melanjutkan. 🙂
                </p>
                <div className="flex gap-4 justify-center">
                  <Link 
                    to="/login" 
                    className="flex-1 max-w-[140px] py-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-black text-sm transition-all shadow-lg hover:shadow-blue-200 active:scale-95"
                  >
                    Masuk
                  </Link>
                  <Link 
                    to="/register" 
                    className="flex-1 max-w-[140px] py-3 rounded-full bg-accent-green hover:bg-green-600 text-white font-black text-sm transition-all shadow-lg hover:shadow-green-200 active:scale-95"
                  >
                    Daftar
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-800 mb-4">Fitur Keren Kami</h2>
            <p className="text-gray-600 text-lg">Berbagai fitur untuk mendukung kesehatan mentalmu</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card p-6 overflow-hidden hover:-translate-y-2 transition-all cursor-pointer group border-2 border-transparent hover:border-primary/20 bg-white"
              >
                <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-gray-100 relative shadow-inner">
                  <img 
                    src={feature.image} 
                    alt={feature.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                </div>
                <h3 className="font-bold text-xl text-gray-800 mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gradient-to-br from-primary-light to-secondary-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <h2 className="text-4xl font-black text-gray-800 mb-6">Tentang Kami</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-2xl">
                    🎓
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Universitas Respati Yogyakarta</h3>
                    <p className="text-sm">
                      Kami adalah mahasiswa dari Universitas Respati Yogyakarta Fakultas Ilmu Kesehatan dan Fakultas Sains dan Teknologi. Website ini dibuat dan dikembangkan oleh mahasiswa prodi SI (Sistem Informasi) Universitas Respati Yogyakarta dan dibantu untuk pengembangan lebih lanjut oleh gabungan mahasiswa Fakultas Ilmu Kesehatan Universitas Respati Yogyakarta prodi SI Keperawatan dan SI Kebidanan.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 text-2xl">
                    🎯
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Tujuan Kami</h3>
                    <p className="text-sm">
                      Membantu mahasiswa keperawatan memahami dan mengelola kesehatan mental mereka melalui edukasi dan dukungan yang mudah diakses.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-accent-green/20 flex items-center justify-center flex-shrink-0 text-2xl">
                    💚
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Komitmen Kami</h3>
                    <p className="text-sm">
                      Menyediakan platform yang aman, privat, dan suportif untuk semua mahasiswa yang membutuhkan bantuan terkait kesehatan mental.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative flex justify-center items-center">
              <div className="w-64 h-64 rounded-full bg-white/50 backdrop-blur-sm border-2 border-white shadow-xl flex items-center justify-center p-8">
                <img src="/logo-unriyo.png" alt="Logo UNRIYO" className="w-full h-full object-contain drop-shadow-lg" />
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/logo-unriyo.png" alt="Logo" className="w-12 h-12 object-contain" />
                <span className="text-2xl font-black text-white">ProbMaxCare</span>
              </div>
              <p className="text-gray-400 text-sm">
                Platform edukasi kesehatan mental mahasiswa Universitas Respati Yogyakarta.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Fitur</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>PMC Game</li>
                <li>Cek Kesehatan Mental</li>
                <li>LiveChat AI</li>
                <li>Buat Janji Konseling</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Kontak</h3>
              <p className="text-sm text-gray-400">
                Universitas Respati Yogyakarta<br />
                Fakultas Ilmu Kesehatan<br />
                Program Studi Keperawatan
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            © 2026 CodeFit Innovate. All rights reserved. Made with 💚 for mental health awareness.
          </div>
        </div>
      </footer>
    </div>
  );
}
