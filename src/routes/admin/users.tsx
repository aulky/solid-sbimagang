import {
  createAsync,
  useSubmission,
  type RouteDefinition,
} from "@solidjs/router";
import { Show, For, createSignal, createEffect } from "solid-js";
import { Portal } from "solid-js/web";
import {
  getAdminUsers,
  getAllDivisi,
  createUser,
  updateUser,
  deleteUser,
} from "~/lib";

export const route = {
  preload() {
    getAdminUsers();
    getAllDivisi();
  },
} satisfies RouteDefinition;

export default function AdminUsers() {
  const users = createAsync(() => getAdminUsers(), { deferStream: true });
  const divisiList = createAsync(() => getAllDivisi(), { deferStream: true });

  const [showCreate, setShowCreate] = createSignal(false);
  const [editingUser, setEditingUser] = createSignal<any | null>(null);
  const [deletingUser, setDeletingUser] = createSignal<{
    id: string;
    username: string;
  } | null>(null);
  let createFormRef: HTMLFormElement | undefined;

  // Filter signals
  const [searchQuery, setSearchQuery] = createSignal("");
  const [filterRole, setFilterRole] = createSignal("");
  const [filterStatus, setFilterStatus] = createSignal("");
  const [filterDivisi, setFilterDivisi] = createSignal("");

  // Pagination setup
  const [currentPage, setCurrentPage] = createSignal(1);
  const itemsPerPage = 10;

  // Filter logic
  const filteredUsers = () => {
    const list = users();
    if (!list) return [];
    return list.filter((u) => {
      if (filterRole() && u.role !== filterRole()) return false;
      if (filterStatus() && String(u.isActive) !== filterStatus()) return false;
      if (filterDivisi() && u.divisiId !== filterDivisi()) return false;

      const q = searchQuery().toLowerCase().trim();
      if (q) {
        const nameMatch = u.fullName.toLowerCase().includes(q);
        const usernameMatch = u.username.toLowerCase().includes(q);
        if (!nameMatch && !usernameMatch) return false;
      }
      return true;
    });
  };

  const totalPages = () => {
    const list = filteredUsers();
    return Math.max(1, Math.ceil(list.length / itemsPerPage));
  };

  const paginatedUsers = () => {
    const list = filteredUsers();
    const start = (currentPage() - 1) * itemsPerPage;
    return list.slice(start, start + itemsPerPage);
  };

  const creating = useSubmission(createUser);
  const updating = useSubmission(updateUser);
  const deleting = useSubmission(deleteUser);

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

  return (
    <main class="p-4">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4); text-align: left;">
        <h1 class="page-title" style="margin-bottom: 0;">
          Kelola Pengguna
        </h1>
        <button
          class="btn-primary"
          style="width: auto; padding: 0 var(--space-4); height: 40px;"
          onClick={() => setShowCreate(true)}
        >
          Tambah Pengguna
        </button>
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
                  <input
                    name="password"
                    type="password"
                    placeholder="Masukkan password"
                    required
                    minLength={6}
                  />
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
                <Show when={creating.result instanceof Error}>
                  <div class="alert-error">
                    {(creating.result as Error).message}
                  </div>
                </Show>
              </form>
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
            onInput={(e) => {
              setSearchQuery(e.currentTarget.value);
              setCurrentPage(1);
            }}
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
            <option value="DITANGGUHKAN">Ditangguhkan</option>
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
        <button
          onClick={() => {
            setSearchQuery("");
            setFilterRole("");
            setFilterStatus("");
            setFilterDivisi("");
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
                    <label>Status</label>
                    <select name="status">
                      <option value="AKTIF" selected={user().status === "AKTIF"}>
                        Aktif
                      </option>
                      <option value="DITANGGUHKAN" selected={user().status === "DITANGGUHKAN"}>
                        Ditangguhkan
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
                  <Show when={(updating.result as any) instanceof Error}>
                    <div class="alert-error">
                      {((updating.result as any) as Error).message}
                    </div>
                  </Show>
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
                  <Show when={(deleting.result as any) instanceof Error}>
                    <div class="alert-error">
                      {(deleting.result as any as Error).message}
                    </div>
                  </Show>
                </form>
              </div>
            </div>
          </Portal>
        )}
      </Show>

      <div style="overflow-x: auto;">
        <table class="data-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Username</th>
              <th>Nama</th>
              <th>Email</th>
              <th>Divisi</th>
              <th>Role</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <Show
              when={users() && users()!.length > 0}
              fallback={
                <tr>
                  <td
                    colspan="8"
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
                          u.status === "AKTIF"
                            ? "badge-approved"
                            : u.status === "DITANGGUHKAN"
                              ? "badge-pending"
                              : "badge-rejected"
                        }`}
                      >
                        {u.status === "AKTIF"
                          ? "Aktif"
                          : u.status === "DITANGGUHKAN"
                            ? "Ditangguhkan"
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
      <Show when={users() && users()!.length > 0}>
        <div class="pagination-container">
          <div class="pagination-info">
            Menampilkan {paginatedUsers().length} dari {users()!.length}{" "}
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
            <For each={Array.from({ length: totalPages() }, (_, i) => i + 1)}>
              {(page) => (
                <button
                  class="btn-pagination"
                  classList={{ active: currentPage() === page }}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
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
    </main>
  );
}
