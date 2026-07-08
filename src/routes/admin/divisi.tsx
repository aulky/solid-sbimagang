import {
  createAsync,
  useSubmission,
  type RouteDefinition,
} from "@solidjs/router";
import { Show, For, createSignal, createEffect } from "solid-js";
import { Portal } from "solid-js/web";
import {
  getAdminDivisi,
  createDivisi,
  updateDivisi,
  deleteDivisi,
} from "~/lib";

export const route = {
  preload() {
    getAdminDivisi();
  },
} satisfies RouteDefinition;

export default function AdminDivisi() {
  const divisiList = createAsync(() => getAdminDivisi(), { deferStream: true });

  const [showCreate, setShowCreate] = createSignal(false);
  const [editingDivisi, setEditingDivisi] = createSignal<{
    id: string;
    name: string;
    description: string | null;
  } | null>(null);
  const [deletingDivisi, setDeletingDivisi] = createSignal<{
    id: string;
    name: string;
  } | null>(null);
  let createFormRef: HTMLFormElement | undefined;

  // Pagination setup
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

  // Close modal on successful division creation and reset form
  createEffect(() => {
    if (creating.result && !(creating.result instanceof Error)) {
      createFormRef?.reset();
      setShowCreate(false);
    }
  });

  // Close modal on successful division update
  createEffect(() => {
    if (updating.result && !(updating.result instanceof Error)) {
      setEditingDivisi(null);
    }
  });

  // Close modal on successful division deletion
  createEffect(() => {
    if (deleting.result && !((deleting.result as any) instanceof Error)) {
      setDeletingDivisi(null);
    }
  });

  return (
    <main class="p-4">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4); text-align: left;">
        <h1 class="page-title" style="margin-bottom: 0;">
          Kelola Divisi
        </h1>
        <button
          class="btn-primary"
          style="width: auto; padding: 0 var(--space-4); height: 40px;"
          onClick={() => setShowCreate(true)}
        >
          Tambah Divisi
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
                  Tambah Divisi Baru
                </h3>
                <button
                  class="theme-toggle"
                  style="font-size: 24px; padding: 0; cursor: pointer;"
                  onClick={() => setShowCreate(false)}
                >
                  ×
                </button>
              </div>
              <form ref={createFormRef} action={createDivisi} method="post">
                <div class="form-group">
                  <label>Nama Divisi</label>
                  <input
                    name="name"
                    placeholder="Masukkan nama divisi"
                    required
                    minLength={2}
                  />
                </div>
                <div class="form-group">
                  <label>Deskripsi</label>
                  <textarea
                    name="description"
                    placeholder="Masukkan deskripsi divisi"
                    rows="3"
                  />
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

      <Show when={editingDivisi()}>
        {(divisi) => (
          <Portal>
            <div class="modal-overlay" onClick={() => setEditingDivisi(null)}>
              <div
                class="modal modal-animate"
                onClick={(e) => e.stopPropagation()}
              >
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4); border-bottom: 1px solid var(--color-border); padding-bottom: var(--space-2);">
                  <h3 style="margin: 0; font-family: var(--font-headline); font-weight: 700;">
                    Edit Divisi
                  </h3>
                  <button
                    class="theme-toggle"
                    style="font-size: 24px; padding: 0; cursor: pointer;"
                    onClick={() => setEditingDivisi(null)}
                  >
                    ×
                  </button>
                </div>
                <form action={updateDivisi} method="post">
                  <input type="hidden" name="id" value={divisi().id} />
                  <div class="form-group">
                    <label>Nama Divisi</label>
                    <input
                      name="name"
                      value={divisi().name}
                      required
                      minLength={2}
                    />
                  </div>
                  <div class="form-group">
                    <label>Deskripsi</label>
                    <textarea name="description" rows="3">
                      {divisi().description ?? ""}
                    </textarea>
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
                      onClick={() => setEditingDivisi(null)}
                    >
                      Batal
                    </button>
                  </div>
                  <Show when={updating.result instanceof Error}>
                    <div class="alert-error">
                      {(updating.result as Error).message}
                    </div>
                  </Show>
                </form>
              </div>
            </div>
          </Portal>
        )}
      </Show>

      <Show when={deletingDivisi()}>
        {(divisi) => (
          <Portal>
            <div class="modal-overlay" onClick={() => setDeletingDivisi(null)}>
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
                    onClick={() => setDeletingDivisi(null)}
                  >
                    ×
                  </button>
                </div>
                <form action={deleteDivisi} method="post">
                  <input type="hidden" name="id" value={divisi().id} />
                  <p style="margin-top: 0; margin-bottom: var(--space-4); font-size: 14px; color: var(--color-text); line-height: 1.5; text-align: left;">
                    Apakah Anda yakin ingin menghapus divisi{" "}
                    <strong>{divisi().name}</strong>?
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
                      onClick={() => setDeletingDivisi(null)}
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
              <th>Nama Divisi</th>
              <th>Deskripsi</th>
              <th>Jumlah Anggota</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <Show
              when={divisiList() && divisiList()!.length > 0}
              fallback={
                <tr>
                  <td
                    colspan="5"
                    style="text-align: center; color: var(--color-text-secondary); padding: var(--space-5);"
                  >
                    Belum ada data divisi.
                  </td>
                </tr>
              }
            >
              <For each={paginatedDivisi()}>
                {(d, i) => (
                  <tr>
                    <td style="font-family: var(--font-mono); font-size: 13px;">
                      {(currentPage() - 1) * itemsPerPage + i() + 1}
                    </td>
                    <td>{d.name}</td>
                    <td>{d.description ?? "-"}</td>
                    <td>
                      <span class="badge badge-izin">
                        {d._count.users} Anggota
                      </span>
                    </td>
                    <td>
                      <button
                        class="btn-secondary"
                        style="display: inline-flex; width: auto; height: 32px; padding: 0 12px; font-size: 13px;"
                        onClick={() => setEditingDivisi(d)}
                      >
                        Edit
                      </button>{" "}
                      <button
                        class="btn-danger"
                        style="display: inline-flex; width: auto; height: 32px; padding: 0 12px; font-size: 13px;"
                        onClick={() =>
                          setDeletingDivisi({ id: d.id, name: d.name })
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
      <Show when={divisiList() && divisiList()!.length > 0}>
        <div class="pagination-container">
          <div class="pagination-info">
            Menampilkan {paginatedDivisi().length} dari {divisiList()!.length}{" "}
            divisi
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
