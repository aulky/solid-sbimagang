import { ssr, ssrHydrationKey, escape, createComponent, ssrAttribute } from "solid-js/web";
import { c as createAsync, g as getUser } from "../../entry-server.js";
import { Show } from "solid-js";
import "solid-js/web/storage";
import "fs";
import "path";
import "crypto";
import "@prisma/client";
import "node:stream";
import "xlsx";
var _tmpl$ = ["<main", ' class="login-container"><div class="login-card" style="text-align:center;"><img src="/logo-sigma.png" alt="Logo SIGMA" style="height:60px;margin-bottom:var(--space-3);"><h2 style="margin-bottom:var(--space-2);">Sistem Informasi dan Manajemen Magang</h2><!--$-->', "<!--/--></div></main>"], _tmpl$2 = ["<div", '><p style="margin-bottom:var(--space-3);">Selamat datang, <strong>', "</strong>!</p><a", ' class="btn-primary" style="text-decoration:none;display:inline-flex;width:auto;padding:0 var(--space-4);">Masuk ke Dashboard</a></div>'];
const id$$ = "src/routes/index.tsx?pick=default&pick=$css";
function Home() {
  const user = createAsync(() => getUser(), {
    deferStream: true
  });
  return ssr(_tmpl$, ssrHydrationKey(), escape(createComponent(Show, {
    get when() {
      return user();
    },
    children: (u) => ssr(_tmpl$2, ssrHydrationKey(), escape(u().fullName), ssrAttribute("href", u().role === "ADMIN" ? "/admin/dashboard" : "/dashboard", false))
  })));
}
export {
  Home as default,
  id$$
};
//# sourceMappingURL=index-Bker35Ea.js.map
