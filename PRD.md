# Product Requirement Document (PRD) - Sistem Absensi Magang PT SBI Cilacap

Dokumen Persyaratan Produk (PRD) ini menjelaskan fungsionalitas, alur sistem, hak akses pengguna, serta spesifikasi teknis dari aplikasi **Sistem Absensi Magang PT Solusi Bangun Indonesia (PT SBI) Cilacap**.

---

## 1. Pendahuluan
Aplikasi Sistem Absensi Magang dirancang untuk mengotomatisasi pencatatan kehadiran, mempermudah pengajuan izin, dan menyajikan analitik data anak magang kepada administrator secara dinamis, real-time, dan aman.

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
| Dashboard Statistik (Kartu & Chart Visual) | Ya (Statistik Global) | Tidak (Hanya Absensi Hari Ini) |
| Kelola Data Pengguna (CRUD & Filter) | Ya | Tidak |
| Kelola Data Divisi (CRUD) | Ya | Tidak |
| Monitor Kehadiran Harian (Filter & Detail) | Ya | Tidak |
| Approval Pengajuan Izin (Setuju / Tolak) | Ya | Tidak |
| Cetak Laporan (PDF Landscape & Export Excel) | Ya | Tidak |
| Konfigurasi Sistem (Jam Masuk, Toleransi, Lokasi)| Ya | Tidak |

---

## 3. Spesifikasi Kebutuhan Fungsional (Functional Requirements)

### 3.1. Modul Autentikasi & Keamanan Sesi
1. **Login Page**:
   * Pengguna masuk menggunakan `username` dan `password`.
   * Form login diam terhadap efek tracking cursor, animasi hover hanya diterapkan pada tombol "Masuk".
2. **Route Guarding**:
   * Sesi dijamin oleh HttpOnly cookie bernama `sbi_session` yang terenkripsi aman menggunakan `SESSION_SECRET`.
   * Pengguna tanpa sesi otomatis dialihkan ke halaman `/login`.
   * Pengguna dengan role `USER` yang mencoba mengakses direktori `/admin/...` diblokir dan dialihkan ke halaman `/unauthorized`.
3. **Unauthorized Handling**:
   * Halaman `/unauthorized` menampilkan kode status 403 Akses Ditolak.
   * Dilengkapi timer hitung mundur 3 detik yang secara otomatis mengalihkan pengguna kembali ke dashboard utama peran mereka (USER ke `/dashboard`, ADMIN ke `/admin/dashboard`).
4. **Pencegahan Flash Lightmode (FOYT Bug)**:
   * Menggunakan script pemblokir render di `<head>` dokumen (SSR layer) untuk menyematkan tema `dark` dari `localStorage` secara instan sebelum browser mem-parsing elemen DOM.

---

### 3.2. Panel Pengguna (USER - Anak Magang)

#### A. Halaman Dashboard Utama (`/dashboard`)
1. **Status Absensi Hari Ini**:
   * Menampilkan tanggal dan jam real-time.
   * Menampilkan opsi tombol "Check-In" jika belum melakukan absensi.
   * Menampilkan opsi tombol "Check-Out" jika sudah melakukan check-in tetapi belum check-out.
   * Menampilkan rekap jam masuk, jam keluar, serta badge status kehadiran jika absensi hari ini sudah lengkap.
2. **Kartu Statistik Bulanan**:
   * Menampilkan jumlah akumulasi kehadiran dengan status "HADIR" dan "TELAT" pada bulan berjalan.

#### B. Halaman Pengajuan Izin Magang (`/izin`)
1. **Form Pengajuan Baru (Modal)**:
   * Dibuka melalui tombol "Ajukan Izin" di bar atas.
   * Menggunakan modal portal. Pengguna memilih tipe perizinan (Sakit, Izin, Cuti), memasukkan tanggal mulai, tanggal selesai, dan menuliskan alasan pengajuan secara detail (minimal 5 karakter).
   * **Validasi Ukuran File**: Lampiran bukti dibatasi maksimal 500KB, divalidasi langsung di sisi client (alert instan) dan server-side (`submitIzin` action) demi keamanan storage.
   * Menutup otomatis setelah pengajuan berhasil dikirim (tanpa memunculkan modal konfirmasi ganda).
