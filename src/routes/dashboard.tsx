import {
  createAsync,
  useSubmission,
  useSearchParams,
  type RouteDefinition,
} from "@solidjs/router";
import { Show, createEffect } from "solid-js";
import {
  getUser,
  getTodayAttendance,
  checkIn,
  checkOut,
  getAttendanceHistory,
  getPublicSettings,
} from "~/lib";
import { showToast } from "~/lib/toast";

export const route = {
  preload: () => {
    getUser();
    getTodayAttendance();
    getAttendanceHistory();
    getPublicSettings();
  },
} satisfies RouteDefinition;

export default function Dashboard() {
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
      setSearchParams({ success: null });
    } else if (searchParams.success === "checkout") {
      showToast("Check-Out berhasil! Sampai jumpa besok.", "success");
      setSearchParams({ success: null });
    }
  });

  // Toast error notifications
  createEffect(() => { if ((checkingIn.result as any) instanceof Error) showToast(((checkingIn.result as any) as Error).message, "error"); });
  createEffect(() => { if ((checkingOut.result as any) instanceof Error) showToast(((checkingOut.result as any) as Error).message, "error"); });

  const now = () => {
    const d = new Date();
    return (
      d.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }) +
      " — " +
      d.toLocaleTimeString("id-ID")
    );
  };

  const monthStats = () => {
    const records = history();
    if (!records) return { hadir: 0, telat: 0, izin: 0, alpha: 0, onTimeRate: 0 };
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
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
    const onTimeRate = totalPresent > 0 ? Math.round((hadir / totalPresent) * 100) : 0;
    return { hadir, telat, izin, alpha, onTimeRate };
  };

  return (
    <div style="text-align: left;">
      <div class="fade-in-up" style="display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-4); flex-wrap: wrap;">
        <img
          src="/favicon.png"
          alt="Logo SIGMA"
          style="height: 48px; width: auto; object-fit: contain; flex-shrink: 0;"
        />
        <div>
          <h1 class="page-title" style="margin-bottom: 4px; font-size: 1.8rem; line-height: 1.2;">
            Selamat datang, {user()?.fullName}!
          </h1>
          <p style="color: var(--color-text-secondary); margin: 0; font-size: 14px;">
            Divisi: {user()?.divisi ?? "-"}
          </p>
          <Show when={user()?.batch}>
            {(batch) => (
              <p style="color: var(--color-text-secondary); margin: 2px 0 0 0; font-size: 13px;">
                Batch: <strong style="color: var(--color-text);">{batch().name}</strong>{" "}
                <span style="font-size: 12px;">
                  ({new Date(batch().startDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })} - {new Date(batch().endDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })})
                </span>
              </p>
            )}
          </Show>
        </div>
      </div>
      <p style="font-size: 14px; color: var(--color-text-secondary); margin: 0 0 var(--space-3) 0;">
        {now()}
      </p>

      {/* Statistik Bulanan */}
      <h2 style="font-family: var(--font-headline); font-weight: 700; font-size: 1.1rem; margin-top: var(--space-4); margin-bottom: var(--space-3);">
        Statistik Bulan Ini
      </h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-3);">
        {/* Hadir */}
        <div class="stat-card fade-in-up stagger-1" style="border-left: 4px solid var(--color-success); flex-direction: row; align-items: center; justify-content: space-between; padding: var(--space-3) var(--space-4);">
          <div>
            <div class="stat-value" style="font-size: 1.8rem; line-height: 1.2;">{monthStats().hadir}</div>
            <div class="stat-label" style="font-size: 13px;">Hadir</div>
          </div>
          <div style="background: rgba(22, 163, 74, 0.1); padding: 10px; border-radius: var(--radius-md); display: flex;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--color-success);"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
        </div>

        {/* Telat */}
        <div class="stat-card fade-in-up stagger-2" style="border-left: 4px solid var(--color-warning); flex-direction: row; align-items: center; justify-content: space-between; padding: var(--space-3) var(--space-4);">
          <div>
            <div class="stat-value" style="font-size: 1.8rem; line-height: 1.2;">{monthStats().telat}</div>
            <div class="stat-label" style="font-size: 13px;">Terlambat</div>
          </div>
          <div style="background: rgba(217, 119, 6, 0.1); padding: 10px; border-radius: var(--radius-md); display: flex;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--color-warning);"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
        </div>

        {/* Izin */}
        <div class="stat-card fade-in-up stagger-3" style="border-left: 4px solid var(--color-info); flex-direction: row; align-items: center; justify-content: space-between; padding: var(--space-3) var(--space-4);">
          <div>
            <div class="stat-value" style="font-size: 1.8rem; line-height: 1.2;">{monthStats().izin}</div>
            <div class="stat-label" style="font-size: 13px;">Izin / Sakit</div>
          </div>
          <div style="background: rgba(37, 99, 235, 0.1); padding: 10px; border-radius: var(--radius-md); display: flex;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--color-info);"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          </div>
        </div>

        {/* Tingkat Tepat Waktu */}
        <div class="stat-card fade-in-up stagger-4" style="border-left: 4px solid #8b5cf6; flex-direction: row; align-items: center; justify-content: space-between; padding: var(--space-3) var(--space-4);">
          <div>
            <div class="stat-value" style="font-size: 1.8rem; line-height: 1.2;">{monthStats().onTimeRate}<span style="font-size: 1rem;">%</span></div>
            <div class="stat-label" style="font-size: 13px;">Tepat Waktu</div>
          </div>
          <div style="background: rgba(139, 92, 246, 0.1); padding: 10px; border-radius: var(--radius-md); display: flex;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #8b5cf6;"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
          </div>
        </div>
      </div>

      <div class="stat-card fade-in-up stagger-5" style={{ "margin-top": "var(--space-4)" }}>
        <h2 style="font-family: var(--font-headline); font-weight: 700; font-size: 1.2rem; margin-top: 0; margin-bottom: var(--space-3); color: var(--color-text);">Absensi Hari Ini</h2>
        <Show when={settings()}>
          {(s) => {
            const [tHour, tMin] = (s().jamMasuk || "08:00").split(":").map(Number);
            const totalMin = tHour * 60 + tMin + Number(s().toleransiMenit || 0);
            const limitStr = `${String(Math.floor(totalMin / 60)).padStart(2, "0")}:${String(totalMin % 60).padStart(2, "0")}`;
            return (
              <div style="font-size: 13px; margin-bottom: var(--space-3); color: var(--color-text-secondary); display: flex; flex-direction: column; gap: 2px;">
                <div>Batas Check-In Tanpa Telat: <strong style="color: var(--color-text-primary);">{limitStr}</strong></div>
                <div>Check-Out Mulai Jam: <strong style="color: var(--color-text-primary);">{s().jamMulaiCheckout || "16:00"}</strong></div>
              </div>
            );
          }}
        </Show>
        <Show
          when={today() && today()!.status === "IZIN"}
          fallback={
            <Show
              when={today()}
              fallback={
                <div>
                  <p class="stat-label">Belum Check-In</p>
                  <form action={checkIn} method="post">
                    <button
                      class="btn-primary"
                      type="submit"
                      disabled={checkingIn.pending}
                    >
                      {checkingIn.pending ? "Memproses..." : "Check-In"}
                    </button>
                  </form>
                </div>
              }
            >
              {(att) => (
                <div>
                  <p>
                    <span class="stat-label">Check-In:</span>{" "}
                    {att().checkIn
                      ? new Date(att().checkIn as Date).toLocaleTimeString("id-ID")
                      : "-"}
                  </p>
                  <Show
                    when={att().checkOut}
                    fallback={
                      <div>
                        <form action={checkOut} method="post">
                          <button
                            class="btn-primary"
                            type="submit"
                            disabled={
                              checkingOut.pending ||
                              (() => {
                                const s = settings();
                                if (!s) return false;
                                const jam = s.jamMulaiCheckout || "16:00";
                                const [h, m] = jam.split(":").map(Number);
                                const d = new Date();
                                return d.getHours() * 60 + d.getMinutes() < h * 60 + m - 60;
                              })()
                            }
                          >
                            {checkingOut.pending ? "Memproses..." : "Check-Out"}
                          </button>
                        </form>
                        {(() => {
                          const s = settings();
                          if (!s) return null;
                          const jam = s.jamMulaiCheckout || "16:00";
                          const [h, m] = jam.split(":").map(Number);
                          const target = h * 60 + m;
                          const d = new Date();
                          const nowMin = d.getHours() * 60 + d.getMinutes();
                          if (nowMin < target - 60) {
                            const ah = Math.floor((target - 60) / 60);
                            const am = (target - 60) % 60;
                            const allowedStr = `${String(ah).padStart(2, "0")}:${String(am).padStart(2, "0")}`;
                            return (
                              <p style="font-size: 12px; color: var(--color-text-secondary); margin-top: 6px;">
                                Check-Out tersedia mulai jam {allowedStr}
                              </p>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    }
                  >
                    {(co) => (
                      <div>
                        <p>
                          <span class="stat-label">Check-Out:</span>{" "}
                          {new Date(co() as Date).toLocaleTimeString("id-ID")}
                        </p>
                        <div style="display: flex; align-items: center; gap: 8px; margin-top: 10px;">
                          <span
                            class={`badge ${
                              att().status === "HADIR"
                                ? "badge-hadir"
                                : att().status === "TELAT"
                                  ? "badge-telat"
                                  : att().status === "ALPHA"
                                    ? "badge-alpha"
                                    : "badge-izin"
                            }`}
                          >
                            {att().status}
                          </span>
                          <span style="font-size: 13px; color: var(--color-success); font-weight: 500;">
                            Hari ini sudah Check-Out
                          </span>
                        </div>
                      </div>
                    )}
                  </Show>
                </div>
              )}
            </Show>
          }
        >
          <div style="background: rgba(37, 99, 235, 0.1); border-left: 4px solid var(--color-info); padding: var(--space-3) var(--space-4); border-radius: var(--radius-md); display: flex; flex-direction: column; gap: var(--space-1);">
            <p style="margin: 0; color: var(--color-info); font-weight: 600; display: flex; align-items: center; gap: 8px;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              Status Kehadiran: Izin Aktif
            </p>
            <p style="margin: 4px 0 0 0; font-size: 13px; color: var(--color-text-secondary); line-height: 1.4;">
              Hari ini Anda terdaftar sedang izin/sakit ({today()?.notes || "-"}). Anda tidak perlu melakukan check-in atau check-out.
            </p>
          </div>
        </Show>
      </div>
    </div>
  );
}
