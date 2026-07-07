import { A } from "@solidjs/router";

export default function Unauthorized() {
  return (
    <main class="login-container">
      <div class="login-card" style="text-align: center;">
        <h1 style="color: var(--color-error); font-size: 4rem; margin: 1rem 0;">403</h1>
        <h2 style="margin-bottom: var(--space-3);">Akses Ditolak</h2>
        <p style="color: var(--color-text-secondary); margin-bottom: var(--space-4);">
          Anda tidak memiliki izin untuk mengakses halaman ini. Silakan kembali ke dashboard atau hubungi administrator jika Anda merasa ini adalah kesalahan.
        </p>
        <A href="/dashboard" class="btn-primary" style="text-decoration: none; display: inline-flex; width: auto; padding: 0 var(--space-4);">
          Kembali ke Dashboard
        </A>
      </div>
    </main>
  );
}
