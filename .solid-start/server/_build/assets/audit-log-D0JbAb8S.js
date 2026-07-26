import { ssr, ssrHydrationKey, ssrAttribute, escape, createComponent } from "solid-js/web";
import { createSignal, Suspense, Show, For } from "solid-js";
import { c as createAsync, x as getAdminAuditLogs } from "../../entry-server.js";
import { g as getPageNumbers } from "./utils-9YFw9ezW.js";
import "solid-js/web/storage";
import "fs";
import "path";
import "crypto";
import "@prisma/client";
import "node:stream";
import "xlsx";
var _tmpl$ = ["<div", ' style="overflow-x:auto;"><table class="data-table"><thead><tr><th>No</th><th>Waktu</th><th>Pengguna</th><th>Aktivitas</th><th>Detail</th><th>IP Address</th><th>Lokasi</th><th>Browser / OS</th></tr></thead><tbody>', "</tbody></table></div>"], _tmpl$2 = ["<div", ' class="pagination-container"><div class="pagination-info">Menampilkan <!--$-->', "<!--/--> dari <!--$-->", '<!--/--> log aktivitas</div><div class="pagination-buttons"><button class="btn-pagination"', ">Sebelumnya</button><!--$-->", '<!--/--><button class="btn-pagination"', ">Berikutnya</button></div></div>"], _tmpl$3 = ["<main", '><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-4);flex-wrap:wrap;gap:var(--space-3);text-align:left;"><h1 class="page-title" style="margin-bottom:0;">Audit Log Aktivitas</h1></div><div class="filter-card" style="margin-bottom:var(--space-4);"><div class="form-group"><label>Cari Informasi</label><input type="text" placeholder="Cari user, IP, lokasi, atau detail..."', '></div><div class="form-group"><label>Filter Aktivitas</label><select', '><option value>Semua Aktivitas</option><option value="LOGIN">LOGIN</option><option value="LOGIN_GAGAL">LOGIN GAGAL</option><option value="REGISTER">REGISTER</option><option value="LOGOUT">LOGOUT</option><option value="AKSES_HALAMAN">AKSES HALAMAN</option><option value="CHECK_IN">CHECK IN</option><option value="CHECK_OUT">CHECK OUT</option><option value="PENGAJUAN_IZIN">PENGAJUAN IZIN</option><option value="SETUJUI_IZIN">SETUJUI IZIN</option><option value="TOLAK_IZIN">TOLAK IZIN</option><option value="BUAT_PENGGUNA">BUAT PENGGUNA</option><option value="UPDATE_PENGGUNA">UPDATE PENGGUNA</option><option value="HAPUS_PENGGUNA">HAPUS PENGGUNA</option><option value="BUAT_DIVISI">BUAT DIVISI</option><option value="UPDATE_DIVISI">UPDATE DIVISI</option><option value="HAPUS_DIVISI">HAPUS DIVISI</option><option value="UPDATE_PENGATURAN">UPDATE CONFIG</option></select></div><button class="btn-ghost" style="width:auto;">Reset Filter</button></div><!--$-->', "<!--/--></main>"], _tmpl$4 = ["<div", ' style="overflow-x:auto;opacity:0.6;pointer-events:none;"><table class="data-table"><thead><tr><th>No</th><th>Waktu</th><th>Pengguna</th><th>Aktivitas</th><th>Detail</th><th>IP Address</th><th>Lokasi</th><th>Browser / OS</th></tr></thead><tbody>', "</tbody></table></div>"], _tmpl$5 = ["<tr", '><td><div class="skeleton" style="width:24px;height:16px;"></div></td><td><div class="skeleton" style="width:80px;height:16px;"></div></td><td><div class="skeleton" style="width:100px;height:16px;"></div></td><td><div class="skeleton" style="width:80px;height:20px;border-radius:4px;"></div></td><td><div class="skeleton" style="width:150px;height:16px;"></div></td><td><div class="skeleton" style="width:90px;height:16px;"></div></td><td><div class="skeleton" style="width:90px;height:16px;"></div></td><td><div class="skeleton" style="width:120px;height:16px;"></div></td></tr>'], _tmpl$6 = ["<tr", '><td colspan="8" style="text-align:center;color:var(--color-text-secondary);padding:var(--space-5);">Tidak ada log aktivitas untuk kriteria yang dipilih.</td></tr>'], _tmpl$7 = ["<strong", ' style="display:block;overflow:hidden;text-overflow:ellipsis;">', "</strong>"], _tmpl$8 = ["<div", ' style="font-size:12px;color:var(--color-text-secondary);overflow:hidden;text-overflow:ellipsis;">@<!--$-->', "<!--/--></div>"], _tmpl$9 = ["<tr", '><td style="font-family:var(--font-mono);font-size:13px;">', '</td><td style="font-size:13px;white-space:nowrap;"><div>', '</div><div style="font-size:12px;color:var(--color-text-secondary);">', '</div></td><td style="max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"', ">", '</td><td><span class="', '">', '</span></td><td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;font-size:13px;"', ">", '</td><td style="font-family:var(--font-mono);font-size:13px;max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"', ">", '</td><td style="font-size:13px;max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"', ">", '</td><td style="font-size:12px;max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"', ">", "</td></tr>"], _tmpl$0 = ["<span", '><strong style="color:var(--color-text-secondary);display:block;overflow:hidden;text-overflow:ellipsis;">', '</strong><div style="font-size:11px;color:var(--color-text-secondary);overflow:hidden;text-overflow:ellipsis;">Non-aktif / Tamu</div></span>'], _tmpl$1 = ["<button", ' class="', '">', "</button>"], _tmpl$10 = ["<span", ' style="padding:0 8px;color:var(--color-text-secondary);align-self:center;font-weight:600;">...</span>'];
const id$$ = "src/routes/admin/audit-log.tsx?pick=default&pick=$css";
function AdminAuditLog() {
  const [searchQuery, setSearchQuery] = createSignal("");
  const [debouncedSearch, setDebouncedSearch] = createSignal("");
  const [filterAction, setFilterAction] = createSignal("");
  const [currentPage, setCurrentPage] = createSignal(1);
  const itemsPerPage = 15;
  const logs = createAsync(() => getAdminAuditLogs({
    page: currentPage(),
    limit: itemsPerPage,
    search: debouncedSearch(),
    action: filterAction()
  }));
  const totalPages = () => {
    const total = logs()?.total ?? 0;
    return Math.max(1, Math.ceil(total / itemsPerPage));
  };
  const paginatedLogs = () => {
    return logs()?.items ?? [];
  };
  const getActionBadgeClass = (action) => {
    switch (action) {
      case "LOGIN":
      case "REGISTER":
      case "BUAT_PENGGUNA":
      case "BUAT_DIVISI":
      case "SETUJUI_IZIN":
      case "CHECK_IN":
        return "badge-approved";
      case "UPDATE_PENGGUNA":
      case "UPDATE_DIVISI":
      case "UPDATE_PENGATURAN":
      case "CHECK_OUT":
        return "badge-pending";
      case "LOGOUT":
      case "HAPUS_PENGGUNA":
      case "HAPUS_DIVISI":
      case "TOLAK_IZIN":
      case "LOGIN_GAGAL":
        return "badge-rejected";
      case "AKSES_HALAMAN":
      case "PENGAJUAN_IZIN":
        return "badge-izin";
      default:
        return "badge-pending";
    }
  };
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const day = d.getDate();
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  };
  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    const h = String(d.getHours()).padStart(2, "0");
    const m = String(d.getMinutes()).padStart(2, "0");
    const s = String(d.getSeconds()).padStart(2, "0");
    return `${h}.${m}.${s}`;
  };
  return ssr(_tmpl$3, ssrHydrationKey(), ssrAttribute("value", escape(searchQuery(), true), false), ssrAttribute("value", escape(filterAction(), true), false), escape(createComponent(Suspense, {
    get fallback() {
      return ssr(_tmpl$4, ssrHydrationKey(), escape(createComponent(For, {
        each: [1, 2, 3, 4, 5],
        children: () => ssr(_tmpl$5, ssrHydrationKey())
      })));
    },
    get children() {
      return [ssr(_tmpl$, ssrHydrationKey(), escape(createComponent(Show, {
        get when() {
          return paginatedLogs().length > 0;
        },
        get fallback() {
          return ssr(_tmpl$6, ssrHydrationKey());
        },
        get children() {
          return createComponent(For, {
            get each() {
              return paginatedLogs();
            },
            children: (row, idx) => ssr(_tmpl$9, ssrHydrationKey(), (escape(currentPage()) - 1) * escape(itemsPerPage) + escape(idx()) + 1, escape(formatDate(row.createdAt)), escape(formatTime(row.createdAt)), ssrAttribute("title", row.user?.fullName ? `${escape(row.user.fullName, true)} (@${escape(row.username, true)})` : escape(row.username || "Anonim", true), false), escape(createComponent(Show, {
              get when() {
                return row.user;
              },
              get fallback() {
                return ssr(_tmpl$0, ssrHydrationKey(), escape(row.username || "Anonim"));
              },
              get children() {
                return [ssr(_tmpl$7, ssrHydrationKey(), escape(row.user?.fullName)), ssr(_tmpl$8, ssrHydrationKey(), escape(row.username))];
              }
            })), `badge ${escape(getActionBadgeClass(row.action), true)}`, escape(row.action.replace(/_/g, " ")), ssrAttribute("title", escape(row.details || "", true), false), escape(row.details || "-"), ssrAttribute("title", escape(row.ip || "-", true), false), escape(row.ip || "-"), ssrAttribute("title", escape(row.location || "", true), false), escape(row.location || "-"), ssrAttribute("title", escape(row.userAgent || "", true), false), escape(row.userAgent || "-"))
          });
        }
      }))), createComponent(Show, {
        get when() {
          return (logs()?.total ?? 0) > 0;
        },
        get children() {
          return ssr(_tmpl$2, ssrHydrationKey(), escape(paginatedLogs().length), escape(logs()?.total ?? 0), ssrAttribute("disabled", currentPage() === 1, true), escape(createComponent(For, {
            get each() {
              return getPageNumbers(currentPage(), totalPages());
            },
            children: (page) => createComponent(Show, {
              when: page !== "...",
              get fallback() {
                return ssr(_tmpl$10, ssrHydrationKey());
              },
              get children() {
                return ssr(_tmpl$1, ssrHydrationKey(), `btn-pagination ${currentPage() === page ? "active" : ""}`, escape(page));
              }
            })
          })), ssrAttribute("disabled", currentPage() === totalPages(), true));
        }
      })];
    }
  })));
}
export {
  AdminAuditLog as default,
  id$$
};
//# sourceMappingURL=audit-log-D0JbAb8S.js.map
