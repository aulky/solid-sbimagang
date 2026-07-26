import { ssr, ssrHydrationKey, escape, createComponent } from "solid-js/web";
import { A } from "./components-CiWplyHD.js";
import "solid-js";
import "../../entry-server.js";
import "solid-js/web/storage";
import "fs";
import "path";
import "crypto";
import "@prisma/client";
import "node:stream";
import "xlsx";
var _tmpl$ = ["<main", ' class="login-container"><div class="login-card" style="text-align:center;"><h1 class="page-title" style="font-size:4rem;margin-bottom:var(--space-2);color:var(--color-primary)">404</h1><h2>Halaman Tidak Ditemukan</h2><p style="margin-bottom:var(--space-4);color:var(--color-text-secondary)">Maaf, halaman yang Anda cari tidak dapat ditemukan.</p><!--$-->', "<!--/--></div></main>"];
const id$$ = "src/routes/[...404].tsx?pick=default&pick=$css";
function NotFound() {
  return ssr(_tmpl$, ssrHydrationKey(), escape(createComponent(A, {
    href: "/",
    "class": "btn-primary",
    style: "text-decoration: none;",
    children: "Kembali ke Beranda"
  })));
}
export {
  NotFound as default,
  id$$
};
//# sourceMappingURL=_...404_-Dad2_Sht.js.map
