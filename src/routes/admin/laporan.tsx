import { createAsync, type RouteDefinition } from "@solidjs/router";
import { For, Show, createSignal } from "solid-js";
import { getLaporan, getAllDivisi, getPageNumbers } from "~/lib";

export const route = {
  preload() {
    getLaporan();
    getAllDivisi();
  },
} satisfies RouteDefinition;

export default function Laporan() {
  const [filterDateStart, setFilterDateStart] = createSignal("");
  const [filterDateEnd, setFilterDateEnd] = createSignal("");
  const records = createAsync(() => getLaporan(filterDateStart(), filterDateEnd()));
  const divisiList = createAsync(() => getAllDivisi());
  const [filterDivisi, setFilterDivisi] = createSignal("");
  const [searchQuery, setSearchQuery] = createSignal("");

  // Pagination setup
  const [currentPage, setCurrentPage] = createSignal(1);
  const itemsPerPage = 10;

  const totalPages = () => {
    const list = filteredRecords();
    return Math.max(1, Math.ceil(list.length / itemsPerPage));
  };

  const downloadXLSX = () => {
    const list = filteredRecords();
    if (!list || list.length === 0) {
      alert("Tidak ada data untuk diexport.");
      return;
    }

    let html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8" />
  <!--[if gte mso 9]>
  <xml>
    <x:ExcelWorkbook>
      <x:ExcelWorksheets>
        <x:ExcelWorksheet>
          <x:Name>Laporan Absensi</x:Name>
          <x:WorksheetOptions>
            <x:DisplayGridlines/>
          </x:WorksheetOptions>
        </x:ExcelWorksheet>
      </x:ExcelWorksheets>
    </x:ExcelWorkbook>
  </xml>
  <![endif]-->
  <style>
    body { font-family: sans-serif; }
    table { border-collapse: collapse; width: 100%; }
    th { background-color: #E11D48; color: #ffffff; font-weight: bold; border: 1px solid #cccccc; padding: 10px; text-align: left; }
    td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; }
    .status-hadir { color: #16A34A; font-weight: bold; }
    .status-telat { color: #D97706; font-weight: bold; }
    .status-izin { color: #2563EB; font-weight: bold; }
    .status-alpha { color: #DC2626; font-weight: bold; }
  </style>
</head>
<body>
  <h2>Laporan Kehadiran Anak Magang</h2>
  <p>PT. Solusi Bangun Indonesia Cilacap</p>
  <table>
    <thead>
      <tr>
        <th>No</th>
        <th>Nama Lengkap</th>
        <th>Username</th>
        <th>Divisi</th>
        <th>Tanggal</th>
        <th>Check-In</th>
        <th>Check-Out</th>
        <th>Status</th>
        <th>Catatan</th>
      </tr>
    </thead>
    <tbody>`;

    list.forEach((r: any, idx: number) => {
      const date = new Date(r.date).toLocaleDateString("id-ID");
      const ci = r.checkIn
        ? new Date(r.checkIn).toLocaleTimeString("id-ID")
        : "-";
      const co = r.checkOut
        ? new Date(r.checkOut).toLocaleTimeString("id-ID")
        : "-";
      const statusClass = `status-${r.status.toLowerCase()}`;
      html += `
      <tr>
        <td>${idx + 1}</td>
        <td>${r.user.fullName}</td>
        <td>@${r.user.username}</td>
        <td>${r.user.divisi?.name ?? "-"}</td>
        <td>${date}</td>
        <td>${ci}</td>
        <td>${co}</td>
        <td><span class="${statusClass}">${r.status}</span></td>
        <td>${r.notes ?? "-"}</td>
      </tr>`;
    });

    html += `
    </tbody>
  </table>
</body>
</html>`;

    const blob = new Blob([html], {
      type: "application/vnd.ms-excel;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `laporan_absensi_${new Date().toISOString().slice(0, 10)}.xls`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printReport = () => {
    window.print();
  };

  // Local filter
  const filteredRecords = () => {
    const list = records();
    if (!list) return [];
    return list.filter((r: any) => {
      const rDate = new Date(r.date).toISOString().slice(0, 10);
      if (filterDateStart() && rDate < filterDateStart()) return false;
      if (filterDateEnd() && rDate > filterDateEnd()) return false;
      if (filterDivisi() && r.user.divisi?.name !== filterDivisi())
        return false;

      const query = searchQuery().toLowerCase().trim();
      if (query) {
        const nameMatch = r.user.fullName.toLowerCase().includes(query);
        const usernameMatch = r.user.username.toLowerCase().includes(query);
        const divisiMatch = r.user.divisi?.name?.toLowerCase().includes(query);
        if (!nameMatch && !usernameMatch && !divisiMatch) return false;
      }

      return true;
    });
  };

  const paginatedRecords = () => {
    const list = filteredRecords();
    const start = (currentPage() - 1) * itemsPerPage;
    return list.slice(start, start + itemsPerPage);
  };

  return (
    <main>
      <div
        style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4);"
        class="no-print"
      >
        <h1 class="page-title" style="margin-bottom: 0;">
          Laporan Absensi
        </h1>
        <div style="display: flex; gap: var(--space-2);">
          <button
            onClick={downloadXLSX}
            class="btn-primary"
            style="width: auto; padding: 0 var(--space-3); height: 38px;"
          >
            Export Excel
          </button>
          <button
            onClick={printReport}
            class="btn-ghost"
            style="width: auto; padding: 0 var(--space-3); height: 38px;"
          >
            Cetak PDF
          </button>
        </div>
      </div>

      <div class="filter-card no-print" style="margin-bottom: var(--space-4);">
        <div class="form-group">
          <label>Cari Nama</label>
          <input
            type="text"
            placeholder="Cari berdasarkan nama..."
            value={searchQuery()}
            onInput={(e) => {
              setSearchQuery(e.currentTarget.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div class="form-group">
          <label>Pilih Divisi</label>
          <select
            value={filterDivisi()}
            onChange={(e) => {
              setFilterDivisi(e.currentTarget.value);
              setCurrentPage(1);
            }}
          >
            <option value="">Semua Divisi</option>
            <For each={divisiList()}>
              {(d) => <option value={d.name}>{d.name}</option>}
            </For>
          </select>
        </div>
        <div class="form-group">
          <label>Tanggal Mulai</label>
          <input
            type="date"
            value={filterDateStart()}
            onInput={(e) => {
              setFilterDateStart(e.currentTarget.value);
              setCurrentPage(1); // Reset page on filter change
            }}
          />
        </div>
        <div class="form-group">
          <label>Tanggal Selesai</label>
          <input
            type="date"
            value={filterDateEnd()}
            onInput={(e) => {
              setFilterDateEnd(e.currentTarget.value);
              setCurrentPage(1); // Reset page on filter change
            }}
          />
        </div>
        <button
          onClick={() => {
            setFilterDateStart("");
            setFilterDateEnd("");
            setFilterDivisi("");
            setSearchQuery("");
            setCurrentPage(1);
          }}
          class="btn-ghost"
          style="width: auto;"
        >
          Reset Filter
        </button>
      </div>

      {/* Print header — Kop Surat Resmi */}
      <div
        class="print-only"
        style="display: none; margin-bottom: 20px;"
      >
        <div style="display: flex; align-items: center; border-bottom: 3px double #1e293b; padding-bottom: 15px; margin-bottom: 10px; gap: 15px; width: 100%; box-sizing: border-box;">
          <img
            src="/logo-sbi.png"
            alt="PT SBI"
            style="height: 55px;"
          />
          <div>
            <h2 style="margin: 0; font-size: 18px; font-weight: 800; letter-spacing: 0.5px; color: #0f172a;">PT SOLUSI BANGUN INDONESIA Tbk</h2>
            <p style="margin: 2px 0 0 0; font-size: 11px; color: #475569; line-height: 1.4;">
              Pabrik Cilacap — Jl. Ir. H. Juanda, Cilacap, Jawa Tengah
            </p>
          </div>
        </div>

        <div style="text-align: center; margin-bottom: 15px;">
          <h3 style="margin: 0; font-size: 15px; font-weight: 700; letter-spacing: 1px; color: #0f172a; text-transform: uppercase;">Laporan Kehadiran Mahasiswa / Siswa Magang</h3>
          <p style="margin: 6px 0 0 0; font-size: 12px; color: #475569;">
            Periode: {filterDateStart() ? new Date(filterDateStart()).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "—"} s/d {filterDateEnd() ? new Date(filterDateEnd()).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
      </div>

      <div style="overflow-x: auto;" class="no-print">
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
              when={paginatedRecords().length > 0}
              fallback={
                <tr>
                  <td
                    colspan="8"
                    style="text-align: center; color: var(--color-text-secondary); padding: var(--space-5);"
                  >
                    Tidak ada catatan absensi sesuai filter tanggal.
                  </td>
                </tr>
              }
            >
              <For each={paginatedRecords()}>
                {(row, idx) => {
                  const dateFormatted = new Date(row.date).toLocaleDateString(
                    "id-ID",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  );

                  const checkInTime = row.checkIn
                    ? new Date(row.checkIn).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "-";

                  const checkOutTime = row.checkOut
                    ? new Date(row.checkOut).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "-";

                  return (
                    <tr>
                      <td style="font-family: var(--font-mono); font-size: 13px;">
                        {(currentPage() - 1) * itemsPerPage + idx() + 1}
                      </td>
                      <td>
                        <strong>{row.user.fullName}</strong>
                        <div style="font-size: 11px; color: var(--color-text-secondary);">
                          @{row.user.username}
                        </div>
                      </td>
                      <td>{row.user.divisi?.name ?? "-"}</td>
                      <td>{dateFormatted}</td>
                      <td style="font-family: var(--font-mono);">
                        {checkInTime}
                      </td>
                      <td style="font-family: var(--font-mono);">
                        {checkOutTime}
                      </td>
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

      {/* Print table — semua data tanpa pagination */}
      <div class="print-only" style="display: none;">
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
            <For each={filteredRecords()}>
              {(row, idx) => {
                const dateFormatted = new Date(row.date).toLocaleDateString(
                  "id-ID",
                  { year: "numeric", month: "long", day: "numeric" },
                );
                const checkInTime = row.checkIn
                  ? new Date(row.checkIn).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "-";
                const checkOutTime = row.checkOut
                  ? new Date(row.checkOut).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "-";
                return (
                  <tr>
                    <td>{idx() + 1}</td>
                    <td>
                      <strong>{row.user.fullName}</strong>
                    </td>
                    <td>{row.user.divisi?.name ?? "-"}</td>
                    <td>{dateFormatted}</td>
                    <td>{checkInTime}</td>
                    <td>{checkOutTime}</td>
                    <td>{row.status}</td>
                    <td>{row.notes ?? "-"}</td>
                  </tr>
                );
              }}
            </For>
          </tbody>
        </table>
        <p style="font-size: 11px; color: #64748b; margin-top: 10px; text-align: right;">
          Total: {filteredRecords().length} data
        </p>
      </div>

      {/* Pagination Controls */}
      <Show when={filteredRecords().length > 0}>
        <div class="pagination-container no-print">
          <div class="pagination-info">
            Menampilkan {paginatedRecords().length} dari{" "}
            {filteredRecords().length} rekap absensi
          </div>
          <div class="pagination-buttons">
            <button
              class="btn-pagination"
              disabled={currentPage() === 1}
              onClick={() => setCurrentPage(currentPage() - 1)}
            >
              Sebelumnya
            </button>
            <For each={getPageNumbers(currentPage(), totalPages())}>
              {(page) => (
                <Show
                  when={page !== "..."}
                  fallback={
                    <span style="padding: 0 8px; color: var(--color-text-secondary); align-self: center; font-weight: 600;">
                      ...
                    </span>
                  }
                >
                  <button
                    class="btn-pagination"
                    classList={{ active: currentPage() === page }}
                    onClick={() => setCurrentPage(page as number)}
                  >
                    {page}
                  </button>
                </Show>
              )}
            </For>
            <button
              class="btn-pagination"
              disabled={currentPage() === totalPages()}
              onClick={() => setCurrentPage(currentPage() + 1)}
            >
              Berikutnya
            </button>
          </div>
        </div>
      </Show>

      <style>{`
        @media print {
          @page {
            size: landscape;
            margin: 15mm;
          }
          .no-print {
            display: none !important;
          }
          .print-only {
            display: block !important;
            width: 100% !important;
          }
          .app-layout,
          .app-layout.has-sidebar,
          .app-layout.has-sidebar .app-main-content {
            padding-left: 0 !important;
            margin-left: 0 !important;
            display: block !important;
            width: 100% !important;
          }
          .app-main-content {
            padding: 0 !important;
            margin: 0 !important;
            margin-left: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            overflow: visible !important;
          }
          body {
            background: #ffffff !important;
            color: #0f172a !important;
            font-family: sans-serif !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
          }
          .data-table {
            background: #ffffff !important;
            box-shadow: none !important;
            border: none !important;
            width: 100% !important;
            border-collapse: collapse !important;
          }
          .data-table th {
            background-color: transparent !important;
            color: #1e293b !important;
            border-bottom: 2px solid #475569 !important;
            border-top: none !important;
            border-left: none !important;
            border-right: none !important;
            font-weight: bold !important;
            padding: 10px 12px !important;
            text-align: left !important;
          }
          .data-table td {
            border-bottom: 1px solid #e2e8f0 !important;
            border-top: none !important;
            border-left: none !important;
            border-right: none !important;
            color: #334155 !important;
            padding: 10px 12px !important;
          }
          .data-table tr:nth-child(even) td {
            background-color: #f8fafc !important;
          }
          .badge {
            background: transparent !important;
            border: 1px solid #475569 !important;
            color: #475569 !important;
            padding: 2px 6px !important;
            border-radius: 4px !important;
            font-size: 11px !important;
            font-weight: bold !important;
          }
        }
      `}</style>
    </main>
  );
}
