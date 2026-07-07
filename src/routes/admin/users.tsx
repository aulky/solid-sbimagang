import { createAsync, useSubmission, type RouteDefinition } from "@solidjs/router";
import { Show, For, createSignal, createEffect } from "solid-js";
import {
  getAdminUsers,
  getAllDivisi,
  createUser,
  updateUser,
  deleteUser
} from "~/lib";

export const route = {
  preload() {
    getAdminUsers();
    getAllDivisi();
  }
} satisfies RouteDefinition;

export default function AdminUsers() {
  const users = createAsync(() => getAdminUsers(), { deferStream: true });
  const divisiList = createAsync(() => getAllDivisi(), { deferStream: true });

  const [showCreate, setShowCreate] = createSignal(false);
  const [editingId, setEditingId] = createSignal<string | null>(null);

  const creating = useSubmission(createUser);
  const updating = useSubmission(updateUser);
  const deleting = useSubmission(deleteUser);

  // Close modal on successful user creation
  createEffect(() => {
    if (creating.result && !(creating.result instanceof Error)) {
      setShowCreate(false);
    }
  });

  return (
    <main class="p-4">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4);">
        <h1 class="page-title" style="margin-bottom: 0;">Kelola Pengguna</h1>
        <button class="btn-primary" style="width: auto; padding: 0 var(--space-4); height: 40px;" onClick={() => setShowCreate(true)}>
          Tambah Pengguna
        </button>
      </div>

      <Show when={showCreate()}>
        <div class="modal-overlay" onClick={() => setShowCreate(false)}>
          <div class="modal modal-animate" onClick={(e) => e.stopPropagation()}>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4); border-bottom: 1px solid var(--color-border); padding-bottom: var(--space-2);">
              <h3 style="margin: 0; font-family: var(--font-headline); font-weight: 700;">Tambah Pengguna Baru</h3>
              <button class="theme-toggle" style="font-size: 24px; padding: 0; cursor: pointer;" onClick={() => setShowCreate(false)}>×</button>
            </div>
            <form action={createUser} method="post">
              <div class="form-group">
                <label>Username</label>
                <input name="username" placeholder="Masukkan username" required minLength={3} />
              </div>
              <div class="form-group">
                <label>Password</label>
                <input name="password" type="password" placeholder="Masukkan password" required minLength={6} />
              </div>
              <div class="form-group">
                <label>Nama Lengkap</label>
                <input name="fullName" placeholder="Masukkan nama lengkap" required />
              </div>
              <div class="form-group">
                <label>Email</label>
                <input name="email" type="email" placeholder="Masukkan email" required />
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
                <button class="btn-primary" type="submit" disabled={creating.pending}>
                  {creating.pending ? "Menyimpan..." : "Simpan"}
                </button>
                <button class="btn-ghost" type="button" onClick={() => setShowCreate(false)}>
                  Batal
                </button>
              </div>
              <Show when={creating.result instanceof Error}>
                <div class="alert-error">{(creating.result as Error).message}</div>
              </Show>
            </form>
          </div>
        </div>
      </Show>

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
          <For each={users()}>
            {(u, i) => (
              <Show
                when={editingId() === u.id}
                fallback={
                  <tr>
                    <td>{i() + 1}</td>
                    <td>{u.username}</td>
                    <td>{u.fullName}</td>
                    <td>{u.email}</td>
                    <td>{u.divisi?.name ?? "-"}</td>
                    <td>
                      <span class={`badge ${u.role === 'ADMIN' ? 'badge-izin' : 'badge-approved'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <span class={`badge ${u.isActive ? 'badge-approved' : 'badge-rejected'}`}>
                        {u.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td>
                      <button class="btn-secondary" style="display: inline-flex; width: auto; height: 32px; padding: 0 12px; font-size: 13px;" onClick={() => setEditingId(u.id)}>Edit</button>{" "}
                      <form action={deleteUser} method="post" style={{ display: "inline" }}
                        onSubmit={(e) => { if (!confirm("Hapus pengguna " + u.username + "?")) e.preventDefault(); }}>
                        <input type="hidden" name="id" value={u.id} />
                        <button class="btn-danger" style="display: inline-flex; width: auto; height: 32px; padding: 0 12px; font-size: 13px;" type="submit" disabled={deleting.pending}>Hapus</button>
                      </form>
                    </td>
                  </tr>
                }
              >
                <tr>
                  <td>{i() + 1}</td>
                  <td colspan="7">
                    <div class="form-card" style="max-width: 100%;">
                      <h4 style="margin-top: 0; font-family: var(--font-headline); font-weight: 700;">Edit Pengguna: {u.username}</h4>
                      <form action={updateUser} method="post">
                        <input type="hidden" name="id" value={u.id} />
                        <div class="form-group">
                          <label>Nama Lengkap</label>
                          <input name="fullName" value={u.fullName} required />
                        </div>
                        <div class="form-group">
                          <label>Email</label>
                          <input name="email" type="email" value={u.email} required />
                        </div>
                        <div class="form-group">
                          <label>Telepon</label>
                          <input name="phone" value={u.phone ?? ""} />
                        </div>
                        <div class="form-group">
                          <label>Role</label>
                          <select name="role">
                            <option value="USER" selected={u.role === "USER"}>USER</option>
                            <option value="ADMIN" selected={u.role === "ADMIN"}>ADMIN</option>
                          </select>
                        </div>
                        <div class="form-group">
                          <label>Divisi</label>
                          <select name="divisiId">
                            <option value="">-- Pilih Divisi --</option>
                            <For each={divisiList()}>
                              {(d) => <option value={d.id} selected={d.id === u.divisiId}>{d.name}</option>}
                            </For>
                          </select>
                        </div>
                        <div class="form-group">
                          <label>Status</label>
                          <select name="isActive">
                            <option value="true" selected={u.isActive}>Aktif</option>
                            <option value="false" selected={!u.isActive}>Nonaktif</option>
                          </select>
                        </div>
                        <div style="display: flex; gap: var(--space-2);">
                          <button class="btn-primary" style="width: auto; padding: 0 var(--space-4);" type="submit" disabled={updating.pending}>
                            {updating.pending ? "Menyimpan..." : "Simpan"}
                          </button>
                          <button class="btn-ghost" style="width: auto; padding: 0 var(--space-4);" type="button" onClick={() => setEditingId(null)}>Batal</button>
                        </div>
                        <Show when={updating.result instanceof Error}>
                          <div class="alert-error">{(updating.result as Error).message}</div>
                        </Show>
                      </form>
                    </div>
                  </td>
                </tr>
              </Show>
            )}
          </For>
        </tbody>
      </table>
    </main>
  );
}
