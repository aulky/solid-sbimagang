# Product Requirement Document (PRD) - Sistem Absensi Magang PT SBI Cilacap

Dokumen Persyaratan Produk (PRD) ini menjelaskan fungsionalitas, alur sistem, hak akses pengguna, serta spesifikasi teknis dari aplikasi **Sistem Absensi Magang PT Solusi Bangun Indonesia (PT SBI) Cilacap**.

---

## 1. Pendahuluan
Aplikasi Sistem Absensi Magang dirancang untuk mengotomatisasi pencatatan kehadiran, mempermudah pengajuan izin, dan menyajikan analitik data anak magang kepada administrator secara dinamis, real-time, dan aman.

Stack teknologi: SolidJS + SolidStart 2.0, Prisma ORM (MySQL), SSR, SVG murni tanpa library chart.

---

## 2. Hak Akses & Peran Pengguna (User Roles)
Sistem membedakan hak akses secara ketat berdasarkan peran (role) pengguna:

| Fitur | ADMIN (Administrator) | USER (Anak Magang) |
| :--- | :---: | :---: |
| Autentikasi (Login / Logout) | Ya | Ya |
| Melakukan Absensi (Check-In / Check-Out) | Tidak | Ya |
| Mengajukan Izin Baru (Sakit, Izin, Cuti) | Tidak | Ya |
| Melihat Riwayat Absensi Pribadi | Tidak | Ya |
| Mengubah Profil & Sandi Pribadi | Ya | Ya |
| Dashboard Statistik (Kartu & Chart Visual) | Ya (Statistik Global) | Ya (Statistik Bulanan) |
| Kelola Data Pengguna (CRUD & Filter) | Ya | Tidak |
| Kelola Data Divisi (CRUD) | Ya | Tidak |
| Monitor Kehadiran Harian (Filter & Detail) | Ya | Tidak |
| Approval Pengajuan Izin (Setuju / Tolak) | Ya | Tidak |
| Cetak Laporan (PDF Landscape & Export Excel) | Ya | Tidak |
| Konfigurasi Sistem (Jam Masuk, Toleransi, Lokasi, Jam Check-Out) | Ya | Tidak |
| Audit Log Aktivitas (Riwayat Aksi Semua User) | Ya | Tidak |

---

## 3. Spesifikasi Kebutuhan Fungsional (Functional Requirements)

### 3.1. Modul Autentikasi & Keamanan Sesi
1. **Login Page**:
   * Pengguna masuk menggunakan `username` dan `password`.
   * Dilengkapi tombol toggle visibilitas password (ikon mata).
   * Form login diam terhadap efek tracking cursor, animasi hover hanya diterapkan pada tombol "Masuk".
   * Logo PT SBI menyesuaikan tema (putih untuk dark mode, merah untuk light mode).
2. **Route Guarding**:
   * Sesi dijamin oleh HttpOnly cookie bernama `sbi_session` yang terenkripsi aman menggunakan `SESSION_SECRET`.
   * Pengguna tanpa sesi otomatis dialihkan ke halaman `/login`.
   * Pengguna dengan role `USER` yang mencoba mengakses direktori `/admin/...` diblokir dan dialihkan ke halaman `/unauthorized`.
   * Admin yang mencoba akses halaman user (`/dashboard`, `/riwayat`, `/izin`) juga dialihkan ke `/unauthorized`.
3. **Unauthorized Handling**:
   * Halaman `/unauthorized` menampilkan kode status 403 Akses Ditolak.
   * Dilengkapi timer hitung mundur 3 detik yang secara otomatis mengalihkan pengguna kembali ke dashboard utama peran mereka (USER ke `/dashboard`, ADMIN ke `/admin/dashboard`).
4. **Pencegahan Flash Lightmode (FOYT Bug)**:
   * Menggunakan script pemblokir render di `<head>` dokumen (SSR layer) untuk menyematkan tema `dark` dari `localStorage` secara instan sebelum browser mem-parsing elemen DOM.
