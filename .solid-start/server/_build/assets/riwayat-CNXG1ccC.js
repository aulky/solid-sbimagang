import { ssr, ssrHydrationKey, ssrAttribute, escape, createComponent } from "solid-js/web";
import { createSignal, Show, For } from "solid-js";
import { c as createAsync, h as getAttendanceHistory } from "../../entry-server.js";
import { g as getPageNumbers } from "./utils-9YFw9ezW.js";
import "solid-js/web/storage";
import "fs";
import "path";
import "crypto";
import "@prisma/client";
import "node:stream";
import "xlsx";
var _tmpl$ = ["<div", '><h1 class="page-title" style="text-align:left;">Riwayat Absensi</h1><div class="filter-card" style="margin-bottom:var(--space-4);"><div class="form-group"><label>Filter Tanggal</label><input type="date"', '></div><div class="form-group"><label>Filter Status</label><select', '><option value>Semua Status</option><option value="HADIR">HADIR</option><option value="TELAT">TELAT</option><option value="IZIN">IZIN</option><option value="ALPHA">ALPHA</option></select></div><button class="btn-ghost" style="width:auto;">Reset Filter</button></div><!--$-->', "<!--/--></div>"], _tmpl$2 = ["<div", ' style="overflow-x:auto;opacity:0.6;pointer-events:none;"><table class="data-table"><thead><tr><th>No</th><th>Tanggal</th><th>Check-In</th><th>Check-Out</th><th>Status</th><th>Catatan</th></tr></thead><tbody>', "</tbody></table></div>"], _tmpl$3 = ["<tr", '><td><div class="skeleton" style="width:24px;height:16px;"></div></td><td><div class="skeleton" style="width:120px;height:16px;"></div></td><td><div class="skeleton" style="width:70px;height:16px;"></div></td><td><div class="skeleton" style="width:70px;height:16px;"></div></td><td><div class="skeleton" style="width:60px;height:20px;border-radius:4px;"></div></td><td><div class="skeleton" style="width:150px;height:16px;"></div></td></tr>'], _tmpl$4 = ["<div", ' style="overflow-x:auto;"><table class="data-table"><thead><tr><th>No</th><th>Tanggal</th><th>Check-In</th><th>Check-Out</th><th>Status</th><th>Catatan</th></tr></thead><tbody>', "</tbody></table></div>"], _tmpl$5 = ["<div", ' class="pagination-container"><div class="pagination-info">Menampilkan <!--$-->', "<!--/--> dari <!--$-->", '<!--/--> riwayat</div><div class="pagination-buttons"><button class="btn-pagination"', ">Sebelumnya</button><!--$-->", '<!--/--><button class="btn-pagination"', ">Berikutnya</button></div></div>"], _tmpl$6 = ["<tr", '><td colspan="6" style="text-align:center;color:var(--color-text-secondary);padding:var(--space-5);">Belum ada riwayat absensi.</td></tr>'], _tmpl$7 = ["<tr", '><td style="font-family:var(--font-mono);font-size:13px;">', "</td><td>", '</td><td style="font-family:var(--font-mono);">', '</td><td style="font-family:var(--font-mono);">', '</td><td><span class="', '">', "</span></td><td>", "</td></tr>"], _tmpl$8 = ["<button", ' class="', '">', "</button>"], _tmpl$9 = ["<span", ' style="padding:0 8px;color:var(--color-text-secondary);align-self:center;font-weight:600;">...</span>'];
const id$$ = "src/routes/riwayat.tsx?pick=default&pick=$css";
const statusBadge = (status) => status === "HADIR" ? "badge-hadir" : status === "TELAT" ? "badge-telat" : status === "ALPHA" ? "badge-alpha" : "badge-izin";
function Riwayat() {
  const history = createAsync(() => getAttendanceHistory());
  const [currentPage, setCurrentPage] = createSignal(1);
  const itemsPerPage = 10;
  const [filterDate, setFilterDate] = createSignal("");
  const [filterStatus, setFilterStatus] = createSignal("");
  const filteredRecords = () => {
    const list = history();
    if (!list) return [];
    return list.filter((r) => {
      if (filterDate()) {
        const rDate = new Date(r.date).toISOString().slice(0, 10);
        if (rDate !== filterDate()) return false;
      }
      if (filterStatus() && r.status !== filterStatus()) return false;
      return true;
    });
  };
  const totalPages = () => {
    const list = filteredRecords();
    return Math.max(1, Math.ceil(list.length / itemsPerPage));
  };
  const paginatedRecords = () => {
    const list = filteredRecords();
    const start = (currentPage() - 1) * itemsPerPage;
    return list.slice(start, start + itemsPerPage);
  };
  return ssr(_tmpl$, ssrHydrationKey(), ssrAttribute("value", escape(filterDate(), true), false), ssrAttribute("value", escape(filterStatus(), true), false), escape(createComponent(Show, {
    get when() {
      return history();
    },
    get fallback() {
      return ssr(_tmpl$2, ssrHydrationKey(), escape(createComponent(For, {
        each: [1, 2, 3, 4, 5],
        children: () => ssr(_tmpl$3, ssrHydrationKey())
      })));
    },
    children: (rList) => {
      if (rList.length === 999999) console.log(rList);
      return [ssr(_tmpl$4, ssrHydrationKey(), escape(createComponent(Show, {
        get when() {
          return paginatedRecords().length > 0;
        },
        get fallback() {
          return ssr(_tmpl$6, ssrHydrationKey());
        },
        get children() {
          return createComponent(For, {
            get each() {
              return paginatedRecords();
            },
            children: (r, i) => ssr(_tmpl$7, ssrHydrationKey(), (escape(currentPage()) - 1) * escape(itemsPerPage) + escape(i()) + 1, escape(new Date(r.date).toLocaleDateString("id-ID", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric"
            })), r.checkIn ? escape(new Date(r.checkIn).toLocaleTimeString("id-ID")) : "-", r.checkOut ? escape(new Date(r.checkOut).toLocaleTimeString("id-ID")) : "-", `badge ${escape(statusBadge(r.status), true)}`, escape(r.status), escape(r.notes ?? "-"))
          });
        }
      }))), ssr(_tmpl$5, ssrHydrationKey(), escape(paginatedRecords().length), escape(filteredRecords().length), ssrAttribute("disabled", currentPage() === 1, true), escape(createComponent(For, {
        get each() {
          return getPageNumbers(currentPage(), totalPages());
        },
        children: (page) => createComponent(Show, {
          when: page !== "...",
          get fallback() {
            return ssr(_tmpl$9, ssrHydrationKey());
          },
          get children() {
            return ssr(_tmpl$8, ssrHydrationKey(), `btn-pagination ${currentPage() === page ? "active" : ""}`, escape(page));
          }
        })
      })), ssrAttribute("disabled", currentPage() === totalPages(), true))];
    }
  })));
}
export {
  Riwayat as default,
  id$$
};
//# sourceMappingURL=riwayat-CNXG1ccC.js.map
