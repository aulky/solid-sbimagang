# Dokumentasi SAPA - Sistem Absensi Peserta Magang

SAPA - Sistem Absensi Peserta Magang adalah aplikasi web modern berbasis **SolidJS (SolidStart)** yang dirancang untuk mempermudah pemantauan kehadiran, keterlambatan, pengajuan izin, dan pelaporan operasional harian anak magang.

---

## 1. Overview Aplikasi
Aplikasi ini menyediakan panel untuk dua kategori pengguna:
1. **Role USER (Anak Magang)**:
   * Melakukan check-in dan check-out absensi harian secara tepat waktu.
   * Mengajukan izin magang (Sakit, Izin, Cuti) secara langsung melalui modal portal.
   * Melihat riwayat absensi pribadi beserta filter tanggal dan status kehadiran.
   * Mengatur profil pribadi (nama, email, telepon) dan memperbarui kata sandi secara aman.
2. **Role ADMIN (Pengelola Magang)**:
   * Memantau dashboard dengan grafik kehadiran harian (SVG Donut Chart) dan tren pertumbuhan anak magang secara visual (SVG Line Chart).
   * Mengelola data Pengguna (Intern) dan data Unit Divisi Magang.
   * Mengaudit absensi harian dan log absensi seluruh unit kerja.
   * Mengelola permohonan izin (Setujui atau Tolak pengajuan sakit/cuti).
   * Mengekspor laporan absensi terpadu ke format spreadsheet Excel (.xls) ber-layout rapi.
   * Mencetak laporan absensi dalam format lanskap PDF profesional.
   * Mengonfigurasi jam masuk absensi, toleransi keterlambatan, dan nama lokasi kantor secara dinamis.

---

## 2. Struktur Folder & Kode Utama

```
├── .env                  # Berkas rahasia konfigurasi server & database
├── .env.example          # Template konfigurasi .env
├── package.json          # Manajemen dependensi dan skrip eksekusi
├── settings.json         # Penyimpanan dinamis konfigurasi absensi (jam masuk, dll)
├── prisma/
│   └── schema.prisma     # Skema database relasional (Model User, Divisi, Absensi, Izin)
└── src/
    ├── app.css           # Styling visual global dan variabel CSS (Light/Dark themes)
    ├── app.tsx           # Layout root, sidebar dropdown navigasi, dan routing guard
    ├── entry-client.tsx  # Titik masuk eksekusi browser (Client-side entry)
    ├── entry-server.tsx  # Titik masuk eksekusi server & pencegah flash lightmode (SSR head script)
    ├── lib/
    │   ├── db.ts         # Inisialisasi Prisma Client instance
    │   ├── index.ts      # Server-side queries dan actions (logic database utama)
    │   └── server.ts     # Helper authentikasi sesi, hashing password, dan helper request
    └── routes/
        ├── index.tsx     # Pengarah halaman utama
        ├── login.tsx     # Antarmuka masuk sistem
        ├── profil.tsx    # Halaman pengaturan profil dan ubah kata sandi
        ├── riwayat.tsx   # Rekap kehadiran personal (USER)
        ├── izin.tsx      # Panel pengajuan izin magang (USER)
        ├── unauthorized.tsx # Halaman 403 Akses Ditolak dengan auto-redirect
        └── admin/
            ├── dashboard.tsx # Panel statistik grafis & visual (ADMIN)
            ├── users.tsx     # Manajemen akun pengguna/intern (ADMIN)
            ├── divisi.tsx    # Manajemen unit divisi magang (ADMIN)
            ├── absensi.tsx   # Panel monitoring kehadiran harian (ADMIN)
            ├── izin.tsx      # Manajemen persetujuan izin (ADMIN)
            ├── laporan.tsx   # Unduh laporan Excel dan cetak PDF (ADMIN)
            └── settings.tsx  # Konfigurasi jam kerja & lokasi kantor (ADMIN)
```

---

## 3. Panduan Setup Lengkap (Zero to Running)

Proyek ini dapat dikonfigurasi dan dijalankan menggunakan **NPM** atau **PNPM** sebagai package manager. Pilih salah satu alur perintah di bawah ini dari awal hingga akhir.

### Tahap 1: Persiapan Awal
1. Pastikan server lokal Anda telah terinstal **Node.js (versi >= 22)** dan **MySQL Server**.
2. Clone repositori ini ke folder kerja lokal Anda.