5. **Manajemen Status Pengguna**:
   * Pengguna memiliki status: `AKTIF`, `ALUMNI`, `NONAKTIF`.
   * Status `NONAKTIF` mencegah login sama sekali.
   * Status `ALUMNI` mencegah check-in, check-out, dan pengajuan izin. Status ini secara otomatis diperbarui oleh sistem saat `requireUser()` mendeteksi tanggal hari ini telah melewati tanggal akhir batch (`endDate`) yang bersangkutan.
6. **Logout Konfirmasi**:
   * Tombol Logout di sidebar memicu modal konfirmasi (Portal) sebelum benar-benar logout.

### 3.2. Panel Pengguna (USER - Anak Magang)

#### A. Halaman Dashboard Utama (`/dashboard`)
1. **Sambutan & Info**:
   * Menampilkan logo, sapaan nama lengkap, dan divisi user.
   * Menampilkan tanggal dan jam real-time.
2. **Status Absensi Hari Ini**:
   * Menampilkan batas check-in tanpa telat dan jam mulai check-out dari pengaturan sistem.
   * Menampilkan opsi tombol "Check-In" jika belum melakukan absensi.
   * Menampilkan opsi tombol "Check-Out" jika sudah check-in tetapi belum check-out (disabled jika 1 jam sebelum jam mulai check-out).
   * Menampilkan rekap jam masuk, jam keluar, serta badge status kehadiran jika absensi hari ini sudah lengkap.
   * Jika user sedang izin (`IZIN`), menampilkan info bahwa tidak perlu check-in/out.
3. **Kartu Statistik Bulanan (4 kartu)**:
   * Jumlah kehadiran **HADIR** pada bulan berjalan.
   * Jumlah **TELAT** pada bulan berjalan.
   * Jumlah **IZIN / SAKIT** pada bulan berjalan.
   * Persentase **Tepat Waktu** (on-time rate = hadir / (hadir+telat) * 100).

#### B. Halaman Pengajuan Izin Magang (`/izin`)
1. **Form Pengajuan Baru (Modal)**:
   * Dibuka melalui tombol "Ajukan Izin" di bar atas.
   * Menggunakan modal portal dengan animasi scale-up.
   * Memilih tipe perizinan (Sakit, Izin, Cuti), tanggal mulai, tanggal selesai, dan alasan detail (min. 5 karakter).
   * **Validasi Ukuran File**: Lampiran bukti maksimal 500KB, tipe file gambar (JPG/PNG) atau PDF, divalidasi client-side (alert) dan server-side.
   * Upload file disimpan dengan nama random (crypto) di folder `uploads/` pada root project (persisten, tidak terhapus saat rebuild).
   * Path lampiran disimpan sebagai `/api/uploads?file=...`.
   * Modal menutup otomatis setelah pengajuan berhasil dikirim.
2. **Riwayat Izin Magang (Tabel + Filter + Pagination)**:
   * Menyajikan tabel riwayat pengajuan izin dengan status (`PENDING`, `APPROVED`, `REJECTED`).
   * Filter card: filter berdasarkan **Tipe Izin** (Sakit/Izin/Cuti) dan **Status**.
   * Dilengkapi paginasi (5 item per halaman) dengan navigasi halaman dan tombol Sebelumnya/Berikutnya.
   * **Preview Berkas Terunggah**: Tombol "Lihat Surat" membuka modal preview gambar/PDF. Berkas di-serve via API `/api/uploads?file=...` dengan fallback path `/uploads/` untuk kompatibilitas data lama.

#### C. Halaman Riwayat Absensi (`/riwayat`)
1. **Tabel Log Absensi**:
   * Menampilkan rekap log kehadiran pribadi (tanggal, waktu masuk, waktu keluar, status, catatan).
   * Status ditampilkan dengan badge berwarna (HADIR=hijau, TELAT=kuning, IZIN=biru, ALPHA=merah).
