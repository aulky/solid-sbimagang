import { createAsync, type RouteDefinition } from "@solidjs/router";
import { getUser } from "~/lib";
import { Show } from "solid-js";

export const route = {
  preload() {
    getUser();
  },
} satisfies RouteDefinition;

export default function Home() {
  const user = createAsync(() => getUser(), { deferStream: true });

  return (
    <main class="login-container">
      <div class="login-card" style="text-align: center;">
        <img
          src="/logo-sbi.png"
          alt="PT SBI Logo"
          style="height: 60px; margin-bottom: var(--space-3);"
        />
        <h2 style="margin-bottom: var(--space-2);">Sistem Absensi Magang</h2>
        <p style="color: var(--color-text-secondary); margin-bottom: var(--space-4);">
          PT. Solusi Bangun Indonesia — Cilacap
        </p>
        <Show when={user()}>
          {(u) => (
            <div>
              <p style="margin-bottom: var(--space-3);">
                Selamat datang, <strong>{u().fullName}</strong>!
              </p>
              <a
                href={u().role === "ADMIN" ? "/admin/dashboard" : "/dashboard"}
                class="btn-primary"
                style="text-decoration: none; display: inline-flex; width: auto; padding: 0 var(--space-4);"
              >
                Masuk ke Dashboard
              </a>
            </div>
          )}
        </Show>
      </div>
    </main>
  );
}
