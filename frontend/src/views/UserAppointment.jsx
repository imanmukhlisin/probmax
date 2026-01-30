import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";

export default function UserAppointment() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const { setNotification, user } = useStateContext();

    // Form state
    const [formData, setFormData] = useState({
        appointment_date: "",
        appointment_time: "",
        whatsapp_number: "",
        location: "Online (Zoom/GMeet)" // Default
    });

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = () => {
        setLoading(true);
        axiosClient.get('/appointments')
            .then(({ data }) => {
                setLoading(false);
                setAppointments(data);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    const onSubmit = (ev) => {
        ev.preventDefault();
        setLoading(true);
        axiosClient.post('/appointments', formData)
            .then(() => {
                setNotification("Janji temu berhasil dibuat!");
                fetchAppointments();
                setFormData({
                    appointment_date: "",
                    appointment_time: "",
                    whatsapp_number: "",
                    location: "Online (Zoom/GMeet)"
                });
            })
            .catch(err => {
                setLoading(false);
                const response = err.response;
                if (response && response.status === 422) {
                    alert(response.data.message);
                } else {
                    alert("Gagal membuat janji.");
                }
            });
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Janji Konseling 🤝</h1>
                 {/* Only Consultants/Admin see link to manage schedules */}
                 {user.role_id !== 3 && (
                    <Link to="/schedules" className="btn-secondary text-sm">
                        Atur Jadwal Saya
                    </Link>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-1">
                    <div className="card sticky top-24">
                        <h2 className="text-xl font-bold text-primary-dark mb-4">Buat Janji Baru</h2>
                        <form onSubmit={onSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">Tanggal</label>
                                <input 
                                    type="date" 
                                    className="input-field"
                                    value={formData.appointment_date}
                                    onChange={e => setFormData({...formData, appointment_date: e.target.value})}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">Waktu</label>
                                <input 
                                    type="time" 
                                    className="input-field"
                                    value={formData.appointment_time}
                                    onChange={e => setFormData({...formData, appointment_time: e.target.value})}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">Nomor WhatsApp</label>
                                <input 
                                    type="text" 
                                    className="input-field"
                                    placeholder="081234567890"
                                    value={formData.whatsapp_number}
                                    onChange={e => setFormData({...formData, whatsapp_number: e.target.value})}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-1">Lokasi / Media</label>
                                <select 
                                    className="input-field"
                                    value={formData.location}
                                    onChange={e => setFormData({...formData, location: e.target.value})}
                                >
                                    <option value="Online (Zoom/GMeet)">Online (Zoom/GMeet)</option>
                                    <option value="Offline (Kampus)">Offline (Kampus)</option>
                                </select>
                            </div>
                            
                            <button disabled={loading} className="btn-primary w-full mt-2">
                                {loading ? 'Memproses...' : 'Ajukan Janji Temu'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* List Section */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-bold text-gray-800">Riwayat Janji Temu</h2>
                    
                    {appointments.length === 0 ? (
                        <div className="card text-center py-12">
                            <div className="text-4xl mb-4">📅</div>
                            <p className="text-gray-500">Belum ada janji temu yang dibuat.</p>
                        </div>
                    ) : (
                        appointments.map(appt => (
                            <div key={appt.id} className="card flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 hover:border-primary/30 transition-colors border border-transparent">
                                <div className="flex gap-4 items-start">
                                    <div className="bg-blue-100 text-primary w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold shrink-0">
                                        {new Date(appt.appointment_date).getDate()}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800 tex-lg">
                                            {new Date(appt.appointment_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                            <span className="flex items-center gap-1">⏰ {appt.appointment_time}</span>
                                            <span className="flex items-center gap-1">📍 {appt.location}</span>
                                        </div>
                                        <div className="text-xs text-gray-400 mt-2">
                                            WhatsApp: {appt.whatsapp_number}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 sm:mt-0 self-end sm:self-center">
                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                                        Terjadwal
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
