from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Halo Data Science UNS! Backend berhasil jalan."}

@app.get("/status")
def check_status():
    return {"status": "Aman", "versi_python": "3.12"}