2. **Penyaringan Data (Filter)**:
   * Filter card kompak untuk **Tanggal** dan **Status Kehadiran**.
   * Tombol Reset Filter.
3. **Paginasi**: 10 item per halaman dengan navigasi.

---

### 3.3. Panel Pengelola (ADMIN - Administrator)

#### A. Halaman Dashboard Utama (`/admin/dashboard`)
1. **Statistik Numerik (5 kartu)**:
   * Total Anak Magang (user aktif, role USER, status `AKTIF` saja — tidak termasuk `ALUMNI` dan `NONAKTIF`).
   * Total Divisi.
   * Hadir Hari Ini.
   * Terlambat Hari Ini.
   * Izin Menunggu Persetujuan (PENDING).
2. **Visual Donut Chart (Absensi Hari Ini)**:
   * Diagram lingkaran SVG murni dengan 4 segmen: Hadir, Telat, Izin, Belum Absen.
   * Hover efek: segmen membesar, tooltip persentase, opacity redup pada segmen lain.
   * Angka total di tengah berubah sesuai segmen yang di-hover.
3. **Visual Line Chart (Tren Pertumbuhan Anak Magang)**:
   * Diagram garis SVG murni yang menampilkan akumulasi jumlah anak magang terdaftar (30 hari terakhir).
   * Menampilkan 3 titik grid (min, mid, max) dengan garis dashed.
   * Setiap titik data memiliki tooltip (native `<title>`).

#### B. Halaman Kelola Pengguna (`/admin/users`)
1. **Manajemen Data (CRUD)**:
   * Tambah pengguna baru via modal (username, password dengan toggle visibilitas, nama, email, telepon, role, divisi).
   * Edit pengguna via modal pre-filled (nama, email, telepon, role, divisi, **status**).
   * Hapus pengguna via modal konfirmasi custom.
2. **Penyaringan (Filter)**:
   * Filter dengan 4 kriteria: **Cari Nama/Username** (debounce 400ms), **Role**, **Status** (Aktif/Alumni/Nonaktif), **Divisi**.
   * Tombol Reset Filter.
3. **Paginasi Server-side**: 10 item per halaman dengan total dari server.
4. Modal otomatis menutup setelah sukses create/update/delete.

#### C. Halaman Kelola Divisi (`/admin/divisi`)
1. **Manajemen Unit Divisi (CRUD)**:
   * Tambah divisi via modal (nama divisi, deskripsi).
   * Edit divisi via modal pre-filled.
   * Hapus divisi via modal konfirmasi custom.
2. **Tabel menampilkan**: No, Nama Divisi, Deskripsi, **Jumlah Anggota** (dari `_count.users`), Aksi (Edit/Hapus).
3. **Paginasi Client-side**: 10 item per halaman.

#### D. Halaman Monitor Absensi (`/admin/absensi`)
1. **Tabel Log Absensi Global**:
   * Memantau log presensi seluruh anak magang (Nama, Divisi, Tanggal, Check-In, Check-Out, Status, Catatan).
2. **Penyaringan Data (Filter)**:
   * Filter: **Cari Nama/Username** (debounce 400ms), **Tanggal** (default hari ini), **Status Kehadiran**, **Divisi**.
   * Tombol Reset Filter.
3. **Paginasi Server-side**: 10 item per halaman.
4. **Default filter tanggal**: Hari ini (local timezone).

#### E. Halaman Kelola Pengajuan Izin (`/admin/izin`)
1. **Tabel Pengajuan Izin**:
   * Menampilkan daftar izin dari semua anak magang (Nama + username + telepon, Tipe, Tanggal Mulai, Tanggal Selesai, Alasan, Lampiran, Status, Aksi).
   * **Ellipsis Alasan**: Kolom alasan dibatasi dengan `max-width: 200px` dan efek ellipsis (`...`) agar tampilan tabel rapi dan konsisten (seperti pada log aktivitas). Detail alasan tetap dapat dibaca via tooltip hover (`title`).
