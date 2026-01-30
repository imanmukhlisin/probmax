import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider"

export default function Dashboard() {
  const { user } = useStateContext();
  const [stats, setStats] = useState({}); // Admin stats
  const [userSummary, setUserSummary] = useState(null); // Student stats
  const [consultantSummary, setConsultantSummary] = useState(null); // Consultant stats
  const [users, setUsers] = useState([]); // Admin User Management List
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (user.role_id === 1) { // Admin
        axiosClient.get('/admin/stats')
            .then(({data}) => { 
                setStats(data);
                // Also fetch users for management
                return axiosClient.get('/admin/users');
            })
            .then(({data}) => setUsers(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    } else if (user.role_id === 2) { // Consultant
        axiosClient.get('/dashboard/consultant-summary')
            .then(({data}) => setConsultantSummary(data))
            .catch(err => console.error(err))
             .finally(() => setLoading(false));
    } else if (user.role_id === 3) { // Student
        axiosClient.get('/dashboard/user-summary')
            .then(({data}) => setUserSummary(data))
            .catch(err => console.error(err))
             .finally(() => setLoading(false));
    }
  }, [user]);

  const updateUserRole = (userId, newRoleId) => {
      if(!window.confirm("Apakah Anda yakin ingin mengubah role user ini?")) return;
      axiosClient.put(`/admin/users/${userId}`, { role_id: newRoleId })
        .then(() => {
            alert("Role user berhasil diupdate!");
            // Refresh list
            axiosClient.get('/admin/users').then(({data}) => setUsers(data));
        })
        .catch(err => alert("Failed to update role"));
  }

  if (loading) return (
      <div className="flex justify-center items-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
               <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
               <p className="text-gray-500 font-medium animate-pulse">Memuat Dashboard...</p>
          </div>
      </div>
  );

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold text-gray-800">
                Halo, <span className="text-primary">{user.username}</span> 👋
            </h1>
            <p className="text-gray-500 mt-1">Selamat datang kembali! Bagaimana perasaanmu hari ini?</p>
        </div>
        <div>
             <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${
                 user.role_id === 1 ? 'bg-red-100 text-red-700' : 
                 user.role_id === 2 ? 'bg-purple-100 text-purple-700' : 
                 'bg-green-100 text-green-700'
             }`}>
                {user.role_id === 1 ? 'Administrator' : user.role_id === 2 ? 'Konsultan' : 'Mahasiswa'}
             </span>
        </div>
      </div>
      
      {/* ---------------- ADMIN DASHBOARD ---------------- */}
      {user.role_id === 1 && (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card border-l-4 border-primary flex items-center justify-between">
                    <div>
                        <div className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total User</div>
                        <div className="text-3xl font-bold text-gray-800 mt-1">{stats.total_users || 0}</div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-full text-primary">👥</div>
                </div>
                <div className="card border-l-4 border-secondary flex items-center justify-between">
                     <div>
                        <div className="text-gray-500 text-sm font-medium uppercase tracking-wider">Feedback</div>
                        <div className="text-3xl font-bold text-gray-800 mt-1">{stats.total_feedbacks || 0}</div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-full text-secondary">📝</div>
                </div>
            </div>

            <div className="card shadow-md border-none">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-primary-dark">Manajemen User</h2>
                        <p className="text-sm text-gray-400">Informasi data user yang terdaftar dan aktif</p>
                    </div>
                    <div className="text-sm text-gray-400">Kelola role pengguna</div>
                </div>
                <div className="overflow-x-auto -mx-6 sm:mx-0">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100 text-gray-400 text-[10px] md:text-sm font-semibold">
                                <th className="px-6 py-6 transition-all">Pengguna</th>
                                <th className="px-6 py-6 hidden sm:table-cell">Email</th>
                                <th className="px-6 py-6">Status Role</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="p-10 text-center text-gray-400 italic">Belum ada data user.</td>
                                </tr>
                            )}
                            {users.map(u => (
                                <tr key={u.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-6 transition-all">
                                        <div className="font-bold text-gray-800">{u.username}</div>
                                        <div className="text-[10px] text-gray-400 sm:hidden">{u.email}</div>
                                    </td>
                                    <td className="px-6 py-6 text-gray-500 hidden sm:table-cell">{u.email}</td>
                                    <td className="px-6 py-6">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                            u.role_id === 1 ? 'bg-red-100 text-red-700' :
                                            u.role_id === 2 ? 'bg-purple-100 text-purple-700' :
                                            'bg-green-100 text-green-700'
                                        }`}>
                                            {u.role ? u.role.name : (u.role_id === 1 ? 'Admin' : u.role_id === 2 ? 'Consultant' : 'Mahasiswa')}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
      )}

      {/* ---------------- CONSULTANT DASHBOARD ---------------- */}
      {user.role_id === 2 && consultantSummary && (
          <div className="space-y-10">
            {/* 1. Summary Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card border-l-4 border-primary bg-white shadow-sm">
                    <div className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Appointment Minggu Ini</div>
                    <div className="text-4xl font-black text-gray-800">{consultantSummary?.stats?.appointments_this_week || 0}</div>
                    <div className="text-xs text-gray-400 mt-2">Total janji terjadwal pekan ini</div>
                </div>
                
                <div className="card border-l-4 border-secondary bg-white shadow-sm">
                    <div className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Appointment Terdekat</div>
                    {consultantSummary?.stats?.nearest_appointment ? (
                        <div>
                            <div className="text-lg font-black text-gray-800 truncate">
                                {consultantSummary?.stats?.nearest_appointment?.user?.username}
                            </div>
                            <div className="text-sm font-bold text-secondary mt-1">
                                📅 {new Date(consultantSummary?.stats?.nearest_appointment?.appointment_date).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'})} 
                                <span className="mx-2">|</span> 
                                ⏰ {consultantSummary?.stats?.nearest_appointment?.appointment_time}
                            </div>
                        </div>
                    ) : (
                        <div className="text-gray-400 italic text-sm mt-2">Tidak ada janji mendatamg</div>
                    )}
                </div>

                <div className="card border-l-4 border-accent-green bg-white shadow-sm">
                    <div className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Jadwal Aktif</div>
                    <div className="text-4xl font-black text-gray-800">{consultantSummary?.stats?.active_schedules_count || 0}</div>
                    <div className="text-xs text-gray-400 mt-2">Slot waktu tersedia untuk Anda</div>
                </div>
            </div>

            {/* 2. Appointments Section */}
            <div className="card shadow-md border-none pb-0">
                <div className="flex justify-between items-center mb-6 px-6 pt-2">
                    <h2 className="text-xl font-black text-gray-800">Janji Konseling Terbaru</h2>
                    <Link to="/consultant/appointments" className="text-primary text-sm font-bold hover:underline">Lihat Semua</Link>
                </div>
                <div className="overflow-x-auto -mx-6 sm:mx-0">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest ">
                                <th className="px-6 py-4">Mahasiswa</th>
                                <th className="px-6 py-4">Waktu</th>
                                <th className="px-6 py-4 hidden md:table-cell">Lokasi</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-xs md:text-sm">
                            {(!consultantSummary?.recent_appointments || consultantSummary.recent_appointments.length === 0) && (
                                <tr>
                                    <td colSpan="5" className="p-10 text-center text-gray-400 italic">Belum ada janji temu tercatat.</td>
                                </tr>
                            )}
                            {consultantSummary?.recent_appointments?.map(app => (
                                <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-5 font-bold text-gray-800">{app.user.username}</td>
                                    <td className="px-6 py-5">
                                        <div className="font-bold text-gray-700">{new Date(app.appointment_date).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'})}</div>
                                        <div className="text-[10px] text-gray-400">{app.appointment_time}</div>
                                    </td>
                                    <td className="px-6 py-5 text-gray-500 hidden md:table-cell">{app.location || '-'}</td>
                                    <td className="px-6 py-5">
                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                            app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                            app.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                                            app.status === 'completed' ? 'bg-green-100 text-green-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <Link to="/consultant/appointments" className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors inline-block border border-transparent hover:border-primary/20">
                                            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 3. Schedules Section */}
                <div className="card shadow-md border-none">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-black text-gray-800">Jadwal Saya</h2>
                        <Link to="/schedules" className="text-primary text-sm font-bold hover:underline">Kelola Jadwal</Link>
                    </div>
                    <div className="space-y-4">
                        {(!consultantSummary?.upcoming_schedules || consultantSummary.upcoming_schedules.length === 0) && (
                            <p className="p-6 text-center text-gray-400 italic text-sm">Belum ada jadwal aktif.</p>
                        )}
                        {consultantSummary?.upcoming_schedules?.map(sch => (
                            <div key={sch.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-primary/30 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary font-bold">
                                        {new Date(sch.date).getDate()}
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-700">{new Date(sch.date).toLocaleDateString('id-ID', {weekday: 'long', month: 'short', year: 'numeric'})}</div>
                                        <div className="text-xs text-gray-400">{sch.start_time} - {sch.end_time}</div>
                                    </div>
                                </div>
                                <div className="text-xs font-black text-primary px-3 py-1 bg-white rounded-full shadow-sm border border-gray-100">AKTIF</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. Analytics Section */}
                <div className="card shadow-md border-none">
                    <h2 className="text-xl font-black text-gray-800 mb-6">Gambaran Kondisi Mahasiswa</h2>
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Distribusi Cek Harian</h3>
                            <div className="space-y-3">
                                {consultantSummary?.analytics?.category_distribution?.map(cat => (
                                    <div key={cat.category}>
                                        <div className="flex justify-between text-xs font-bold mb-1">
                                            <span className="text-gray-600">{cat.category}</span>
                                            <span className="text-gray-400">{cat.count} orang</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full ${
                                                    cat.category === 'Normal' ? 'bg-green-400' :
                                                    cat.category === 'Stres Ringan' ? 'bg-yellow-400' :
                                                    cat.category === 'Stres Sedang' ? 'bg-orange-400' : 'bg-red-400'
                                                }`}
                                                style={{ width: `${(cat.count / 10) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Mood Umum Minggu Ini</h3>
                            <div className="flex flex-wrap gap-2">
                                {consultantSummary?.analytics?.mood_trends?.map(mood => (
                                    <div key={mood.selected_mood} className="px-4 py-2 bg-purple-50 rounded-2xl border border-purple-100 flex items-center gap-3">
                                        <span className="text-lg">
                                            {mood.selected_mood === 'Senang' ? '😊' : 
                                             mood.selected_mood === 'Biasa saja' ? '😐' : 
                                             mood.selected_mood === 'Sedih' ? '😢' : 
                                             mood.selected_mood === 'Marah' ? '😠' : '😌'}
                                        </span>
                                        <div>
                                            <div className="text-[10px] font-black text-purple-700 uppercase leading-none">{mood.selected_mood}</div>
                                            <div className="text-xs font-bold text-gray-500">{mood.count} total</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 5. Shortcuts Section */}
            <div>
                <h2 className="text-xl font-black text-gray-800 mb-6">Navigasi Cepat</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link to="/schedules" className="card p-5 bg-white border-none shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group">
                        <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:bg-blue-500 group-hover:text-white transition-colors">📅</div>
                        <div className="font-black text-gray-700 text-sm">Kelola Jadwal</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">Atur ketersediaan</div>
                    </Link>
                    <Link to="/consultant/appointments" className="card p-5 bg-white border-none shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group">
                        <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:bg-purple-500 group-hover:text-white transition-colors">🤝</div>
                        <div className="font-black text-gray-700 text-sm">Semua Janji</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">Lihat histori janji</div>
                    </Link>
                    <Link to="/consultant/analytics" className="card p-5 bg-white border-none shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group">
                        <div className="w-12 h-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:bg-green-500 group-hover:text-white transition-colors">📊</div>
                        <div className="font-black text-gray-700 text-sm">Rekap Mahasiswa</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">Data agregat mental</div>
                    </Link>
                    <Link to="/consultant/analytics" className="card p-5 bg-white border-none shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group">
                        <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:bg-orange-500 group-hover:text-white transition-colors">🎭</div>
                        <div className="font-black text-gray-700 text-sm">Statistik Mood</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">Analisis mood mingguan</div>
                    </Link>
                </div>
            </div>
          </div>
      )}

      {/* ---------------- STUDENT DASHBOARD ---------------- */}
      {user.role_id === 3 && userSummary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Last Daily Check */}
            <div className="card relative overflow-hidden group hover:border-accent-green transition-colors">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <svg className="w-24 h-24 text-accent-green" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" /></svg>
                </div>
                <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <span className="w-2 h-8 bg-accent-green rounded-full"></span>
                    Cek Harian Terakhir
                </h3>
                {userSummary.last_daily_check ? (
                    <div className="mt-2">
                        <div className="text-4xl font-bold text-gray-800">{userSummary.last_daily_check.total_score}</div>
                        <div className={`text-sm font-semibold inline-block px-2 py-1 rounded mt-2 mb-1 ${
                             userSummary.last_daily_check.stress_level.includes('Normal') ? 'bg-green-100 text-green-700' : 
                             userSummary.last_daily_check.stress_level.includes('Ringan') ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                        }`}>
                            {userSummary.last_daily_check.stress_level}
                        </div>
                        <div className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                             📅 {new Date(userSummary.last_daily_check.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'long'})}
                        </div>
                    </div>
                ) : (
                    <div className="h-32 flex flex-col justify-center text-center">
                        <p className="text-gray-400 text-sm italic">Belum ada data cek harian.</p>
                        <p className="text-gray-500 text-xs mt-1">Isi sekarang yuk!</p>
                    </div>
                )}
                 <Link to="/daily-check" className="mt-6 block text-center w-full py-2 rounded-lg bg-green-50 text-accent-green font-semibold hover:bg-accent-green hover:text-white transition-colors">
                    {userSummary.last_daily_check ? 'Cek Lagi' : 'Cek Sekarang'}
                 </Link>
            </div>

            {/* Last Mood */}
            <div className="card relative overflow-hidden group hover:border-secondary transition-colors">
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <svg className="w-24 h-24 text-secondary" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" /><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" /></svg>
                </div>
                 <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <span className="w-2 h-8 bg-secondary rounded-full"></span>
                    Mood Terakhir
                </h3>
                 {userSummary.last_mood ? (
                    <div className="mt-2">
                        <div className="text-3xl font-bold text-gray-800">
                            {userSummary.last_mood.selected_mood}
                        </div>
                        <div className="text-sm font-medium text-gray-600 mt-2">
                           <span className="text-gray-400 text-xs uppercase tracking-wide">Habit:</span><br/>
                           {userSummary.last_mood.selected_habit}
                        </div>
                        <div className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                             📅 {new Date(userSummary.last_mood.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'long'})}
                        </div>
                    </div>
                ) : (
                    <div className="h-32 flex flex-col justify-center text-center">
                        <p className="text-gray-400 text-sm italic">Belum ada mood tercatat.</p>
                        <p className="text-gray-500 text-xs mt-1">Bagaimana harimu?</p>
                    </div>
                )}
                <Link to="/pmc-game" className="mt-6 block text-center w-full py-2 rounded-lg bg-purple-50 text-secondary font-semibold hover:bg-secondary hover:text-white transition-colors">
                    Main PMC Game
                </Link>
            </div>

            {/* Next Appointment */}
            <div className="card relative overflow-hidden group hover:border-primary transition-colors">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <svg className="w-24 h-24 text-primary" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
                </div>
                <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <span className="w-2 h-8 bg-primary rounded-full"></span>
                    Janji Berikutnya
                </h3>
                 {userSummary.next_appointment ? (
                    <div className="mt-2">
                        <div className="text-2xl font-bold text-gray-800">
                             {new Date(userSummary.next_appointment.appointment_date).toLocaleDateString('id-ID', {weekday: 'long', day: 'numeric', month: 'long'})}
                        </div>
                        <div className="text-lg font-semibold text-primary mt-1 flex items-center gap-2">
                            ⏰ {userSummary.next_appointment.appointment_time}
                        </div>
                        <div className="text-sm text-gray-500 mt-2 bg-gray-50 p-2 rounded inline-block">
                            📍 {userSummary.next_appointment.location || 'Lokasi menyusul'}
                        </div>
                    </div>
                ) : (
                    <div className="h-32 flex flex-col justify-center text-center">
                        <p className="text-gray-400 text-sm italic">Tidak ada janji mendatamg.</p>
                        <p className="text-gray-500 text-xs mt-1">Butuh teman cerita?</p>
                    </div>
                )}
                 <Link to="/appointments" className="mt-6 block text-center w-full py-2 rounded-lg bg-blue-50 text-primary font-semibold hover:bg-primary hover:text-white transition-colors">
                    {userSummary.next_appointment ? 'Lihat Detail' : 'Buat Janji'}
                 </Link>
            </div>
        </div>
      )}

    </div>
  )
}