### Tahap 2: Instalasi Dependensi & Setup File `.env`
Salin file template `.env.example` ke file `.env` baru:
```bash
# Salin konfigurasi env
cp .env.example .env
```
Buka file `.env` tersebut dan sesuaikan baris `DATABASE_URL` dengan username, kata sandi, dan nama basis data MySQL Anda:
```env
DATABASE_URL="mysql://username:password_mysql_anda@localhost:3306/absensi_sbi"
SESSION_SECRET="kunci_acak_rahasia_untuk_enkripsi_cookie_sesi"
COOKIE_SECURE=false
```

Jalankan perintah berikut untuk menginstal seluruh package dependensi:

* **Menggunakan NPM**:
  ```bash
  npm install
  ```
* **Menggunakan PNPM**:
  ```bash
  pnpm install
  ```

### Tahap 3: Inisialisasi Database (Reset & Sync)
Perintah ini akan menyelaraskan database MySQL Anda sesuai dengan struktur tabel yang ditentukan di skema ORM Prisma (dalam keadaan kosong):

* **Menggunakan NPM**:
  ```bash
  npm run db:reset
  ```
* **Menggunakan PNPM**:
  ```bash
  pnpm run db:reset
  ```

### Tahap 4: Daftarkan Akun Admin & Data Dummy (Seeding)
Jalankan perintah berikut untuk mengisi database dengan data divisi, akun pengguna uji coba (budi & siti), serta akun administrator utama:

* **Menggunakan NPM**:
  ```bash
  npm run db:seed
  ```
* **Menggunakan PNPM**:
  ```bash
  pnpm run db:seed
  ```

Kredensial login admin default setelah eksekusi seed berhasil:
* **Username**: `admin`
* **Password**: `admin123456`

---

## 4. Panduan Menjalankan di Localhost (Debug / Development)

Untuk menjalankan server dalam mode pengembangan dengan dukungan pelacakan error (debug) dan hot-reload (perubahan kode langsung diterapkan ke browser tanpa restart):

* **Menggunakan NPM**:
  ```bash
  npm run dev
  ```
* **Menggunakan PNPM**:
  ```bash
  pnpm run dev
  ```
Buka browser pada alamat IP atau port lokal yang ditunjukkan (default: `http://localhost:3000` atau `http://localhost:5173`).

---

## 5. Panduan Deployment & Menjalankan di Server Produksi (Production)

Untuk mempublikasikan aplikasi pada VPS / Server produksi (Zero to Production):

### Langkah 1: Kompilasi Proyek (Build)
Jalankan proses bundling aset dan server-side rendering:

* **Menggunakan NPM**:
  ```bash
  npm run build
  ```
* **Menggunakan PNPM**:
  ```bash
  pnpm run build
  ```
Kompilasi ini akan menghasilkan direktori `.output/` yang siap dideploy.

### Langkah 2: Konfigurasi File `.env` Produksi
Sebelum menjalankan aplikasi di server produksi, edit berkas `.env` Anda dan pastikan nilai keamanan cookie diatur ke `true` (wajib menggunakan sertifikat SSL HTTPS):
```env
COOKIE_SECURE=true
```

### Langkah 3: Menjalankan Mode Produksi Mandiri (Tanpa PM2)
Jika ingin melakukan pengujian cepat mode produksi secara manual:

* **Menggunakan NPM**:
  ```bash
  npm run start
  ```
* **Menggunakan PNPM**:
  ```bash
  pnpm run start
  ```

### Langkah 4: Menjalankan Mode Latar Belakang (Menggunakan PM2)
Untuk menjaga aplikasi tetap hidup secara kontinu di background server produksi:
```bash
# Jalankan menggunakan Process Manager PM2
pm2 start .output/server/index.mjs --name "absensi-sbi"

# Daftarkan PM2 ke startup OS agar otomatis menyala saat server reboot
pm2 startup
pm2 save
```

### 4. Konfigurasi Reverse Proxy Nginx
Buat berkas konfigurasi situs baru di `/etc/nginx/sites-available/absensi-sbi` dan isi dengan konfigurasi berikut:

```nginx
server {
    listen 80;
    server_name domain.com; # Ganti dengan domain Anda

    # Redirect HTTP ke HTTPS demi keamanan session cookie
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name domain.com;

    # Konfigurasi Sertifikat SSL (Let's Encrypt / Certbot)
    ssl_certificate /etc/letsencrypt/live/domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/domain.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://localhost:3000; # Mengarahkan ke port aplikasi SolidStart (default: 3000)
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Aktifkan situs konfigurasi dan restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/absensi-sbi /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```
Aplikasi Anda kini terpublikasi dengan aman di port HTTPS produksi!
