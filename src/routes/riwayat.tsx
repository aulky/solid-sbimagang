import { createAsync, type RouteDefinition } from "@solidjs/router";
import { For, Show } from "solid-js";
import { getAttendanceHistory } from "~/lib";

export const route = {
  preload: () => {
    getAttendanceHistory();
  },
} satisfies RouteDefinition;

const statusBadge = (status: string) =>
  status === "HADIR"
    ? "badge-hadir"
    : status === "TELAT"
      ? "badge-telat"
      : status === "ALPHA"
        ? "badge-alpha"
        : "badge-izin";

export default function Riwayat() {
  const history = createAsync(() => getAttendanceHistory());

  return (
    <div>
      <h1 class="page-title">Riwayat Absensi</h1>
      <Show when={history()} fallback={<p>Memuat...</p>}>
        {(records) => (
          <table class="data-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Tanggal</th>
                <th>Check-In</th>
                <th>Check-Out</th>
                <th>Status</th>
                <th>Catatan</th>
              </tr>
            </thead>
            <tbody>
              <For each={records()}>
                {(r, i) => (
                  <tr>
                    <td>{i() + 1}</td>
                    <td>{new Date(r.date).toLocaleDateString("id-ID", { weekday: "short", year: "numeric", month: "short", day: "numeric" })}</td>
                    <td>{r.checkIn ? new Date(r.checkIn).toLocaleTimeString("id-ID") : "-"}</td>
                    <td>{r.checkOut ? new Date(r.checkOut).toLocaleTimeString("id-ID") : "-"}</td>
                    <td><span class={statusBadge(r.status)}>{r.status}</span></td>
                    <td>{r.catatan ?? "-"}</td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        )}
      </Show>
    </div>
  );
}
