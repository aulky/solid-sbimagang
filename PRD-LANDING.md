# Product Requirement Document (PRD) - Landing Page SIGMA

Dokumen ini menjelaskan fungsionalitas, konten, dan spesifikasi teknis dari **halaman landing publik** (`/`) aplikasi **SIGMA** (Sistem Informasi dan Manajemen Magang) untuk program Absensi Magang. Dokumen ini melengkapi [PRD.md](PRD.md) yang fokus pada sistem absensi internal (setelah login) — PRD ini fokus khusus pada halaman publik sebelum login beserta CMS admin yang mengelola kontennya.

---

## 1. Pendahuluan

Landing page adalah **halaman rekrutmen/informasi publik** yang dilihat calon peserta magang (siswa/mahasiswa) sebelum login — menampilkan info batch magang yang dibuka, sisa kuota per divisi, syarat pendaftaran, FAQ, testimoni alumni, dan kontak HRD. Seluruh konten bersifat **dinamis (CMS-driven)** — dikelola admin melalui `/admin/landing` tanpa perlu ubah kode.

* **Target pengguna**: calon peserta magang (anonim/belum login), serta pengguna existing yang mengakses halaman ini sebelum diarahkan ke dashboard masing-masing.
* **Route**: `/` (`src/routes/index.tsx`), auto-redirect ke `/dashboard` atau `/admin/dashboard` jika user sudah login (`src/app.tsx`).
* **Stack**: SolidJS + SolidStart 2.0, SSR, Prisma ORM (MySQL), CSS murni tanpa framework (`src/app.css`), tanpa library UI/icon pihak ketiga.

---

## 2. Referensi Fitur Existing (Landing Page — `src/routes/index.tsx`)

| # | Section | Elemen | Sumber Data | Kondisi Tampil |
| :-: | --- | --- | --- | --- |
| 1 | **Header/Navbar** | Logo + wordmark "SIGMA", nav anchor (Tentang, Kuota, Syarat, FAQ, Kontak), CTA kanan (Login / Masuk Dashboard) | Statis + `getPublicUser()` | Selalu, CTA berubah sesuai status login |
| 2 | **Hero** | Judul H1, subjudul (opsional), tombol "Lihat Kuota Tersedia" (anchor `#kuota`) | `getLandingSettings()` — `heroTitle`, `heroSubtitle` | Judul ada fallback default; subjudul hanya jika diisi |
| 3 | **Tentang Program** (`#tentang`) | Paragraf deskripsi program | `settings.aboutText` | Hanya render jika `aboutText` terisi |
| 4 | **Kuota & Periode Batch** (`#kuota`) | Kartu per batch (nama, rentang tanggal format ID, deskripsi opsional) + grid kuota per divisi dengan badge "N Tersedia"/"Penuh" | `getPublicKuota()` — model `BatchMagang` + `BatchDivisiQuota`, dihitung `quota - filled` (filled = user AKTIF di batch+divisi) | Fallback pesan jika tidak ada batch terbuka (`endDate >= hari ini`) |
| 5 | **Syarat & Ketentuan** (`#syarat`) | List bullet judul syarat | `getPublicSyarat()` — `LandingListItem` section `SYARAT`, `active=true` | Hanya render jika ada item aktif |
| 6 | **FAQ** (`#faq`) | Accordion native `<details>/<summary>` per item (pertanyaan + jawaban) | `getPublicFaq()` — `LandingListItem` section `FAQ` | Hanya render jika ada item aktif |
| 7 | **Testimoni ("Kata Mereka")** | Grid kartu glass: nama, roleInfo opsional (mis. "Alumni Divisi IT, Batch 2025"), kutipan pesan | `getPublicTestimoni()` — `LandingTestimoni`, `active=true` | Hanya render jika ada testimoni aktif |
| 8 | **Footer/Kontak** (`#kontak`) | Judul "Hubungi Kami", tombol "Chat WhatsApp" (`wa.me/...`), tombol "Email: ..." (`mailto:`), alamat opsional, copyright | `settings.contactWhatsapp/contactEmail/contactAddress` | Tombol WA/Email hanya muncul jika field terisi |

### Fitur interaktif & non-visual

* **Auth-aware CTA**: navbar & auto-redirect reaktif terhadap sesi (`getPublicUser`).
* **Smooth in-page anchor navigation** ke tiap section.
* **FAQ accordion** tanpa JS custom (native HTML disclosure).
* **Badge kuota real-time**: dihitung server-side per request, bukan statis.
* **Tema dark/light global** ikut termasuk di landing page (variabel CSS + script anti-FOYT di `entry-server.tsx`), namun **tidak ada toggle tema** yang terlihat di landing page itu sendiri (toggle hanya ada di sidebar setelah login).
* **SEO**: meta tag, Open Graph/Twitter card, JSON-LD terpasang di document shell (`entry-server.tsx`) — berlaku untuk landing page sebagai entry point utama.
* Tidak ada form/input client-side di landing page itu sendiri (form Login terpisah di `/login`).

