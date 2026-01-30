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
                return axiosClient.get('/users');
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
      if(!window.confirm("Are you sure you want to change this user's role?")) return;
      axiosClient.put(`/users/${userId}`, { role_id: newRoleId })
        .then(() => {
            alert("User role updated!");
            // Refresh list
            axiosClient.get('/users').then(({data}) => setUsers(data));
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

            <div className="card">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-primary-dark">Manajemen User</h2>
                    <div className="text-sm text-gray-400">Kelola role pengguna</div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 text-gray-500 text-sm">
                                <th className="p-4 font-semibold">Pengguna</th>
                                <th className="p-4 font-semibold">Email</th>
                                <th className="p-4 font-semibold">Status Role</th>
                                <th className="p-4 font-semibold">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {users.map(u => (
                                <tr key={u.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="p-4">
                                        <div className="font-medium text-gray-800">{u.username}</div>
                                    </td>
                                    <td className="p-4 text-gray-600">{u.email}</td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            u.role_id===1?'bg-red-100 text-red-800':
                                            u.role_id===2?'bg-purple-100 text-purple-800':
                                            'bg-green-100 text-green-800'
                                        }`}>
                                            {u.role ? u.role.name : (u.role_id === 1 ? 'Admin' : u.role_id === 2 ? 'Consultant' : 'User')}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {u.id !== user.id && (
                                            <select 
                                                className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-primary focus:border-primary block p-2 outline-none cursor-pointer hover:border-primary transition-colors"
                                                value={u.role_id} 
                                                onChange={e => updateUserRole(u.id, e.target.value)}
                                            >
                                                <option value="1">Admin</option>
                                                <option value="2">Consultant</option>
                                                <option value="3">User</option>
                                            </select>
                                        )}
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
          <>
          
          {/* Quick Actions for Consultant */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <Link to="/consultant/analytics" className="card p-4 hover:-translate-y-1 transition-transform cursor-pointer border-none shadow-sm hover:shadow-md bg-white text-center group">
                  <div className="w-12 h-12 mx-auto bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-2xl mb-3 group-hover:bg-purple-600 group-hover:text-white transition-colors">📊</div>
                  <div className="font-semibold text-gray-700">Ringkasan Mahasiswa</div>
                  <div className="text-xs text-gray-400 mt-1">Data agregat kondisi mental</div>
              </Link>
          </div>
          </>
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

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold mb-6 text-primary-dark">Menu Cepat</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {user.role_id === 3 && (
                <>
                <Link to="/chat-ai" className="card p-4 hover:-translate-y-1 transition-transform cursor-pointer border-none shadow-sm hover:shadow-md bg-white text-center group">
                    <div className="w-12 h-12 mx-auto bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-2xl mb-3 group-hover:bg-purple-600 group-hover:text-white transition-colors">🤖</div>
                    <div className="font-semibold text-gray-700">LiveChat AI</div>
                    <div className="text-xs text-gray-400 mt-1">Teman cerita virtual</div>
                </Link>
                <Link to="/daily-check/history" className="card p-4 hover:-translate-y-1 transition-transform cursor-pointer border-none shadow-sm hover:shadow-md bg-white text-center group">
                    <div className="w-12 h-12 mx-auto bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl mb-3 group-hover:bg-green-600 group-hover:text-white transition-colors">📜</div>
                    <div className="font-semibold text-gray-700">Riwayat Cek</div>
                    <div className="text-xs text-gray-400 mt-1">Pantau perkembanganmu</div>
                </Link>
                </>
            )}
            <Link to="/profile" className="card p-4 hover:-translate-y-1 transition-transform cursor-pointer border-none shadow-sm hover:shadow-md bg-white text-center group">
                <div className="w-12 h-12 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">👤</div>
                <div className="font-semibold text-gray-700">Profil Saya</div>
                <div className="text-xs text-gray-400 mt-1">Atur akunmu</div>
            </Link>
        </div>
      </div>
    </div>
  )
}
