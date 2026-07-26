import { ssr, ssrHydrationKey, escape, createComponent } from "solid-js/web";
import { createSignal, onMount } from "solid-js";
import { n as useNavigate, c as createAsync, g as getUser } from "../../entry-server.js";
import { A } from "./components-CiWplyHD.js";
import "solid-js/web/storage";
import "fs";
import "path";
import "crypto";
import "@prisma/client";
import "node:stream";
import "xlsx";
var _tmpl$ = ["<main", ' class="login-container"><div class="login-card" style="text-align:center;"><h1 style="color:var(--color-error);font-size:4rem;margin:1rem 0;">403</h1><h2 style="margin-bottom:var(--space-3);">Akses Ditolak</h2><p style="color:var(--color-text-secondary);margin-bottom:var(--space-4);">Anda tidak memiliki izin untuk mengakses halaman ini.</p><p style="color:var(--color-warning);font-weight:700;font-size:14px;margin-bottom:var(--space-4);">Mengalihkan Anda secara otomatis ke Dashboard dalam <!--$-->', "<!--/--> detik...</p><!--$-->", "<!--/--></div></main>"];
const id$$ = "src/routes/unauthorized.tsx?pick=default&pick=$css";
function Unauthorized() {
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
    }, 1e3);
  });
  const getTargetHref = () => {
    const u = user();
    if (!u) return "/login";
    return u.role === "ADMIN" ? "/admin/dashboard" : "/dashboard";
  };
  return ssr(_tmpl$, ssrHydrationKey(), escape(countdown()), escape(createComponent(A, {
    get href() {
      return getTargetHref();
    },
    "class": "btn-primary",
    style: "text-decoration: none; display: inline-flex; width: auto; padding: 0 var(--space-4);",
    children: "Kembali Sekarang"
  })));
}
export {
  Unauthorized as default,
  id$$
};
//# sourceMappingURL=unauthorized-DaZPqjEc.js.map
