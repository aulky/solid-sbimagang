import { createAsync, useSubmission, useAction, type RouteDefinition } from "@solidjs/router";
import { For, Show, createSignal, createEffect } from "solid-js";
import { Portal } from "solid-js/web";
import { getUserIzinList, submitIzin } from "~/lib";

export const route = {
  preload: () => {
    getUserIzinList();
  },
} satisfies RouteDefinition;

const statusBadge = (status: string) =>
  status === "PENDING"
    ? "badge-pending"
    : status === "APPROVED"
      ? "badge-approved"
      : status === "REJECTED"
        ? "badge-rejected"
        : "badge-pending";

export default function Izin() {
  const izinList = createAsync(() => getUserIzinList());
  const submitting = useSubmission(submitIzin);
  const triggerSubmit = useAction(submitIzin);

  // Form signals
  const [type, setType] = createSignal("");
  const [startDate, setStartDate] = createSignal("");
  const [endDate, setEndDate] = createSignal("");
  const [reason, setReason] = createSignal("");
  const [errorMessage, setErrorMessage] = createSignal("");

  // Confirmation Modal signal
  const [showConfirm, setShowConfirm] = createSignal(false);

  // Pagination signals
  const [currentPage, setCurrentPage] = createSignal(1);
  const itemsPerPage = 5;

  const totalPages = () => {
    const list = izinList();
    return list ? Math.max(1, Math.ceil(list.length / itemsPerPage)) : 1;
  };

  const paginatedList = () => {
    const list = izinList();
    if (!list) return [];
    const start = (currentPage() - 1) * itemsPerPage;
    return list.slice(start, start + itemsPerPage);
  };

  // Close confirm modal & reset form on success
  createEffect(() => {
    if (submitting.result && !(submitting.result instanceof Error)) {
      setType("");
      setStartDate("");
      setEndDate("");
      setReason("");
      setErrorMessage("");
      setShowConfirm(false);
    } else if (submitting.result instanceof Error) {
      setErrorMessage(submitting.result.message);
      setShowConfirm(false);
    }
  });

  const handleOpenConfirm = (e: Event) => {
    e.preventDefault();
    setErrorMessage("");

    if (!type()) {
      setErrorMessage("Silakan pilih tipe perizinan.");
      return;
    }
    if (!startDate()) {
      setErrorMessage("Silakan masukkan tanggal mulai.");
      return;
    }
    if (!endDate()) {
      setErrorMessage("Silakan masukkan tanggal selesai.");
      return;
    }
    if (new Date(startDate()) > new Date(endDate())) {
      setErrorMessage("Tanggal mulai tidak boleh melebihi tanggal selesai.");
      return;
    }
    if (!reason() || reason().trim().length < 5) {
      setErrorMessage("Alasan pengajuan harus minimal 5 karakter.");
      return;
    }

    setShowConfirm(true);
  };

  const handleFinalSubmit = () => {
    const fd = new FormData();
    fd.append("type", type());
    fd.append("startDate", startDate());
    fd.append("endDate", endDate());
    fd.append("reason", reason());
    triggerSubmit(fd);
  };

  return (
    <main class="p-4" style="max-width: 900px; margin: 0 auto;">
      <h1 class="page-title">Pengajuan Izin Magang</h1>

      <div class="form-card" style="max-width: 100%; margin-bottom: var(--space-5);">
        <h2 style="margin-top: 0; font-family: var(--font-headline); font-weight: 700; font-size: 1.5rem; margin-bottom: var(--space-4);">Ajukan Izin Baru</h2>

        <form onSubmit={handleOpenConfirm}>
          <div class="form-group">
            <label for="type">Tipe Perizinan</label>
            <select id="type" value={type()} onChange={(e) => setType(e.currentTarget.value)} required>
              <option value="">-- Pilih Tipe --</option>
              <option value="SAKIT">Sakit</option>
              <option value="IZIN">Izin (Keperluan Mendesak)</option>
              <option value="CUTI">Cuti Magang</option>
            </select>
          </div>

          <div style="display: flex; gap: var(--space-4); flex-wrap: wrap;">
            <div class="form-group" style="flex: 1; min-width: 200px;">
              <label for="startDate">Tanggal Mulai</label>
              <input type="date" id="startDate" value={startDate()} onInput={(e) => setStartDate(e.currentTarget.value)} required />
            </div>
            <div class="form-group" style="flex: 1; min-width: 200px;">
              <label for="endDate">Tanggal Selesai</label>
              <input type="date" id="endDate" value={endDate()} onInput={(e) => setEndDate(e.currentTarget.value)} required />
            </div>
          </div>

          <div class="form-group">
            <label for="reason">Alasan Pengajuan</label>
            <textarea
              id="reason"
              placeholder="Jelaskan alasan pengajuan izin secara detail..."
              rows="4"
              value={reason()}
              onInput={(e) => setReason(e.currentTarget.value)}
              required
            />
          </div>

          <button class="btn-primary" type="submit" style="width: auto; padding: 0 var(--space-5); height: 42px;">
            Ajukan Izin
          </button>

          <Show when={errorMessage()}>
            <div class="alert-error" style="margin-top: var(--space-3);">{errorMessage()}</div>
          </Show>
        </form>
      </div>

      {/* Confirmation Modal */}
      <Show when={showConfirm()}>
        <Portal>
          <div class="modal-overlay" onClick={() => setShowConfirm(false)}>
            <div class="modal modal-animate" onClick={(e) => e.stopPropagation()} style="max-width: 460px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4); border-bottom: 1px solid var(--color-border); padding-bottom: var(--space-2);">
                <h3 style="margin: 0; font-family: var(--font-headline); font-weight: 700;">Konfirmasi Pengajuan</h3>
                <button class="theme-toggle" style="font-size: 24px; padding: 0; cursor: pointer;" onClick={() => setShowConfirm(false)}>×</button>
              </div>

              <div style="text-align: left; margin-bottom: var(--space-4); font-size: 14px; line-height: 1.5;">
                <p style="margin-bottom: var(--space-3); color: var(--color-text-secondary);">
                  Apakah data pengajuan izin magang di bawah ini sudah sesuai?
                </p>
                <div style="background: rgba(0,0,0,0.02); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-3); display: flex; flex-direction: column; gap: var(--space-2);">
                  <div>
                    <strong>Tipe:</strong> {type()}
                  </div>
                  <div>
                    <strong>Tanggal Mulai:</strong> {new Date(startDate()).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                  </div>
                  <div>
                    <strong>Tanggal Selesai:</strong> {new Date(endDate()).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                  </div>
                  <div style="word-break: break-word;">
                    <strong>Alasan:</strong> {reason()}
                  </div>
                </div>
              </div>

              <div style="display: flex; gap: var(--space-3);">
                <button class="btn-ghost" style="flex: 1;" type="button" onClick={() => setShowConfirm(false)}>
                  Batal
                </button>
                <button class="btn-primary" style="flex: 1;" type="button" onClick={handleFinalSubmit} disabled={submitting.pending}>
                  {submitting.pending ? "Mengirim..." : "Ya, Kirim"}
                </button>
              </div>
            </div>
          </div>
        </Portal>
      </Show>

      {/* History Section */}
      <h2 style="margin-top: var(--space-5); font-family: var(--font-headline); font-weight: 700; font-size: 1.5rem; margin-bottom: var(--space-3); color: var(--color-text);">Riwayat Pengajuan Izin</h2>

      <Show when={izinList()} fallback={<p>Memuat...</p>}>
        {(list) => (
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
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <Show
                    when={paginatedList().length > 0}
                    fallback={
                      <tr>
                        <td colspan="6" style="text-align: center; color: var(--color-text-secondary); padding: var(--space-5);">
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
                          <td>{new Date(r.startDate).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}</td>
                          <td>{new Date(r.endDate).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}</td>
                          <td>
                            <span class="badge badge-izin">{r.type}</span>
                          </td>
                          <td style="max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title={r.reason}>
                            {r.reason}
                          </td>
                          <td>
                            <span class={statusBadge(r.status)}>{r.status}</span>
                          </td>
                        </tr>
                      )}
                    </For>
                  </Show>
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <Show when={list().length > 0}>
              <div class="pagination-container">
                <div class="pagination-info">
                  Menampilkan {paginatedList().length} dari {list().length} pengajuan izin
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
          </>
        )}
      </Show>
    </main>
  );
}