2. **Penyaringan Data (Filter)**:
   * Filter: **Cari Nama/Username** (debounce 400ms), **Tipe Izin**, **Status**.
   * Tombol Reset Filter.
3. **Paginasi Server-side**: 10 item per halaman.
4. **Aksi Persetujuan**:
   * Tombol "Setujui" (status `APPROVED`, otomatis membuat catatan absensi `IZIN` untuk rentang tanggal).
   * Tombol "Tolak" (status `REJECTED`).
   * Untuk yang sudah diproses, ditampilkan "-".
5. **Preview Lampiran**: Modal preview gambar/PDF seperti di halaman user.

#### F. Halaman Laporan Absensi (`/admin/laporan`)
1. **Penyaringan Rekap Laporan**:
   * Filter: **Cari Nama** (client-side), **Divisi**, **Rentang Tanggal** (Mulai & Selesai).
2. **Export Excel (XLS)**:
   * Menghasilkan file `.xls` (HTML table dengan MIME Excel) dengan styling: header merah `#E11D48`, teks putih tebal, status berwarna (hijau/kuning/biru/merah).
3. **Cetak PDF Landscape**:
   * **Kop Surat Resmi**: Logo PT SBI dan alamat pabrik Cilacap di header cetak.
   * **Layout Bersih**: Hanya border horizontal tipis, zebra-striping, tanpa border vertikal.
   * **Semua Data**: Mencetak seluruh data (tanpa pagination) dengan menyembunyikan sidebar, filter, dan navigasi via CSS `@media print`.
   * **Layout Paksa**: `margin-left: 0 !important`, `padding: 0 !important` untuk menyembunyikan sidebar sepenuhnya.
4. **Paginasi Client-side**: 10 item per halaman.

#### G. Halaman Pengaturan Sistem (`/admin/settings`)
1. **Penyimpanan Dinamis**:
   * Konfigurasi disimpan di file JSON (`settings.json`) di root proyek.
2. **Variabel yang Diatur**:
   * **Jam Masuk**: Batas waktu absensi pagi (format 24 jam, contoh: `08:00`).
   * **Toleransi Keterlambatan**: Menit tambahan toleransi check-in.
   * **Jam Mulai Check-Out**: Batas minimal waktu check-out (contoh: `16:00`). Check-out baru bisa dilakukan 1 jam sebelum jam ini.
   * **Lokasi Kantor**: Alamat atau koordinat kantor.

#### H. Halaman Audit Log Aktivitas (`/admin/audit-log`)
1. **Pencatatan Otomatis**:
   * Semua aksi pengguna tercatat di tabel `AuditLog` database.
   * Aksi yang dicatat: LOGIN, LOGIN_GAGAL, REGISTER, LOGOUT, AKSES_HALAMAN, CHECK_IN, CHECK_OUT, PENGAJUAN_IZIN, SETUJUI_IZIN, TOLAK_IZIN, BUAT_PENGGUNA, UPDATE_PENGGUNA, HAPUS_PENGGUNA, BUAT_DIVISI, UPDATE_DIVISI, HAPUS_DIVISI, UPDATE_PENGATURAN.
2. **Informasi Dicatat per Entri**:
   * Waktu kejadian, Pengguna (nama + username), Aktivitas, Detail, IP Address, Lokasi (geo-IP lookup dari ipwho.is → ipapi.co → ip-api.com, background async), Browser / OS (parsed dari User-Agent).
3. **Tabel & Filter**:
   * Filter: **Cari Informasi** (username, detail, IP, lokasi — debounce 400ms), **Filter Aktivitas** (dropdown).
   * Paginasi server-side (15 item per halaman).

---

### 3.4. Modul Upload Berkas
1. **API Upload Serving** (`/api/uploads?file=...`):
   * Endpoint GET yang menyajikan file gambar/PDF dari folder uploads.
   * Mendukung 3-candidate fallback path: `uploads/` (root project, persisten) → `.output/public/uploads/` → `public/uploads/` (backward compat data lama).
   * Proteksi path traversal (filter `..` dan `/`).
   * Cache header `public, max-age=31536000, immutable`.
