import { A, useNavigate, createAsync } from "@solidjs/router";
import { onMount, createSignal } from "solid-js";
import { getUser } from "~/lib";

export default function Unauthorized() {
  const navigate = useNavigate();
  const user = createAsync(() => getUser().catch(() => null));
  const [countdown, setCountdown] = createSignal(3);

  onMount(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          const u = user();
          if (u) {
            navigate(u.role === "ADMIN" ? "/admin/dashboard" : "/dashboard");
          } else {
            navigate("/login");
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  });

  const getTargetHref = () => {
    const u = user();
    if (!u) return "/login";
    return u.role === "ADMIN" ? "/admin/dashboard" : "/dashboard";
  };

  return (
    <main class="login-container">
      <div class="login-card" style="text-align: center;">
        <h1 style="color: var(--color-error); font-size: 4rem; margin: 1rem 0;">
          403
        </h1>
        <h2 style="margin-bottom: var(--space-3);">Akses Ditolak</h2>
        <p style="color: var(--color-text-secondary); margin-bottom: var(--space-4);">
          Anda tidak memiliki izin untuk mengakses halaman ini.
        </p>
        <p style="color: var(--color-warning); font-weight: 700; font-size: 14px; margin-bottom: var(--space-4);">
          Mengalihkan Anda secara otomatis ke Dashboard dalam {countdown()} detik...
        </p>
        <A
          href={getTargetHref()}
          class="btn-primary"
          style="text-decoration: none; display: inline-flex; width: auto; padding: 0 var(--space-4);"
        >
          Kembali Sekarang
        </A>
      </div>
    </main>
  );
}
