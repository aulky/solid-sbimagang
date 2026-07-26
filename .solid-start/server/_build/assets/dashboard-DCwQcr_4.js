import { ssr, ssrHydrationKey, escape, createComponent, ssrStyleProperty, ssrAttribute } from "solid-js/web";
import { createEffect, Show } from "solid-js";
import { c as createAsync, u as useSubmission, a as useSearchParams, s as showToast, b as checkOut, d as checkIn, g as getUser, e as getPublicSettings, f as getTodayAttendance, h as getAttendanceHistory } from "../../entry-server.js";
import "solid-js/web/storage";
import "fs";
import "path";
import "crypto";
import "@prisma/client";
import "node:stream";
import "xlsx";
var _tmpl$ = ["<div", ' style="background:rgba(37, 99, 235, 0.1);border-left:4px solid var(--color-info);padding:var(--space-3) var(--space-4);border-radius:var(--radius-md);display:flex;flex-direction:column;gap:var(--space-1);"><p style="margin:0;color:var(--color-info);font-weight:600;display:flex;align-items:center;gap:8px;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>Status Kehadiran: Izin Aktif</p><p style="margin:4px 0 0 0;font-size:13px;color:var(--color-text-secondary);line-height:1.4;">Hari ini Anda terdaftar sedang izin/sakit (<!--$-->', "<!--/-->). Anda tidak perlu melakukan check-in atau check-out.</p></div>"], _tmpl$2 = ["<div", ' style="text-align:left;"><div class="fade-in-up" style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-4);flex-wrap:wrap;"><img src="/favicon.png" alt="Logo SIGMA" style="height:48px;width:auto;object-fit:contain;flex-shrink:0;"><div><h1 class="page-title" style="margin-bottom:4px;font-size:1.8rem;line-height:1.2;">Selamat datang, <!--$-->', '<!--/-->!</h1><p style="color:var(--color-text-secondary);margin:0;font-size:14px;">Divisi: <!--$-->', "<!--/--></p><!--$-->", '<!--/--></div></div><p style="font-size:14px;color:var(--color-text-secondary);margin:0 0 var(--space-3) 0;">', '</p><h2 style="font-family:var(--font-headline);font-weight:700;font-size:1.1rem;margin-top:var(--space-4);margin-bottom:var(--space-3);">Statistik Bulan Ini</h2><div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:var(--space-3);"><div class="stat-card fade-in-up stagger-1" style="border-left:4px solid var(--color-success);flex-direction:row;align-items:center;justify-content:space-between;padding:var(--space-3) var(--space-4);"><div><div class="stat-value" style="font-size:1.8rem;line-height:1.2;">', '</div><div class="stat-label" style="font-size:13px;">Hadir</div></div><div style="background:rgba(22, 163, 74, 0.1);padding:10px;border-radius:var(--radius-md);display:flex;"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--color-success);"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg></div></div><div class="stat-card fade-in-up stagger-2" style="border-left:4px solid var(--color-warning);flex-direction:row;align-items:center;justify-content:space-between;padding:var(--space-3) var(--space-4);"><div><div class="stat-value" style="font-size:1.8rem;line-height:1.2;">', '</div><div class="stat-label" style="font-size:13px;">Terlambat</div></div><div style="background:rgba(217, 119, 6, 0.1);padding:10px;border-radius:var(--radius-md);display:flex;"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--color-warning);"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg></div></div><div class="stat-card fade-in-up stagger-3" style="border-left:4px solid var(--color-info);flex-direction:row;align-items:center;justify-content:space-between;padding:var(--space-3) var(--space-4);"><div><div class="stat-value" style="font-size:1.8rem;line-height:1.2;">', '</div><div class="stat-label" style="font-size:13px;">Izin / Sakit</div></div><div style="background:rgba(37, 99, 235, 0.1);padding:10px;border-radius:var(--radius-md);display:flex;"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--color-info);"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg></div></div><div class="stat-card fade-in-up stagger-4" style="border-left:4px solid #8b5cf6;flex-direction:row;align-items:center;justify-content:space-between;padding:var(--space-3) var(--space-4);"><div><div class="stat-value" style="font-size:1.8rem;line-height:1.2;"><!--$-->', '<!--/--><span style="font-size:1rem;">%</span></div><div class="stat-label" style="font-size:13px;">Tepat Waktu</div></div><div style="background:rgba(139, 92, 246, 0.1);padding:10px;border-radius:var(--radius-md);display:flex;"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:#8b5cf6;"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg></div></div></div><div class="stat-card fade-in-up stagger-5" style="', '"><h2 style="font-family:var(--font-headline);font-weight:700;font-size:1.2rem;margin-top:0;margin-bottom:var(--space-3);color:var(--color-text);">Absensi Hari Ini</h2><!--$-->', "<!--/--><!--$-->", "<!--/--></div></div>"], _tmpl$3 = ["<p", ' style="color:var(--color-text-secondary);margin:2px 0 0 0;font-size:13px;">Batch: <strong style="color:var(--color-text);">', '</strong> <span style="font-size:12px;">(<!--$-->', "<!--/--> - <!--$-->", "<!--/-->)</span></p>"], _tmpl$4 = ["<div", ' style="font-size:13px;margin-bottom:var(--space-3);color:var(--color-text-secondary);display:flex;flex-direction:column;gap:2px;"><div>Batas Check-In Tanpa Telat: <strong style="color:var(--color-text-primary);">', '</strong></div><div>Check-Out Mulai Jam: <strong style="color:var(--color-text-primary);">', "</strong></div></div>"], _tmpl$5 = ["<div", '><p class="stat-label">Belum Check-In</p><form', ' method="post"><button class="btn-primary" type="submit"', ">", "</button></form></div>"], _tmpl$6 = ["<div", '><p><span class="stat-label">Check-In:</span> <!--$-->', "<!--/--></p><!--$-->", "<!--/--></div>"], _tmpl$7 = ["<div", "><form", ' method="post"><button class="btn-primary" type="submit"', ">", "</button></form><!--$-->", "<!--/--></div>"], _tmpl$8 = ["<p", ' style="font-size:12px;color:var(--color-text-secondary);margin-top:6px;">Check-Out tersedia mulai jam <!--$-->', "<!--/--></p>"], _tmpl$9 = ["<div", '><p><span class="stat-label">Check-Out:</span> <!--$-->', '<!--/--></p><div style="display:flex;align-items:center;gap:8px;margin-top:10px;"><span class="', '">', '</span><span style="font-size:13px;color:var(--color-success);font-weight:500;">Hari ini sudah Check-Out</span></div></div>'];
const id$$ = "src/routes/dashboard.tsx?pick=default&pick=$css";
function Dashboard() {
  const user = createAsync(() => getUser());
  const today = createAsync(() => getTodayAttendance());
  const history = createAsync(() => getAttendanceHistory());
  const settings = createAsync(() => getPublicSettings());
  const checkingIn = useSubmission(checkIn);
  const checkingOut = useSubmission(checkOut);
  const [searchParams, setSearchParams] = useSearchParams();
  createEffect(() => {
    if (searchParams.success === "checkin") {
      showToast("Check-In berhasil! Selamat bekerja.", "success");
      setSearchParams({
        success: null
      });
    } else if (searchParams.success === "checkout") {
      showToast("Check-Out berhasil! Sampai jumpa besok.", "success");
      setSearchParams({
        success: null
      });
    }
  });
  createEffect(() => {
    if (checkingIn.result instanceof Error) showToast(checkingIn.result.message, "error");
  });
  createEffect(() => {
    if (checkingOut.result instanceof Error) showToast(checkingOut.result.message, "error");
  });
  const now = () => {
    const d = /* @__PURE__ */ new Date();
    return d.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    }) + " — " + d.toLocaleTimeString("id-ID");
  };
  const monthStats = () => {
    const records = history();
    if (!records) return {
      hadir: 0,
      telat: 0,
      izin: 0,
      alpha: 0,
      onTimeRate: 0
    };
    const thisMonth = (/* @__PURE__ */ new Date()).getMonth();
    const thisYear = (/* @__PURE__ */ new Date()).getFullYear();
    let hadir = 0;
    let telat = 0;
    let izin = 0;
    let alpha = 0;
    for (const r of records) {
      const d = new Date(r.date);
      if (d.getMonth() === thisMonth && d.getFullYear() === thisYear) {
        if (r.status === "HADIR") hadir++;
        else if (r.status === "TELAT") telat++;
        else if (r.status === "IZIN") izin++;
        else if (r.status === "ALPHA") alpha++;
      }
    }
    const totalPresent = hadir + telat;
    const onTimeRate = totalPresent > 0 ? Math.round(hadir / totalPresent * 100) : 0;
    return {
      hadir,
      telat,
      izin,
      alpha,
      onTimeRate
    };
  };
  return ssr(_tmpl$2, ssrHydrationKey(), escape(user()?.fullName), escape(user()?.divisi ?? "-"), escape(createComponent(Show, {
    get when() {
      return user()?.batch;
    },
    children: (batch) => ssr(_tmpl$3, ssrHydrationKey(), escape(batch().name), escape(new Date(batch().startDate).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric"
    })), escape(new Date(batch().endDate).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric"
    })))
  })), escape(now()), escape(monthStats().hadir), escape(monthStats().telat), escape(monthStats().izin), escape(monthStats().onTimeRate), ssrStyleProperty("margin-top:", "var(--space-4)"), escape(createComponent(Show, {
    get when() {
      return settings();
    },
    children: (s) => {
      const [tHour, tMin] = (s().jamMasuk || "08:00").split(":").map(Number);
      const totalMin = tHour * 60 + tMin + Number(s().toleransiMenit || 0);
      const limitStr = `${String(Math.floor(totalMin / 60)).padStart(2, "0")}:${String(totalMin % 60).padStart(2, "0")}`;
      return ssr(_tmpl$4, ssrHydrationKey(), escape(limitStr), escape(s().jamMulaiCheckout || "16:00"));
    }
  })), escape(createComponent(Show, {
    get when() {
      return today() && today().status === "IZIN";
    },
    get fallback() {
      return createComponent(Show, {
        get when() {
          return today();
        },
        get fallback() {
          return ssr(_tmpl$5, ssrHydrationKey(), ssrAttribute("action", escape(checkIn, true), false), ssrAttribute("disabled", checkingIn.pending, true), checkingIn.pending ? "Memproses..." : "Check-In");
        },
        children: (att) => ssr(_tmpl$6, ssrHydrationKey(), att().checkIn ? escape(new Date(att().checkIn).toLocaleTimeString("id-ID")) : "-", escape(createComponent(Show, {
          get when() {
            return att().checkOut;
          },
          get fallback() {
            return ssr(_tmpl$7, ssrHydrationKey(), ssrAttribute("action", escape(checkOut, true), false), ssrAttribute("disabled", checkingOut.pending || (() => {
              const s = settings();
              if (!s) return false;
              const jam = s.jamMulaiCheckout || "16:00";
              const [h, m] = jam.split(":").map(Number);
              const d = /* @__PURE__ */ new Date();
              return d.getHours() * 60 + d.getMinutes() < h * 60 + m - 60;
            })(), true), checkingOut.pending ? "Memproses..." : "Check-Out", (() => {
              const s = settings();
              if (!s) return null;
              const jam = s.jamMulaiCheckout || "16:00";
              const [h, m] = jam.split(":").map(Number);
              const target = h * 60 + m;
              const d = /* @__PURE__ */ new Date();
              const nowMin = d.getHours() * 60 + d.getMinutes();
              if (nowMin < target - 60) {
                const ah = Math.floor((target - 60) / 60);
                const am = (target - 60) % 60;
                const allowedStr = `${String(ah).padStart(2, "0")}:${String(am).padStart(2, "0")}`;
                return ssr(_tmpl$8, ssrHydrationKey(), escape(allowedStr));
              }
              return escape(null);
            })());
          },
          children: (co) => ssr(_tmpl$9, ssrHydrationKey(), escape(new Date(co()).toLocaleTimeString("id-ID")), `badge ${att().status === "HADIR" ? "badge-hadir" : att().status === "TELAT" ? "badge-telat" : att().status === "ALPHA" ? "badge-alpha" : "badge-izin"}`, escape(att().status))
        })))
      });
    },
    get children() {
      return ssr(_tmpl$, ssrHydrationKey(), escape(today()?.notes || "-"));
    }
  })));
}
export {
  Dashboard as default,
  id$$
};
//# sourceMappingURL=dashboard-DCwQcr_4.js.map
