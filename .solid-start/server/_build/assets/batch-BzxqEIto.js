import { ssr, ssrHydrationKey, escape, createComponent, Portal, ssrAttribute } from "solid-js/web";
import { createEffect, createSignal, Show, For } from "solid-js";
import { c as createAsync, a as useSearchParams, s as showToast, u as useSubmission, y as createBatch, z as updateBatch, A as deleteBatch, B as getAdminBatches } from "../../entry-server.js";
import { g as getPageNumbers } from "./utils-9YFw9ezW.js";
import "solid-js/web/storage";
import "fs";
import "path";
import "crypto";
import "@prisma/client";
import "node:stream";
import "xlsx";
var _tmpl$ = ["<div", ' class="modal-overlay"><div class="modal modal-animate"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-4);border-bottom:1px solid var(--color-border);padding-bottom:var(--space-2);"><h3 style="margin:0;font-family:var(--font-headline);font-weight:700;">Tambah Batch Baru</h3><button class="theme-toggle" style="font-size:24px;padding:0;cursor:pointer;">×</button></div><form', ' method="post"><div class="form-group"><label>Nama Batch</label><input name="name" placeholder="Contoh: Batch 1 - 2026" required minlength="2"></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3);"><div class="form-group"><label>Tanggal Mulai</label><input name="startDate" type="date" required></div><div class="form-group"><label>Tanggal Selesai</label><input name="endDate" type="date" required></div></div><div class="form-group"><label>Deskripsi</label><textarea name="description" placeholder="Masukkan deskripsi program magang untuk batch ini" rows="3"></textarea></div><div style="display:flex;gap:var(--space-2);margin-top:var(--space-4);"><button class="btn-primary" type="submit"', ">", '</button><button class="btn-ghost" type="button">Batal</button></div></form></div></div>'], _tmpl$2 = ["<div", ' class="pagination-container"><div class="pagination-info">Menampilkan <!--$-->', "<!--/--> dari <!--$-->", '<!--/--> batch</div><div class="pagination-buttons"><button class="btn-pagination"', ">Sebelumnya</button><!--$-->", '<!--/--><button class="btn-pagination"', ">Berikutnya</button></div></div>"], _tmpl$3 = ["<main", ' class="p-4"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-4);text-align:left;"><h1 class="page-title" style="margin-bottom:0;">Kelola Batch Magang</h1><button class="btn-primary" style="width:auto;padding:0 var(--space-4);height:40px;">Tambah Batch</button></div><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", '<!--/--><div style="overflow-x:auto;"><table class="data-table"><thead><tr><th>No</th><th>Nama Batch</th><th>Tanggal Mulai</th><th>Tanggal Selesai</th><th>Status</th><th>Jumlah Peserta</th><th>Aksi</th></tr></thead><tbody>', "</tbody></table></div><!--$-->", "<!--/--></main>"], _tmpl$4 = ["<div", ' class="modal-overlay"><div class="modal modal-animate"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-4);border-bottom:1px solid var(--color-border);padding-bottom:var(--space-2);"><h3 style="margin:0;font-family:var(--font-headline);font-weight:700;">Edit Batch Magang</h3><button class="theme-toggle" style="font-size:24px;padding:0;cursor:pointer;">×</button></div><form', ' method="post"><input type="hidden" name="id"', '><div class="form-group"><label>Nama Batch</label><input name="name"', ' required minlength="2"></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3);"><div class="form-group"><label>Tanggal Mulai</label><input name="startDate" type="date"', ' required></div><div class="form-group"><label>Tanggal Selesai</label><input name="endDate" type="date"', ' required></div></div><div class="form-group"><label>Deskripsi</label><textarea name="description" rows="3">', '</textarea></div><div style="display:flex;gap:var(--space-2);margin-top:var(--space-4);"><button class="btn-primary" type="submit"', ">", '</button><button class="btn-ghost" type="button">Batal</button></div></form></div></div>'], _tmpl$5 = ["<div", ' class="modal-overlay"><div class="modal modal-animate" style="max-width:400px;"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-4);border-bottom:1px solid var(--color-border);padding-bottom:var(--space-2);"><h3 style="margin:0;font-family:var(--font-headline);font-weight:700;">Konfirmasi Hapus</h3><button class="theme-toggle" style="font-size:24px;padding:0;cursor:pointer;">×</button></div><form', ' method="post"><input type="hidden" name="id"', '><p style="margin-top:0;margin-bottom:var(--space-4);font-size:14px;color:var(--color-text);line-height:1.5;text-align:left;">Apakah Anda yakin ingin menghapus batch <strong>', '</strong>?</p><div style="display:flex;gap:var(--space-2);"><button class="btn-danger" type="submit"', ' style="width:auto;padding:0 var(--space-4);">', '</button><button class="btn-ghost" type="button" style="width:auto;padding:0 var(--space-4);">Batal</button></div></form></div></div>'], _tmpl$6 = ["<tr", '><td colspan="7" style="text-align:center;color:var(--color-text-secondary);padding:var(--space-5);">Belum ada data batch magang.</td></tr>'], _tmpl$7 = ["<div", ' style="font-size:11px;color:var(--color-text-secondary);margin-top:2px;">', "</div>"], _tmpl$8 = ["<tr", '><td style="font-family:var(--font-mono);font-size:13px;">', '</td><td><strong style="color:var(--color-text);">', "</strong><!--$-->", "<!--/--></td><td>", "</td><td>", '</td><td><span class="', '">', '</span></td><td><span class="badge badge-izin"><!--$-->', '<!--/--> Anak Magang</span></td><td><button class="btn-secondary" style="display:inline-flex;width:auto;height:32px;padding:0 12px;font-size:13px;">Edit</button> <button class="btn-danger" style="display:inline-flex;width:auto;height:32px;padding:0 12px;font-size:13px;">Hapus</button></td></tr>'], _tmpl$9 = ["<button", ' class="', '">', "</button>"], _tmpl$0 = ["<span", ' style="padding:0 8px;color:var(--color-text-secondary);align-self:center;font-weight:600;">...</span>'];
const id$$ = "src/routes/admin/batch.tsx?pick=default&pick=$css";
const formatDateString = (dateStr) => {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
};
const getBatchStatus = (startDate, endDate) => {
  const today = /* @__PURE__ */ new Date();
  today.setHours(0, 0, 0, 0);
  const s = new Date(startDate);
  s.setHours(0, 0, 0, 0);
  const e = new Date(endDate);
  e.setHours(0, 0, 0, 0);
  if (today < s) {
    return {
      label: "Mendatang",
      badgeClass: "badge-pending"
    };
  }
  if (today > e) {
    return {
      label: "Selesai",
      badgeClass: "badge-rejected"
    };
  }
  return {
    label: "Aktif",
    badgeClass: "badge-approved"
  };
};
function AdminBatch() {
  const batchList = createAsync(() => getAdminBatches(), {
    deferStream: true
  });
  const [searchParams, setSearchParams] = useSearchParams();
  createEffect(() => {
    if (searchParams.success === "create") {
      showToast("Batch magang berhasil ditambahkan!", "success");
      setSearchParams({
        success: null
      });
    } else if (searchParams.success === "update") {
      showToast("Batch magang berhasil diperbarui!", "success");
      setSearchParams({
        success: null
      });
    } else if (searchParams.success === "delete") {
      showToast("Batch magang berhasil dihapus!", "success");
      setSearchParams({
        success: null
      });
    }
  });
  const [showCreate, setShowCreate] = createSignal(false);
  const [editingBatch, setEditingBatch] = createSignal(null);
  const [deletingBatch, setDeletingBatch] = createSignal(null);
  const [currentPage, setCurrentPage] = createSignal(1);
  const itemsPerPage = 10;
  const totalPages = () => {
    const list = batchList();
    return list ? Math.max(1, Math.ceil(list.length / itemsPerPage)) : 1;
  };
  const paginatedBatches = () => {
    const list = batchList();
    if (!list) return [];
    const start = (currentPage() - 1) * itemsPerPage;
    return list.slice(start, start + itemsPerPage);
  };
  const creating = useSubmission(createBatch);
  const updating = useSubmission(updateBatch);
  const deleting = useSubmission(deleteBatch);
  let prevCreatingPending = false;
  createEffect(() => {
    const pending = !!creating.pending;
    if (prevCreatingPending && !pending && !creating.error) {
      setShowCreate(false);
    }
    prevCreatingPending = pending;
  });
  let prevUpdatingPending = false;
  createEffect(() => {
    const pending = !!updating.pending;
    if (prevUpdatingPending && !pending && !updating.error) {
      setEditingBatch(null);
    }
    prevUpdatingPending = pending;
  });
  let prevDeletingPending = false;
  createEffect(() => {
    const pending = !!deleting.pending;
    if (prevDeletingPending && !pending && !deleting.error) {
      setDeletingBatch(null);
    }
    prevDeletingPending = pending;
  });
  createEffect(() => {
    if (creating.result instanceof Error) showToast(creating.result.message, "error");
  });
  createEffect(() => {
    if (updating.result instanceof Error) showToast(updating.result.message, "error");
  });
  createEffect(() => {
    if (deleting.result instanceof Error) showToast(deleting.result.message, "error");
  });
  return ssr(_tmpl$3, ssrHydrationKey(), escape(createComponent(Show, {
    get when() {
      return showCreate();
    },
    get children() {
      return createComponent(Portal, {
        get children() {
          return ssr(_tmpl$, ssrHydrationKey(), ssrAttribute("action", escape(createBatch, true), false), ssrAttribute("disabled", creating.pending, true), creating.pending ? "Menyimpan..." : "Simpan");
        }
      });
    }
  })), escape(createComponent(Show, {
    get when() {
      return editingBatch();
    },
    children: (batch) => createComponent(Portal, {
      get children() {
        return ssr(_tmpl$4, ssrHydrationKey(), ssrAttribute("action", escape(updateBatch, true), false), ssrAttribute("value", escape(batch().id, true), false), ssrAttribute("value", escape(batch().name, true), false), ssrAttribute("value", escape(new Date(batch().startDate).toISOString().split("T")[0], true), false), ssrAttribute("value", escape(new Date(batch().endDate).toISOString().split("T")[0], true), false), escape(batch().description ?? ""), ssrAttribute("disabled", updating.pending, true), updating.pending ? "Menyimpan..." : "Simpan");
      }
    })
  })), escape(createComponent(Show, {
    get when() {
      return deletingBatch();
    },
    children: (batch) => createComponent(Portal, {
      get children() {
        return ssr(_tmpl$5, ssrHydrationKey(), ssrAttribute("action", escape(deleteBatch, true), false), ssrAttribute("value", escape(batch().id, true), false), escape(batch().name), ssrAttribute("disabled", deleting.pending, true), deleting.pending ? "Menghapus..." : "Hapus");
      }
    })
  })), escape(createComponent(Show, {
    get when() {
      return batchList() && batchList().length > 0;
    },
    get fallback() {
      return ssr(_tmpl$6, ssrHydrationKey());
    },
    get children() {
      return createComponent(For, {
        get each() {
          return paginatedBatches();
        },
        children: (b, i) => {
          const status = getBatchStatus(b.startDate, b.endDate);
          return ssr(_tmpl$8, ssrHydrationKey(), (escape(currentPage()) - 1) * escape(itemsPerPage) + escape(i()) + 1, escape(b.name), escape(createComponent(Show, {
            get when() {
              return b.description;
            },
            get children() {
              return ssr(_tmpl$7, ssrHydrationKey(), escape(b.description));
            }
          })), escape(formatDateString(b.startDate)), escape(formatDateString(b.endDate)), `badge ${escape(status.badgeClass, true)}`, escape(status.label), escape(b._count.users));
        }
      });
    }
  })), escape(createComponent(Show, {
    get when() {
      return batchList() && batchList().length > 0;
    },
    get children() {
      return ssr(_tmpl$2, ssrHydrationKey(), escape(paginatedBatches().length), escape(batchList().length), ssrAttribute("disabled", currentPage() === 1, true), escape(createComponent(For, {
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
  })));
}
export {
  AdminBatch as default,
  id$$
};
//# sourceMappingURL=batch-BzxqEIto.js.map
