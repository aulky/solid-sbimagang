import { useSubmission, type RouteSectionProps } from "@solidjs/router";
import { Show, createSignal, onMount, createEffect } from "solid-js";
import { Portal } from "solid-js/web";
import { loginOrRegister } from "~/lib";

export default function Login(props: RouteSectionProps) {
  const loggingIn = useSubmission(loginOrRegister);
  const [theme, setTheme] = createSignal("light");
  const [showPassword, setShowPassword] = createSignal(false);
  const [errorMessage, setErrorMessage] = createSignal<string | null>(null);

  let toastTimer: any;

  createEffect(() => {
    const res = loggingIn.result;
    if (res) {
      const msg = res instanceof Error
        ? res.message
        : (res as any)?.message || String(res);
      setErrorMessage(msg);

      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        setErrorMessage(null);
      }, 10000);
    }
  });

  onMount(() => {
    const saved = localStorage.getItem("theme");
    if (saved) {
      setTheme(saved);
    } else if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setTheme("dark");
    }
  });

  return (
    <main class="login-container">
      {/* Toast Notification Top-Right */}
      <Show when={errorMessage()}>
        {(msg) => (
          <Portal>
            <div
              style="position: fixed; top: 20px; right: 20px; z-index: 9999; max-width: 380px; width: calc(100% - 40px); animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);"
            >
              <div
                class="alert-error"
                role="alert"
                style="display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 16px; margin: 0; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.2); border: 2px solid var(--color-error); border-radius: var(--radius-md); background-color: var(--surface-base);"
              >
                <div style="display: flex; align-items: center; gap: 10px; flex: 1;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; color: var(--color-error);">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span style="font-size: 14px; font-weight: 500; text-align: left; line-height: 1.4;">
                    {msg()}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setErrorMessage(null)}
                  style="background: transparent; border: none; font-size: 20px; line-height: 1; cursor: pointer; color: var(--color-text-secondary); padding: 4px; display: flex; align-items: center; justify-content: center; border-radius: 4px; transition: color 0.2s ease;"
                  title="Tutup notifikasi"
                >
                  ×
                </button>
              </div>
            </div>
          </Portal>
        )}
      </Show>

      <div class="login-card" style="text-align: center;">
        <img
          src={theme() === "dark" ? "/logo-sapaa-putih.png" : "/logo-sapa.png"}
          alt="SIGMA - Sistem Absensi Peserta Magang"
          style="height: 55px; width: auto; object-fit: contain; margin-bottom: var(--space-4);"
        />


        <form action={loginOrRegister} method="post">
          <input
            type="hidden"
            name="redirectTo"
            value={props.params.redirectTo ?? "/"}
          />
          <input type="hidden" name="loginType" value="login" />

          <div class="form-group">
            <label for="username-input">Nama Pengguna</label>
            <input
              id="username-input"
              name="username"
              placeholder="Masukkan username"
              required
            />
          </div>

          <div class="form-group">
            <label for="password-input">Kata Sandi</label>
            <div class="password-input-container">
              <input
                id="password-input"
                name="password"
                type={showPassword() ? "text" : "password"}
                placeholder="Masukkan password"
                required
              />
              <button
                type="button"
                class="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword())}
                title={showPassword() ? "Sembunyikan sandi" : "Tampilkan sandi"}
              >
                <Show
                  when={showPassword()}
                  fallback={
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  }
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                </Show>
              </button>
            </div>
          </div>

          <button type="submit" disabled={loggingIn.pending}>
            {loggingIn.pending ? "Memproses..." : "Masuk"}
          </button>

          <div style="display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: var(--space-4); color: var(--color-text-secondary); font-size: 16px;">
            <span>Created by :</span>
            <img src="/logo-telu.png" alt="Telkom University" style="height: 80px; width: auto; object-fit: contain;" />
          </div>
        </form>
      </div>
    </main>
  );
}
