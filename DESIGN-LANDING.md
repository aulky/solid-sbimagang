# Landing Page Design Spec — SIGMA

Dokumen ini adalah spesifikasi desain **khusus halaman landing publik** (`/`, `src/routes/index.tsx`), ditulis agar AI agent dapat langsung mengimplementasikan/meningkatkan UI tanpa perlu menebak keputusan desain. Untuk konteks fitur & data, lihat [PRD-LANDING.md](PRD-LANDING.md). Untuk token desain umum aplikasi (dipakai juga di dashboard admin/user), lihat [DESIGN.md](DESIGN.md) — dokumen ini **mewarisi token yang sama** (jangan buat token baru yang bentrok) dan menambahkan spesifikasi UI yang spesifik untuk tiap section landing page.

**Tujuan halaman**: mengonversi pengunjung anonim (calon peserta magang) menjadi pendaftar, dengan membangun kepercayaan, transparansi (kuota real-time), dan mengurangi friksi (FAQ, kontak jelas).

---

## 0. Aturan untuk AI Agent yang Mengimplementasikan

1. **File yang boleh diubah**: `src/routes/index.tsx` (markup/logic) dan bagian `/* ================= LANDING PAGE (PUBLIC) ================= */` di `src/app.css` (baris ±1762 ke bawah). **Jangan** mengubah token root (`:root`, `[data-theme="dark"]`) di baris 1–56 — itu dipakai global oleh seluruh dashboard.
2. **Jangan** menambah CSS framework (Tailwind dll) atau library UI/icon baru. Ikuti pola yang sudah ada: CSS custom property + class manual + SVG inline untuk ikon.
3. **Semua konten tetap data-driven** — jangan hardcode teks yang sudah bersumber dari `getLandingSettings/getPublicKuota/getPublicFaq/getPublicSyarat/getPublicTestimoni`. Section baru yang butuh data baru harus lewat Prisma model + query baru mengikuti pola `src/lib/index.ts` (lines ~1206–1558), lalu diberi tab baru di `src/routes/admin/landing.tsx`.
4. **Pertahankan seluruh conditional rendering** (`<Show>`) yang menyembunyikan section kosong — jangan menampilkan section kosong/placeholder di production.
5. Prefix class baru dengan `landing-` agar tidak bentrok dengan style dashboard lain di `app.css` yang sama.
6. Uji di **dua tema** (light & dark, via `[data-theme="dark"]`) dan minimal 3 breakpoint: 375px (mobile), 768px (tablet), 1280px (desktop).

---

## 1. Prinsip Desain