2. **Riwayat Izin Magang (Tabel & Filter)**:
   * Halaman didesain full-width untuk visualisasi yang luas.
   * Menyajikan tabel riwayat pengajuan izin yang mencakup status persetujuan (`PENDING`, `APPROVED`, `REJECTED`).
   * Dilengkapi filter card kompak untuk menyaring riwayat berdasarkan **Tipe Izin** dan **Status**.
   * **Preview Berkas Terunggah**: Mendukung preview berkas gambar/PDF secara instan melalui modal Portal. Berkas di-serve secara dinamis melalui API endpoint `/api/uploads?file=...` untuk memastikan akses real-time di lingkungan production. Hal ini juga mendukung kompatibilitas berkas lama (`/uploads/...`) via utilitas normalisasi URL otomatis.

#### C. Halaman Riwayat Absensi (`/riwayat`)
1. **Tabel Log Absensi**:
   * Menampilkan rekap log kehadiran pribadi (tanggal, waktu masuk, waktu keluar, status, catatan/keterangan).
2. **Penyaringan Data (Filter)**:
   * Filter card kompak untuk membatasi tampilan berdasarkan **Tanggal** dan **Status Kehadiran**.

---

### 3.3. Panel Pengelola (ADMIN - Administrator)

#### A. Halaman Dashboard Utama (`/admin/dashboard`)
1. **Statistik Numerik**:
   * Kartu ringkasan jumlah anak magang aktif, jumlah divisi, jumlah hadir hari ini, jumlah telat hari ini, dan jumlah izin yang menunggu persetujuan.
2. **Visual Donut Chart (Absensi Hari Ini)**:
   * Diagram lingkaran (SVG murni) yang memvisualisasikan persentase status kehadiran hari ini (Hadir, Telat, Izin, Belum Absen).
3. **Visual Line Chart (Pertumbuhan Anak Magang)**:
   * Diagram garis (SVG murni) yang menampilkan kecenderungan tren kenaikan/penurunan kuantitas anak magang terdaftar.

#### B. Halaman Kelola Pengguna (`/admin/users`)
1. **Manajemen Data (CRUD)**:
   * Tambah pengguna baru via modal pop-up (mengisi username, password, nama, email, telepon, role, divisi).
   * Edit data pengguna via modal pop-up (pre-filled data lama, mengganti password, memblokir/mengaktifkan status user).
   * Hapus pengguna via modal pop-up konfirmasi custom.
2. **Penyaringan (Filter)**:
   * Filter card dengan kolom berukuran proporsional untuk memfilter pengguna berdasarkan **Cari Nama/Username**, **Role**, **Status**, dan **Divisi**.
3. **Perbaikan Bug**:
   * Modal tambah data otomatis menutup seketika setelah tombol Simpan ditekan dan data sukses terekam.

#### C. Halaman Kelola Divisi (`/admin/divisi`)
1. **Manajemen Unit Divisi (CRUD)**:
   * Tambah divisi via modal pop-up (nama divisi, deskripsi).
   * Edit divisi via modal pop-up.
   * Hapus divisi via modal pop-up konfirmasi custom.

#### D. Halaman Monitor Absensi (`/admin/absensi`)
1. **Tabel Log Absensi Global**:
   * Memantau log presensi seluruh anak magang secara real-time.
2. **Penyaringan Data (Filter)**:
   * Filter card kompak dengan kolom berukuran proporsional untuk memfilter berdasarkan **Nama/Username**, **Tanggal**, **Status Kehadiran**, dan **Divisi**.

#### E. Halaman Kelola Pengajuan Izin (`/admin/izin`)
1. **Audit Permohonan**:
   * Menampilkan daftar izin masuk dari anak magang yang berstatus `PENDING`.
2. **Aksi Persetujuan**:
   * Tombol "Setujui" (mengubah status ke `APPROVED` dan otomatis membuat catatan absensi berkategori `IZIN` untuk rentang tanggal tersebut).
   * Tombol "Tolak" (mengubah status ke `REJECTED`).

#### F. Halaman Laporan Absensi (`/admin/laporan`)
1. **Penyaringan Rekap Laporan**:
   * Membatasi ekspor data berdasarkan Nama, Divisi, dan Rentang Tanggal (Mulai & Selesai).
2. **Export Excel (XLSX)**:
   * Menghasilkan lembar kerja Excel berformat (.xls) dengan styling tabel profesional (tajuk merah `#E11D48`, teks tebal putih, gridlines, dan teks status kehadiran terwarna hijau/kuning/merah secara rapi).
