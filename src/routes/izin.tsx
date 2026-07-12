import {
  createAsync,
  useSubmission,
  useAction,
  type RouteDefinition,
} from "@solidjs/router";
import { For, Show, createSignal, createEffect } from "solid-js";
import { Portal } from "solid-js/web";
import { getUserIzinList, submitIzin, getPageNumbers } from "~/lib";

export const route = {
  preload: () => {
    getUserIzinList();
  },
} satisfies RouteDefinition;

const normalizeAttachmentUrl = (url: string) =>
  url.startsWith("/uploads/") ? `/api/uploads?file=${url.replace("/uploads/", "")}` : url;

const statusBadge = (status: string) =>
  status === "PENDING"
    ? "badge-pending"
    : status === "APPROVED"
      ? "badge-approved"
      : status === "REJECTED"
        ? "badge-rejected"
        : "badge-pending";

const statusText = (status: string) => {
  const map: Record<string, string> = {
    PENDING: "Menunggu",
    APPROVED: "Disetujui",
    REJECTED: "Ditolak",
  };
  return map[status] || status;
};

export default function Izin() {
  const izinList = createAsync(() => getUserIzinList());
  const submitting = useSubmission(submitIzin);

  const [showCreate, setShowCreate] = createSignal(false);
  const [filterType, setFilterType] = createSignal("");
  const [filterStatus, setFilterStatus] = createSignal("");
  const [viewingAttachment, setViewingAttachment] = createSignal<string | null>(null);
  let createFormRef: HTMLFormElement | undefined;

  // Pagination signals
  const [currentPage, setCurrentPage] = createSignal(1);
  const itemsPerPage = 5;

  const filteredHistory = () => {
    const list = izinList();
    if (!list) return [];
    return list.filter((r) => {
      if (filterStatus() && r.status !== filterStatus()) return false;
      if (filterType() && r.type !== filterType()) return false;
      return true;
    });
  };

  const totalPages = () => {
    const list = filteredHistory();
    return Math.max(1, Math.ceil(list.length / itemsPerPage));
  };

  const paginatedList = () => {
    const list = filteredHistory();
    if (!list) return [];
    const start = (currentPage() - 1) * itemsPerPage;
    return list.slice(start, start + itemsPerPage);
  };

  // Close modal on successful submission
  let prevSubmittingPending = false;
  createEffect(() => {
    const pending = !!submitting.pending;
    if (prevSubmittingPending && !pending && !submitting.error) {
      createFormRef?.reset();
      setShowCreate(false);
    }
    prevSubmittingPending = pending;
  });

  return (
    <main class="p-4" style="text-align: left;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4);">
        <h1 class="page-title" style="margin-bottom: 0;">Pengajuan Izin Magang</h1>
        <button
          class="btn-primary"
          style="width: auto; padding: 0 var(--space-4); height: 40px;"
          onClick={() => setShowCreate(true)}
        >
          Ajukan Izin
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
                  Ajukan Izin Baru
                </h3>
                <button
                  class="theme-toggle"
                  style="font-size: 24px; padding: 0; cursor: pointer;"
                  onClick={() => setShowCreate(false)}
                >
                  ×
                </button>
              </div>

              <form
                ref={createFormRef}
                action={submitIzin}
                method="post"
                enctype="multipart/form-data"
              >
                <div class="form-group">
                  <label for="type">Tipe Perizinan</label>
                  <select id="type" name="type" required>
                    <option value="">-- Pilih Tipe --</option>
                    <option value="SAKIT">Sakit</option>
                    <option value="IZIN">Izin (Keperluan Mendesak)</option>
                    <option value="CUTI">Cuti Magang</option>
                  </select>
                </div>

                <div style="display: flex; gap: var(--space-4); flex-wrap: wrap;">
                  <div class="form-group" style="flex: 1; min-width: 150px;">
                    <label for="startDate">Tanggal Mulai</label>
                    <input type="date" id="startDate" name="startDate" required />
                  </div>
                  <div class="form-group" style="flex: 1; min-width: 150px;">
                    <label for="endDate">Tanggal Selesai</label>
                    <input type="date" id="endDate" name="endDate" required />
                  </div>
                </div>

                <div class="form-group">
                  <label for="reason">Alasan Pengajuan</label>
                  <textarea
                    id="reason"
                    name="reason"
                    placeholder="Jelaskan alasan pengajuan izin secara detail..."
                    rows="4"
                    required
                  />
                </div>

                <div class="form-group">
                  <label for="attachment">Lampiran Bukti / Surat Sakit (Gambar / PDF, maks. 500KB)</label>
                  <input
                    type="file"
                    id="attachment"
                    name="attachment"
                    accept="image/png, image/jpeg, image/jpg, application/pdf"
                    onChange={(e) => {
                      const file = e.currentTarget.files?.[0];
                      if (file && file.size > 500 * 1024) {
                        alert("Ukuran berkas maksimal 500KB.");
                        e.currentTarget.value = "";
                      }
                    }}
                  />
                </div>

                <div style="display: flex; gap: var(--space-2); margin-top: var(--space-4);">
                  <button
                    class="btn-primary"
                    type="submit"
                    disabled={submitting.pending}
                  >
                    {submitting.pending ? "Mengirim..." : "Kirim Pengajuan"}
                  </button>
                  <button
                    class="btn-ghost"
                    type="button"
                    onClick={() => setShowCreate(false)}
                  >
                    Batal
                  </button>
                </div>

                <Show when={submitting.result instanceof Error}>
                  <div class="alert-error">
                    {(submitting.result as Error).message}
                  </div>
                </Show>
              </form>
            </div>
          </div>
        </Portal>
      </Show>

      {/* Filter Section */}
      <div class="filter-card" style="margin-bottom: var(--space-4);">
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

      {/* History Section */}

      <Show when={izinList()} fallback={<p>Memuat...</p>}>
        {(list) => {
          if (list.length === 999999) console.log(list);
          return (
            <>
            <div style="overflow-x: auto;">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Tanggal Mulai</th>
                    <th>Tanggal Selesai</th>
                    <th>Tipe</th>
                    <th>Alasan</th>
                    <th>Lampiran</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <Show
                    when={paginatedList().length > 0}
                    fallback={
                      <tr>
                        <td
                          colspan="7"
                          style="text-align: center; color: var(--color-text-secondary); padding: var(--space-5);"
                        >
                          Belum ada riwayat pengajuan izin magang.
                        </td>
                      </tr>
                    }
                  >
                    <For each={paginatedList()}>
                      {(r, i) => (
                        <tr>
                          <td style="font-family: var(--font-mono); font-size: 13px;">
                            {(currentPage() - 1) * itemsPerPage + i() + 1}
                          </td>
                          <td>
                            {new Date(r.startDate).toLocaleDateString("id-ID", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </td>
                          <td>
                            {new Date(r.endDate).toLocaleDateString("id-ID", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </td>
                          <td>
                            <span class="badge badge-izin">{r.type}</span>
                          </td>
                          <td
                            style="max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
                            title={r.reason}
                          >
                            {r.reason}
                          </td>
                          <td>
                            <Show
                              when={r.attachment}
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
                                onClick={() => setViewingAttachment(normalizeAttachmentUrl(r.attachment!))}
                              >
                                Lihat Surat
                              </button>
                            </Show>
                          </td>
                          <td>
                            <span class={`badge ${statusBadge(r.status)}`}>
                              {statusText(r.status)}
                            </span>
                          </td>
                        </tr>
                      )}
                    </For>
                  </Show>
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <Show when={filteredHistory().length > 0}>
              <div class="pagination-container">
                <div class="pagination-info">
                  Menampilkan {paginatedList().length} dari{" "}
                  {filteredHistory().length} pengajuan izin
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
          </>
        ); }}
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

                <Show
                  when={viewingAttachment()?.toLowerCase().endsWith(".pdf")}
                  fallback={
                    <img
                      src={url()}
                      alt="Surat Sakit"
                      style="max-width: 100%; max-height: 70vh; object-fit: contain; border-radius: var(--radius-md); box-shadow: var(--shadow-md);"
                    />
                  }
                >
                  <object
                    data={url()}
                    type="application/pdf"
                    width="100%"
                    height="500px"
                    style="border-radius: var(--radius-md); border: 1px solid var(--color-border);"
                  >
                    <p style="font-size: 14px; color: var(--color-text-secondary); margin-bottom: 15px;">
                      Pratinjau PDF tidak didukung langsung oleh browser Anda.
                    </p>
                    <a
                      href={url()}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="btn-primary"
                      style="text-decoration: none; display: inline-flex; width: auto; padding: 0 var(--space-4);"
                    >
                      Buka / Unduh PDF
                    </a>
                  </object>
                </Show>

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
