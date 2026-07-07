import { createAsync, useSubmission, type RouteDefinition } from "@solidjs/router";
import { Show } from "solid-js";
import { getUser, getTodayAttendance, checkIn, checkOut, getAttendanceHistory } from "~/lib";

export const route = {
  preload: () => {
    getUser();
    getTodayAttendance();
    getAttendanceHistory();
  },
} satisfies RouteDefinition;

export default function Dashboard() {
  const user = createAsync(() => getUser());
  const today = createAsync(() => getTodayAttendance());
  const history = createAsync(() => getAttendanceHistory());
  const checkingIn = useSubmission(checkIn);
  const checkingOut = useSubmission(checkOut);

  const now = () => {
    const d = new Date();
    return d.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }) + " — " + d.toLocaleTimeString("id-ID");
  };

  const monthStats = () => {
    const records = history();
    if (!records) return { hadir: 0, telat: 0 };
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    let hadir = 0;
    let telat = 0;
    for (const r of records) {
      const d = new Date(r.date);
      if (d.getMonth() === thisMonth && d.getFullYear() === thisYear) {
        if (r.status === "HADIR") hadir++;
        if (r.status === "TELAT") telat++;
      }
    }
    return { hadir, telat };
  };

  return (
    <div>
      <h1 class="page-title">Selamat datang, {user()?.fullName}!</h1>
      <p>Divisi: {user()?.divisi}</p>
      <p>{now()}</p>

      <div class="stat-card" style={{ "margin-top": "1.5rem" }}>
        <h2>Absensi Hari Ini</h2>
        <Show
          when={today()}
          fallback={
            <div>
              <p class="stat-label">Belum Check-In</p>
              <form action={checkIn} method="post">
                <button class="btn-primary" type="submit" disabled={checkingIn.pending}>
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
                {new Date(att().checkIn).toLocaleTimeString("id-ID")}
              </p>
              <Show
                when={att().checkOut}
                fallback={
                  <form action={checkOut} method="post">
                    <button class="btn-primary" type="submit" disabled={checkingOut.pending}>
                      {checkingOut.pending ? "Memproses..." : "Check-Out"}
                    </button>
                  </form>
                }
              >
                {(co) => (
                  <div>
                    <p>
                      <span class="stat-label">Check-Out:</span>{" "}
                      {new Date(co()).toLocaleTimeString("id-ID")}
                    </p>
                    <span
                      class={
                        att().status === "HADIR"
                          ? "badge-hadir"
                          : att().status === "TELAT"
                            ? "badge-telat"
                            : att().status === "ALPHA"
                              ? "badge-alpha"
                              : "badge-izin"
                      }
                    >
                      {att().status}
                    </span>
                  </div>
                )}
              </Show>
            </div>
          )}
        </Show>
      </div>

      <div style={{ display: "flex", gap: "1rem", "margin-top": "1.5rem" }}>
        <div class="stat-card">
          <div class="stat-value">{monthStats().hadir}</div>
          <div class="stat-label">Hadir Bulan Ini</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{monthStats().telat}</div>
          <div class="stat-label">Telat Bulan Ini</div>
        </div>
      </div>
    </div>
  );
}
