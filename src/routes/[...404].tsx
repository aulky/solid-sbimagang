import { A } from "@solidjs/router";

export default function NotFound() {
  return (
    <main class="login-container">
      <div class="login-card" style="text-align: center;">
        <h1 class="page-title" style="font-size: 4rem; margin-bottom: var(--space-2); color: var(--color-primary)">404</h1>
        <h2>Halaman Tidak Ditemukan</h2>
        <p style="margin-bottom: var(--space-4); color: var(--color-text-secondary)">
          Maaf, halaman yang Anda cari tidak dapat ditemukan.
        </p>
        <A href="/" class="btn-primary" style="text-decoration: none;">
          Kembali ke Beranda
        </A>
      </div>
    </main>
  );
}
