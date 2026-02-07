import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";

export default function StudentMonitoring() {
  const { user } = useStateContext();
  const [monitoringData, setMonitoringData] = useState({});
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('all'); // 'all' or 'YYYY-MM'

  useEffect(() => {
    fetchMonitoringData();
  }, []);

  const fetchMonitoringData = () => {
    setLoading(true);
    setError(null);
    
    axiosClient.get('/admin/student-monitoring')
      .then(({ data }) => {
        setMonitoringData(data.data);
        // Auto-select current month if available
        const currentMonth = new Date().toISOString().slice(0, 7);
        const monthKeys = Object.keys(data.data);
        if (monthKeys.includes(currentMonth)) {
          setSelectedMonth(currentMonth);
        } else if (monthKeys.length > 0) {
          setSelectedMonth(monthKeys[0]); // Select first available month
        }
      })
      .catch((err) => {
        console.error(err);
        setError('Gagal memuat data monitoring');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleExport = () => {
    setExporting(true);
    
    axiosClient.get('/admin/student-monitoring/export', {
      responseType: 'blob'
    })
      .then((response) => {
        // Create blob link to download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Monitoring_Mahasiswa_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((err) => {
        console.error(err);
        alert('Gagal mengekspor data');
      })
      .finally(() => {
        setExporting(false);
      });
  };

  const getStressColor = (level) => {
    switch(level) {
      case 'Normal':
        return 'bg-green-100 text-green-700 border-green-500';
      case 'Stres Ringan':
        return 'bg-yellow-100 text-yellow-700 border-yellow-500';
      case 'Stres Sedang':
        return 'bg-orange-100 text-orange-700 border-orange-500';
      case 'Stres Berat':
        return 'bg-red-100 text-red-700 border-red-500';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium animate-pulse">Memuat Data Monitoring...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-red-500 font-medium mb-4">{error}</p>
          <button 
            onClick={fetchMonitoringData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  const monthKeys = Object.keys(monitoringData).sort().reverse();
  const filteredMonthKeys = selectedMonth === 'all' ? monthKeys : monthKeys.filter(key => key === selectedMonth);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-800">
            📊 Monitoring Mahasiswa
          </h1>
          <p className="text-gray-600 mt-1">Data cek kesehatan mental harian mahasiswa</p>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting || monthKeys.length === 0}
          className="px-6 py-3 bg-accent-green text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center"
        >
          {exporting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Mengekspor...</span>
            </>
          ) : (
            <>
              <span>📥</span>
              <span>Export CSV</span>
            </>
          )}
        </button>
      </div>

      {/* Month Filter */}
      {monthKeys.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <span>📅</span>
              <span>Filter Bulan:</span>
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="flex-1 sm:flex-none sm:min-w-[250px] px-4 py-2.5 border-2 border-gray-200 rounded-xl font-bold text-gray-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            >
              <option value="all">📊 Semua Bulan ({monthKeys.length} bulan)</option>
              {monthKeys.map((monthKey) => (
                <option key={monthKey} value={monthKey}>
                  {monitoringData[monthKey].month_label} ({monitoringData[monthKey].records.length} cek)
                </option>
              ))}
            </select>
            {selectedMonth !== 'all' && (
              <button
                onClick={() => setSelectedMonth('all')}
                className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all flex items-center gap-2"
              >
                <span>🔄</span>
                <span>Reset Filter</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="text-3xl mb-2">📅</div>
          <div className="text-2xl font-black">{filteredMonthKeys.length}</div>
          <div className="text-blue-100 text-sm font-medium">
            {selectedMonth === 'all' ? 'Bulan Tercatat' : 'Bulan Dipilih'}
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="text-3xl mb-2">✅</div>
          <div className="text-2xl font-black">
            {filteredMonthKeys.reduce((sum, key) => sum + monitoringData[key].records.length, 0)}
          </div>
          <div className="text-green-100 text-sm font-medium">Total Cek Harian</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="text-3xl mb-2">👥</div>
          <div className="text-2xl font-black">
            {new Set(filteredMonthKeys.flatMap(key => monitoringData[key].records.map(r => r.user_name))).size}
          </div>
          <div className="text-purple-100 text-sm font-medium">Mahasiswa Aktif</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="text-3xl mb-2">📊</div>
          <div className="text-2xl font-black">
            {filteredMonthKeys.length > 0 ? monitoringData[filteredMonthKeys[0]].records.length : 0}
          </div>
          <div className="text-orange-100 text-sm font-medium">
            {selectedMonth === 'all' ? 'Cek Bulan Terbaru' : 'Cek Bulan Ini'}
          </div>
        </div>
      </div>

      {/* Monthly Data */}
      {filteredMonthKeys.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Belum Ada Data</h3>
          <p className="text-gray-600">
            {selectedMonth === 'all' 
              ? 'Belum ada mahasiswa yang melakukan cek harian'
              : 'Tidak ada data untuk bulan yang dipilih'}
          </p>
        </div>
      ) : (
        filteredMonthKeys.map((monthKey) => {
          const monthData = monitoringData[monthKey];
          
          return (
            <div key={monthKey} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {/* Month Header */}
              <div className="bg-gradient-to-r from-primary to-secondary px-6 py-4">
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <span>📅</span>
                  <span>{monthData.month_label}</span>
                  <span className="ml-auto bg-white/20 px-3 py-1 rounded-full text-sm">
                    {monthData.records.length} cek
                  </span>
                </h2>
              </div>

              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                        No
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                        Nama Mahasiswa
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">
                        Tanggal
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-black text-gray-700 uppercase tracking-wider">
                        Skor Total
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-black text-gray-700 uppercase tracking-wider">
                        Kategori Stress
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {monthData.records.map((record, index) => (
                      <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                          {record.user_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {record.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary font-black text-lg">
                            {record.total_score}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`inline-block px-4 py-2 rounded-full text-xs font-black border-2 ${getStressColor(record.stress_level)}`}>
                            {record.stress_level}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-gray-200">
                {monthData.records.map((record, index) => (
                  <div key={record.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-primary/10 text-primary px-2 py-1 rounded-lg text-xs font-black">
                            #{index + 1}
                          </span>
                          <span className="text-xs text-gray-500">{record.date}</span>
                        </div>
                        <h3 className="font-black text-gray-900">{record.user_name}</h3>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                          <span className="text-primary font-black text-xl">{record.total_score}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 font-medium">Kategori:</span>
                      <span className={`px-3 py-1.5 rounded-full text-xs font-black border-2 ${getStressColor(record.stress_level)}`}>
                        {record.stress_level}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
