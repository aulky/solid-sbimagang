import { ssr, ssrHydrationKey, ssrAttribute, escape, createComponent } from "solid-js/web";
import { createSignal, createEffect, onMount, Show } from "solid-js";
import { u as useSubmission, s as showToast, l as loginOrRegister } from "../../entry-server.js";
import "solid-js/web/storage";
import "fs";
import "path";
import "crypto";
import "@prisma/client";
import "node:stream";
import "xlsx";
var _tmpl$ = ["<svg", ' width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>'], _tmpl$2 = ["<main", ' class="login-container"><div class="login-card" style="text-align:center;"><img', ' alt="SIGMA - Sistem Informasi dan Manajemen Magang" style="height:55px;width:auto;object-fit:contain;margin-bottom:var(--space-4);"><form', ' method="post"><input type="hidden" name="redirectTo"', '><input type="hidden" name="loginType" value="login"><div class="form-group"><label for="username-input">Nama Pengguna</label><input id="username-input" name="username" placeholder="Masukkan username" required></div><div class="form-group"><label for="password-input">Kata Sandi</label><div class="password-input-container"><input id="password-input" name="password"', ' placeholder="Masukkan password" required><button type="button" class="password-toggle-btn"', ">", '</button></div></div><button type="submit"', ">", '</button><div style="display:flex;align-items:center;justify-content:center;gap:6px;margin-top:var(--space-4);color:var(--color-text-secondary);font-size:16px;"><span>Created by :</span><img src="/logo-telu.png" alt="Telkom University" style="height:80px;width:auto;object-fit:contain;"></div></form></div></main>'], _tmpl$3 = ["<svg", ' width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>'];
const id$$ = "src/routes/login.tsx?pick=default&pick=$css";
function Login(props) {
  const loggingIn = useSubmission(loginOrRegister);
  const [theme, setTheme] = createSignal("light");
  const [showPassword, setShowPassword] = createSignal(false);
  createEffect(() => {
    const res = loggingIn.result;
    if (res) {
      const msg = res instanceof Error ? res.message : res?.message || String(res);
      showToast(msg);
    }
  });
  onMount(() => {
    const saved = localStorage.getItem("theme");
    if (saved) {
      setTheme(saved);
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
  });
  return ssr(_tmpl$2, ssrHydrationKey(), ssrAttribute("src", theme() === "dark" ? "/logo-sigma-putih.png" : "/logo-sigma.png", false), ssrAttribute("action", escape(loginOrRegister, true), false), ssrAttribute("value", escape(props.params.redirectTo ?? "/", true), false), ssrAttribute("type", showPassword() ? "text" : "password", false), ssrAttribute("title", showPassword() ? "Sembunyikan sandi" : "Tampilkan sandi", false), escape(createComponent(Show, {
    get when() {
      return showPassword();
    },
    get fallback() {
      return ssr(_tmpl$3, ssrHydrationKey());
    },
    get children() {
      return ssr(_tmpl$, ssrHydrationKey());
    }
  })), ssrAttribute("disabled", loggingIn.pending, true), loggingIn.pending ? "Memproses..." : "Masuk");
}
export {
  Login as default,
  id$$
};
//# sourceMappingURL=login-BSW8oJVt.js.map
