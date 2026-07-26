# Prompt: Implementasi Redesign Landing Page SIGMA

> Prompt siap pakai untuk AI coding agent (Claude Code atau lainnya) yang akan mengimplementasikan peningkatan UI/UX landing page. Copy-paste seluruh isi di bawah sebagai instruksi tugas.

---

Kamu bekerja di project **SIGMA** (Sistem Informasi dan Manajemen Magang, SolidJS + SolidStart 2.0 + Prisma/MySQL) milik PT Solusi Bangun Indonesia (PT SBI) Cilacap, di `d:\CODING\solid-sbimagang`.

**Tugas**: implementasikan peningkatan UI/UX pada halaman landing publik (`/`) sesuai spesifikasi yang sudah didokumentasikan di repo ini. Sebelum menulis kode apa pun, baca dulu ketiga dokumen berikut secara penuh:

1. **[PRD-LANDING.md](PRD-LANDING.md)** — fitur, section, dan sumber data yang sudah ada di landing page saat ini (jangan hapus/ubah fungsionalitas ini, hanya perbaiki presentasinya).
2. **[DESIGN-LANDING.md](DESIGN-LANDING.md)** — spesifikasi desain lengkap: prinsip desain, token, wireframe per-section, komponen, motion, breakpoint, aksesibilitas, do's and don'ts. **Ini adalah sumber kebenaran utama untuk implementasi.**
3. **[DESIGN.md](DESIGN.md)** — token desain global aplikasi (warna, tipografi, spacing, radius, shadow) yang sudah dipakai di `src/app.css` — jangan buat token baru yang bentrok dengan ini.

File yang relevan untuk diedit:
- `src/routes/index.tsx` — markup & logic landing page
- `src/app.css` — blok `/* ================= LANDING PAGE (PUBLIC) ================= */` (sekitar baris 1762 ke bawah)

## Batasan Wajib (dari DESIGN-LANDING.md section 0 & 8)

- **Jangan** mengubah CSS custom property di `:root` / `[data-theme="dark"]` (baris 1–56 `app.css`) — itu dipakai global oleh seluruh dashboard admin/user, bukan hanya landing page.
- **Jangan** menambah framework CSS (Tailwind dll) atau library UI/icon pihak ketiga baru. Pertahankan pola: CSS custom property + class manual + SVG inline.
- **Jangan** mengubah/menghapus data fetching (`getLandingSettings`, `getPublicKuota`, `getPublicFaq`, `getPublicSyarat`, `getPublicTestimoni`) atau conditional render (`<Show>`) yang menyembunyikan section kosong.
- Semua class baru prefix `landing-` agar tidak bentrok dengan style dashboard lain di file CSS yang sama.
- Uji hasil di **light & dark mode**, dan minimal 3 breakpoint: 375px, 768px, 1280px.

## Daftar Perubahan yang Harus Diimplementasikan (urutan prioritas)

**Prioritas tinggi — section Kuota & Periode Batch (konversi utama):**
1. Ubah grid batch card jadi responsif (`auto-fill, minmax(320px, 1fr)`) untuk >1 batch aktif, tetap 1 kolom di mobile.
2. Ubah warna badge "Penuh" dari merah solid ke tint lembut (`rgba(220,38,38,.12)` teks `--color-error`), konsisten gaya dengan badge "Tersedia".
3. Urutkan divisi dalam tiap batch: yang masih ada slot (`sisa > 0`) tampil lebih dulu, "Penuh" di bawah.
4. Tambahkan progress bar tipis (4px, radius-pill) di bawah tiap baris divisi menampilkan rasio `filled/quota`.
5. Tambahkan skeleton loading (shimmer) untuk 1–2 card saat data batch belum resolve (SSR streaming).
6. Pada empty-state (tidak ada batch dibuka), tambahkan link/tombol ghost "Hubungi HRD untuk info batch berikutnya" mengarah ke `#kontak`.

**Prioritas menengah — Header, Hero, FAQ, Footer:**
7. Tambahkan underline-on-hover pada nav item header, dan highlight nav aktif sesuai section yang sedang di-scroll (`IntersectionObserver` ringan, tanpa library).
8. Hero: perbesar clamp H1 ke `clamp(32px, 5.5vw, 52px)`, tambahkan micro-interaction ikon panah (→) pada tombol CTA yang bergeser 4px saat hover.
9. FAQ: tambahkan ikon chevron di kanan `<summary>` yang rotate 180° saat `[open]`.
10. Footer: tambahkan **floating WhatsApp button** (fixed bottom-right, hanya tampil di viewport <1024px, disembunyikan di desktop) mengarah ke link WA yang sama dengan tombol footer, dengan `aria-label="Chat WhatsApp"`.

**Prioritas rendah — polish tambahan:**
11. Testimoni: tambahkan avatar placeholder (lingkaran inisial) di kiri nama pada tiap card.
12. Syarat & Ketentuan: ganti bullet default dengan icon checkmark kecil (SVG inline, warna primary).
13. Hover pada batch card & testimoni card: `translateY(-2px)` + shadow naik dari `shadow-glass` → `shadow-md`, transisi 200ms.

## Definisi Selesai (Definition of Done)

- Semua perubahan di atas diimplementasikan sesuai spesifikasi detail di [DESIGN-LANDING.md](DESIGN-LANDING.md) (section 3 & 5 khususnya) — baca ulang bagian terkait sebelum implementasi tiap poin.
- Tidak ada regresi pada dashboard admin/user (karena berbagi file `app.css` yang sama) — cek halaman lain (`/dashboard`, `/admin/dashboard`) masih tampil normal setelah perubahan.
- Dijalankan & dicek visual langsung di browser (dev server) untuk light mode, dark mode, dan minimal breakpoint mobile + desktop — bukan hanya lolos type-check.
- Tidak ada konten hardcoded baru yang seharusnya berasal dari CMS/data dinamis.
