from typing import List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Inisialisasi aplikasi untuk backend Kelompok 3
app = FastAPI(
    title="API Kelompok 3 - Rekayasa Sistem Informasi",
    description="REST API sederhana untuk manajemen data anggota kelompok."
)

# Setup CORS agar bisa diakses dari frontend Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Skema Data (Pydantic Models) ---
class MahasiswaBase(BaseModel):
    nim: str
    nama: str

# Inherit dari base model agar tidak perlu menulis ulang atribut nim dan nama
class Mahasiswa(MahasiswaBase):
    id: int

# --- Mock Database ---
# Dummy data anggota kelompok 3 untuk testing awal API
db_mahasiswa: List[Mahasiswa] = [
    Mahasiswa(id=1, nim="L0224015", nama="Bagus"),
    Mahasiswa(id=2, nim="L0224032", nama="Jalu"),
    Mahasiswa(id=3, nim="L0224035", nama="Michael"),
    Mahasiswa(id=4, nim="L0224048", nama="Sega"),
    Mahasiswa(id=5, nim="L0224051", nama="Maulana"),
]

# Variabel bantu untuk auto-increment ID
next_id = 6

# --- Routes / Endpoints ---

@app.get("/mahasiswa", response_model=List[Mahasiswa])
def ambil_semua_data():
    """Mengambil seluruh data mahasiswa yang ada di dalam sistem."""
    return db_mahasiswa

@app.get("/mahasiswa/{mhs_id}", response_model=Mahasiswa)
def cari_mahasiswa(mhs_id: int):
    """Mencari data mahasiswa spesifik berdasarkan ID."""
    for mhs in db_mahasiswa:
        if mhs.id == mhs_id:
            return mhs
            
    # Kembalikan error 404 jika ID tidak cocok
    raise HTTPException(status_code=404, detail="Data mahasiswa tidak ditemukan.")

@app.post("/mahasiswa", response_model=Mahasiswa, status_code=201)
def tambah_mahasiswa(data_baru: MahasiswaBase):
    """Menambahkan data mahasiswa baru ke dalam sistem."""
    global next_id
    
    mahasiswa_baru = Mahasiswa(
        id=next_id, 
        nim=data_baru.nim, 
        nama=data_baru.nama
    )
    
    db_mahasiswa.append(mahasiswa_baru)
    next_id += 1
    
    return mahasiswa_baru

@app.delete("/mahasiswa/{mhs_id}", status_code=204)
def hapus_mahasiswa(mhs_id: int):
    """Menghapus data mahasiswa berdasarkan ID."""
    for index, mhs in enumerate(db_mahasiswa):
        if mhs.id == mhs_id:
            del db_mahasiswa[index]
            return
    
    raise HTTPException(status_code=404, detail="Data Mahasiswa tidak ditemukan.")

@app.put("/mahasiswa/{mhs_id}", response_model=Mahasiswa)
def update_mahasiswa(mhs_id: int, data_update: MahasiswaBase):
    """Memperbarui data mahasiswa berdasarkan ID."""
    for index, mhs in enumerate(db_mahasiswa):
        if mhs.id == mhs_id:
            db_mahasiswa[index] = Mahasiswa(
                id=mhs_id, 
                nim=data_update.nim, 
                nama=data_update.nama
            )
            return db_mahasiswa[index]
    

    raise HTTPException(status_code=404, detail="Data Mahasiswa tidak ditemukan.")