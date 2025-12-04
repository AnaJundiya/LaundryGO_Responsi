LaundyGo: Aplikasi Layanan Laundry Berbasis Lokasi dengan Fitur Pencarian dan Pemesanan.

LaundryGo adalah aplikasi mobile berbasis lokasi yang menampilkan daftar toko laundry terdekat lengkap dengan informasi harga layanan, hingga fasilitas. Aplikasi ini dilengkapi fitur visualisasi peta persebaran laundry, filter pencarian (harga dan jarak), dan halaman list toko laundry.

**1. Komponen Frontend (Antarmuka Pengguna)**
Bagian yang berhubungan langsung dengan pengguna, terdiri dari:
•	Halaman Login
•	Halaman Register
•	Halaman Beranda (Home)
•	Halaman Peta (Map) berisi titik lokasi laundry
•	Halaman List Laundry
•	Halaman Filter Pencarian (Harga & Jarak)
•	Komponen UI:
o	TextField (input)
o	Button
o	Card/List Item
o	Map Widget (Google Maps/Mapbox)
o	Slider Filter
o	Icon & Image

**2. Komponen Backend**
•	Database
Menyimpan data user, lokasi laundry, harga, fasilitas, jarak, dll.
•	API Server
Menghubungkan aplikasi dengan database (Login, Register, Data Laundry).
•	Authentication System
Mengelola login dan register user.
•	Data Laundry API
Mengambil data toko laundry, harga, lokasi, dan informasi lainnya.

**3. Komponen Location & Maps**
Menangani fitur lokasi dan peta:
•	GPS/Geolocation Service
Mengambil posisi pengguna.
•	Maps API
Menampilkan peta & titik lokasi laundry.
•	Distance Calculator
Menghitung jarak user ke laundry.

**4. Komponen Logic & Controller**
Mengatur alur data dan fungsi dalam aplikasi:
•	Auth Controller – logika login/register
•	Map Controller – logika marker & lokasi
•	Laundry Controller – mengambil dan mengelola data laundry
•	Filter Controller – memproses filter harga–jarak

**5. Komponen Sistem Navigasi**
Mengatur perpindahan antar halaman:
•	Login ↔ Register
•	Login → Beranda
•	Beranda → Map / List / Filter

**6. Komponen Pendukung (Utilities & Helper)**
Berfungsi untuk membantu proses aplikasi:
•	Validasi input (form login/register)
•	Format harga
•	Perhitungan jarak
•	Handler izin lokasi
•	Config API/endpoint

**7. Komponen Asset**
Berisi file pendukung visual:
•	Logo aplikasi
•	Icon fitur
•	Gambar toko laundry
•	Font

**Sumber data berasal dari Google Maps.**

**Printscreen UI Aplikasi LaundryGo**
![LoginPage](https://github.com/user-attachments/assets/c357d147-d3ce-4cd2-9d66-84c85daf7681)
![RegisterPage](https://github.com/user-attachments/assets/7715c0ef-a1bb-4adf-b0b7-205259d667a8)
![Beranda](https://github.com/user-attachments/assets/6217f34b-4d9d-437d-9ac3-1a32277db98c)
![Filter](https://github.com/user-attachments/assets/e03345d2-01e9-4f40-9bd3-4a44cb4373d3)
![MapPage](https://github.com/user-attachments/assets/c7248c21-d1de-48c8-b919-b8e5757b0d0d)
![ListLaundry](https://github.com/user-attachments/assets/48ed3418-03c5-4af2-abe4-20f9bc33a89d)
![FormEdit](https://github.com/user-attachments/assets/1763d5c8-8ac6-440b-b4c6-55f6ddf05d7c)
![FormInput](https://github.com/user-attachments/assets/b9cea882-1ab5-4d1c-a1d0-09c0d0259f88)






