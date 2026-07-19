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
          src="/logo-sapa.png"
          alt="Logo SIGMA"
          style="height: 60px; margin-bottom: var(--space-3);"
        />
        <h2 style="margin-bottom: var(--space-2);">Sistem Absensi Peserta Magang</h2>
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
