import { createAsync, type RouteDefinition } from "@solidjs/router";
import { For, Show, createSignal } from "solid-js";
import { getAdminAbsensi, exportCSV } from "~/lib";

export const route = {
  preload() {
    getAdminAbsensi();
  }
} satisfies RouteDefinition;

export default function Laporan() {
  const records = createAsync(() => getAdminAbsensi());
  const [filterDateStart, setFilterDateStart] = createSignal("");
  const [filterDateEnd, setFilterDateEnd] = createSignal("");

  const downloadCSV = async () => {
    try {
      const csvContent = await exportCSV();
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `laporan_absensi_${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      alert("Gagal melakukan export CSV: " + String(e));
    }
  };

  const printReport = () => {
    window.print();
  };

  // Local filter
  const filteredRecords = () => {
    const list = records();
    if (!list) return [];
    return list.filter(r => {
      const rDate = new Date(r.date).toISOString().slice(0, 10);
      if (filterDateStart() && rDate < filterDateStart()) return false;
      if (filterDateEnd() && rDate > filterDateEnd()) return false;
      return true;
    });
  };

  return (
    <main>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4);" class="no-print">
        <h1 class="page-title" style="margin-bottom: 0;">Laporan Absensi</h1>
        <div style="display: flex; gap: var(--space-2);">
          <button onClick={downloadCSV} class="btn-primary" style="width: auto; padding: 0 var(--space-3); height: 38px;">
            Export CSV (Excel)
          </button>
          <button onClick={printReport} class="btn-ghost" style="width: auto; padding: 0 var(--space-3); height: 38px;">
            Cetak PDF
          </button>
        </div>
      </div>

      <div class="form-card no-print" style="max-width: 100%; margin-bottom: var(--space-4); display: flex; flex-direction: row; gap: var(--space-4); align-items: flex-end; flex-wrap: wrap;">
        <div class="form-group" style="margin-bottom: 0; flex: 1; min-width: 200px;">
          <label>Tanggal Mulai</label>
          <input type="date" value={filterDateStart()} onInput={(e) => setFilterDateStart(e.currentTarget.value)} />
        </div>
        <div class="form-group" style="margin-bottom: 0; flex: 1; min-width: 200px;">
          <label>Tanggal Selesai</label>
          <input type="date" value={filterDateEnd()} onInput={(e) => setFilterDateEnd(e.currentTarget.value)} />
        </div>
        <button
          onClick={() => { setFilterDateStart(""); setFilterDateEnd(""); }}
          class="btn-ghost"
          style="width: auto; height: 40px; padding: 0 var(--space-3);"
        >
          Reset Filter
        </button>
      </div>

      {/* Print header */}
      <div class="print-only" style="display: none; text-align: center; margin-bottom: var(--space-5);">
        <img src="/logo-sbi.png" alt="PT SBI" style="height: 50px; margin-bottom: var(--space-2);" />
        <h2>LAPORAN KEHADIRAN ANAK MAGANG</h2>
        <h3>PT. SOLUSI BANGUN INDONESIA — CILACAP</h3>
        <p style="margin-top: var(--space-1); font-size: 13px; color: var(--color-text-secondary);">
          Dicetak pada: {new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      <div style="overflow-x: auto;">
        <table class="data-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Lengkap</th>
              <th>Divisi</th>
              <th>Tanggal</th>
              <th>Check-In</th>
              <th>Check-Out</th>
              <th>Status</th>
              <th>Catatan</th>
            </tr>
          </thead>
          <tbody>
            <Show
              when={filteredRecords().length > 0}
              fallback={
                <tr>
                  <td colspan="8" style="text-align: center; color: var(--color-text-secondary); padding: var(--space-5);">
                    Tidak ada catatan absensi sesuai filter tanggal.
                  </td>
                </tr>
              }
            >
              <For each={filteredRecords()}>
                {(row, idx) => {
                  const dateFormatted = new Date(row.date).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  });

                  const checkInTime = row.checkIn
                    ? new Date(row.checkIn).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit"
                      })
                    : "-";

                  const checkOutTime = row.checkOut
                    ? new Date(row.checkOut).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit"
                      })
                    : "-";

                  return (
                    <tr>
                      <td style="font-family: var(--font-mono); font-size: 13px;">{idx() + 1}</td>
                      <td>
                        <strong>{row.user.fullName}</strong>
                        <div style="font-size: 11px; color: var(--color-text-secondary);">@{row.user.username}</div>
                      </td>
                      <td>{row.user.divisi?.name ?? "-"}</td>
                      <td>{dateFormatted}</td>
                      <td style="font-family: var(--font-mono);">{checkInTime}</td>
                      <td style="font-family: var(--font-mono);">{checkOutTime}</td>
                      <td>
                        <span class={`badge badge-${row.status.toLowerCase()}`}>
                          {row.status}
                        </span>
                      </td>
                      <td>{row.notes ?? "-"}</td>
                    </tr>
                  );
                }}
              </For>
            </Show>
          </tbody>
        </table>
      </div>

      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
          body {
            background: #ffffff !important;
            color: #000000 !important;
          }
          main {
            padding: 0 !important;
          }
          .data-table {
            background: #ffffff !important;
            box-shadow: none !important;
            border: 1px solid #000000 !important;
          }
          .data-table th, .data-table td {
            border-bottom: 1px solid #000000 !important;
            color: #000000 !important;
          }
          .badge {
            background: transparent !important;
            border: 1px solid #000000 !important;
            color: #000000 !important;
            padding: 2px 6px !important;
          }
        }
      `}</style>
    </main>
  );
}
