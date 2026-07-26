import { ssr, ssrHydrationKey, ssrAttribute, escape, createComponent } from "solid-js/web";
import { createSignal, For, Suspense, Show } from "solid-js";
import { c as createAsync, t as getAllDivisi, v as getAllBatches, w as getAdminAbsensi } from "../../entry-server.js";
import { g as getPageNumbers } from "./utils-9YFw9ezW.js";
import "solid-js/web/storage";
import "fs";
import "path";
import "crypto";
import "@prisma/client";
import "node:stream";
import "xlsx";
var _tmpl$ = ["<div", ' style="overflow-x:auto;"><table class="data-table"><thead><tr><th>No</th><th>Nama Lengkap</th><th>Divisi</th><th>Tanggal</th><th>Check-In</th><th>Check-Out</th><th>Status</th><th>Catatan</th></tr></thead><tbody>', "</tbody></table></div>"], _tmpl$2 = ["<div", ' class="pagination-container"><div class="pagination-info">Menampilkan <!--$-->', "<!--/--> dari <!--$-->", '<!--/--> catatan absensi</div><div class="pagination-buttons"><button class="btn-pagination"', ">Sebelumnya</button><!--$-->", '<!--/--><button class="btn-pagination"', ">Berikutnya</button></div></div>"], _tmpl$3 = ["<main", '><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-4);flex-wrap:wrap;gap:var(--space-3);text-align:left;"><h1 class="page-title" style="margin-bottom:0;">Monitor Absensi</h1></div><div class="filter-card" style="margin-bottom:var(--space-4);"><div class="form-group"><label>Cari Nama/Username</label><input type="text" placeholder="Cari nama/username..."', '></div><div class="form-group"><label>Tanggal</label><input type="date"', '></div><div class="form-group"><label>Status Kehadiran</label><select', '><option value>Semua Status</option><option value="HADIR">HADIR</option><option value="TELAT">TELAT</option><option value="IZIN">IZIN</option><option value="ALPHA">ALPHA</option></select></div><div class="form-group"><label>Pilih Divisi</label><select', "><option value>Semua Divisi</option><!--$-->", '<!--/--></select></div><div class="form-group"><label>Pilih Batch</label><select', "><option value>Semua Batch</option><!--$-->", '<!--/--></select></div><button class="btn-ghost" style="width:auto;">Reset Filter</button></div><!--$-->', "<!--/--></main>"], _tmpl$4 = ["<option", ">", "</option>"], _tmpl$5 = ["<div", ' style="overflow-x:auto;opacity:0.6;pointer-events:none;"><table class="data-table"><thead><tr><th>No</th><th>Nama Lengkap</th><th>Divisi</th><th>Tanggal</th><th>Check-In</th><th>Check-Out</th><th>Status</th><th>Catatan</th></tr></thead><tbody>', "</tbody></table></div>"], _tmpl$6 = ["<tr", '><td><div class="skeleton" style="width:24px;height:16px;"></div></td><td><div class="skeleton" style="width:120px;height:16px;"></div></td><td><div class="skeleton" style="width:80px;height:16px;"></div></td><td><div class="skeleton" style="width:100px;height:16px;"></div></td><td><div class="skeleton" style="width:60px;height:16px;"></div></td><td><div class="skeleton" style="width:60px;height:16px;"></div></td><td><div class="skeleton" style="width:70px;height:20px;border-radius:4px;"></div></td><td><div class="skeleton" style="width:150px;height:16px;"></div></td></tr>'], _tmpl$7 = ["<tr", '><td colspan="8" style="text-align:center;color:var(--color-text-secondary);padding:var(--space-5);">Tidak ada catatan absensi untuk kriteria yang dipilih.</td></tr>'], _tmpl$8 = ["<tr", '><td style="font-family:var(--font-mono);font-size:13px;">', "</td><td><strong>", '</strong><div style="font-size:12px;color:var(--color-text-secondary);">@<!--$-->', "<!--/--></div></td><td>", "</td><td>", '</td><td style="font-family:var(--font-mono);">', '</td><td style="font-family:var(--font-mono);">', '</td><td><span class="', '">', '</span></td><td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"', ">", "</td></tr>"], _tmpl$9 = ["<button", ' class="', '">', "</button>"], _tmpl$0 = ["<span", ' style="padding:0 8px;color:var(--color-text-secondary);align-self:center;font-weight:600;">...</span>'];
const id$$ = "src/routes/admin/absensi.tsx?pick=default&pick=$css";
function AdminAbsensi() {
  const divisiList = createAsync(() => getAllDivisi());
  const batchList = createAsync(() => getAllBatches());
  const getTodayString = () => {
    const tzoffset = (/* @__PURE__ */ new Date()).getTimezoneOffset() * 6e4;
    const localISOTime = new Date(Date.now() - tzoffset).toISOString().slice(0, 10);
    return localISOTime;
  };
  const [filterDate, setFilterDate] = createSignal(getTodayString());
  const [searchQuery, setSearchQuery] = createSignal("");
  const [debouncedSearch, setDebouncedSearch] = createSignal("");
  const [filterDivisi, setFilterDivisi] = createSignal("");
  const [filterBatch, setFilterBatch] = createSignal("");
  const [filterStatus, setFilterStatus] = createSignal("");
  const [currentPage, setCurrentPage] = createSignal(1);
  const itemsPerPage = 10;
  const recordsData = createAsync(() => getAdminAbsensi({
    page: currentPage(),
    limit: itemsPerPage,
    search: debouncedSearch(),
    date: filterDate(),
    status: filterStatus(),
    divisiId: filterDivisi(),
    batchId: filterBatch()
  }));
  const totalPages = () => {
    const total = recordsData()?.total ?? 0;
    return Math.max(1, Math.ceil(total / itemsPerPage));
  };
  const paginatedRecords = () => {
    return recordsData()?.items ?? [];
  };
  return ssr(_tmpl$3, ssrHydrationKey(), ssrAttribute("value", escape(searchQuery(), true), false), ssrAttribute("value", escape(filterDate(), true), false), ssrAttribute("value", escape(filterStatus(), true), false), ssrAttribute("value", escape(filterDivisi(), true), false), escape(createComponent(For, {
    get each() {
      return divisiList();
    },
    children: (d) => ssr(_tmpl$4, ssrHydrationKey() + ssrAttribute("value", escape(d.id, true), false), escape(d.name))
  })), ssrAttribute("value", escape(filterBatch(), true), false), escape(createComponent(For, {
    get each() {
      return batchList();
    },
    children: (b) => ssr(_tmpl$4, ssrHydrationKey() + ssrAttribute("value", escape(b.id, true), false), escape(b.name))
  })), escape(createComponent(Suspense, {
    get fallback() {
      return ssr(_tmpl$5, ssrHydrationKey(), escape(createComponent(For, {
        each: [1, 2, 3, 4, 5],
        children: () => ssr(_tmpl$6, ssrHydrationKey())
      })));
    },
    get children() {
      return [ssr(_tmpl$, ssrHydrationKey(), escape(createComponent(Show, {
        get when() {
          return paginatedRecords().length > 0;
        },
        get fallback() {
          return ssr(_tmpl$7, ssrHydrationKey());
        },
        get children() {
          return createComponent(For, {
            get each() {
              return paginatedRecords();
            },
            children: (row, idx) => {
              const dateFormatted = new Date(row.date).toLocaleDateString("id-ID", {
                weekday: "long",
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
              return ssr(_tmpl$8, ssrHydrationKey(), (escape(currentPage()) - 1) * escape(itemsPerPage) + escape(idx()) + 1, escape(row.user.fullName), escape(row.user.username), escape(row.user.divisi?.name ?? "-"), escape(dateFormatted), escape(checkInTime), escape(checkOutTime), `badge badge-${escape(row.status.toLowerCase(), true)}`, escape(row.status), ssrAttribute("title", escape(row.notes ?? "", true), false), escape(row.notes ?? "-"));
            }
          });
        }
      }))), createComponent(Show, {
        get when() {
          return (recordsData()?.total ?? 0) > 0;
        },
        get children() {
          return ssr(_tmpl$2, ssrHydrationKey(), escape(paginatedRecords().length), escape(recordsData()?.total ?? 0), ssrAttribute("disabled", currentPage() === 1, true), escape(createComponent(For, {
            get each() {
              return getPageNumbers(currentPage(), totalPages());
            },
            children: (page) => createComponent(Show, {
              when: page !== "...",
              get fallback() {
                return ssr(_tmpl$0, ssrHydrationKey());
              },
              get children() {
                return ssr(_tmpl$9, ssrHydrationKey(), `btn-pagination ${currentPage() === page ? "active" : ""}`, escape(page));
              }
            })
          })), ssrAttribute("disabled", currentPage() === totalPages(), true));
        }
      })];
    }
  })));
}
export {
  AdminAbsensi as default,
  id$$
};
//# sourceMappingURL=absensi-_5V_52SC.js.map
