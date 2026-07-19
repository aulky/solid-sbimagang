import { useSubmission, type RouteSectionProps } from "@solidjs/router";
import { Show, createSignal, onMount } from "solid-js";
import { loginOrRegister } from "~/lib";

export default function Login(props: RouteSectionProps) {
  const loggingIn = useSubmission(loginOrRegister);
  const [theme, setTheme] = createSignal("light");
  const [showPassword, setShowPassword] = createSignal(false);

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

          <Show when={loggingIn.result}>
            <div class="alert-error" role="alert" id="error-message">
              {loggingIn.result instanceof Error
                ? loggingIn.result.message
                : (loggingIn.result as any)?.message ||
                  String(loggingIn.result)}
            </div>
          </Show>
        </form>
      </div>
    </main>
  );
}
