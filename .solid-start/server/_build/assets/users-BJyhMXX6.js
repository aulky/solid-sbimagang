import { ssr, ssrHydrationKey, escape, createComponent, Portal, ssrAttribute } from "solid-js/web";
import { createEffect, createSignal, Show, For, Suspense } from "solid-js";
import { c as createAsync, a as useSearchParams, s as showToast, u as useSubmission, O as createUser, P as updateUser, Q as deleteUser, R as adminResetPassword, t as getAllDivisi, v as getAllBatches, S as getAdminUsers } from "../../entry-server.js";
import { g as getPageNumbers } from "./utils-9YFw9ezW.js";
import "solid-js/web/storage";
import "fs";
import "path";
import "crypto";
import "@prisma/client";
import "node:stream";
import "xlsx";
var _tmpl$ = ["<svg", ' width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>'], _tmpl$2 = ["<div", ' class="modal-overlay"><div class="modal modal-animate"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-4);border-bottom:1px solid var(--color-border);padding-bottom:var(--space-2);"><h3 style="margin:0;font-family:var(--font-headline);font-weight:700;">Tambah Pengguna Baru</h3><button class="theme-toggle" style="font-size:24px;padding:0;cursor:pointer;">×</button></div><form', ' method="post"><div class="form-group"><label>Username</label><input name="username" placeholder="Masukkan username" required minlength="3"></div><div class="form-group"><label>Password</label><div class="password-input-container"><input name="password"', ' placeholder="Masukkan password" required minlength="6"><button type="button" class="password-toggle-btn"', ">", '</button></div></div><div class="form-group"><label>Nama Lengkap</label><input name="fullName" placeholder="Masukkan nama lengkap" required></div><div class="form-group"><label>Email</label><input name="email" type="email" placeholder="Masukkan email" required></div><div class="form-group"><label>Telepon</label><input name="phone" placeholder="Masukkan nomor telepon"></div><div class="form-group"><label>Role</label><select name="role"><option value="USER">USER</option><option value="ADMIN">ADMIN</option></select></div><div class="form-group"><label>Divisi</label><select name="divisiId"><option value>-- Pilih Divisi --</option><!--$-->', '<!--/--></select></div><div class="form-group"><label>Batch Magang</label><select name="batchId"><option value>-- Pilih Batch --</option><!--$-->', '<!--/--></select></div><div style="display:flex;gap:var(--space-2);margin-top:var(--space-4);"><button class="btn-primary" type="submit"', ">", '</button><button class="btn-ghost" type="button">Batal</button></div></form></div></div>'], _tmpl$3 = ["<div", ' class="modal-overlay"><div class="modal modal-animate" style="max-width:600px;"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-4);border-bottom:1px solid var(--color-border);padding-bottom:var(--space-2);"><h3 style="margin:0;font-family:var(--font-headline);font-weight:700;">Impor Pengguna</h3><button class="theme-toggle" style="font-size:24px;padding:0;cursor:pointer;">×</button></div><div style="margin-bottom:var(--space-4);"><p style="margin:0 0 var(--space-2);font-size:14px;color:var(--color-text-secondary);">1. Unduh template Excel, isi data pengguna, lalu upload kembali.</p><a href="/api/users/template" download class="btn-ghost" style="display:inline-block;text-decoration:none;text-align:center;width:auto;padding:0 var(--space-4);height:36px;line-height:36px;">Unduh Template</a></div><div style="margin-bottom:var(--space-4);padding:var(--space-3);border-radius:8px;background:var(--color-surface);border:1px solid var(--color-border);font-size:13px;line-height:1.6;"><p style="margin:0 0 var(--space-2);font-weight:700;color:var(--color-text);display:flex;align-items:center;gap:6px;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>Petunjuk Pengisian:</p><p style="margin:0 0 var(--space-1);color:var(--color-success);display:flex;align-items:center;gap:6px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>Tambahkan data pengguna mulai dari <strong>baris 2</strong> ke bawah.</p><p style="margin:0 0 var(--space-1);color:var(--color-success);display:flex;align-items:center;gap:6px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>Kolom wajib: <strong>username, password, fullName, email</strong>.</p><p style="margin:0 0 var(--space-1);color:var(--color-success);display:flex;align-items:center;gap:6px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>Kolom opsional: phone, role (USER/ADMIN), divisi, batch.</p><p style="margin:0 0 var(--space-1);color:var(--color-success);display:flex;align-items:center;gap:6px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>Lihat sheet <strong>"Referensi"</strong> untuk daftar divisi & batch yang tersedia.</p><hr style="border:none;border-top:1px solid var(--color-border);margin:var(--space-2) 0;"><p style="margin:0 0 var(--space-1);color:var(--color-danger);display:flex;align-items:center;gap:6px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg><strong>JANGAN UBAH</strong> baris 1 (header kolom) di sheet "Template".</p><p style="margin:0;color:var(--color-danger);display:flex;align-items:center;gap:6px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg><strong>JANGAN UBAH</strong> nama sheet "Template".</p></div><form><div class="form-group"><label>2. Upload file Excel (.xlsx)</label><input name="file" type="file" accept=".xlsx" required></div><button class="btn-primary" type="submit"', ' style="width:auto;padding:0 var(--space-4);">', "</button></form><!--$-->", "<!--/--></div></div>"], _tmpl$4 = ["<div", ' style="overflow-x:auto;"><table class="data-table"><thead><tr><th>No</th><th>Username</th><th>Nama</th><th>Email</th><th>Divisi</th><th>Batch</th><th>Role</th><th>Status</th><th>Aksi</th></tr></thead><tbody>', "</tbody></table></div>"], _tmpl$5 = ["<div", ' class="pagination-container"><div class="pagination-info">Menampilkan <!--$-->', "<!--/--> dari <!--$-->", '<!--/--> pengguna</div><div class="pagination-buttons"><button class="btn-pagination"', ">Sebelumnya</button><!--$-->", '<!--/--><button class="btn-pagination"', ">Berikutnya</button></div></div>"], _tmpl$6 = ["<main", ' class="p-4"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-4);text-align:left;"><h1 class="page-title" style="margin-bottom:0;">Kelola Pengguna</h1><div style="display:flex;gap:var(--space-2);"><button class="btn-ghost" style="width:auto;padding:0 var(--space-4);height:40px;">Impor Pengguna</button><button class="btn-primary" style="width:auto;padding:0 var(--space-4);height:40px;">Tambah Pengguna</button></div></div><!--$-->', "<!--/--><!--$-->", '<!--/--><div class="filter-card" style="margin-bottom:var(--space-4);"><div class="form-group"><label>Cari Nama/Username</label><input type="text" placeholder="Cari nama/username..."', '></div><div class="form-group"><label>Pilih Role</label><select', '><option value>Semua Role</option><option value="USER">USER</option><option value="ADMIN">ADMIN</option></select></div><div class="form-group"><label>Pilih Status</label><select', '><option value>Semua Status</option><option value="AKTIF">Aktif</option><option value="ALUMNI">Alumni</option><option value="NONAKTIF">Nonaktif</option></select></div><div class="form-group"><label>Pilih Divisi</label><select', "><option value>Semua Divisi</option><!--$-->", '<!--/--></select></div><div class="form-group"><label>Pilih Batch</label><select', "><option value>Semua Batch</option><!--$-->", '<!--/--></select></div><button class="btn-ghost" style="width:auto;">Reset Filter</button></div><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--></main>"], _tmpl$7 = ["<svg", ' width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>'], _tmpl$8 = ["<option", ">", "</option>"], _tmpl$9 = ["<div", ' style="max-height:200px;overflow-y:auto;"><table class="data-table" style="font-size:12px;"><thead><tr><th>Baris</th><th>Username</th><th>Error</th></tr></thead><tbody>', "</tbody></table></div>"], _tmpl$0 = ["<div", ' style="margin-top:var(--space-4);border-top:1px solid var(--color-border);padding-top:var(--space-4);"><p style="margin:0 0 var(--space-2);font-size:14px;"><strong>Hasil:</strong> <!--$-->', "<!--/-->/<!--$-->", "<!--/--> berhasil ditambahkan.</p><!--$-->", "<!--/--></div>"], _tmpl$1 = ["<tr", "><td>", "</td><td>", '</td><td style="color:var(--color-danger);">', "</td></tr>"], _tmpl$10 = ["<div", ' class="modal-overlay"><div class="modal modal-animate"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-4);border-bottom:1px solid var(--color-border);padding-bottom:var(--space-2);"><h3 style="margin:0;font-family:var(--font-headline);font-weight:700;">Edit Pengguna</h3><button class="theme-toggle" style="font-size:24px;padding:0;cursor:pointer;">×</button></div><form', ' method="post"><input type="hidden" name="id"', '><div class="form-group"><label>Nama Lengkap</label><input name="fullName"', ' required></div><div class="form-group"><label>Email</label><input name="email" type="email"', ' required></div><div class="form-group"><label>Telepon</label><input name="phone"', '></div><div class="form-group"><label>Role</label><select name="role"><option value="USER"', '>USER</option><option value="ADMIN"', '>ADMIN</option></select></div><div class="form-group"><label>Divisi</label><select name="divisiId"><option value>-- Pilih Divisi --</option><!--$-->', '<!--/--></select></div><div class="form-group"><label>Batch Magang</label><select name="batchId"><option value>-- Pilih Batch --</option><!--$-->', '<!--/--></select></div><div class="form-group"><label>Status</label><select name="status"><option value="AKTIF"', '>Aktif</option><option value="ALUMNI"', '>Alumni</option><option value="NONAKTIF"', '>Nonaktif</option></select></div><div style="display:flex;gap:var(--space-2);margin-top:var(--space-4);"><button class="btn-primary" type="submit"', ">", '</button><button class="btn-ghost" type="button">Batal</button></div></form></div></div>'], _tmpl$11 = ["<option", "", ">", "</option>"], _tmpl$12 = ["<div", ' class="modal-overlay"><div class="modal modal-animate" style="max-width:400px;"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-4);border-bottom:1px solid var(--color-border);padding-bottom:var(--space-2);"><h3 style="margin:0;font-family:var(--font-headline);font-weight:700;">Konfirmasi Hapus</h3><button class="theme-toggle" style="font-size:24px;padding:0;cursor:pointer;">×</button></div><form', ' method="post"><input type="hidden" name="id"', '><p style="margin-top:0;margin-bottom:var(--space-4);font-size:14px;color:var(--color-text);line-height:1.5;text-align:left;">Apakah Anda yakin ingin menghapus pengguna <strong>', '</strong>?</p><div style="display:flex;gap:var(--space-2);"><button class="btn-danger" type="submit"', ' style="width:auto;padding:0 var(--space-4);">', '</button><button class="btn-ghost" type="button" style="width:auto;padding:0 var(--space-4);">Batal</button></div></form></div></div>'], _tmpl$13 = ["<div", ' class="modal-overlay"><div class="modal modal-animate" style="max-width:400px;"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-4);border-bottom:1px solid var(--color-border);padding-bottom:var(--space-2);"><h3 style="margin:0;font-family:var(--font-headline);font-weight:700;">Reset Sandi Pengguna</h3><button class="theme-toggle" style="font-size:24px;padding:0;cursor:pointer;">×</button></div><form', ' method="post"><input type="hidden" name="id"', '><p style="margin-top:0;margin-bottom:var(--space-3);font-size:14px;color:var(--color-text);text-align:left;">Reset sandi untuk <strong>', '</strong>.</p><div class="form-group"><label>Sandi Baru</label><div class="password-input-container"><input name="newPassword"', ' placeholder="Masukkan sandi baru (min. 6 karakter)" required minlength="6"><button type="button" class="password-toggle-btn"', ">", '</button></div></div><div style="display:flex;gap:var(--space-2);margin-top:var(--space-4);"><button class="btn-primary" type="submit"', ">", '</button><button class="btn-ghost" type="button">Batal</button></div></form></div></div>'], _tmpl$14 = ["<div", ' style="overflow-x:auto;opacity:0.6;pointer-events:none;"><table class="data-table"><thead><tr><th>No</th><th>Username</th><th>Nama</th><th>Email</th><th>Divisi</th><th>Batch</th><th>Role</th><th>Status</th><th>Aksi</th></tr></thead><tbody>', "</tbody></table></div>"], _tmpl$15 = ["<tr", '><td><div class="skeleton" style="width:24px;height:16px;"></div></td><td><div class="skeleton" style="width:90px;height:16px;"></div></td><td><div class="skeleton" style="width:110px;height:16px;"></div></td><td><div class="skeleton" style="width:140px;height:16px;"></div></td><td><div class="skeleton" style="width:80px;height:16px;"></div></td><td><div class="skeleton" style="width:80px;height:16px;"></div></td><td><div class="skeleton" style="width:50px;height:20px;border-radius:4px;"></div></td><td><div class="skeleton" style="width:50px;height:20px;border-radius:4px;"></div></td><td><div class="skeleton" style="width:100px;height:24px;"></div></td></tr>'], _tmpl$16 = ["<tr", '><td colspan="9" style="text-align:center;color:var(--color-text-secondary);padding:var(--space-5);">Belum ada data pengguna.</td></tr>'], _tmpl$17 = ["<tr", '><td style="font-family:var(--font-mono);font-size:13px;">', "</td><td>", "</td><td>", "</td><td>", "</td><td>", "</td><td>", '</td><td><span class="', '">', '</span></td><td><span class="', '">', '</span></td><td><button class="btn-secondary" style="display:inline-flex;width:auto;height:32px;padding:0 12px;font-size:13px;">Edit</button> <button class="btn-ghost" style="display:inline-flex;width:auto;height:32px;padding:0 12px;font-size:13px;color:var(--color-info);">Reset</button> <button class="btn-danger" style="display:inline-flex;width:auto;height:32px;padding:0 12px;font-size:13px;">Hapus</button></td></tr>'], _tmpl$18 = ["<button", ' class="', '">', "</button>"], _tmpl$19 = ["<span", ' style="padding:0 8px;color:var(--color-text-secondary);align-self:center;font-weight:600;">...</span>'];
const id$$ = "src/routes/admin/users.tsx?pick=default&pick=$css";
function AdminUsers() {
  const divisiList = createAsync(() => getAllDivisi(), {
    deferStream: true
  });
  const batchList = createAsync(() => getAllBatches(), {
    deferStream: true
  });
  const [searchParams, setSearchParams] = useSearchParams();
  createEffect(() => {
    if (searchParams.success === "create") {
      showToast("Pengguna berhasil ditambahkan!", "success");
      setSearchParams({
        success: null
      });
    } else if (searchParams.success === "update") {
      showToast("Pengguna berhasil diperbarui!", "success");
      setSearchParams({
        success: null
      });
    } else if (searchParams.success === "delete") {
      showToast("Pengguna berhasil dihapus!", "success");
      setSearchParams({
        success: null
      });
    }
  });
  const [showCreate, setShowCreate] = createSignal(false);
  const [editingUser, setEditingUser] = createSignal(null);
  const [deletingUser, setDeletingUser] = createSignal(null);
  const [showCreatePassword, setShowCreatePassword] = createSignal(false);
  const [showBulk, setShowBulk] = createSignal(false);
  const [bulkResult, setBulkResult] = createSignal(null);
  const [bulkLoading, setBulkLoading] = createSignal(false);
  const [searchQuery, setSearchQuery] = createSignal("");
  const [debouncedSearch, setDebouncedSearch] = createSignal("");
  const [filterRole, setFilterRole] = createSignal("");
  const [filterStatus, setFilterStatus] = createSignal("");
  const [filterDivisi, setFilterDivisi] = createSignal("");
  const [filterBatch, setFilterBatch] = createSignal("");
  const [resettingUser, setResettingUser] = createSignal(null);
  const [showResetPassword, setShowResetPassword] = createSignal(false);
  const [currentPage, setCurrentPage] = createSignal(1);
  const itemsPerPage = 10;
  const usersData = createAsync(() => getAdminUsers({
    page: currentPage(),
    limit: itemsPerPage,
    search: debouncedSearch(),
    role: filterRole(),
    status: filterStatus(),
    divisiId: filterDivisi(),
    batchId: filterBatch()
  }));
  const totalPages = () => {
    const total = usersData()?.total ?? 0;
    return Math.max(1, Math.ceil(total / itemsPerPage));
  };
  const paginatedUsers = () => {
    return usersData()?.items ?? [];
  };
  const creating = useSubmission(createUser);
  const updating = useSubmission(updateUser);
  const deleting = useSubmission(deleteUser);
  const resetting = useSubmission(adminResetPassword);
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
      setEditingUser(null);
    }
    prevUpdatingPending = pending;
  });
  let prevDeletingPending = false;
  createEffect(() => {
    const pending = !!deleting.pending;
    if (prevDeletingPending && !pending && !deleting.error) {
      setDeletingUser(null);
    }
    prevDeletingPending = pending;
  });
  let prevResettingPending = false;
  createEffect(() => {
    const pending = !!resetting.pending;
    if (prevResettingPending && !pending && !resetting.error) {
      setResettingUser(null);
    }
    prevResettingPending = pending;
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
  createEffect(() => {
    if (resetting.result) {
      if (resetting.result instanceof Error) showToast(resetting.result.message, "error");
      else showToast("Sandi pengguna berhasil direset!", "success");
    }
  });
  return ssr(_tmpl$6, ssrHydrationKey(), escape(createComponent(Show, {
    get when() {
      return showCreate();
    },
    get children() {
      return createComponent(Portal, {
        get children() {
          return ssr(_tmpl$2, ssrHydrationKey(), ssrAttribute("action", escape(createUser, true), false), ssrAttribute("type", showCreatePassword() ? "text" : "password", false), ssrAttribute("title", showCreatePassword() ? "Sembunyikan sandi" : "Tampilkan sandi", false), escape(createComponent(Show, {
            get when() {
              return showCreatePassword();
            },
            get fallback() {
              return ssr(_tmpl$7, ssrHydrationKey());
            },
            get children() {
              return ssr(_tmpl$, ssrHydrationKey());
            }
          })), escape(createComponent(For, {
            get each() {
              return divisiList();
            },
            children: (d) => ssr(_tmpl$8, ssrHydrationKey() + ssrAttribute("value", escape(d.id, true), false), escape(d.name))
          })), escape(createComponent(For, {
            get each() {
              return batchList();
            },
            children: (b) => ssr(_tmpl$8, ssrHydrationKey() + ssrAttribute("value", escape(b.id, true), false), escape(b.name))
          })), ssrAttribute("disabled", creating.pending, true), creating.pending ? "Menyimpan..." : "Simpan");
        }
      });
    }
  })), escape(createComponent(Show, {
    get when() {
      return showBulk();
    },
    get children() {
      return createComponent(Portal, {
        get children() {
          return ssr(_tmpl$3, ssrHydrationKey(), ssrAttribute("disabled", bulkLoading(), true), bulkLoading() ? "Mengimpor..." : "Impor", escape(createComponent(Show, {
            get when() {
              return bulkResult();
            },
            children: (res) => ssr(_tmpl$0, ssrHydrationKey(), escape(res().successCount), escape(res().total), escape(createComponent(Show, {
              get when() {
                return res().errors.length > 0;
              },
              get children() {
                return ssr(_tmpl$9, ssrHydrationKey(), escape(createComponent(For, {
                  get each() {
                    return res().errors;
                  },
                  children: (err) => ssr(_tmpl$1, ssrHydrationKey(), escape(err.row), escape(err.username), escape(err.error))
                })));
              }
            })))
          })));
        }
      });
    }
  })), ssrAttribute("value", escape(searchQuery(), true), false), ssrAttribute("value", escape(filterRole(), true), false), ssrAttribute("value", escape(filterStatus(), true), false), ssrAttribute("value", escape(filterDivisi(), true), false), escape(createComponent(For, {
    get each() {
      return divisiList();
    },
    children: (d) => ssr(_tmpl$8, ssrHydrationKey() + ssrAttribute("value", escape(d.id, true), false), escape(d.name))
  })), ssrAttribute("value", escape(filterBatch(), true), false), escape(createComponent(For, {
    get each() {
      return batchList();
    },
    children: (b) => ssr(_tmpl$8, ssrHydrationKey() + ssrAttribute("value", escape(b.id, true), false), escape(b.name))
  })), escape(createComponent(Show, {
    get when() {
      return editingUser();
    },
    children: (user) => createComponent(Portal, {
      get children() {
        return ssr(_tmpl$10, ssrHydrationKey(), ssrAttribute("action", escape(updateUser, true), false), ssrAttribute("value", escape(user().id, true), false), ssrAttribute("value", escape(user().fullName, true), false), ssrAttribute("value", escape(user().email, true), false), ssrAttribute("value", escape(user().phone ?? "", true), false), ssrAttribute("selected", user().role === "USER", true), ssrAttribute("selected", user().role === "ADMIN", true), escape(createComponent(For, {
          get each() {
            return divisiList();
          },
          children: (d) => ssr(_tmpl$11, ssrHydrationKey() + ssrAttribute("value", escape(d.id, true), false), ssrAttribute("selected", d.id === user().divisiId, true), escape(d.name))
        })), escape(createComponent(For, {
          get each() {
            return batchList();
          },
          children: (b) => ssr(_tmpl$11, ssrHydrationKey() + ssrAttribute("value", escape(b.id, true), false), ssrAttribute("selected", b.id === user().batchId, true), escape(b.name))
        })), ssrAttribute("selected", user().status === "AKTIF", true), ssrAttribute("selected", user().status === "ALUMNI", true), ssrAttribute("selected", user().status === "NONAKTIF", true), ssrAttribute("disabled", updating.pending, true), updating.pending ? "Menyimpan..." : "Simpan");
      }
    })
  })), escape(createComponent(Show, {
    get when() {
      return deletingUser();
    },
    children: (user) => createComponent(Portal, {
      get children() {
        return ssr(_tmpl$12, ssrHydrationKey(), ssrAttribute("action", escape(deleteUser, true), false), ssrAttribute("value", escape(user().id, true), false), escape(user().username), ssrAttribute("disabled", deleting.pending, true), deleting.pending ? "Menghapus..." : "Hapus");
      }
    })
  })), escape(createComponent(Show, {
    get when() {
      return resettingUser();
    },
    children: (user) => createComponent(Portal, {
      get children() {
        return ssr(_tmpl$13, ssrHydrationKey(), ssrAttribute("action", escape(adminResetPassword, true), false), ssrAttribute("value", escape(user().id, true), false), escape(user().username), ssrAttribute("type", showResetPassword() ? "text" : "password", false), ssrAttribute("title", showResetPassword() ? "Sembunyikan sandi" : "Tampilkan sandi", false), escape(createComponent(Show, {
          get when() {
            return showResetPassword();
          },
          get fallback() {
            return ssr(_tmpl$7, ssrHydrationKey());
          },
          get children() {
            return ssr(_tmpl$, ssrHydrationKey());
          }
        })), ssrAttribute("disabled", resetting.pending, true), resetting.pending ? "Memproses..." : "Reset Sandi");
      }
    })
  })), escape(createComponent(Suspense, {
    get fallback() {
      return ssr(_tmpl$14, ssrHydrationKey(), escape(createComponent(For, {
        each: [1, 2, 3, 4, 5],
        children: () => ssr(_tmpl$15, ssrHydrationKey())
      })));
    },
    get children() {
      return [ssr(_tmpl$4, ssrHydrationKey(), escape(createComponent(Show, {
        get when() {
          return paginatedUsers().length > 0;
        },
        get fallback() {
          return ssr(_tmpl$16, ssrHydrationKey());
        },
        get children() {
          return createComponent(For, {
            get each() {
              return paginatedUsers();
            },
            children: (u, i) => ssr(_tmpl$17, ssrHydrationKey(), (escape(currentPage()) - 1) * escape(itemsPerPage) + escape(i()) + 1, escape(u.username), escape(u.fullName), escape(u.email), escape(u.divisi?.name ?? "-"), escape(u.batch?.name ?? "-"), `badge ${u.role === "ADMIN" ? "badge-izin" : "badge-approved"}`, escape(u.role), `badge ${u.status === "AKTIF" ? "badge-approved" : u.status === "ALUMNI" ? "badge-izin" : "badge-rejected"}`, u.status === "AKTIF" ? "Aktif" : u.status === "ALUMNI" ? "Alumni" : "Nonaktif")
          });
        }
      }))), createComponent(Show, {
        get when() {
          return (usersData()?.total ?? 0) > 0;
        },
        get children() {
          return ssr(_tmpl$5, ssrHydrationKey(), escape(paginatedUsers().length), escape(usersData()?.total ?? 0), ssrAttribute("disabled", currentPage() === 1, true), escape(createComponent(For, {
            get each() {
              return getPageNumbers(currentPage(), totalPages());
            },
            children: (page) => createComponent(Show, {
              when: page !== "...",
              get fallback() {
                return ssr(_tmpl$19, ssrHydrationKey());
              },
              get children() {
                return ssr(_tmpl$18, ssrHydrationKey(), `btn-pagination ${currentPage() === page ? "active" : ""}`, escape(page));
              }
            })
          })), ssrAttribute("disabled", currentPage() === totalPages(), true));
        }
      })];
    }
  })));
}
export {
  AdminUsers as default,
  id$$
};
//# sourceMappingURL=users-BJyhMXX6.js.map
