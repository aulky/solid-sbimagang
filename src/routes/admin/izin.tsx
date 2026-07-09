import {
  createAsync,
  useSubmission,
  type RouteDefinition,
} from "@solidjs/router";
import { For, Show, createSignal } from "solid-js";
import { Portal } from "solid-js/web";
import { getAdminIzin, approveIzin } from "~/lib";

export const route = {
  preload() {
    getAdminIzin();
  },
} satisfies RouteDefinition;

export default function AdminIzin() {
  const records = createAsync(() => getAdminIzin());
  const approving = useSubmission(approveIzin);
  const [viewingAttachment, setViewingAttachment] = createSignal<string | null>(null);

  // Filter signals
  const [searchQuery, setSearchQuery] = createSignal("");
  const [filterType, setFilterType] = createSignal("");
  const [filterStatus, setFilterStatus] = createSignal("");

  // Pagination setup
  const [currentPage, setCurrentPage] = createSignal(1);
  const itemsPerPage = 10;

  // Filter logic
  const filteredRecords = () => {
    const list = records();
    if (!list) return [];
    return list.filter((r) => {
      if (filterStatus() && r.status !== filterStatus()) return false;
      if (filterType() && r.type !== filterType()) return false;

      const query = searchQuery().toLowerCase().trim();
      if (query) {
        const nameMatch = r.user.fullName.toLowerCase().includes(query);
        const usernameMatch = r.user.username.toLowerCase().includes(query);
        if (!nameMatch && !usernameMatch) return false;
      }
      return true;
    });
  };

  const totalPages = () => {
    const list = filteredRecords();
    return Math.max(1, Math.ceil(list.length / itemsPerPage));
  };

  const paginatedRecords = () => {
    const list = filteredRecords();
    const start = (currentPage() - 1) * itemsPerPage;
    return list.slice(start, start + itemsPerPage);
  };

  return (
    <main>
      <h1 class="page-title">Kelola Pengajuan Izin</h1>

      <div class="filter-card" style="margin-bottom: var(--space-4);">
        <div class="form-group">
          <label>Cari Nama</label>
          <input
            type="text"
            placeholder="Cari nama atau username..."
            value={searchQuery()}
            onInput={(e) => {
              setSearchQuery(e.currentTarget.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div class="form-group">
          <label>Tipe Izin</label>
          <select
            value={filterType()}
            onChange={(e) => {
              setFilterType(e.currentTarget.value);
              setCurrentPage(1);
            }}
          >
            <option value="">Semua Tipe</option>
            <option value="SAKIT">Sakit</option>
            <option value="IZIN">Izin</option>
            <option value="CUTI">Cuti</option>
          </select>
        </div>
        <div class="form-group">
          <label>Status</label>
          <select
            value={filterStatus()}
            onChange={(e) => {
              setFilterStatus(e.currentTarget.value);
              setCurrentPage(1);
            }}
          >
            <option value="">Semua Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Setuju</option>
            <option value="REJECTED">Tolak</option>
          </select>
        </div>
        <button
          onClick={() => {
            setSearchQuery("");
            setFilterType("");
            setFilterStatus("");
            setCurrentPage(1);
          }}
          class="btn-ghost"
          style="width: auto;"
        >
          Reset Filter
        </button>
      </div>

      <div style="overflow-x: auto;">
        <table class="data-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Tipe</th>
              <th>Tanggal Mulai</th>
              <th>Tanggal Selesai</th>
              <th>Alasan</th>
              <th>Lampiran</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <Show
              when={records() && records()!.length > 0}
              fallback={
                <tr>
                  <td
                    colspan="9"
                    style="text-align: center; color: var(--color-text-secondary); padding: var(--space-5);"
                  >
                    Belum ada pengajuan izin.
                  </td>
                </tr>
              }
            >
              <For each={paginatedRecords()}>
                {(row, idx) => {
                  const startDate = new Date(row.startDate).toLocaleDateString(
                    "id-ID",
                  );
                  const endDate = new Date(row.endDate).toLocaleDateString(
                    "id-ID",
                  );

                  return (
                    <tr>
                      <td style="font-family: var(--font-mono); font-size: 13px;">
                        {(currentPage() - 1) * itemsPerPage + idx() + 1}
                      </td>
                      <td>
                        <strong>{row.user.fullName}</strong>
                        <div style="font-size: 12px; color: var(--color-text-secondary);">
                          @{row.user.username}
                        </div>
                        <Show when={row.user.phone}>
                          <div style="font-size: 11px; color: var(--color-text-secondary); margin-top: 2px; display: flex; align-items: center; gap: 4px;">
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              style="flex-shrink: 0; stroke: currentColor;"
                            >
                              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                            <span>{row.user.phone}</span>
                          </div>
                        </Show>
                      </td>
                      <td>
                        <span class="badge badge-izin">{row.type}</span>
                      </td>
                      <td>{startDate}</td>
                      <td>{endDate}</td>
                      <td
                        style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
                        title={row.reason}
                      >
                        {row.reason}
                      </td>
                      <td>
                        <Show
                          when={row.attachment}
                          fallback={
                            <span style="color: var(--color-text-secondary); font-size: 13px;">
                              —
                            </span>
                          }
                        >
                          <button
                            type="button"
                            class="btn-secondary"
                            style="width: auto; height: 32px; padding: 0 12px; font-size: 12px; display: inline-flex;"
                            onClick={() => setViewingAttachment(row.attachment)}
                          >
                            Lihat Surat
                          </button>
                        </Show>
                      </td>
                      <td>
                        <span class={`badge badge-${row.status.toLowerCase()}`}>
                          {row.status}
                        </span>
                      </td>
                      <td>
                        <Show when={row.status === "PENDING"}>
                          <div style="display: flex; gap: var(--space-2);">
                            <form action={approveIzin} method="post">
                              <input type="hidden" name="id" value={row.id} />
                              <input
                                type="hidden"
                                name="status"
                                value="APPROVED"
                              />
                              <button
                                type="submit"
                                class="btn-secondary"
                                style="width: auto; height: 32px; padding: 0 12px; font-size: 12px;"
                                disabled={approving.pending}
                              >
                                Setujui
                              </button>
                            </form>
                            <form action={approveIzin} method="post">
                              <input type="hidden" name="id" value={row.id} />
                              <input
                                type="hidden"
                                name="status"
                                value="REJECTED"
                              />
                              <button
                                type="submit"
                                class="btn-danger"
                                style="width: auto; height: 32px; padding: 0 12px; font-size: 12px;"
                                disabled={approving.pending}
                              >
                                Tolak
                              </button>
                            </form>
                          </div>
                        </Show>
                        <Show when={row.status !== "PENDING"}>
                          <span style="color: var(--color-text-secondary); font-size: 13px;">
                            —
                          </span>
                        </Show>
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
      <Show when={records() && records()!.length > 0}>
        <div class="pagination-container">
          <div class="pagination-info">
            Menampilkan {paginatedRecords().length} dari {records()!.length}{" "}
            pengajuan izin
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

      <Show when={viewingAttachment()}>
        {(url) => (
          <Portal>
            <div
              class="modal-overlay"
              onClick={() => setViewingAttachment(null)}
            >
              <div
                class="modal modal-animate"
                onClick={(e) => e.stopPropagation()}
                style="max-width: 600px; text-align: center;"
              >
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4); border-bottom: 1px solid var(--color-border); padding-bottom: var(--space-2);">
                  <h3
                    style="margin: 0; font-family: var(--font-headline); font-weight: 700;"
                  >
                    Surat Keterangan Sakit
                  </h3>
                  <button
                    class="theme-toggle"
                    style="font-size: 24px; padding: 0; cursor: pointer;"
                    onClick={() => setViewingAttachment(null)}
                  >
                    ×
                  </button>
                </div>
                <img
                  src={url()}
                  alt="Surat Sakit"
                  style="max-width: 100%; max-height: 70vh; object-fit: contain; border-radius: var(--radius-md); box-shadow: var(--shadow-md);"
                />
                <div
                  style="margin-top: var(--space-4); display: flex; justify-content: center;"
                >
                  <button
                    class="btn-ghost"
                    type="button"
                    onClick={() => setViewingAttachment(null)}
                    style="width: auto; padding: 0 var(--space-4);"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </Portal>
        )}
      </Show>
    </main>
  );
}