### CMS Admin terkait (`src/routes/admin/landing.tsx`) — pengelola konten di atas

| Tab | Kelola |
| --- | --- |
| Hero & Kontak | `heroTitle`, `heroSubtitle`, `aboutText`, `contactWhatsapp`, `contactEmail`, `contactAddress` |
| Kuota | CRUD batch magang (nama, tanggal mulai/selesai, deskripsi) + kuota per divisi per batch |
| FAQ | CRUD pertanyaan & jawaban, toggle aktif/nonaktif |
| Syarat | CRUD item syarat, toggle aktif/nonaktif |
| Testimoni | CRUD nama, roleInfo, pesan, toggle aktif/nonaktif |

Semua tab menggunakan modal CRUD (`<Portal>`), toast sukses/error, dan checkbox aktif/nonaktif yang langsung mengontrol visibilitas item di landing page publik — **tanpa deploy ulang**.

---

## 3. Kebutuhan Fungsional Tambahan yang Diusulkan (Scope PRD Baru)

> Bagian ini adalah *usulan* peningkatan, bukan fitur yang sudah ada — untuk didiskusikan/diprioritaskan.

1. **Statistik Sosial Proof di Hero**: kartu kecil "X alumni magang", "Y batch telah berjalan" untuk menambah kredibilitas.
2. **Filter/Search Kuota per Divisi**: jika jumlah divisi bertambah banyak, tambahkan search/filter di section Kuota.
3. **Countdown Batas Pendaftaran**: tampilkan sisa waktu pendaftaran batch aktif (berbasis `endDate` atau field baru `registrationDeadline`).
4. **Tombol "Daftar Sekarang" langsung**: saat ini alur pendaftaran tidak jelas di UI publik (hanya "Login") — perlu klarifikasi apakah calon peserta magang mendaftar via WhatsApp/Email manual, atau perlu form pendaftaran mandiri.
5. **Galeri/Dokumentasi Kegiatan Magang**: section foto kegiatan intern untuk memperkuat daya tarik.
6. **Multi-bahasa (ID/EN)**: opsional bila target termasuk peserta magang asing/exchange program.
7. **Toggle tema di landing page**: saat ini toggle tema hanya ada di sidebar setelah login; pengunjung anonim tidak bisa ubah tema secara manual di landing page.
8. **Analytics dasar**: page view / klik CTA (WhatsApp, Email, Login) untuk mengukur efektivitas landing page.
9. **Loading skeleton per section**: saat ini `deferStream: true` membuat section menunggu data — pertimbangkan skeleton loader agar tidak terasa kosong saat SSR streaming.

---

## 4. Kebutuhan Non-Fungsional

* **Responsivitas**: layout mobile-first, kartu batch/testimoni menyesuaikan grid ke 1 kolom di layar kecil (mengikuti pola glassmorphism card yang sama dengan halaman lain).
* **Performa SSR**: setiap section memakai `createAsync` + `deferStream: true` — data di-preload lewat `route.preload()` agar tidak ada waterfall request tambahan di client.
* **SEO**: meta title/description, OG/Twitter card, JSON-LD sudah tersedia di `entry-server.tsx` — perlu dipastikan konten dinamis (hero title/subtitle) ikut memengaruhi meta tag jika berbeda per kunjungan (saat ini kemungkinan statis).
* **Aksesibilitas**: FAQ accordion native sudah aksesibel secara default (keyboard-navigable); perlu audit kontras warna badge "Penuh" (merah) vs teks di dark mode.
* **Governance konten**: seluruh copy (hero, about, syarat, FAQ, testimoni, kontak) adalah data CMS — perubahan konten adalah tanggung jawab admin HRD, bukan tim development.

---

## 5. Daftar Ringkas (Checklist) — Fitur Landing Page Saat Ini

- [x] Header sticky dengan navigasi anchor
- [x] CTA Login / Masuk Dashboard (auth-aware)
- [x] Hero title & subtitle (dinamis, ada fallback)
- [x] CTA "Lihat Kuota Tersedia"
- [x] Section Tentang Program (opsional)
- [x] Section Kuota & Periode Batch (dinamis dari `BatchMagang`)
- [x] Badge sisa kuota per divisi ("Tersedia" / "Penuh")
- [x] Section Syarat & Ketentuan (list, opsional)
- [x] Section FAQ (accordion, opsional)
- [x] Section Testimoni (grid kartu, opsional)
- [x] Footer Kontak (WhatsApp, Email, Alamat, Copyright)
- [x] Auto-redirect user yang sudah login
- [x] Tema dark/light global (tanpa toggle di halaman ini)
- [x] SEO meta tag & JSON-LD (global, termasuk landing page)
- [x] CMS admin penuh untuk semua konten di atas (`/admin/landing`)
- [ ] Statistik sosial proof di hero
- [ ] Countdown batas pendaftaran
- [ ] Alur pendaftaran mandiri (form daftar)
- [ ] Galeri dokumentasi kegiatan
- [ ] Multi-bahasa
- [ ] Toggle tema di landing page
- [ ] Analytics klik CTA