| Prinsip | Artinya untuk halaman ini |
| --- | --- |
| **Trustworthy & Institutional** | Ini bukan landing page startup — ini situs resmi anak perusahaan SIG (BUMN semen). Hindari elemen playful berlebihan (confetti, meme, gradient neon). Gunakan whitespace generous, tipografi tegas (Poppins), warna primary merah (#E11D48) sebagai aksen, bukan dominasi penuh. |
| **Transparency-first** | Section Kuota adalah jantung konversi — sisa kuota per divisi harus jadi elemen paling scannable di halaman (bukan disembunyikan di tabel kecil). |
| **Zero-friction FAQ/Contact** | Kontak (WhatsApp/Email) harus terlihat tanpa scroll jauh — pertimbangkan sticky/floating WA button di mobile. |
| **CMS-safe** | Semua layout harus tetap rapi walau admin mengisi teks pendek/panjang, 1 batch atau 10 batch, 0 testimoni atau 20 testimoni. Desain untuk *rentang* konten, bukan 1 skenario. |
| **Fast perceived load** | SSR + `deferStream`, maka desain harus punya skeleton/placeholder state yang tidak "kosong tiba-tiba muncul" (layout shift). |

---

## 2. Design Tokens (diwarisi dari `app.css` — jangan diubah nilainya)

| Token | Light | Dark | Pemakaian di landing |
| --- | --- | --- | --- |
| `--color-primary` | `#e11d48` | sama | CTA utama, hover nav, accent gradient hero |
| `--color-secondary` | `#2563eb` | sama | Tombol Email (secondary), link footer |
| `--color-success` | `#16a34a` | sama | Badge kuota "Tersedia" |
| `--color-error` | `#dc2626` | sama | Badge kuota "Penuh" |
| `--surface-base` | `#ffffff` | `#0f172a` | Background halaman |
| `--surface-glass` | `rgba(255,255,255,.65)` | `rgba(15,23,42,.75)` | Header sticky, card batch/testimoni (glassmorphism) |
| `--color-text` / `--color-text-secondary` | `#1f2937` / `#6b7280` | `#f1f5f9` / `#94a3b8` | Heading / body & caption |
| `--color-border` | `#e5e7eb` | `#334155` | Border card, divider |
| `--font-headline` | Poppins | | H1–H3, judul section, nama testimoni |
| `--font-body` | DM Sans | | Paragraf, label |
| `--space-1..10` | 4–80px | | Spacing rhythm (lihat DESIGN.md) |
| `--radius-md/lg/xl/pill` | 8/16/24/9999px | | Card, badge, tombol |
| `--shadow-glass/md/lg/color` | | | Elevation card & hover |

**Tambahan token khusus landing (boleh ditambahkan sebagai CSS var lokal di dalam blok landing, bukan di `:root` global):**

```css
.landing-page {
  --landing-max-width: 1000px;      /* lebar konten section, sudah dipakai */
  /* Glow radial multi-stop dari atas-tengah (radius px tetap), fade bertahap
     sampai transparent — dipasang sebagai background-image .landing-page
     (full-width), bukan di .landing-hero yang terkurung lebar shell. */
  --landing-hero-gradient: radial-gradient(1100px 640px at 50% -120px,
    rgba(225,29,72,.10) 0%, rgba(225,29,72,.05) 45%,
    rgba(225,29,72,.02) 70%, transparent 100%);
  --landing-card-radius: var(--radius-lg);
}
```

---

## 3. Struktur Halaman (Wireframe Section-per-Section)

Urutan section (top → bottom), semua conditional kecuali Header/Hero/Kuota/Footer:

```
┌───────────────────────────────────────────────────────────┐
│ HEADER (sticky, glass)  Logo SIGMA   Tentang Kuota Syarat  │
│                                        FAQ Kontak   [Login]│
├───────────────────────────────────────────────────────────┤
│                        HERO (center)                       │
│              H1 Judul Program Absensi Magang               │
│                 Subjudul (opsional)                         │
│              [ Lihat Kuota Tersedia → ]                     │
├───────────────────────────────────────────────────────────┤
│ TENTANG PROGRAM (opsional)  — paragraf center, max 720px    │
├───────────────────────────────────────────────────────────┤
│ KUOTA & PERIODE BATCH  — grid card batch (paling penting)   │
│  ┌ Batch A ───────────────┐  ┌ Batch B ───────────────┐     │
│  │ nama + tanggal          │  │ ...                    │     │
│  │ [Divisi] [N Tersedia]   │  │                        │     │
│  │ [Divisi] [Penuh]        │  │                        │     │
│  └─────────────────────────┘  └────────────────────────┘     │
├───────────────────────────────────────────────────────────┤
│ SYARAT & KETENTUAN (opsional) — bullet list                │
├───────────────────────────────────────────────────────────┤
│ FAQ (opsional) — accordion                                  │
├───────────────────────────────────────────────────────────┤
│ KATA MEREKA / TESTIMONI (opsional) — grid card              │
├───────────────────────────────────────────────────────────┤
│ FOOTER / KONTAK — WA + Email + alamat + copyright           │
└───────────────────────────────────────────────────────────┘
```

### 3.1 Header / Navbar

* **Layout**: flex row, `justify-content: space-between`. Kiri: logo + wordmark. Tengah/kanan: nav anchor. Paling kanan: CTA auth-aware.
* **Sticky**: `position: sticky; top:0; z-index:20`, background `--surface-glass` + `backdrop-filter: blur(16px)`, border-bottom 1px `--color-border`.
* **Nav item**: font 14px/600, warna `--color-text-secondary`, hover → `--color-primary`. Tambahkan underline-on-hover (2px, transisi 150ms) untuk affordance yang lebih jelas daripada sekadar ganti warna.
* **Aktif section indicator (peningkatan opsional)**: gunakan `IntersectionObserver` ringan (tanpa library) untuk highlight nav item sesuai section yang sedang di-scroll (`aria-current="true"` + class `.active`).
* **Mobile (<640px)**: nav wrap ke bawah logo (sudah ada di CSS), tapi pertimbangkan mengubah ke hamburger menu jika nav bertambah item — untuk saat ini 5 item masih muat wrap tanpa hamburger.
* **CTA kanan**: `.btn-primary` pill/rounded-md height 36px. Auth-aware: "Login" (anonim) vs "Masuk Dashboard" (login).

### 3.2 Hero

* **Layout**: full-width section, text-center, padding vertikal besar (`--space-8` atau lebih, misal 96px top/bottom di desktop, 64px di mobile).
* **Background**: gradient radial/linear halus dari `--color-primary` di 8% opacity ke transparent — jangan solid block warna (biar tidak berat/childish untuk institusi resmi).
* **H1**: `clamp(28px, 5vw, 44px)` Poppins 800. Pertimbangkan menaikkan ke `clamp(32px, 5.5vw, 52px)` untuk hero yang lebih confident di desktop besar (sesuai `text-hero`/`text-h1` scale di DESIGN.md), asal tetap responsif turun di mobile.
* **Subjudul**: `--color-text-secondary`, max-width 640px center, hanya render jika field terisi (jangan ubah perilaku ini).
* **CTA**: satu tombol primary besar (44–48px height) mengarah ke `#kuota`. Tambahkan micro-interaction: ikon panah kecil (→) yang bergeser 4px ke kanan saat hover (200ms ease), untuk memberi rasa "scroll ke bawah" tanpa mengubah teks.
* **Optional enhancement (bukan wajib, lihat PRD section 3.1)**: baris kecil stat sosial-proof di bawah CTA, misal "X Alumni · Y Batch Berjalan" — hanya tampilkan jika data tersedia dari settings, gaya caption 13px, warna secondary, dipisah dengan `·`.

### 3.3 Tentang Program

* Section paling sederhana: judul center + 1 paragraf max-width 720px, line-height 1.7. Tidak perlu card/border — biarkan sebagai "napas" visual antara Hero dan Kuota.

### 3.4 Kuota & Periode Batch — **section prioritas UX tertinggi**

Ini section konversi utama; perlakukan sebagai "product listing", bukan sekadar teks.

* **Grid batch**: saat ini stack vertikal 1 kolom. Untuk >1 batch aktif, ubah ke grid responsif: `grid-template-columns: repeat(auto-fill, minmax(320px, 1fr))` di ≥768px, tetap 1 kolom di mobile — supaya batch card sejajar side-by-side, bukan menumpuk panjang ke bawah.
* **Batch card** (`.landing-batch-card`): glass card, radius-lg, padding `--space-4`. Header card: nama batch (H3) + meta tanggal (caption, ikon kalender opsional). Body: deskripsi (jika ada) lalu grid kuota divisi.
* **Badge kuota** — ini elemen paling penting secara UX:
  * "N Tersedia": background success-tint (mis. `rgba(22,163,74,.12)` light / `rgba(22,163,74,.2)` dark), teks `--color-success`, radius-pill, font 13px/600. **Jangan** pakai badge merah solid untuk "Penuh" yang terlalu agresif — gunakan tint sama seperti badge lain (`rgba(220,38,38,.12)`) agar konsisten dengan gaya badge di dashboard (`.badge-approved` / `.badge-rejected`).
  * Tambahkan **urutan tampil**: divisi dengan slot tersisa > 0 ditampilkan lebih dulu, "Penuh" di bawah — supaya peluang yang masih terbuka lebih menonjol (perubahan logic ringan di `index.tsx`, sort array `batch.divisi` sebelum `<For>`).
  * Opsional: progress bar tipis (4px, radius-pill) di bawah nama divisi menunjukkan `filled/quota` secara visual selain angka — membantu calon pelamar menilai "seberapa cepat harus daftar" secara sekilas.
* **Empty state**: pesan center italic/secondary "Belum ada informasi batch magang yang dibuka saat ini." — sudah ada, pertahankan, tapi tambahkan CTA sekunder di bawahnya: link/tombol ghost "Hubungi HRD untuk info batch berikutnya" mengarah ke `#kontak`, supaya pengunjung tidak dead-end.
* **Loading state (SSR streaming)**: tampilkan 1–2 skeleton card (shimmer, `background: linear-gradient` animasi, radius-lg, tinggi ±180px) selama `kuota()` belum resolve, alih-alih layout kosong yang tiba-tiba terisi.

### 3.5 Syarat & Ketentuan

* List bullet sederhana sudah cukup. Peningkatan opsional: ganti bullet default dengan custom icon checkmark kecil (SVG inline 16px, warna primary) di depan tiap item — memberi kesan "checklist yang bisa dipenuhi", lebih actionable daripada bullet polos.

### 3.6 FAQ

* Pertahankan native `<details>/<summary>` (aksesibel, ringan). Tambahkan:
  * Ikon chevron (▼) di kanan `<summary>` yang rotate 180° saat `[open]` (CSS `details[open] summary svg { transform: rotate(180deg) }`), agar ada affordance visual expand/collapse yang jelas (saat ini hanya mengandalkan marker default browser yang tidak konsisten antar browser).
  * Transisi max-height/opacity halus opsional (butuh sedikit JS/CSS trick karena `<details>` tidak native-animatable, atau cukup biarkan instant — jangan over-engineer untuk section sekunder ini).

### 3.7 Testimoni ("Kata Mereka")

* Grid card sudah baik. Tambahkan avatar placeholder (lingkaran inisial, mengikuti pola avatar sidebar yang sudah ada di dashboard — reuse gaya yang sama untuk konsistensi) di kiri nama, agar tidak terasa seperti blok teks polos.
* Jika testimoni ≥4, pertimbangkan horizontal scroll-snap carousel di mobile (`scroll-snap-type: x mandatory`) daripada grid 1 kolom yang membuat scroll halaman terlalu panjang — opsional, grid tetap valid fallback.

### 3.8 Footer / Kontak

* Pertahankan struktur (judul, copy, tombol WA/Email, alamat, copyright).
* **Peningkatan penting**: di viewport mobile, tambahkan **floating WhatsApp button** (fixed bottom-right, lingkaran 56px, ikon WA, `box-shadow: shadow-lg`, `z-index: 30`) yang selalu terlihat sepanjang scroll — ini pola UX standar untuk landing page dengan kontak WA sebagai jalur utama, mengurangi friksi dibanding harus scroll ke footer. Sembunyikan di desktop (>1024px) karena tombol di footer sudah cukup terlihat.
* Pastikan kontras teks footer (biasanya area paling gelap/muted) tetap ≥ 4.5:1 di kedua tema.

---

## 4. Komponen Reusable (extend, jangan duplikasi)

| Komponen | Class existing | Catatan penyesuaian untuk landing |
| --- | --- | --- |
| Tombol Primary | `.btn-primary` | Sudah dipakai; pastikan varian "Large" (44–48px, dipakai di Hero) vs "Medium" (36–40px, header/footer) konsisten dengan tabel Sizes di [DESIGN.md](DESIGN.md) |
| Tombol Secondary | `.btn-secondary` | Dipakai untuk tombol Email di footer — pertahankan sebagai outline/secondary, bukan filled, agar WA tetap CTA dominan |
| Badge | `.badge-approved` / `.badge-rejected` | Reuse untuk kuota tersedia/penuh (lihat 3.4) — jangan buat class badge baru |
| Card Glass | pola `.landing-batch-card` / `.landing-testimoni-card` | Konsisten radius-lg + `backdrop-filter: blur(12px)` + `shadow-glass` |
| Accordion | native `<details>` | Tambahkan chevron seperti 3.6, jangan ganti ke komponen custom JS kecuali benar-benar perlu |

---

## 5. Motion & Interaksi

* Durasi transisi standar: **150–300ms ease** (selaras DESIGN.md — jangan lebih lambat, terasa berat untuk halaman institusi).
* Hover card (batch/testimoni): `transform: translateY(-2px)` + shadow naik dari `shadow-glass` → `shadow-md`, 200ms.
* Scroll-triggered fade-in per section (opsional, low-priority): `IntersectionObserver` + class `.is-visible` yang toggle `opacity/translateY`, threshold 0.15, sekali trigger saja (jangan re-animate tiap scroll naik-turun — mengganggu).
* **Jangan** animasi berlebihan (parallax berat, particle background, auto-playing carousel tanpa kontrol) — bertentangan dengan prinsip "Trustworthy & Institutional".

---

## 6. Responsive Breakpoints

| Breakpoint | Perilaku |
| --- | --- |
| `< 640px` (mobile) | Header wrap ke bawah logo (existing). Grid batch/testimoni → 1 kolom. Floating WA button muncul. Hero padding dikurangi (`--space-6`). |
| `640–1024px` (tablet) | Grid batch/testimoni 2 kolom (`auto-fill minmax(320px,1fr)`). Nav tetap 1 baris. |
| `> 1024px` (desktop) | Grid batch/testimoni hingga 3 kolom. Floating WA disembunyikan (tombol footer cukup). Max-width konten tetap 1000px center (jangan full-bleed teks, biar tidak terlalu lebar untuk dibaca). |

---

## 7. Aksesibilitas (Checklist)

- [ ] Semua CTA punya target tap ≥ 40px tinggi (mobile).
- [ ] Kontras teks vs background ≥ 4.5:1 di light & dark (khususnya `--color-text-secondary` di atas `--surface-glass`).
- [ ] `<details>/<summary>` FAQ tetap keyboard-navigable (native, jangan intercept dengan JS custom yang merusak default behavior).
- [ ] Nav anchor & tombol punya `focus-visible` outline yang jelas (gunakan `--shadow-focus` token, jangan `outline: none` tanpa pengganti).
- [ ] Gambar (logo, avatar testimoni jika ditambahkan) punya `alt` text deskriptif.
- [ ] Floating WA button (jika ditambahkan) punya `aria-label="Chat WhatsApp"`.

---

## 8. Do's and Don'ts (khusus Landing Page)

1. **Do** jaga section Kuota sebagai fokus visual utama — ini yang paling mempengaruhi keputusan calon pelamar.
2. **Do** desain untuk rentang konten (0–1 batch vs banyak batch, 0 vs banyak testimoni) — selalu render empty-state yang membantu, bukan kosong begitu saja.
3. **Do** pertahankan aksen merah (`--color-primary`) sebagai *aksen*, bukan dominasi — halaman institusi resmi, bukan promo diskon.
4. **Don't** menambah animasi berat, autoplay carousel, atau efek "flashy" yang menurunkan kesan kredibilitas perusahaan BUMN semen.
5. **Don't** mengubah token warna/spacing global di `:root` — semua penyesuaian landing harus lokal ke `.landing-page` agar dashboard admin/user tidak ikut berubah.
6. **Do** uji setiap perubahan di dark mode — glassmorphism sangat sensitif kontrasnya di dark surface (`rgba(15,23,42,.75)`).
7. **Don't** menyembunyikan CTA kontak (WA/Email) di belakang scroll panjang tanpa floating button di mobile.
8. **Do** jaga waktu transisi 150–300ms — konsisten dengan seluruh aplikasi (modal, toast, sidebar sudah pakai rentang ini).
