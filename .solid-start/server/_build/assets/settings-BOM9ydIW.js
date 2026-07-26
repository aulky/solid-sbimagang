import { ssr, ssrHydrationKey, escape, createComponent, ssrAttribute } from "solid-js/web";
import { createEffect, Show } from "solid-js";
import { c as createAsync, u as useSubmission, s as showToast, M as updateSystemSettings, N as getSystemSettings } from "../../entry-server.js";
import "solid-js/web/storage";
import "fs";
import "path";
import "crypto";
import "@prisma/client";
import "node:stream";
import "xlsx";
var _tmpl$ = ["<main", ' style="max-width:600px;margin:0 auto;text-align:left;"><h1 class="page-title">Pengaturan Sistem</h1><!--$-->', "<!--/--></main>"], _tmpl$2 = ["<div", ' class="settings-card skeleton-card" style="opacity:0.6;pointer-events:none;"><h3 style="margin-top:0;font-family:var(--font-headline);font-weight:700;margin-bottom:var(--space-4);"><div class="skeleton" style="width:150px;height:22px;"></div></h3><div class="skeleton-form-field"><div class="skeleton" style="width:120px;height:16px;"></div><div class="skeleton" style="width:100%;height:35px;border-radius:6px;"></div></div><div class="skeleton-form-field"><div class="skeleton" style="width:160px;height:16px;"></div><div class="skeleton" style="width:100%;height:35px;border-radius:6px;"></div></div><div class="skeleton-form-field"><div class="skeleton" style="width:140px;height:16px;"></div><div class="skeleton" style="width:100%;height:35px;border-radius:6px;"></div></div><div class="skeleton" style="width:150px;height:38px;border-radius:var(--radius-md);margin-top:var(--space-4);"></div></div>'], _tmpl$3 = ["<div", ' class="settings-card"><h3 style="margin-top:0;font-family:var(--font-headline);font-weight:700;margin-bottom:var(--space-4);">Konfigurasi Absensi</h3><form', ' method="post"><div class="form-group"><label for="jam-masuk">Jam Masuk (Format 24 Jam)</label><input id="jam-masuk" name="jamMasuk" type="time"', ' required></div><div class="form-group"><label for="toleransi-menit">Toleransi Keterlambatan (Menit)</label><input id="toleransi-menit" name="toleransiMenit" type="number" min="0"', ' required></div><div class="form-group"><label for="jam-mulai-checkout">Jam Mulai Check-Out (Format 24 Jam)</label><input id="jam-mulai-checkout" name="jamMulaiCheckout" type="time"', ' required></div><div class="form-group"><label for="lokasi-kantor">Lokasi Kantor (Default)</label><input id="lokasi-kantor" name="lokasiKantor" type="text" placeholder="Masukkan lokasi kantor"', ' required></div><button class="btn-primary" type="submit"', ' style="width:auto;padding:0 var(--space-4);margin-top:var(--space-4);">', "</button></form></div>"];
const id$$ = "src/routes/admin/settings.tsx?pick=default&pick=$css";
function AdminSettings() {
  const settings = createAsync(() => getSystemSettings());
  const updating = useSubmission(updateSystemSettings);
  createEffect(() => {
    if (updating.result) {
      if (updating.result instanceof Error) {
        showToast(updating.result.message, "error");
      } else {
        showToast("Pengaturan sistem berhasil diperbarui!", "success");
      }
    }
  });
  return ssr(_tmpl$, ssrHydrationKey(), escape(createComponent(Show, {
    get when() {
      return settings();
    },
    get fallback() {
      return ssr(_tmpl$2, ssrHydrationKey());
    },
    children: (data) => ssr(_tmpl$3, ssrHydrationKey(), ssrAttribute("action", escape(updateSystemSettings, true), false), ssrAttribute("value", escape(data().jamMasuk || "08:00", true), false), ssrAttribute("value", escape(data().toleransiMenit ?? 0, true), false), ssrAttribute("value", escape(data().jamMulaiCheckout || "16:00", true), false), ssrAttribute("value", escape(data().lokasiKantor || "Kantor PT. SBI Cilacap", true), false), ssrAttribute("disabled", updating.pending, true), updating.pending ? "Menyimpan..." : "Simpan Pengaturan")
  })));
}
export {
  AdminSettings as default,
  id$$
};
//# sourceMappingURL=settings-BOM9ydIW.js.map
