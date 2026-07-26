import { ssr, ssrHydrationKey, escape, createComponent, Portal, ssrAttribute } from "solid-js/web";
import { createEffect, createSignal, Show, For } from "solid-js";
import { c as createAsync, u as useSubmission, a as useSearchParams, s as showToast, i as submitIzin, j as getUserIzinList } from "../../entry-server.js";
import { g as getPageNumbers } from "./utils-9YFw9ezW.js";
import "solid-js/web/storage";
import "fs";
import "path";
import "crypto";
import "@prisma/client";
import "node:stream";
import "xlsx";
var _tmpl$ = ["<div", ' class="modal-overlay"><div class="modal modal-animate"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-4);border-bottom:1px solid var(--color-border);padding-bottom:var(--space-2);"><h3 style="margin:0;font-family:var(--font-headline);font-weight:700;">Ajukan Izin Baru</h3><button class="theme-toggle" style="font-size:24px;padding:0;cursor:pointer;">×</button></div><form', ' method="post" enctype="multipart/form-data"><div class="form-group"><label for="type">Tipe Perizinan</label><select id="type" name="type" required><option value>-- Pilih Tipe --</option><option value="SAKIT">Sakit</option><option value="IZIN">Izin (Keperluan Mendesak)</option><option value="CUTI">Cuti Magang</option></select></div><div style="display:flex;gap:var(--space-4);flex-wrap:wrap;"><div class="form-group" style="flex:1;min-width:150px;"><label for="startDate">Tanggal Mulai</label><input type="date" id="startDate" name="startDate" required></div><div class="form-group" style="flex:1;min-width:150px;"><label for="endDate">Tanggal Selesai</label><input type="date" id="endDate" name="endDate" required></div></div><div class="form-group"><label for="reason">Alasan Pengajuan</label><textarea id="reason" name="reason" placeholder="Jelaskan alasan pengajuan izin secara detail..." rows="4" required></textarea></div><div class="form-group"><label for="attachment">Lampiran Bukti / Surat Sakit (Gambar / PDF, maks. 500KB)</label><input type="file" id="attachment" name="attachment" accept="image/png, image/jpeg, image/jpg, application/pdf"></div><div style="display:flex;gap:var(--space-2);margin-top:var(--space-4);"><button class="btn-primary" type="submit"', ">", '</button><button class="btn-ghost" type="button">Batal</button></div></form></div></div>'], _tmpl$2 = ["<main", ' class="p-4" style="text-align:left;"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-4);"><h1 class="page-title" style="margin-bottom:0;">Pengajuan Izin Magang</h1><button class="btn-primary" style="width:auto;padding:0 var(--space-4);height:40px;">Ajukan Izin</button></div><!--$-->', '<!--/--><div class="filter-card" style="margin-bottom:var(--space-4);"><div class="form-group"><label>Tipe Izin</label><select', '><option value>Semua Tipe</option><option value="SAKIT">Sakit</option><option value="IZIN">Izin</option><option value="CUTI">Cuti</option></select></div><div class="form-group"><label>Status</label><select', '><option value>Semua Status</option><option value="PENDING">Pending</option><option value="APPROVED">Setuju</option><option value="REJECTED">Tolak</option></select></div><button class="btn-ghost" style="width:auto;">Reset Filter</button></div><!--$-->', "<!--/--><!--$-->", "<!--/--></main>"], _tmpl$3 = ["<div", ' style="overflow-x:auto;opacity:0.6;pointer-events:none;"><table class="data-table"><thead><tr><th>No</th><th>Tanggal Mulai</th><th>Tanggal Selesai</th><th>Tipe</th><th>Alasan</th><th>Lampiran</th><th>Status</th></tr></thead><tbody>', "</tbody></table></div>"], _tmpl$4 = ["<tr", '><td><div class="skeleton" style="width:24px;height:16px;"></div></td><td><div class="skeleton" style="width:100px;height:16px;"></div></td><td><div class="skeleton" style="width:100px;height:16px;"></div></td><td><div class="skeleton" style="width:50px;height:20px;border-radius:4px;"></div></td><td><div class="skeleton" style="width:150px;height:16px;"></div></td><td><div class="skeleton" style="width:80px;height:24px;border-radius:4px;"></div></td><td><div class="skeleton" style="width:60px;height:20px;border-radius:4px;"></div></td></tr>'], _tmpl$5 = ["<div", ' style="overflow-x:auto;"><table class="data-table"><thead><tr><th>No</th><th>Tanggal Mulai</th><th>Tanggal Selesai</th><th>Tipe</th><th>Alasan</th><th>Lampiran</th><th>Status</th></tr></thead><tbody>', "</tbody></table></div>"], _tmpl$6 = ["<div", ' class="pagination-container"><div class="pagination-info">Menampilkan <!--$-->', "<!--/--> dari <!--$-->", '<!--/--> pengajuan izin</div><div class="pagination-buttons"><button class="btn-pagination"', ">Sebelumnya</button><!--$-->", '<!--/--><button class="btn-pagination"', ">Berikutnya</button></div></div>"], _tmpl$7 = ["<tr", '><td colspan="7" style="text-align:center;color:var(--color-text-secondary);padding:var(--space-5);">Belum ada riwayat pengajuan izin magang.</td></tr>'], _tmpl$8 = ["<button", ' type="button" class="btn-secondary" style="width:auto;height:32px;padding:0 12px;font-size:12px;display:inline-flex;">Lihat Surat</button>'], _tmpl$9 = ["<tr", '><td style="font-family:var(--font-mono);font-size:13px;">', "</td><td>", "</td><td>", '</td><td><span class="badge badge-izin">', '</span></td><td style="max-width:250px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"', ">", "</td><td>", '</td><td><span class="', '">', "</span></td></tr>"], _tmpl$0 = ["<span", ' style="color:var(--color-text-secondary);font-size:13px;">—</span>'], _tmpl$1 = ["<button", ' class="', '">', "</button>"], _tmpl$10 = ["<span", ' style="padding:0 8px;color:var(--color-text-secondary);align-self:center;font-weight:600;">...</span>'], _tmpl$11 = ["<object", ' type="application/pdf" width="100%" height="500px" style="border-radius:var(--radius-md);border:1px solid var(--color-border);"><p style="font-size:14px;color:var(--color-text-secondary);margin-bottom:15px;">Pratinjau PDF tidak didukung langsung oleh browser Anda.</p><a', ' target="_blank" rel="noopener noreferrer" class="btn-primary" style="text-decoration:none;display:inline-flex;width:auto;padding:0 var(--space-4);">Buka / Unduh PDF</a></object>'], _tmpl$12 = ["<div", ' class="modal-overlay"><div class="modal modal-animate" style="max-width:600px;text-align:center;"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-4);border-bottom:1px solid var(--color-border);padding-bottom:var(--space-2);"><h3 style="margin:0;font-family:var(--font-headline);font-weight:700;">Surat Keterangan Sakit</h3><button class="theme-toggle" style="font-size:24px;padding:0;cursor:pointer;">×</button></div><!--$-->', '<!--/--><div style="margin-top:var(--space-4);display:flex;justify-content:center;"><button class="btn-ghost" type="button" style="width:auto;padding:0 var(--space-4);">Tutup</button></div></div></div>'], _tmpl$13 = ["<img", ' alt="Surat Sakit" style="max-width:100%;max-height:70vh;object-fit:contain;border-radius:var(--radius-md);box-shadow:var(--shadow-md);">'];
const id$$ = "src/routes/izin.tsx?pick=default&pick=$css";
const statusBadge = (status) => status === "PENDING" ? "badge-pending" : status === "APPROVED" ? "badge-approved" : status === "REJECTED" ? "badge-rejected" : "badge-pending";
const statusText = (status) => {
  const map = {
    PENDING: "Menunggu",
    APPROVED: "Disetujui",
    REJECTED: "Ditolak"
  };
  return map[status] || status;
};
function Izin() {
  const izinList = createAsync(() => getUserIzinList());
  const submitting = useSubmission(submitIzin);
  const [searchParams, setSearchParams] = useSearchParams();
  createEffect(() => {
    if (searchParams.success === "create") {
      showToast("Pengajuan izin berhasil dikirim!", "success");
      setSearchParams({
        success: null
      });
    }
  });
  const [showCreate, setShowCreate] = createSignal(false);
  const [filterType, setFilterType] = createSignal("");
  const [filterStatus, setFilterStatus] = createSignal("");
  const [viewingAttachment, setViewingAttachment] = createSignal(null);
  const [currentPage, setCurrentPage] = createSignal(1);
  const itemsPerPage = 5;
  const filteredHistory = () => {
    const list = izinList();
    if (!list) return [];
    return list.filter((r) => {
      if (filterStatus() && r.status !== filterStatus()) return false;
      if (filterType() && r.type !== filterType()) return false;
      return true;
    });
  };
  const totalPages = () => {
    const list = filteredHistory();
    return Math.max(1, Math.ceil(list.length / itemsPerPage));
  };
  const paginatedList = () => {
    const list = filteredHistory();
    if (!list) return [];
    const start = (currentPage() - 1) * itemsPerPage;
    return list.slice(start, start + itemsPerPage);
  };
  let prevSubmittingPending = false;
  createEffect(() => {
    const pending = !!submitting.pending;
    if (prevSubmittingPending && !pending && !submitting.error) {
      setShowCreate(false);
    }
    prevSubmittingPending = pending;
  });
  createEffect(() => {
    if (submitting.result instanceof Error) showToast(submitting.result.message, "error");
  });
  return ssr(_tmpl$2, ssrHydrationKey(), escape(createComponent(Show, {
    get when() {
      return showCreate();
    },
    get children() {
      return createComponent(Portal, {
        get children() {
          return ssr(_tmpl$, ssrHydrationKey(), ssrAttribute("action", escape(submitIzin, true), false), ssrAttribute("disabled", submitting.pending, true), submitting.pending ? "Mengirim..." : "Kirim Pengajuan");
        }
      });
    }
  })), ssrAttribute("value", escape(filterType(), true), false), ssrAttribute("value", escape(filterStatus(), true), false), escape(createComponent(Show, {
    get when() {
      return izinList();
    },
    get fallback() {
      return ssr(_tmpl$3, ssrHydrationKey(), escape(createComponent(For, {
        each: [1, 2, 3, 4, 5],
        children: () => ssr(_tmpl$4, ssrHydrationKey())
      })));
    },
    children: (list) => {
      if (list.length === 999999) console.log(list);
      return [ssr(_tmpl$5, ssrHydrationKey(), escape(createComponent(Show, {
        get when() {
          return paginatedList().length > 0;
        },
        get fallback() {
          return ssr(_tmpl$7, ssrHydrationKey());
        },
        get children() {
          return createComponent(For, {
            get each() {
              return paginatedList();
            },
            children: (r, i) => ssr(_tmpl$9, ssrHydrationKey(), (escape(currentPage()) - 1) * escape(itemsPerPage) + escape(i()) + 1, escape(new Date(r.startDate).toLocaleDateString("id-ID", {
              year: "numeric",
              month: "long",
              day: "numeric"
            })), escape(new Date(r.endDate).toLocaleDateString("id-ID", {
              year: "numeric",
              month: "long",
              day: "numeric"
            })), escape(r.type), ssrAttribute("title", escape(r.reason, true), false), escape(r.reason), escape(createComponent(Show, {
              get when() {
                return r.attachment;
              },
              get fallback() {
                return ssr(_tmpl$0, ssrHydrationKey());
              },
              get children() {
                return ssr(_tmpl$8, ssrHydrationKey());
              }
            })), `badge ${escape(statusBadge(r.status), true)}`, escape(statusText(r.status)))
          });
        }
      }))), createComponent(Show, {
        get when() {
          return filteredHistory().length > 0;
        },
        get children() {
          return ssr(_tmpl$6, ssrHydrationKey(), escape(paginatedList().length), escape(filteredHistory().length), ssrAttribute("disabled", currentPage() === 1, true), escape(createComponent(For, {
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
  })), escape(createComponent(Show, {
    get when() {
      return viewingAttachment();
    },
    children: (url) => createComponent(Portal, {
      get children() {
        return ssr(_tmpl$12, ssrHydrationKey(), escape(createComponent(Show, {
          get when() {
            return viewingAttachment()?.toLowerCase().endsWith(".pdf");
          },
          get fallback() {
            return ssr(_tmpl$13, ssrHydrationKey() + ssrAttribute("src", escape(url(), true), false));
          },
          get children() {
            return ssr(_tmpl$11, ssrHydrationKey() + ssrAttribute("data", escape(url(), true), false), ssrAttribute("href", escape(url(), true), false));
          }
        })));
      }
    })
  })));
}
export {
  Izin as default,
  id$$
};
//# sourceMappingURL=izin-CEtYEBKC.js.map
