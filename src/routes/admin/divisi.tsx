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
  getPageNumbers,
} from "~/lib";
import { showToast } from "~/lib/toast";

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
  let prevCreatingPending = false;
  createEffect(() => {
    const pending = !!creating.pending;
    if (prevCreatingPending && !pending && !creating.error) {
      createFormRef?.reset();
      setShowCreate(false);
    }
    prevCreatingPending = pending;
  });

  // Close modal on successful division update
  let prevUpdatingPending = false;
  createEffect(() => {
    const pending = !!updating.pending;
    if (prevUpdatingPending && !pending && !updating.error) {
      setEditingDivisi(null);
    }
    prevUpdatingPending = pending;
  });

  // Close modal on successful division deletion
  let prevDeletingPending = false;
  createEffect(() => {
    const pending = !!deleting.pending;
    if (prevDeletingPending && !pending && !deleting.error) {
      setDeletingDivisi(null);
    }
    prevDeletingPending = pending;
  });

  // Toast error & success notifications
  createEffect(() => {
    if (creating.result) {
      if (creating.result instanceof Error) showToast(creating.result.message, "error");
      else showToast("Divisi berhasil ditambahkan!", "success");
    }
  });
  createEffect(() => {
    if (updating.result) {
      if ((updating.result as any) instanceof Error) showToast(((updating.result as any) as Error).message, "error");
      else showToast("Divisi berhasil diperbarui!", "success");
    }
  });
  createEffect(() => {
    if (deleting.result) {
      if ((deleting.result as any) instanceof Error) showToast(((deleting.result as any) as Error).message, "error");
      else showToast("Divisi berhasil dihapus!", "success");
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
    </main>
  );
}
