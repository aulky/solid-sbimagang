import { createAsync, useSubmission, type RouteDefinition } from "@solidjs/router";
import { Show, For, createSignal, createEffect } from "solid-js";
import {
  getAdminDivisi,
  createDivisi,
  updateDivisi,
  deleteDivisi
} from "~/lib";

export const route = {
  preload() {
    getAdminDivisi();
  }
} satisfies RouteDefinition;

export default function AdminDivisi() {
  const divisiList = createAsync(() => getAdminDivisi(), { deferStream: true });

  const [showCreate, setShowCreate] = createSignal(false);
  const [editingId, setEditingId] = createSignal<string | null>(null);

  const creating = useSubmission(createDivisi);
  const updating = useSubmission(updateDivisi);
  const deleting = useSubmission(deleteDivisi);

  // Close modal on successful division creation
  createEffect(() => {
    if (creating.result && !(creating.result instanceof Error)) {
      setShowCreate(false);
    }
  });

  return (
    <main class="p-4">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4);">
        <h1 class="page-title" style="margin-bottom: 0;">Kelola Divisi</h1>
        <button class="btn-primary" style="width: auto; padding: 0 var(--space-4); height: 40px;" onClick={() => setShowCreate(true)}>
          Tambah Divisi
        </button>
      </div>

      <Show when={showCreate()}>
        <div class="modal-overlay" onClick={() => setShowCreate(false)}>
          <div class="modal modal-animate" onClick={(e) => e.stopPropagation()}>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4); border-bottom: 1px solid var(--color-border); padding-bottom: var(--space-2);">
              <h3 style="margin: 0; font-family: var(--font-headline); font-weight: 700;">Tambah Divisi Baru</h3>
              <button class="theme-toggle" style="font-size: 24px; padding: 0; cursor: pointer;" onClick={() => setShowCreate(false)}>×</button>
            </div>
            <form action={createDivisi} method="post">
              <div class="form-group">
                <label>Nama Divisi</label>
                <input name="name" placeholder="Masukkan nama divisi" required minLength={2} />
              </div>
              <div class="form-group">
                <label>Deskripsi</label>
                <textarea name="description" placeholder="Masukkan deskripsi divisi" rows="3" />
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
            <th>Nama Divisi</th>
            <th>Deskripsi</th>
            <th>Jumlah Anggota</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <For each={divisiList()}>
            {(d, i) => (
              <Show
                when={editingId() === d.id}
                fallback={
                  <tr>
                    <td>{i() + 1}</td>
                    <td>{d.name}</td>
                    <td>{d.description ?? "-"}</td>
                    <td>
                      <span class="badge badge-izin">
                        {d._count.users} Anggota
                      </span>
                    </td>
                    <td>
                      <button class="btn-secondary" style="display: inline-flex; width: auto; height: 32px; padding: 0 12px; font-size: 13px;" onClick={() => setEditingId(d.id)}>Edit</button>{" "}
                      <form action={deleteDivisi} method="post" style={{ display: "inline" }}
                        onSubmit={(e) => { if (!confirm("Hapus divisi " + d.name + "?")) e.preventDefault(); }}>
                        <input type="hidden" name="id" value={d.id} />
                        <button class="btn-danger" style="display: inline-flex; width: auto; height: 32px; padding: 0 12px; font-size: 13px;" type="submit" disabled={deleting.pending}>Hapus</button>
                      </form>
                    </td>
                  </tr>
                }
              >
                <tr>
                  <td>{i() + 1}</td>
                  <td colspan="4">
                    <div class="form-card" style="max-width: 100%;">
                      <h4 style="margin-top: 0; font-family: var(--font-headline); font-weight: 700;">Edit Divisi: {d.name}</h4>
                      <form action={updateDivisi} method="post">
                        <input type="hidden" name="id" value={d.id} />
                        <div class="form-group">
                          <label>Nama Divisi</label>
                          <input name="name" value={d.name} required minLength={2} />
                        </div>
                        <div class="form-group">
                          <label>Deskripsi</label>
                          <textarea name="description" rows="3">{d.description ?? ""}</textarea>
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
