import { ssr, ssrHydrationKey, ssrAttribute, escape, createComponent, Portal } from "solid-js/web";
import { createSignal, createEffect, Suspense, Show, For } from "solid-js";
import { u as useSubmission, a as useSearchParams, s as showToast, c as createAsync, J as approveIzin, K as getAdminIzin } from "../../entry-server.js";
import { g as getPageNumbers } from "./utils-9YFw9ezW.js";
import "solid-js/web/storage";
import "fs";
import "path";
import "crypto";
import "@prisma/client";
import "node:stream";
import "xlsx";
var _tmpl$ = ["<div", ' style="overflow-x:auto;"><table class="data-table"><thead><tr><th>No</th><th>Nama</th><th>Tipe</th><th>Tanggal Mulai</th><th>Tanggal Selesai</th><th>Alasan</th><th>Lampiran</th><th>Status</th><th>Aksi</th></tr></thead><tbody>', "</tbody></table></div>"], _tmpl$2 = ["<div", ' class="pagination-container"><div class="pagination-info">Menampilkan <!--$-->', "<!--/--> dari <!--$-->", '<!--/--> pengajuan izin</div><div class="pagination-buttons"><button class="btn-pagination"', ">Sebelumnya</button><!--$-->", '<!--/--><button class="btn-pagination"', ">Berikutnya</button></div></div>"], _tmpl$3 = ["<main", '><h1 class="page-title">Kelola Pengajuan Izin</h1><div class="filter-card" style="margin-bottom:var(--space-4);"><div class="form-group"><label>Cari Nama</label><input type="text" placeholder="Cari nama atau username..."', '></div><div class="form-group"><label>Tipe Izin</label><select', '><option value>Semua Tipe</option><option value="SAKIT">Sakit</option><option value="IZIN">Izin</option><option value="CUTI">Cuti</option></select></div><div class="form-group"><label>Status</label><select', '><option value>Semua Status</option><option value="PENDING">Pending</option><option value="APPROVED">Setuju</option><option value="REJECTED">Tolak</option></select></div><button class="btn-ghost" style="width:auto;">Reset Filter</button></div><!--$-->', "<!--/--><!--$-->", "<!--/--></main>"], _tmpl$4 = ["<div", ' style="overflow-x:auto;opacity:0.6;pointer-events:none;"><table class="data-table"><thead><tr><th>No</th><th>Nama</th><th>Tipe</th><th>Tanggal Mulai</th><th>Tanggal Selesai</th><th>Alasan</th><th>Lampiran</th><th>Status</th><th>Aksi</th></tr></thead><tbody>', "</tbody></table></div>"], _tmpl$5 = ["<tr", '><td><div class="skeleton" style="width:24px;height:16px;"></div></td><td><div class="skeleton" style="width:100px;height:16px;"></div></td><td><div class="skeleton" style="width:50px;height:20px;border-radius:4px;"></div></td><td><div class="skeleton" style="width:80px;height:16px;"></div></td><td><div class="skeleton" style="width:80px;height:16px;"></div></td><td><div class="skeleton" style="width:150px;height:16px;"></div></td><td><div class="skeleton" style="width:70px;height:24px;border-radius:4px;"></div></td><td><div class="skeleton" style="width:60px;height:20px;border-radius:4px;"></div></td><td><div class="skeleton" style="width:100px;height:24px;"></div></td></tr>'], _tmpl$6 = ["<tr", '><td colspan="9" style="text-align:center;color:var(--color-text-secondary);padding:var(--space-5);">Belum ada pengajuan izin.</td></tr>'], _tmpl$7 = ["<div", ' style="font-size:11px;color:var(--color-text-secondary);margin-top:2px;display:flex;align-items:center;gap:4px;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;stroke:currentColor;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg><span>', "</span></div>"], _tmpl$8 = ["<button", ' type="button" class="btn-secondary" style="width:auto;height:32px;padding:0 12px;font-size:12px;display:inline-flex;">Lihat Surat</button>'], _tmpl$9 = ["<div", ' style="display:flex;gap:var(--space-2);"><form', ' method="post"><input type="hidden" name="id"', '><input type="hidden" name="status" value="APPROVED"><button type="submit" class="btn-secondary" style="width:auto;height:32px;padding:0 12px;font-size:12px;"', ">Setujui</button></form><form", ' method="post"><input type="hidden" name="id"', '><input type="hidden" name="status" value="REJECTED"><button type="submit" class="btn-danger" style="width:auto;height:32px;padding:0 12px;font-size:12px;"', ">Tolak</button></form></div>"], _tmpl$0 = ["<span", ' style="color:var(--color-text-secondary);font-size:13px;">—</span>'], _tmpl$1 = ["<tr", '><td style="font-family:var(--font-mono);font-size:13px;">', "</td><td><strong>", '</strong><div style="font-size:12px;color:var(--color-text-secondary);">@<!--$-->', "<!--/--></div><!--$-->", '<!--/--></td><td><span class="badge badge-izin">', "</span></td><td>", "</td><td>", "</td><td", '><div style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">', "</div></td><td>", '</td><td><span class="', '">', "</span></td><td><!--$-->", "<!--/--><!--$-->", "<!--/--></td></tr>"], _tmpl$10 = ["<button", ' class="', '">', "</button>"], _tmpl$11 = ["<span", ' style="padding:0 8px;color:var(--color-text-secondary);align-self:center;font-weight:600;">...</span>'], _tmpl$12 = ["<embed", ' type="application/pdf" width="100%" height="500px" style="border-radius:var(--radius-md);border:1px solid var(--color-border);">'], _tmpl$13 = ["<div", ' class="modal-overlay"><div class="modal modal-animate" style="max-width:600px;text-align:center;"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-4);border-bottom:1px solid var(--color-border);padding-bottom:var(--space-2);"><h3 style="margin:0;font-family:var(--font-headline);font-weight:700;">Surat Keterangan Sakit</h3><button class="theme-toggle" style="font-size:24px;padding:0;cursor:pointer;">×</button></div><!--$-->', '<!--/--><div style="margin-top:var(--space-4);display:flex;justify-content:center;"><button class="btn-ghost" type="button" style="width:auto;padding:0 var(--space-4);">Tutup</button></div></div></div>'], _tmpl$14 = ["<img", ' alt="Surat Sakit" style="max-width:100%;max-height:70vh;object-fit:contain;border-radius:var(--radius-md);box-shadow:var(--shadow-md);">'];
const id$$ = "src/routes/admin/izin.tsx?pick=default&pick=$css";
const statusText = (status) => {
  const map = {
    PENDING: "Menunggu",
    APPROVED: "Disetujui",
    REJECTED: "Ditolak"
  };
  return map[status] || status;
};
function AdminIzin() {
  const approving = useSubmission(approveIzin);
  const [viewingAttachment, setViewingAttachment] = createSignal(null);
  const [searchParams, setSearchParams] = useSearchParams();
  createEffect(() => {
    if (searchParams.success === "update") {
      showToast("Status pengajuan izin berhasil diperbarui!", "success");
      setSearchParams({
        success: null
      });
    }
  });
  createEffect(() => {
    if (approving.result && approving.result instanceof Error) {
      showToast(approving.result.message, "error");
    }
  });
  const [searchQuery, setSearchQuery] = createSignal("");
  const [debouncedSearch, setDebouncedSearch] = createSignal("");
  const [filterType, setFilterType] = createSignal("");
  const [filterStatus, setFilterStatus] = createSignal("");
  const [currentPage, setCurrentPage] = createSignal(1);
  const itemsPerPage = 10;
  const recordsData = createAsync(() => getAdminIzin({
    page: currentPage(),
    limit: itemsPerPage,
    search: debouncedSearch(),
    type: filterType(),
    status: filterStatus()
  }));
  const totalPages = () => {
    const total = recordsData()?.total ?? 0;
    return Math.max(1, Math.ceil(total / itemsPerPage));
  };
  const paginatedRecords = () => {
    return recordsData()?.items ?? [];
  };
  return ssr(_tmpl$3, ssrHydrationKey(), ssrAttribute("value", escape(searchQuery(), true), false), ssrAttribute("value", escape(filterType(), true), false), ssrAttribute("value", escape(filterStatus(), true), false), escape(createComponent(Suspense, {
    get fallback() {
      return ssr(_tmpl$4, ssrHydrationKey(), escape(createComponent(For, {
        each: [1, 2, 3, 4, 5],
        children: () => ssr(_tmpl$5, ssrHydrationKey())
      })));
    },
    get children() {
      return [ssr(_tmpl$, ssrHydrationKey(), escape(createComponent(Show, {
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
            children: (row, idx) => {
              const startDate = new Date(row.startDate).toLocaleDateString("id-ID");
              const endDate = new Date(row.endDate).toLocaleDateString("id-ID");
              return ssr(_tmpl$1, ssrHydrationKey(), (escape(currentPage()) - 1) * escape(itemsPerPage) + escape(idx()) + 1, escape(row.user.fullName), escape(row.user.username), escape(createComponent(Show, {
                get when() {
                  return row.user.phone;
                },
                get children() {
                  return ssr(_tmpl$7, ssrHydrationKey(), escape(row.user.phone));
                }
              })), escape(row.type), escape(startDate), escape(endDate), ssrAttribute("title", escape(row.reason, true), false), escape(row.reason), escape(createComponent(Show, {
                get when() {
                  return row.attachment;
                },
                get fallback() {
                  return ssr(_tmpl$0, ssrHydrationKey());
                },
                get children() {
                  return ssr(_tmpl$8, ssrHydrationKey());
                }
              })), `badge badge-${escape(row.status.toLowerCase(), true)}`, escape(statusText(row.status)), escape(createComponent(Show, {
                get when() {
                  return row.status === "PENDING";
                },
                get children() {
                  return ssr(_tmpl$9, ssrHydrationKey(), ssrAttribute("action", escape(approveIzin, true), false), ssrAttribute("value", escape(row.id, true), false), ssrAttribute("disabled", approving.pending, true), ssrAttribute("action", escape(approveIzin, true), false), ssrAttribute("value", escape(row.id, true), false), ssrAttribute("disabled", approving.pending, true));
                }
              })), escape(createComponent(Show, {
                get when() {
                  return row.status !== "PENDING";
                },
                get children() {
                  return ssr(_tmpl$0, ssrHydrationKey());
                }
              })));
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
                return ssr(_tmpl$11, ssrHydrationKey());
              },
              get children() {
                return ssr(_tmpl$10, ssrHydrationKey(), `btn-pagination ${currentPage() === page ? "active" : ""}`, escape(page));
              }
            })
          })), ssrAttribute("disabled", currentPage() === totalPages(), true));
        }
      })];
    }
  })), escape(createComponent(Show, {
    get when() {
      return viewingAttachment();
    },
    children: (url) => createComponent(Portal, {
      get children() {
        return ssr(_tmpl$13, ssrHydrationKey(), escape(createComponent(Show, {
          get when() {
            return viewingAttachment()?.toLowerCase().endsWith(".pdf");
          },
          get fallback() {
            return ssr(_tmpl$14, ssrHydrationKey() + ssrAttribute("src", escape(url(), true), false));
          },
          get children() {
            return ssr(_tmpl$12, ssrHydrationKey() + ssrAttribute("src", escape(url(), true), false));
          }
        })));
      }
    })
  })));
}
export {
  AdminIzin as default,
  id$$
};
//# sourceMappingURL=izin-DIINCEZI.js.map
