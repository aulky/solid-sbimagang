import {
  createAsync,
  useSubmission,
  type RouteDefinition,
} from "@solidjs/router";
import { Show, For, createSignal, createEffect } from "solid-js";
import { Portal } from "solid-js/web";
import {
  getAdminBatches,
  createBatch,
  updateBatch,
  deleteBatch,
  getPageNumbers,
} from "~/lib";
import { showToast } from "~/lib/toast";

export const route = {
  preload() {
    getAdminBatches();
  },
} satisfies RouteDefinition;

const formatDateString = (dateStr: string | Date) => {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const getBatchStatus = (startDate: string | Date, endDate: string | Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const s = new Date(startDate);
  s.setHours(0, 0, 0, 0);
  const e = new Date(endDate);
  e.setHours(0, 0, 0, 0);

  if (today < s) {
    return { label: "Mendatang", badgeClass: "badge-pending" };
  }
  if (today > e) {
    return { label: "Selesai", badgeClass: "badge-rejected" };
  }
  return { label: "Aktif", badgeClass: "badge-approved" };
};

export default function AdminBatch() {
  const batchList = createAsync(() => getAdminBatches(), { deferStream: true });

  const [showCreate, setShowCreate] = createSignal(false);
  const [editingBatch, setEditingBatch] = createSignal<{
    id: string;
    name: string;
    startDate: string | Date;
    endDate: string | Date;
    description: string | null;
  } | null>(null);
  const [deletingBatch, setDeletingBatch] = createSignal<{
    id: string;
    name: string;
  } | null>(null);
  let createFormRef: HTMLFormElement | undefined;

  // Pagination setup
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

  // Close modal on successful batch creation and reset form
  let prevCreatingPending = false;
  createEffect(() => {
    const pending = !!creating.pending;
    if (prevCreatingPending && !pending && !creating.error) {
      createFormRef?.reset();
      setShowCreate(false);
    }
    prevCreatingPending = pending;
  });

  // Close modal on successful batch update
  let prevUpdatingPending = false;
  createEffect(() => {
    const pending = !!updating.pending;
    if (prevUpdatingPending && !pending && !updating.error) {
      setEditingBatch(null);
    }
    prevUpdatingPending = pending;
  });

  // Close modal on successful batch deletion
  let prevDeletingPending = false;
  createEffect(() => {
    const pending = !!deleting.pending;
    if (prevDeletingPending && !pending && !deleting.error) {
      setDeletingBatch(null);
    }
    prevDeletingPending = pending;
  });

  // Toast error notifications
  createEffect(() => { if (creating.result instanceof Error) showToast(creating.result.message); });
  createEffect(() => { if ((updating.result as any) instanceof Error) showToast(((updating.result as any) as Error).message); });
  createEffect(() => { if ((deleting.result as any) instanceof Error) showToast(((deleting.result as any) as Error).message); });

  return (
    <main class="p-4">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4); text-align: left;">
        <h1 class="page-title" style="margin-bottom: 0;">
          Kelola Batch Magang
        </h1>
        <button
          class="btn-primary"
          style="width: auto; padding: 0 var(--space-4); height: 40px;"
          onClick={() => setShowCreate(true)}
        >
          Tambah Batch
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
                  Tambah Batch Baru
                </h3>
                <button
                  class="theme-toggle"
                  style="font-size: 24px; padding: 0; cursor: pointer;"
                  onClick={() => setShowCreate(false)}
                >
                  ×
                </button>
              </div>
              <form ref={createFormRef} action={createBatch} method="post">
                <div class="form-group">
                  <label>Nama Batch</label>
                  <input
                    name="name"
                    placeholder="Contoh: Batch 1 - 2026"
                    required
                    minLength={2}
                  />
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3);">
                  <div class="form-group">
                    <label>Tanggal Mulai</label>
                    <input name="startDate" type="date" required />
                  </div>
                  <div class="form-group">
                    <label>Tanggal Selesai</label>
                    <input name="endDate" type="date" required />
                  </div>
                </div>
                <div class="form-group">
                  <label>Deskripsi</label>
                  <textarea
                    name="description"
                    placeholder="Masukkan deskripsi program magang untuk batch ini"
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

      <Show when={editingBatch()}>
        {(batch) => (
          <Portal>
            <div class="modal-overlay" onClick={() => setEditingBatch(null)}>
              <div
                class="modal modal-animate"
                onClick={(e) => e.stopPropagation()}
              >
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4); border-bottom: 1px solid var(--color-border); padding-bottom: var(--space-2);">
                  <h3 style="margin: 0; font-family: var(--font-headline); font-weight: 700;">
                    Edit Batch Magang
                  </h3>
                  <button
                    class="theme-toggle"
                    style="font-size: 24px; padding: 0; cursor: pointer;"
                    onClick={() => setEditingBatch(null)}
                  >
                    ×
                  </button>
                </div>
                <form action={updateBatch} method="post">
                  <input type="hidden" name="id" value={batch().id} />
                  <div class="form-group">
                    <label>Nama Batch</label>
                    <input
                      name="name"
                      value={batch().name}
                      required
                      minLength={2}
                    />
                  </div>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3);">
                    <div class="form-group">
                      <label>Tanggal Mulai</label>
                      <input
                        name="startDate"
                        type="date"
                        value={new Date(batch().startDate).toISOString().split("T")[0]}
                        required
                      />
                    </div>
                    <div class="form-group">
                      <label>Tanggal Selesai</label>
                      <input
                        name="endDate"
                        type="date"
                        value={new Date(batch().endDate).toISOString().split("T")[0]}
                        required
                      />
                    </div>
                  </div>
                  <div class="form-group">
                    <label>Deskripsi</label>
                    <textarea name="description" rows="3">
                      {batch().description ?? ""}
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
                      onClick={() => setEditingBatch(null)}
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

      <Show when={deletingBatch()}>
        {(batch) => (
          <Portal>
            <div class="modal-overlay" onClick={() => setDeletingBatch(null)}>
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
                    onClick={() => setDeletingBatch(null)}
                  >
                    ×
                  </button>
                </div>
                <form action={deleteBatch} method="post">
                  <input type="hidden" name="id" value={batch().id} />
                  <p style="margin-top: 0; margin-bottom: var(--space-4); font-size: 14px; color: var(--color-text); line-height: 1.5; text-align: left;">
                    Apakah Anda yakin ingin menghapus batch{" "}
                    <strong>{batch().name}</strong>?
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
                      onClick={() => setDeletingBatch(null)}
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
              <th>Nama Batch</th>
              <th>Tanggal Mulai</th>
              <th>Tanggal Selesai</th>
              <th>Status</th>
              <th>Jumlah Peserta</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <Show
              when={batchList() && batchList()!.length > 0}
              fallback={
                <tr>
                  <td
                    colspan="7"
                    style="text-align: center; color: var(--color-text-secondary); padding: var(--space-5);"
                  >
                    Belum ada data batch magang.
                  </td>
                </tr>
              }
            >
              <For each={paginatedBatches()}>
                {(b, i) => {
                  const status = getBatchStatus(b.startDate, b.endDate);
                  return (
                    <tr>
                      <td style="font-family: var(--font-mono); font-size: 13px;">
                        {(currentPage() - 1) * itemsPerPage + i() + 1}
                      </td>
                      <td>
                        <strong style="color: var(--color-text);">{b.name}</strong>
                        <Show when={b.description}>
                          <div style="font-size: 11px; color: var(--color-text-secondary); margin-top: 2px;">
                            {b.description}
                          </div>
                        </Show>
                      </td>
                      <td>{formatDateString(b.startDate)}</td>
                      <td>{formatDateString(b.endDate)}</td>
                      <td>
                        <span class={`badge ${status.badgeClass}`}>
                          {status.label}
                        </span>
                      </td>
                      <td>
                        <span class="badge badge-izin">
                          {b._count.users} Anak Magang
                        </span>
                      </td>
                      <td>
                        <button
                          class="btn-secondary"
                          style="display: inline-flex; width: auto; height: 32px; padding: 0 12px; font-size: 13px;"
                          onClick={() => setEditingBatch(b)}
                        >
                          Edit
                        </button>{" "}
                        <button
                          class="btn-danger"
                          style="display: inline-flex; width: auto; height: 32px; padding: 0 12px; font-size: 13px;"
                          onClick={() =>
                            setDeletingBatch({ id: b.id, name: b.name })
                          }
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  );
                }}
              </For>
            </Show>
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <Show when={batchList() && batchList()!.length > 0}>
        <div class="pagination-container">
          <div class="pagination-info">
            Menampilkan {paginatedBatches().length} dari {batchList()!.length}{" "}
            batch
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
