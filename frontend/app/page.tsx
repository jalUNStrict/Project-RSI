"use client";

import { useEffect, useState } from "react";

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

  useEffect(() => {
    // Mengambil data dari endpoint FastAPI (menggunakan IP 127.0.0.1 agar lebih stabil)
    const fetchData = async () => {
      try {
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
    };

    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
          
          {/* Header Card dengan warna Indigo standar */}
          <div className="bg-indigo-600 px-6 py-5">
            <h1 className="text-2xl font-bold text-white text-center">
              Daftar Anggota Kelompok 3
            </h1>
            <p className="text-indigo-100 text-center text-sm mt-1">
              Proyek Rekayasa Sistem Informasi
            </p>
          </div>
          
          <div className="p-6">
            {/* Indikator Loading */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                <p className="ml-3 text-gray-500">Memuat data...</p>
              </div>
            ) : error ? (
              /* Indikator Error */
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md text-center">
                <p className="font-medium">Error!</p>
                <p className="text-sm">{error}</p>
                <p className="text-xs mt-2 text-red-500">Pastikan server backend FastAPI sudah berjalan di terminal lain.</p>
              </div>
            ) : (
              /* Tabel Data Versi STANDAR */
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">NIM</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nama Mahasiswa</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {mahasiswa.map((mhs) => (
                      /* Semua baris sekarang memiliki efek hover abu-abu standar */
                      <tr key={mhs.id} className="hover:bg-slate-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center w-16">
                          {mhs.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {mhs.nim}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {/* Nama ditampilkan apa adanya, tanpa tambahan emoji ✨ */}
                          {mhs.nama}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </main>
  );
}