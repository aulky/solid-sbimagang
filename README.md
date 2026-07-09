# Dokumentasi Sistem Absensi Magang PT Solusi Bangun Indonesia (PT SBI) Cilacap

Sistem Absensi Magang adalah aplikasi web modern berbasis **SolidJS (SolidStart)** yang dirancang untuk mempermudah pemantauan kehadiran, keterlambatan, pengajuan izin, dan pelaporan operasional harian anak magang di PT. Solusi Bangun Indonesia, Cilacap.

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

## 3. Panduan Setup: Zero to Production

### Tahap 1: Persiapan Awal
1. Pastikan mesin Anda telah menginstal **Node.js (versi >= 22)** dan **MySQL Server**.
2. Clone repositori ini ke direktori lokal Anda.

### Tahap 2: Instalasi Dependensi
Jalankan perintah berikut pada terminal di folder proyek:
```bash
npm install
```

### Tahap 3: Konfigurasi Variabel Lingkungan (.env)
1. Salin berkas `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```
2. Sesuaikan nilai di dalam `.env` dengan konfigurasi database MySQL lokal Anda:
   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/absensi_sbi"
   SESSION_SECRET="gunakan_kunci_sesi_acak_yang_panjang_dan_rumit"
   COOKIE_SECURE=false
   ```
   * *Catatan*: Pada server lokal (HTTP / IP Address), atur `COOKIE_SECURE=false`. Jika dideploy dengan HTTPS, ubah menjadi `COOKIE_SECURE=true`.

### Tahap 4: Inisialisasi Database
Jalankan perintah berikut untuk mereset database dan menginisialisasi tabel-tabel kosong baru sesuai skema Prisma:
```bash
npm run db:reset
```
*Skrip ini akan menghapus semua database target secara bersih dan menyelaraskan tabel absensi magang dalam keadaan kosong.*

### Tahap 5: Mendaftarkan Akun Administrator Default
Jalankan perintah seeding di terminal untuk membuat akun admin perdana:
```bash
node seed-admin.js
```
Kredensial login admin default setelah eksekusi seed berhasil:
* **Username**: `admin`
* **Password**: `Password123!`

Setelah akun berhasil terdaftar, berkas `seed-admin.js` akan otomatis dihapus demi menjaga keamanan kredensial.

---

## 4. Konfigurasi Deployment di Server Produksi (Production)

Untuk melakukan deployment aplikasi di server produksi, Anda membutuhkan infrastruktur berikut:

### 1. Perangkat Lunak yang Harus Diinstal di VPS / Server
* **Node.js** (v22 atau lebih baru)
* **NPM** atau **PNPM**
* **MySQL Server** (v8.0 atau lebih baru)
* **PM2** (Process Manager untuk menjalankan aplikasi Node secara background & auto-restart):
  ```bash
  npm install -g pm2
  ```
* **Nginx** (Web Server bertindak sebagai Reverse Proxy)

### 2. Langkah Kompilasi (Build) Aplikasi
1. Buka folder proyek di server produksi.
2. Buat file `.env` produksi dengan `COOKIE_SECURE=true` (wajib menggunakan HTTPS).
3. Jalankan kompilasi untuk mode produksi:
   ```bash
   npm run build
   ```
   Kompilasi ini akan menghasilkan direktori `.output/` yang siap dijalankan sebagai layanan server Node mandiri.

### 3. Konfigurasi PM2 Process Manager
Jalankan aplikasi SolidStart di background menggunakan PM2:
```bash
pm2 start .output/server/index.mjs --name "absensi-sbi"
```
Untuk mengaktifkan PM2 agar otomatis berjalan saat VPS / Server reboot:
```bash
pm2 startup
pm2 save
```

### 4. Konfigurasi Reverse Proxy Nginx
Buat berkas konfigurasi situs baru di `/etc/nginx/sites-available/absensi-sbi` dan isi dengan konfigurasi berikut:

```nginx
server {
    listen 80;
    server_name absensi.tup.web.id; # Ganti dengan domain Anda

    # Redirect HTTP ke HTTPS demi keamanan session cookie
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name absensi.tup.web.id;

    # Konfigurasi Sertifikat SSL (Let's Encrypt / Certbot)
    ssl_certificate /etc/letsencrypt/live/absensi.tup.web.id/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/absensi.tup.web.id/privkey.pem;

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
