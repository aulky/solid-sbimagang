import { ssr, ssrHydrationKey, ssrAttribute, escape, createComponent } from "solid-js/web";
import { createSignal, For, Show } from "solid-js";
import { c as createAsync, L as getLaporan, t as getAllDivisi } from "../../entry-server.js";
import { g as getPageNumbers } from "./utils-9YFw9ezW.js";
import "solid-js/web/storage";
import "fs";
import "path";
import "crypto";
import "@prisma/client";
import "node:stream";
import "xlsx";
var _tmpl$ = ["<div", ' class="pagination-container no-print"><div class="pagination-info">Menampilkan <!--$-->', "<!--/--> dari <!--$-->", '<!--/--> rekap absensi</div><div class="pagination-buttons"><button class="btn-pagination"', ">Sebelumnya</button><!--$-->", '<!--/--><button class="btn-pagination"', ">Berikutnya</button></div></div>"], _tmpl$2 = ["<main", '><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-4);" class="no-print"><h1 class="page-title" style="margin-bottom:0;">Laporan Absensi</h1><div style="display:flex;gap:var(--space-2);"><button class="btn-primary" style="width:auto;padding:0 var(--space-3);height:38px;">Export Excel</button><button class="btn-ghost" style="width:auto;padding:0 var(--space-3);height:38px;">Cetak PDF</button></div></div><div class="filter-card no-print" style="margin-bottom:var(--space-4);"><div class="form-group"><label>Cari Nama</label><input type="text" placeholder="Cari berdasarkan nama..."', '></div><div class="form-group"><label>Pilih Divisi</label><select', "><option value>Semua Divisi</option><!--$-->", '<!--/--></select></div><div class="form-group"><label>Tanggal Mulai</label><input type="date"', '></div><div class="form-group"><label>Tanggal Selesai</label><input type="date"', '></div><button class="btn-ghost" style="width:auto;">Reset Filter</button></div><div class="print-only" style="display:none;margin-bottom:20px;"><div style="display:flex;align-items:center;border-bottom:3px double #1e293b;padding-bottom:15px;margin-bottom:10px;gap:15px;width:100%;box-sizing:border-box;"><img src="/logo-sigma.png" alt="SIGMA - Sistem Informasi dan Manajemen Magang" style="height:55px;"><div><h2 style="margin:0;font-size:18px;font-weight:800;letter-spacing:0.5px;color:#0f172a;">SIGMA - Sistem Informasi dan Manajemen Magang</h2><p style="margin:2px 0 0 0;font-size:11px;color:#475569;line-height:1.4;">Pabrik Cilacap — Jl. Ir. H. Juanda, Cilacap, Jawa Tengah</p></div></div><div style="text-align:center;margin-bottom:15px;"><h3 style="margin:0;font-size:15px;font-weight:700;letter-spacing:1px;color:#0f172a;text-transform:uppercase;">Laporan Kehadiran Mahasiswa / Siswa Magang</h3><p style="margin:6px 0 0 0;font-size:12px;color:#475569;">Periode: <!--$-->', "<!--/--> s/d <!--$-->", '<!--/--></p></div></div><div style="overflow-x:auto;" class="no-print"><table class="data-table"><thead><tr><th>No</th><th>Nama Lengkap</th><th>Divisi</th><th>Tanggal</th><th>Check-In</th><th>Check-Out</th><th>Status</th><th>Catatan</th></tr></thead><tbody>', '</tbody></table></div><div class="print-only" style="display:none;"><table class="data-table"><thead><tr><th>No</th><th>Nama Lengkap</th><th>Divisi</th><th>Tanggal</th><th>Check-In</th><th>Check-Out</th><th>Status</th><th>Catatan</th></tr></thead><tbody>', '</tbody></table><p style="font-size:11px;color:#64748b;margin-top:10px;text-align:right;">Total: <!--$-->', "<!--/--> data</p></div><!--$-->", "<!--/--><style>\n        @media print {\n          @page {\n            size: landscape;\n            margin: 15mm;\n          }\n          .no-print {\n            display: none !important;\n          }\n          .print-only {\n            display: block !important;\n            width: 100% !important;\n          }\n          .app-layout,\n          .app-layout.has-sidebar,\n          .app-layout.has-sidebar .app-main-content {\n            padding-left: 0 !important;\n            margin-left: 0 !important;\n            display: block !important;\n            width: 100% !important;\n          }\n          .app-main-content {\n            padding: 0 !important;\n            margin: 0 !important;\n            margin-left: 0 !important;\n            width: 100% !important;\n            max-width: 100% !important;\n            height: auto !important;\n            overflow: visible !important;\n          }\n          body {\n            background: #ffffff !important;\n            color: #0f172a !important;\n            font-family: sans-serif !important;\n          }\n          main {\n            padding: 0 !important;\n            margin: 0 !important;\n            width: 100% !important;\n          }\n          .data-table {\n            background: #ffffff !important;\n            box-shadow: none !important;\n            border: none !important;\n            width: 100% !important;\n            border-collapse: collapse !important;\n          }\n          .data-table th {\n            background-color: transparent !important;\n            color: #1e293b !important;\n            border-bottom: 2px solid #475569 !important;\n            border-top: none !important;\n            border-left: none !important;\n            border-right: none !important;\n            font-weight: bold !important;\n            padding: 10px 12px !important;\n            text-align: left !important;\n          }\n          .data-table td {\n            border-bottom: 1px solid #e2e8f0 !important;\n            border-top: none !important;\n            border-left: none !important;\n            border-right: none !important;\n            color: #334155 !important;\n            padding: 10px 12px !important;\n          }\n          .data-table tr:nth-child(even) td {\n            background-color: #f8fafc !important;\n          }\n          .badge {\n            background: transparent !important;\n            border: 1px solid #475569 !important;\n            color: #475569 !important;\n            padding: 2px 6px !important;\n            border-radius: 4px !important;\n            font-size: 11px !important;\n            font-weight: bold !important;\n          }\n        }\n      </style></main>"], _tmpl$3 = ["<option", ">", "</option>"], _tmpl$4 = ["<tr", '><td colspan="8" style="text-align:center;color:var(--color-text-secondary);padding:var(--space-5);">Tidak ada catatan absensi sesuai filter tanggal.</td></tr>'], _tmpl$5 = ["<tr", '><td style="font-family:var(--font-mono);font-size:13px;">', "</td><td><strong>", '</strong><div style="font-size:11px;color:var(--color-text-secondary);">@<!--$-->', "<!--/--></div></td><td>", "</td><td>", '</td><td style="font-family:var(--font-mono);">', '</td><td style="font-family:var(--font-mono);">', '</td><td><span class="', '">', "</span></td><td>", "</td></tr>"], _tmpl$6 = ["<tr", "><td>", "</td><td><strong>", "</strong></td><td>", "</td><td>", "</td><td>", "</td><td>", "</td><td>", "</td><td>", "</td></tr>"], _tmpl$7 = ["<button", ' class="', '">', "</button>"], _tmpl$8 = ["<span", ' style="padding:0 8px;color:var(--color-text-secondary);align-self:center;font-weight:600;">...</span>'];
const id$$ = "src/routes/admin/laporan.tsx?pick=default&pick=$css";
function Laporan() {
  const [filterDateStart, setFilterDateStart] = createSignal("");
  const [filterDateEnd, setFilterDateEnd] = createSignal("");
  const records = createAsync(() => getLaporan(filterDateStart(), filterDateEnd()));
  const divisiList = createAsync(() => getAllDivisi());
  const [filterDivisi, setFilterDivisi] = createSignal("");
  const [searchQuery, setSearchQuery] = createSignal("");
  const [currentPage, setCurrentPage] = createSignal(1);
  const itemsPerPage = 10;
  const totalPages = () => {
    const list = filteredRecords();
    return Math.max(1, Math.ceil(list.length / itemsPerPage));
  };
  const filteredRecords = () => {
    const list = records();
    if (!list) return [];
    return list.filter((r) => {
      const rDate = new Date(r.date).toISOString().slice(0, 10);
      if (filterDateStart() && rDate < filterDateStart()) return false;
      if (filterDateEnd() && rDate > filterDateEnd()) return false;
      if (filterDivisi() && r.user.divisi?.name !== filterDivisi()) return false;
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
  return ssr(_tmpl$2, ssrHydrationKey(), ssrAttribute("value", escape(searchQuery(), true), false), ssrAttribute("value", escape(filterDivisi(), true), false), escape(createComponent(For, {
    get each() {
      return divisiList();
    },
    children: (d) => ssr(_tmpl$3, ssrHydrationKey() + ssrAttribute("value", escape(d.name, true), false), escape(d.name))
  })), ssrAttribute("value", escape(filterDateStart(), true), false), ssrAttribute("value", escape(filterDateEnd(), true), false), filterDateStart() ? escape(new Date(filterDateStart()).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  })) : "—", filterDateEnd() ? escape(new Date(filterDateEnd()).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  })) : escape((/* @__PURE__ */ new Date()).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  })), escape(createComponent(Show, {
    get when() {
      return paginatedRecords().length > 0;
    },
    get fallback() {
      return ssr(_tmpl$4, ssrHydrationKey());
    },
    get children() {
      return createComponent(For, {
        get each() {
          return paginatedRecords();
        },
        children: (row, idx) => {
          const dateFormatted = new Date(row.date).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric"
          });
          const checkInTime = row.checkIn ? new Date(row.checkIn).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit"
          }) : "-";
          const checkOutTime = row.checkOut ? new Date(row.checkOut).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit"
          }) : "-";
          return ssr(_tmpl$5, ssrHydrationKey(), (escape(currentPage()) - 1) * escape(itemsPerPage) + escape(idx()) + 1, escape(row.user.fullName), escape(row.user.username), escape(row.user.divisi?.name ?? "-"), escape(dateFormatted), escape(checkInTime), escape(checkOutTime), `badge badge-${escape(row.status.toLowerCase(), true)}`, escape(row.status), escape(row.notes ?? "-"));
        }
      });
    }
  })), escape(createComponent(For, {
    get each() {
      return filteredRecords();
    },
    children: (row, idx) => {
      const dateFormatted = new Date(row.date).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
      const checkInTime = row.checkIn ? new Date(row.checkIn).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit"
      }) : "-";
      const checkOutTime = row.checkOut ? new Date(row.checkOut).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit"
      }) : "-";
      return ssr(_tmpl$6, ssrHydrationKey(), escape(idx()) + 1, escape(row.user.fullName), escape(row.user.divisi?.name ?? "-"), escape(dateFormatted), escape(checkInTime), escape(checkOutTime), escape(row.status), escape(row.notes ?? "-"));
    }
  })), escape(filteredRecords().length), escape(createComponent(Show, {
    get when() {
      return filteredRecords().length > 0;
    },
    get children() {
      return ssr(_tmpl$, ssrHydrationKey(), escape(paginatedRecords().length), escape(filteredRecords().length), ssrAttribute("disabled", currentPage() === 1, true), escape(createComponent(For, {
        get each() {
          return getPageNumbers(currentPage(), totalPages());
        },
        children: (page) => createComponent(Show, {
          when: page !== "...",
          get fallback() {
            return ssr(_tmpl$8, ssrHydrationKey());
          },
          get children() {
            return ssr(_tmpl$7, ssrHydrationKey(), `btn-pagination ${currentPage() === page ? "active" : ""}`, escape(page));
          }
        })
      })), ssrAttribute("disabled", currentPage() === totalPages(), true));
    }
  })));
}
export {
  Laporan as default,
  id$$
};
//# sourceMappingURL=laporan-PuTg6LmG.js.map