2. **Normalisasi URL**: Data lama dengan path `/uploads/` otomatis dinormalisasi ke `/api/uploads?file=...` di kedua halaman (user & admin izin).
3. **Penyimpanan Persisten**: File upload disimpan di folder `uploads/` pada root project (bukan di dalam `public/` atau `.output/`) agar tidak terhapus saat proses build ulang.

### 3.5. Modul Pengaturan Akun (Shared - ADMIN & USER)
1. **Sidebar Dropdown**:
   * Tautan "Profil Saya" sebagai dropdown toggle dengan rotasi ikon panah (▼).
   * Dropdown terbuka otomatis jika di halaman profil, menutup jika pindah menu.
2. **Tab Pengaturan Terpisah**:
   * Dua tab berbasis query parameter (`tab`):
     * **Ubah Profil** (`?tab=profile`): Edit nama lengkap, email, telepon. Menampilkan username, role, divisi.
     * **Ubah Sandi** (`?tab=password`): Input sandi lama (toggle visibilitas), sandi baru (min. 6 karakter, toggle), konfirmasi sandi baru (toggle). Sukses menampilkan alert hijau yang hilang setelah 5 detik.
3. **Desain Form**:
   * Kelas `.settings-card`, `max-width: 600px; margin: 0 auto;`.

---

## 4. Kebutuhan Non-Fungsional (Non-Functional Requirements)

### 4.1. Responsivitas & Tampilan Lintas Perangkat
* **Desktop Layout**:
  * Sidebar tetap 260px di kiri, backdrop-filter glassmorphism.
  * Info user di card rounded bawah sidebar dengan avatar lingkaran (inisial), nama (ellipsis), role, toggle tema.
  * Tombol logout outline merah full-width di footer sidebar.
  * Nama dan role dibatasi dengan text-overflow ellipsis.
* **Modal Responsif**:
  * Modal pop-up memiliki `max-height: 90vh` dan `overflow-y: auto` untuk memastikan konten tetap terlihat pada layar dengan zoom tinggi (misal 150%) atau resolusi kecil.
  * Modal diposisikan fixed center dengan animasi mobile.
* **Notifikasi Toast Error Global**:
  * Semua notifikasi error di seluruh halaman (admin & user) menggunakan satu komponen Toast mengambang (floating) di kanan atas layar, dirender secara global di `app.tsx` via `<Portal>`.
  * Desain: background transparan merah (`rgba(220, 38, 38, 0.12)`) dengan `backdrop-filter: blur(16px)`, beradaptasi otomatis dengan tema dark/light mode.
  * Auto-dismiss setelah 10 detik, dengan tombol tutup manual (×).
  * Animasi `slideIn` dari atas.
* **Animasi**:
  * Loading bar global di atas saat route transition.
  * Fade-in pada konten utama.
  * Modal scale-up dengan spring animation.

### 4.2. Keamanan & Performa
* **Keamanan Sandi**: Password di-hash menggunakan PBKDF2 (salt 16-byte random, 1000 iterasi, SHA-512).
* **Keamanan Cookie Sesi**: Konfigurasi `COOKIE_SECURE` — false di dev (HTTP), true di production (HTTPS). MaxAge 7 hari. SameSite Lax.
* **Zero Dependency Visuals**: Chart SVG murni tanpa library pihak ketiga.
* **Audit Logging**: Semua aktivitas tercatat dengan IP, User-Agent, dan lokasi geografis (async background).
* **Geolokasi IP**: Chain fallback 3 provider (ipwho.is → ipapi.co → ip-api.com, timeout 4s masing-masing). IP private (192.168.x, 10.x, 127.x, dll) otomatis dilabel "Localhost".
* **Pencegahan Path Traversal**: Filter `..` dan `/` pada filename upload.
* **Client & Server Validation**: Validasi file size, tipe, dan form input di kedua sisi.
