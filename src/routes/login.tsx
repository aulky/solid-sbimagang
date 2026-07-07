import {
  useSubmission,
  type RouteSectionProps
} from "@solidjs/router";
import { Show, createSignal, onMount } from "solid-js";
import { loginOrRegister } from "~/lib";

export default function Login(props: RouteSectionProps) {
  const loggingIn = useSubmission(loginOrRegister);
  const [theme, setTheme] = createSignal("light");

  onMount(() => {
    const saved = localStorage.getItem("theme");
    if (saved) {
      setTheme(saved);
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
  });

  return (
    <main class="login-container">
      <div class="login-card" style="text-align: center;">
        <img
          src={theme() === "dark" ? "/logo-sbi-putih.png" : "/logo-sbi.png"}
          alt="PT SBI Logo"
          style="height: 36px; width: auto; object-fit: contain; margin-bottom: var(--space-4);"
        />
        <h1 style="font-size: 1.5rem; margin-bottom: var(--space-1); font-family: var(--font-headline); font-weight: 800;">Sistem Absensi Magang</h1>
        <p style="color: var(--color-text-secondary); margin-bottom: var(--space-5); font-size: 14px;">
          PT. Solusi Bangun Indonesia Cilacap
        </p>

        <form action={loginOrRegister} method="post">
          <input type="hidden" name="redirectTo" value={props.params.redirectTo ?? "/"} />
          <input type="hidden" name="loginType" value="login" />

          <div class="form-group">
            <label for="username-input">Nama Pengguna</label>
            <input id="username-input" name="username" placeholder="Masukkan username" required />
          </div>

          <div class="form-group">
            <label for="password-input">Kata Sandi</label>
            <input id="password-input" name="password" type="password" placeholder="Masukkan password" required />
          </div>

          <button type="submit" disabled={loggingIn.pending}>
            {loggingIn.pending ? "Memproses..." : "Masuk"}
          </button>

          <Show when={loggingIn.result}>
            <div class="alert-error" role="alert" id="error-message">
              {loggingIn.result instanceof Error ? loggingIn.result.message : (loggingIn.result as any)?.message || String(loggingIn.result)}
            </div>
          </Show>
        </form>
      </div>
    </main>
  );
}
