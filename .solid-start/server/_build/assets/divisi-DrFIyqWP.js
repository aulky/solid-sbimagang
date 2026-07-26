import { ssr, ssrHydrationKey, escape, createComponent, Portal, ssrAttribute } from "solid-js/web";
import { createEffect, createSignal, Show, For } from "solid-js";
import { c as createAsync, a as useSearchParams, s as showToast, u as useSubmission, F as createDivisi, G as updateDivisi, H as deleteDivisi, I as getAdminDivisi } from "../../entry-server.js";
import { g as getPageNumbers } from "./utils-9YFw9ezW.js";
import "solid-js/web/storage";
import "fs";
import "path";
import "crypto";
import "@prisma/client";
import "node:stream";
import "xlsx";
var _tmpl$ = ["<div", ' class="modal-overlay"><div class="modal modal-animate"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-4);border-bottom:1px solid var(--color-border);padding-bottom:var(--space-2);"><h3 style="margin:0;font-family:var(--font-headline);font-weight:700;">Tambah Divisi Baru</h3><button class="theme-toggle" style="font-size:24px;padding:0;cursor:pointer;">×</button></div><form', ' method="post"><div class="form-group"><label>Nama Divisi</label><input name="name" placeholder="Masukkan nama divisi" required minlength="2"></div><div class="form-group"><label>Deskripsi</label><textarea name="description" placeholder="Masukkan deskripsi divisi" rows="3"></textarea></div><div style="display:flex;gap:var(--space-2);margin-top:var(--space-4);"><button class="btn-primary" type="submit"', ">", '</button><button class="btn-ghost" type="button">Batal</button></div></form></div></div>'], _tmpl$2 = ["<div", ' class="pagination-container"><div class="pagination-info">Menampilkan <!--$-->', "<!--/--> dari <!--$-->", '<!--/--> divisi</div><div class="pagination-buttons"><button class="btn-pagination"', ">Sebelumnya</button><!--$-->", '<!--/--><button class="btn-pagination"', ">Berikutnya</button></div></div>"], _tmpl$3 = ["<main", ' class="p-4"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-4);text-align:left;"><h1 class="page-title" style="margin-bottom:0;">Kelola Divisi</h1><button class="btn-primary" style="width:auto;padding:0 var(--space-4);height:40px;">Tambah Divisi</button></div><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", '<!--/--><div style="overflow-x:auto;"><table class="data-table"><thead><tr><th>No</th><th>Nama Divisi</th><th>Deskripsi</th><th>Jumlah Anggota</th><th>Aksi</th></tr></thead><tbody>', "</tbody></table></div><!--$-->", "<!--/--></main>"], _tmpl$4 = ["<div", ' class="modal-overlay"><div class="modal modal-animate"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-4);border-bottom:1px solid var(--color-border);padding-bottom:var(--space-2);"><h3 style="margin:0;font-family:var(--font-headline);font-weight:700;">Edit Divisi</h3><button class="theme-toggle" style="font-size:24px;padding:0;cursor:pointer;">×</button></div><form', ' method="post"><input type="hidden" name="id"', '><div class="form-group"><label>Nama Divisi</label><input name="name"', ' required minlength="2"></div><div class="form-group"><label>Deskripsi</label><textarea name="description" rows="3">', '</textarea></div><div style="display:flex;gap:var(--space-2);margin-top:var(--space-4);"><button class="btn-primary" type="submit"', ">", '</button><button class="btn-ghost" type="button">Batal</button></div></form></div></div>'], _tmpl$5 = ["<div", ' class="modal-overlay"><div class="modal modal-animate" style="max-width:400px;"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-4);border-bottom:1px solid var(--color-border);padding-bottom:var(--space-2);"><h3 style="margin:0;font-family:var(--font-headline);font-weight:700;">Konfirmasi Hapus</h3><button class="theme-toggle" style="font-size:24px;padding:0;cursor:pointer;">×</button></div><form', ' method="post"><input type="hidden" name="id"', '><p style="margin-top:0;margin-bottom:var(--space-4);font-size:14px;color:var(--color-text);line-height:1.5;text-align:left;">Apakah Anda yakin ingin menghapus divisi <strong>', '</strong>?</p><div style="display:flex;gap:var(--space-2);"><button class="btn-danger" type="submit"', ' style="width:auto;padding:0 var(--space-4);">', '</button><button class="btn-ghost" type="button" style="width:auto;padding:0 var(--space-4);">Batal</button></div></form></div></div>'], _tmpl$6 = ["<tr", '><td colspan="5" style="text-align:center;color:var(--color-text-secondary);padding:var(--space-5);">Belum ada data divisi.</td></tr>'], _tmpl$7 = ["<tr", '><td style="font-family:var(--font-mono);font-size:13px;">', "</td><td>", "</td><td>", '</td><td><span class="badge badge-izin"><!--$-->', '<!--/--> Anggota</span></td><td><button class="btn-secondary" style="display:inline-flex;width:auto;height:32px;padding:0 12px;font-size:13px;">Edit</button> <button class="btn-danger" style="display:inline-flex;width:auto;height:32px;padding:0 12px;font-size:13px;">Hapus</button></td></tr>'], _tmpl$8 = ["<button", ' class="', '">', "</button>"], _tmpl$9 = ["<span", ' style="padding:0 8px;color:var(--color-text-secondary);align-self:center;font-weight:600;">...</span>'];
const id$$ = "src/routes/admin/divisi.tsx?pick=default&pick=$css";
function AdminDivisi() {
  const divisiList = createAsync(() => getAdminDivisi(), {
    deferStream: true
  });
  const [searchParams, setSearchParams] = useSearchParams();
  createEffect(() => {
    if (searchParams.success === "create") {
      showToast("Divisi berhasil ditambahkan!", "success");
      setSearchParams({
        success: null
      });
    } else if (searchParams.success === "update") {
      showToast("Divisi berhasil diperbarui!", "success");
      setSearchParams({
        success: null
      });
    } else if (searchParams.success === "delete") {
      showToast("Divisi berhasil dihapus!", "success");
      setSearchParams({
        success: null
      });
    }
  });
  const [showCreate, setShowCreate] = createSignal(false);
  const [editingDivisi, setEditingDivisi] = createSignal(null);
  const [deletingDivisi, setDeletingDivisi] = createSignal(null);
  const [currentPage, setCurrentPage] = createSignal(1);
  const itemsPerPage = 10;
  const totalPages = () => {
    const list = divisiList();
    return list ? Math.max(1, Math.ceil(list.length / itemsPerPage)) : 1;
  };
  const paginatedDivisi = () => {
    const list = divisiList();
    if (!list) return [];
    const start = (currentPage() - 1) * itemsPerPage;
    return list.slice(start, start + itemsPerPage);
  };
  const creating = useSubmission(createDivisi);
  const updating = useSubmission(updateDivisi);
  const deleting = useSubmission(deleteDivisi);
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
      setEditingDivisi(null);
    }
    prevUpdatingPending = pending;
  });
  let prevDeletingPending = false;
  createEffect(() => {
    const pending = !!deleting.pending;
    if (prevDeletingPending && !pending && !deleting.error) {
      setDeletingDivisi(null);
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
          return ssr(_tmpl$, ssrHydrationKey(), ssrAttribute("action", escape(createDivisi, true), false), ssrAttribute("disabled", creating.pending, true), creating.pending ? "Menyimpan..." : "Simpan");
        }
      });
    }
  })), escape(createComponent(Show, {
    get when() {
      return editingDivisi();
    },
    children: (divisi) => createComponent(Portal, {
      get children() {
        return ssr(_tmpl$4, ssrHydrationKey(), ssrAttribute("action", escape(updateDivisi, true), false), ssrAttribute("value", escape(divisi().id, true), false), ssrAttribute("value", escape(divisi().name, true), false), escape(divisi().description ?? ""), ssrAttribute("disabled", updating.pending, true), updating.pending ? "Menyimpan..." : "Simpan");
      }
    })
  })), escape(createComponent(Show, {
    get when() {
      return deletingDivisi();
    },
    children: (divisi) => createComponent(Portal, {
      get children() {
        return ssr(_tmpl$5, ssrHydrationKey(), ssrAttribute("action", escape(deleteDivisi, true), false), ssrAttribute("value", escape(divisi().id, true), false), escape(divisi().name), ssrAttribute("disabled", deleting.pending, true), deleting.pending ? "Menghapus..." : "Hapus");
      }
    })
  })), escape(createComponent(Show, {
    get when() {
      return divisiList() && divisiList().length > 0;
    },
    get fallback() {
      return ssr(_tmpl$6, ssrHydrationKey());
    },
    get children() {
      return createComponent(For, {
        get each() {
          return paginatedDivisi();
        },
        children: (d, i) => ssr(_tmpl$7, ssrHydrationKey(), (escape(currentPage()) - 1) * escape(itemsPerPage) + escape(i()) + 1, escape(d.name), escape(d.description ?? "-"), escape(d._count.users))
      });
    }
  })), escape(createComponent(Show, {
    get when() {
      return divisiList() && divisiList().length > 0;
    },
    get children() {
      return ssr(_tmpl$2, ssrHydrationKey(), escape(paginatedDivisi().length), escape(divisiList().length), ssrAttribute("disabled", currentPage() === 1, true), escape(createComponent(For, {
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
      })), ssrAttribute("disabled", currentPage() === totalPages(), true));
    }
  })));
}
export {
  AdminDivisi as default,
  id$$
};
//# sourceMappingURL=divisi-DrFIyqWP.js.map
