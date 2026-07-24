import {
  createAsync,
  useSubmission,
  useSearchParams,
  type RouteDefinition,
} from "@solidjs/router";
import { Show, For, Suspense, createSignal, createEffect } from "solid-js";
import { Portal } from "solid-js/web";
import {
  getAdminUsers,
  getAllDivisi,
  getAllBatches,
  createUser,
  updateUser,
  deleteUser,
  bulkCreateUsers,
  getPageNumbers,
  adminResetPassword,
} from "~/lib";
import { showToast } from "~/lib/toast";

export const route = {
  preload() {
    getAdminUsers({ page: 1, limit: 10, search: "", role: "", status: "", divisiId: "" });
    getAllDivisi();
    getAllBatches();
  },
} satisfies RouteDefinition;

export default function AdminUsers() {
  const divisiList = createAsync(() => getAllDivisi(), { deferStream: true });
  const batchList = createAsync(() => getAllBatches(), { deferStream: true });
  const [searchParams, setSearchParams] = useSearchParams();

  createEffect(() => {
    if (searchParams.success === "create") {
      showToast("Pengguna berhasil ditambahkan!", "success");
      setSearchParams({ success: null });
    } else if (searchParams.success === "update") {
      showToast("Pengguna berhasil diperbarui!", "success");
      setSearchParams({ success: null });
    } else if (searchParams.success === "delete") {
      showToast("Pengguna berhasil dihapus!", "success");
      setSearchParams({ success: null });
    }
  });

  const [showCreate, setShowCreate] = createSignal(false);
  const [editingUser, setEditingUser] = createSignal<any | null>(null);
  const [deletingUser, setDeletingUser] = createSignal<{
    id: string;
    username: string;
  } | null>(null);
  const [showCreatePassword, setShowCreatePassword] = createSignal(false);
  let createFormRef: HTMLFormElement | undefined;

  // Bulk import signals
  const [showBulk, setShowBulk] = createSignal(false);
  const [bulkResult, setBulkResult] = createSignal<{
    total: number; successCount: number;
    errors: Array<{ row: number; username: string; error: string }>;
  } | null>(null);
  const [bulkLoading, setBulkLoading] = createSignal(false);

  // Filter signals
  const [searchQuery, setSearchQuery] = createSignal("");
  const [debouncedSearch, setDebouncedSearch] = createSignal("");
  const [filterRole, setFilterRole] = createSignal("");
  const [filterStatus, setFilterStatus] = createSignal("");
  const [filterDivisi, setFilterDivisi] = createSignal("");
  const [filterBatch, setFilterBatch] = createSignal("");

  // Reset password signals
  const [resettingUser, setResettingUser] = createSignal<any | null>(null);
  const [showResetPassword, setShowResetPassword] = createSignal(false);

  // Pagination setup
  const [currentPage, setCurrentPage] = createSignal(1);
  const itemsPerPage = 10;

  let debounceTimer: any;
  const handleSearchInput = (val: string) => {
    setSearchQuery(val);
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      setDebouncedSearch(val);
      setCurrentPage(1);
    }, 400);
  };

  const usersData = createAsync(() =>
    getAdminUsers({
      page: currentPage(),
      limit: itemsPerPage,
      search: debouncedSearch(),
      role: filterRole(),
      status: filterStatus(),
      divisiId: filterDivisi(),
      batchId: filterBatch(),
    })
  );

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

  // Close modal on successful user creation and reset form
  let prevCreatingPending = false;
  createEffect(() => {
    const pending = !!creating.pending;
    if (prevCreatingPending && !pending && !creating.error) {
      createFormRef?.reset();
      setShowCreate(false);
    }
    prevCreatingPending = pending;
  });

  // Close modal on successful user update
  let prevUpdatingPending = false;
  createEffect(() => {
    const pending = !!updating.pending;
    if (prevUpdatingPending && !pending && !updating.error) {
      setEditingUser(null);
    }
    prevUpdatingPending = pending;
  });

  // Close modal on successful user deletion
  let prevDeletingPending = false;
  createEffect(() => {
    const pending = !!deleting.pending;
    if (prevDeletingPending && !pending && !deleting.error) {
      setDeletingUser(null);
    }
    prevDeletingPending = pending;
  });

  // Close modal on successful reset password
  let prevResettingPending = false;
  createEffect(() => {
    const pending = !!resetting.pending;
    if (prevResettingPending && !pending && !resetting.error) {
      setResettingUser(null);
    }
    prevResettingPending = pending;
  });

  // Toast notifications (success & error)
  createEffect(() => { if (creating.result instanceof Error) showToast(creating.result.message, "error"); });
  createEffect(() => { if ((updating.result as any) instanceof Error) showToast(((updating.result as any) as Error).message, "error"); });
  createEffect(() => { if ((deleting.result as any) instanceof Error) showToast(((deleting.result as any) as Error).message, "error"); });
  createEffect(() => {
    if (resetting.result) {
      if ((resetting.result as any) instanceof Error) showToast(((resetting.result as any) as Error).message, "error");
      else showToast("Sandi pengguna berhasil direset!", "success");
    }
  });

  return (
    <main class="p-4">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4); text-align: left;">
        <h1 class="page-title" style="margin-bottom: 0;">
          Kelola Pengguna
        </h1>
        <div style="display: flex; gap: var(--space-2);">
          <button
            class="btn-ghost"
            style="width: auto; padding: 0 var(--space-4); height: 40px;"
            onClick={() => { setBulkResult(null); setShowBulk(true); }}
          >
            Impor Massal
          </button>
          <button
            class="btn-primary"
            style="width: auto; padding: 0 var(--space-4); height: 40px;"
            onClick={() => setShowCreate(true)}
          >
            Tambah Pengguna
          </button>
        </div>
      </div>

      <Show when={showCreate()}>
        <Portal>
          <div class="modal-overlay" onClick={() => setShowCreate(false)}>
            <div
              class="modal modal-animate"
              onClick={(e) => e.stopPropagation()}
            >
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4); border-bottom: 1px solid var(--color-border); padding-bottom: var(--space-2);">
                <h3 style="margin: 0; font-family: var(--font-headline); font-weight: 700;">
                  Tambah Pengguna Baru
                </h3>
                <button
                  class="theme-toggle"
                  style="font-size: 24px; padding: 0; cursor: pointer;"
                  onClick={() => setShowCreate(false)}
                >
                  ×
                </button>
              </div>
              <form ref={createFormRef} action={createUser} method="post">
                <div class="form-group">
                  <label>Username</label>
                  <input
                    name="username"
                    placeholder="Masukkan username"
                    required
                    minLength={3}
                  />
                </div>
                <div class="form-group">
                  <label>Password</label>
                  <div class="password-input-container">
                    <input
                      name="password"
                      type={showCreatePassword() ? "text" : "password"}
                      placeholder="Masukkan password"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      class="password-toggle-btn"
                      onClick={() => setShowCreatePassword(!showCreatePassword())}
                      title={showCreatePassword() ? "Sembunyikan sandi" : "Tampilkan sandi"}
                    >
                      <Show
                        when={showCreatePassword()}
                        fallback={
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        }
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      </Show>
                    </button>
                  </div>
                </div>
                <div class="form-group">
                  <label>Nama Lengkap</label>
                  <input
                    name="fullName"
                    placeholder="Masukkan nama lengkap"
                    required
                  />
                </div>
                <div class="form-group">
                  <label>Email</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="Masukkan email"
                    required
                  />
                </div>
                <div class="form-group">
                  <label>Telepon</label>
                  <input name="phone" placeholder="Masukkan nomor telepon" />
                </div>
                <div class="form-group">
                  <label>Role</label>
                  <select name="role">
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Divisi</label>
                  <select name="divisiId">
                    <option value="">-- Pilih Divisi --</option>
                    <For each={divisiList()}>
                      {(d) => <option value={d.id}>{d.name}</option>}
                    </For>
                  </select>
                </div>
                <div class="form-group">
                  <label>Batch Magang</label>
                  <select name="batchId">
                    <option value="">-- Pilih Batch --</option>
                    <For each={batchList()}>
                      {(b) => <option value={b.id}>{b.name}</option>}
                    </For>
                  </select>
                </div>
                <div style="display: flex; gap: var(--space-2); margin-top: var(--space-4);">
                  <button
                    class="btn-primary"
                    type="submit"
                    disabled={creating.pending}
                  >
                    {creating.pending ? "Menyimpan..." : "Simpan"}
                  </button>
                  <button
                    class="btn-ghost"
                    type="button"
                    onClick={() => setShowCreate(false)}
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Portal>
      </Show>

      <Show when={showBulk()}>
        <Portal>
          <div class="modal-overlay" onClick={() => setShowBulk(false)}>
            <div
              class="modal modal-animate"
              onClick={(e) => e.stopPropagation()}
              style="max-width: 600px;"
            >
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4); border-bottom: 1px solid var(--color-border); padding-bottom: var(--space-2);">
                <h3 style="margin: 0; font-family: var(--font-headline); font-weight: 700;">
                  Impor Pengguna Massal
                </h3>
                <button
                  class="theme-toggle"
                  style="font-size: 24px; padding: 0; cursor: pointer;"
                  onClick={() => setShowBulk(false)}
                >
                  ×
                </button>
              </div>

              <div style="margin-bottom: var(--space-4);">
                <p style="margin: 0 0 var(--space-2); font-size: 14px; color: var(--color-text-secondary);">
                  1. Unduh template Excel, isi data pengguna, lalu upload kembali.
                </p>
                <a
                  href="/api/users/template"
                  download=""
                  class="btn-ghost"
                  style="display: inline-block; text-decoration: none; text-align: center; width: auto; padding: 0 var(--space-4); height: 36px; line-height: 36px;"
                >
                  Unduh Template
                </a>
              </div>

              <form onSubmit={async (e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                setBulkLoading(true);
                setBulkResult(null);
                try {
                  const result = await bulkCreateUsers(fd);
                  if (result instanceof Error) {
                    setBulkResult({ total: 0, successCount: 0, errors: [{ row: 0, username: "-", error: result.message }] });
                  } else {
                    setBulkResult(result as any);
                  }
                } catch (err: any) {
                  setBulkResult({ total: 0, successCount: 0, errors: [{ row: 0, username: "-", error: err.message }] });
                }
                setBulkLoading(false);
              }}>
                <div class="form-group">
                  <label>2. Upload file Excel (.xlsx)</label>
                  <input name="file" type="file" accept=".xlsx" required />
                </div>
                <button
                  class="btn-primary"
                  type="submit"
                  disabled={bulkLoading()}
                  style="width: auto; padding: 0 var(--space-4);"
                >
                  {bulkLoading() ? "Mengimpor..." : "Impor"}
                </button>
              </form>

              <Show when={bulkResult()}>
                {(res) => (
                  <div style="margin-top: var(--space-4); border-top: 1px solid var(--color-border); padding-top: var(--space-4);">
                    <p style="margin: 0 0 var(--space-2); font-size: 14px;">
                      <strong>Hasil:</strong> {res().successCount}/{res().total} berhasil ditambahkan.
                    </p>
                    <Show when={res().errors.length > 0}>
                      <div style="max-height: 200px; overflow-y: auto;">
                        <table class="data-table" style="font-size: 12px;">
                          <thead><tr><th>Baris</th><th>Username</th><th>Error</th></tr></thead>
                          <tbody>
                            <For each={res().errors}>
                              {(err) => (
                                <tr>
                                  <td>{err.row}</td>
                                  <td>{err.username}</td>
                                  <td style="color: var(--color-danger);">{err.error}</td>
                                </tr>
                              )}
                            </For>
                          </tbody>
                        </table>
                      </div>
                    </Show>
                  </div>
                )}
              </Show>
            </div>
          </div>
        </Portal>
      </Show>

      <div class="filter-card" style="margin-bottom: var(--space-4);">
        <div class="form-group">
          <label>Cari Nama/Username</label>
          <input
            type="text"
            placeholder="Cari nama/username..."
            value={searchQuery()}
            onInput={(e) => handleSearchInput(e.currentTarget.value)}
          />
        </div>
        <div class="form-group">
          <label>Pilih Role</label>
          <select
            value={filterRole()}
            onChange={(e) => {
              setFilterRole(e.currentTarget.value);
              setCurrentPage(1);
            }}
          >
            <option value="">Semua Role</option>
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>
        <div class="form-group">
          <label>Pilih Status</label>
          <select
            value={filterStatus()}
            onChange={(e) => {
              setFilterStatus(e.currentTarget.value);
              setCurrentPage(1);
            }}
          >
            <option value="">Semua Status</option>
            <option value="AKTIF">Aktif</option>
            <option value="ALUMNI">Alumni</option>
            <option value="NONAKTIF">Nonaktif</option>
          </select>
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
              {(d) => <option value={d.id}>{d.name}</option>}
            </For>
          </select>
        </div>
        <div class="form-group">
          <label>Pilih Batch</label>
          <select
            value={filterBatch()}
            onChange={(e) => {
              setFilterBatch(e.currentTarget.value);
              setCurrentPage(1);
            }}
          >
            <option value="">Semua Batch</option>
            <For each={batchList()}>
              {(b) => <option value={b.id}>{b.name}</option>}
            </For>
          </select>
        </div>
        <button
          onClick={() => {
            setSearchQuery("");
            setDebouncedSearch("");
            setFilterRole("");
            setFilterStatus("");
            setFilterDivisi("");
            setFilterBatch("");
            setCurrentPage(1);
          }}
          class="btn-ghost"
          style="width: auto;"
        >
          Reset Filter
        </button>
      </div>

      <Show when={editingUser()}>
        {(user) => (
          <Portal>
            <div class="modal-overlay" onClick={() => setEditingUser(null)}>
              <div
                class="modal modal-animate"
                onClick={(e) => e.stopPropagation()}
              >
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4); border-bottom: 1px solid var(--color-border); padding-bottom: var(--space-2);">
                  <h3 style="margin: 0; font-family: var(--font-headline); font-weight: 700;">
                    Edit Pengguna
                  </h3>
                  <button
                    class="theme-toggle"
                    style="font-size: 24px; padding: 0; cursor: pointer;"
                    onClick={() => setEditingUser(null)}
                  >
                    ×
                  </button>
                </div>
                <form action={updateUser} method="post">
                  <input type="hidden" name="id" value={user().id} />
                  <div class="form-group">
                    <label>Nama Lengkap</label>
                    <input name="fullName" value={user().fullName} required />
                  </div>
                  <div class="form-group">
                    <label>Email</label>
                    <input
                      name="email"
                      type="email"
                      value={user().email}
                      required
                    />
                  </div>
                  <div class="form-group">
                    <label>Telepon</label>
                    <input name="phone" value={user().phone ?? ""} />
                  </div>
                  <div class="form-group">
                    <label>Role</label>
                    <select name="role">
                      <option value="USER" selected={user().role === "USER"}>
                        USER
                      </option>
                      <option value="ADMIN" selected={user().role === "ADMIN"}>
                        ADMIN
                      </option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label>Divisi</label>
                    <select name="divisiId">
                      <option value="">-- Pilih Divisi --</option>
                      <For each={divisiList()}>
                        {(d) => (
                          <option
                            value={d.id}
                            selected={d.id === user().divisiId}
                          >
                            {d.name}
                          </option>
                        )}
                      </For>
                    </select>
                  </div>
                  <div class="form-group">
                    <label>Batch Magang</label>
                    <select name="batchId">
                      <option value="">-- Pilih Batch --</option>
                      <For each={batchList()}>
                        {(b) => (
                          <option
                            value={b.id}
                            selected={b.id === user().batchId}
                          >
                            {b.name}
                          </option>
                        )}
                      </For>
                    </select>
                  </div>
                  <div class="form-group">
                    <label>Status</label>
                    <select name="status">
                      <option value="AKTIF" selected={user().status === "AKTIF"}>
                        Aktif
                      </option>
                      <option value="ALUMNI" selected={user().status === "ALUMNI"}>
                        Alumni
                      </option>
                      <option value="NONAKTIF" selected={user().status === "NONAKTIF"}>
                        Nonaktif
                      </option>
                    </select>
                  </div>
                  <div style="display: flex; gap: var(--space-2); margin-top: var(--space-4);">
                    <button
                      class="btn-primary"
                      type="submit"
                      disabled={updating.pending}
                    >
                      {updating.pending ? "Menyimpan..." : "Simpan"}
                    </button>
                    <button
                      class="btn-ghost"
                      type="button"
                      onClick={() => setEditingUser(null)}
                    >
                      Batal
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </Portal>
        )}
      </Show>

      <Show when={deletingUser()}>
        {(user) => (
          <Portal>
            <div class="modal-overlay" onClick={() => setDeletingUser(null)}>
              <div
                class="modal modal-animate"
                onClick={(e) => e.stopPropagation()}
                style="max-width: 400px;"
              >
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4); border-bottom: 1px solid var(--color-border); padding-bottom: var(--space-2);">
                  <h3 style="margin: 0; font-family: var(--font-headline); font-weight: 700;">
                    Konfirmasi Hapus
                  </h3>
                  <button
                    class="theme-toggle"
                    style="font-size: 24px; padding: 0; cursor: pointer;"
                    onClick={() => setDeletingUser(null)}
                  >
                    ×
                  </button>
                </div>
                <form action={deleteUser} method="post">
                  <input type="hidden" name="id" value={user().id} />
                  <p style="margin-top: 0; margin-bottom: var(--space-4); font-size: 14px; color: var(--color-text); line-height: 1.5; text-align: left;">
                    Apakah Anda yakin ingin menghapus pengguna{" "}
                    <strong>{user().username}</strong>?
                  </p>
                  <div style="display: flex; gap: var(--space-2);">
                    <button
                      class="btn-danger"
                      type="submit"
                      disabled={deleting.pending}
                      style="width: auto; padding: 0 var(--space-4);"
                    >
                      {deleting.pending ? "Menghapus..." : "Hapus"}
                    </button>
                    <button
                      class="btn-ghost"
                      type="button"
                      onClick={() => setDeletingUser(null)}
                      style="width: auto; padding: 0 var(--space-4);"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </Portal>
        )}
      </Show>

      <Show when={resettingUser()}>
        {(user) => (
          <Portal>
            <div class="modal-overlay" onClick={() => setResettingUser(null)}>
              <div
                class="modal modal-animate"
                onClick={(e) => e.stopPropagation()}
                style="max-width: 400px;"
              >
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4); border-bottom: 1px solid var(--color-border); padding-bottom: var(--space-2);">
                  <h3 style="margin: 0; font-family: var(--font-headline); font-weight: 700;">
                    Reset Sandi Pengguna
                  </h3>
                  <button
                    class="theme-toggle"
                    style="font-size: 24px; padding: 0; cursor: pointer;"
                    onClick={() => setResettingUser(null)}
                  >
                    ×
                  </button>
                </div>
                <form action={adminResetPassword} method="post">
                  <input type="hidden" name="id" value={user().id} />
                  <p style="margin-top: 0; margin-bottom: var(--space-3); font-size: 14px; color: var(--color-text); text-align: left;">
                    Reset sandi untuk <strong>{user().username}</strong>.
                  </p>
                  <div class="form-group">
                    <label>Sandi Baru</label>
                    <div class="password-input-container">
                      <input
                        name="newPassword"
                        type={showResetPassword() ? "text" : "password"}
                        placeholder="Masukkan sandi baru (min. 6 karakter)"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        class="password-toggle-btn"
                        onClick={() => setShowResetPassword(!showResetPassword())}
                        title={showResetPassword() ? "Sembunyikan sandi" : "Tampilkan sandi"}
                      >
                        <Show
                          when={showResetPassword()}
                          fallback={
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          }
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </svg>
                        </Show>
                      </button>
                    </div>
                  </div>
                  <div style="display: flex; gap: var(--space-2); margin-top: var(--space-4);">
                    <button
                      class="btn-primary"
                      type="submit"
                      disabled={resetting.pending}
                    >
                      {resetting.pending ? "Memproses..." : "Reset Sandi"}
                    </button>
                    <button
                      class="btn-ghost"
                      type="button"
                      onClick={() => setResettingUser(null)}
                    >
                      Batal
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </Portal>
        )}
      </Show>

      <Suspense fallback={
        <div style="overflow-x: auto; opacity: 0.6; pointer-events: none;">
          <table class="data-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Username</th>
                <th>Nama</th>
                <th>Email</th>
                <th>Divisi</th>
                <th>Batch</th>
                <th>Role</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <For each={[1, 2, 3, 4, 5]}>
                {() => (
                  <tr>
                    <td><div class="skeleton" style="width: 24px; height: 16px;"></div></td>
                    <td><div class="skeleton" style="width: 90px; height: 16px;"></div></td>
                    <td><div class="skeleton" style="width: 110px; height: 16px;"></div></td>
                    <td><div class="skeleton" style="width: 140px; height: 16px;"></div></td>
                    <td><div class="skeleton" style="width: 80px; height: 16px;"></div></td>
                    <td><div class="skeleton" style="width: 80px; height: 16px;"></div></td>
                    <td><div class="skeleton" style="width: 50px; height: 20px; border-radius: 4px;"></div></td>
                    <td><div class="skeleton" style="width: 50px; height: 20px; border-radius: 4px;"></div></td>
                    <td><div class="skeleton" style="width: 100px; height: 24px;"></div></td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
      }>
        <div style="overflow-x: auto;">
          <table class="data-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Username</th>
                <th>Nama</th>
                <th>Email</th>
                <th>Divisi</th>
                <th>Batch</th>
                <th>Role</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <Show
                when={paginatedUsers().length > 0}
                fallback={
                  <tr>
                    <td
                      colspan="9"
                      style="text-align: center; color: var(--color-text-secondary); padding: var(--space-5);"
                    >
                      Belum ada data pengguna.
                    </td>
                  </tr>
                }
              >
                <For each={paginatedUsers()}>
                  {(u, i) => (
                    <tr>
                      <td style="font-family: var(--font-mono); font-size: 13px;">
                        {(currentPage() - 1) * itemsPerPage + i() + 1}
                      </td>
                      <td>{u.username}</td>
                      <td>{u.fullName}</td>
                      <td>{u.email}</td>
                      <td>{u.divisi?.name ?? "-"}</td>
                      <td>{u.batch?.name ?? "-"}</td>
                      <td>
                        <span
                          class={`badge ${u.role === "ADMIN" ? "badge-izin" : "badge-approved"}`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <span
                          class={`badge ${
                            (u as any).status === "AKTIF"
                              ? "badge-approved"
                              : (u as any).status === "ALUMNI"
                                ? "badge-izin"
                                : "badge-rejected"
                          }`}
                        >
                          {(u as any).status === "AKTIF"
                            ? "Aktif"
                            : (u as any).status === "ALUMNI"
                              ? "Alumni"
                              : "Nonaktif"}
                        </span>
                      </td>
                      <td>
                        <button
                          class="btn-secondary"
                          style="display: inline-flex; width: auto; height: 32px; padding: 0 12px; font-size: 13px;"
                          onClick={() => setEditingUser(u)}
                        >
                          Edit
                        </button>{" "}
                        <button
                          class="btn-ghost"
                          style="display: inline-flex; width: auto; height: 32px; padding: 0 12px; font-size: 13px; color: var(--color-info);"
                          onClick={() => setResettingUser({ id: u.id, username: u.username })}
                        >
                          Reset
                        </button>{" "}
                        <button
                          class="btn-danger"
                          style="display: inline-flex; width: auto; height: 32px; padding: 0 12px; font-size: 13px;"
                          onClick={() =>
                            setDeletingUser({ id: u.id, username: u.username })
                          }
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  )}
                </For>
              </Show>
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <Show when={(usersData()?.total ?? 0) > 0}>
          <div class="pagination-container">
            <div class="pagination-info">
              Menampilkan {paginatedUsers().length} dari {usersData()?.total ?? 0}{" "}
              pengguna
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
      </Suspense>
    </main>
  );
}