3. **Cetak PDF Landscape**:
   * **Layout Bersih & Minimalis**: Menghapus border vertikal kaku (gaya grid Excel) dan hanya menggunakan border horizontal tipis (`#e2e8f0`) serta border header tebal (`#475569`) dengan background zebra-striping halus pada baris genap.
   * **Kop Surat Pabrik Cilacap**: Menampilkan logo resmi PT SBI Tbk dan alamat operasional pabrik Cilacap di bagian atas halaman dengan penataan presisi (tanpa tag "Dokumen Internal").
   * **Pencetakan Semua Data**: Saat mode cetak diaktifkan, layout mematikan pembatasan pagination, menyembunyikan navigasi halaman, dan menampilkan seluruh data log absensi ke media cetak.
   * **Penyelarasan Layout**: Memaksa layout utama (`.app-layout`, `.app-main-content`) menyetel padding/margin ke `0 !important` dan width ke `100% !important` untuk menyembunyikan visual sidebar secara total dan mencegah terjadinya offset/kolom kosong di sisi kanan kertas.

#### G. Halaman Pengaturan Sistem (`/admin/settings`)
1. **Penyimpanan Dinamis**:
   * Mengatur konfigurasi absensi secara global yang disimpan di file JSON server (`settings.json`).
2. **Variabel yang Diatur**:
   * **Jam Masuk**: Batas waktu absensi pagi (contoh: `08:00`).
   * **Toleransi Keterlambatan**: Tambahan waktu toleransi check-in dalam hitungan menit.
   * **Lokasi Kantor**: Alamat atau koordinat kantor presensi (contoh: `Kantor PT. SBI Cilacap`).

---

### 3.4. Modul Pengaturan Akun (Shared - ADMIN & USER)
1. **Sidebar Dropdown**:
   * Tautan menu "Profil Saya" di sidebar bertindak sebagai dropdown toggle yang didukung transisi rotasi ikon panah (▼).
   * Menu dropdown otomatis terbuka jika user berada di halaman profil, dan menutup jika berpindah ke menu lain.
2. **Tab Pengaturan Terpisah**:
   * Pengaturan akun dibagi menjadi dua tab bersih berbasis query parameter (`tab`):
     * **Ubah Profil** (`/profil?tab=profile`): Form edit nama lengkap, email, dan telepon.
     * **Ubah Sandi** (`/profil?tab=password`): Form ubah kata sandi dengan input sandi lama, sandi baru, dan konfirmasi sandi baru.
3. **Desain Form**:
   * Menggunakan kelas `.settings-card` yang bebas dari efek animasi jedag-jedug hover.
   * Didesain dengan batasan lebar `max-width: 600px; margin: 0 auto;` agar visualisasi terpusat profesional layaknya halaman pengaturan sistem.

---

## 4. Kebutuhan Non-Fungsional (Non-Functional Requirements)

### 4.1. Responsivitas & Tampilan Lintas Perangkat
* **Desktop Layout**:
  * Sidebar navigasi tetap setebal `260px` di sebelah kiri layar.
  * **Layout Info Pengguna & Tema**: Informasi user terbungkus rapi dalam card rounded dengan background subtle di bagian bawah sidebar, dengan toggle tema (dark/light) yang tersusun sejajar di sebelah kanan nama/role user.
  * **Layout Tombol Logout**: Tombol logout berbentuk outline button berukuran penuh (full-width) dengan icon merah ter-center rapi di bagian footer sidebar di bawah card informasi user.
  * **Pencegahan Overflow Teks**: Nama lengkap dan role di dalam sidebar dilengkapi pembatasan lebar dan ellipsis (`...`) jika melebihi ruang yang tersedia, guna mencegah kerusakan visual layout.
* **Mobile Layout**: Sidebar secara otomatis bertransformasi menjadi header navigasi horizontal di bagian atas layar. Semua tabel data dilengkapi scrollbar horizontal (`overflow-x: auto`) agar layout tidak rusak pada layar ponsel cerdas.

### 4.2. Keamanan & Performa
* **Keamanan Sandi**: Password di-hash menggunakan algoritma PBKDF2 dengan salt acak 16 byte sebelum disimpan ke database MySQL.
* **Keamanan Cookie Sesi**: Dilengkapi konfigurasi `COOKIE_SECURE` yang dinonaktifkan (`false`) pada mode pengembangan lokal (HTTP), namun wajib diaktifkan (`true`) saat masuk lingkungan produksi HTTPS agar mencegah pencurian cookie.
* **Zero Dependency Visuals**: Visualisasi chart dibuat murni menggunakan diagram SVG dinamis, mengurangi beban pemuatan berkas JS library pihak ketiga pada browser klien.
