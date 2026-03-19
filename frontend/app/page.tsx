"use client";

import { useEffect, useState, useCallback } from "react";

// Mendefinisikan tipe data sesuai dengan skema di backend
interface Mahasiswa {
  id: number;
  nim: string;
  nama: string;
}

export default function Home() {
  const [mahasiswa, setMahasiswa] = useState<Mahasiswa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fungsi fetch data dibuat terpisah agar bisa dipanggil tombol Refresh
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Mengambil data dari endpoint FastAPI
      const response = await fetch("http://127.0.0.1:8000/mahasiswa");
      
      if (!response.ok) {
        throw new Error("Gagal mengambil data dari server backend.");
      }
      
      const data = await response.json();
      setMahasiswa(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan yang tidak diketahui.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl">
          
          {/* Header Card */}
          <div className="bg-indigo-600 px-6 py-8 relative">
            <div className="flex justify-between items-center">
              <div className="text-left">
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  Daftar Anggota Kelompok 3
                </h1>
                <p className="text-indigo-100 text-sm mt-1 opacity-90">
                  Proyek Rekayasa Sistem Informasi — Assignment Git
                </p>
              </div>
              <button 
                onClick={fetchData}
                disabled={loading}
                className="bg-white/20 hover:bg-white/30 text-white text-xs px-4 py-2 rounded-lg backdrop-blur-sm transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? "Sync..." : "Refresh Data"}
              </button>
            </div>
          </div>
          
          <div className="p-8">
            {/* Indikator Loading */}
            {loading ? (
              <div className="flex flex-col justify-center items-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <p className="mt-4 text-gray-500 font-medium animate-pulse">Menghubungkan ke API Backend...</p>
              </div>
            ) : error ? (
              /* Indikator Error */
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-xl text-center">
                <div className="flex justify-center mb-2 text-red-500">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                   </svg>
                </div>
                <p className="font-bold text-lg">Koneksi Gagal</p>
                <p className="text-sm mt-1 mb-4">{error}</p>
                <p className="text-xs text-red-400 p-2 bg-white rounded-lg inline-block border border-red-100">
                  Tips: Jalankan <code className="bg-red-100 px-1 rounded font-mono">uvicorn main:app --reload</code> di terminal backend kamu.
                </p>
              </div>
            ) : (
              /* Tabel Data */
              <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">ID</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">NIM</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Nama Mahasiswa</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {mahasiswa.map((mhs) => (
                      <tr key={mhs.id} className="hover:bg-indigo-50/30 transition-colors duration-200 group">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono w-16">
                          #{mhs.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-800">
                          <span className="bg-gray-100 group-hover:bg-white px-2 py-1 rounded transition-colors">
                            {mhs.nim}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                          {mhs.nama}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Footer Tambahan  */}
            <div className="mt-10 pt-8 border-t border-gray-100">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                  <p className="text-gray-400 text-xs font-medium uppercase tracking-tighter">
                    Status: Branch Frontend Terintegrasi
                  </p>
                </div>
                
                <div className="bg-slate-50 rounded-2xl p-4 w-full flex justify-between items-center text-[11px] text-gray-500 border border-slate-100">
                  <div>
                    <span className="block font-bold text-gray-700">Tugas:</span>
                    Penugasan Git & Version Control
                  </div>
                  <div className="text-right">
                    <span className="block font-bold text-gray-700 italic">Terakhir diupdate:</span>
                    {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>

                <p className="text-[10px] text-gray-300">
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </main>
  );
}