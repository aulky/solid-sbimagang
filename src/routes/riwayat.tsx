import { createAsync, type RouteDefinition } from "@solidjs/router";
import { For, Show, createSignal } from "solid-js";
import { getAttendanceHistory } from "~/lib";

export const route = {
  preload: () => {
    getAttendanceHistory();
  },
} satisfies RouteDefinition;

const statusBadge = (status: string) =>
  status === "HADIR"
    ? "badge-hadir"
    : status === "TELAT"
      ? "badge-telat"
      : status === "ALPHA"
        ? "badge-alpha"
        : "badge-izin";

export default function Riwayat() {
  const history = createAsync(() => getAttendanceHistory());
  const [currentPage, setCurrentPage] = createSignal(1);
  const itemsPerPage = 10;

  const [filterDate, setFilterDate] = createSignal("");
  const [filterStatus, setFilterStatus] = createSignal("");

  const filteredRecords = () => {
    const list = history();
    if (!list) return [];
    return list.filter((r) => {
      if (filterDate()) {
        const rDate = new Date(r.date).toISOString().slice(0, 10);
        if (rDate !== filterDate()) return false;
      }
      if (filterStatus() && r.status !== filterStatus()) return false;
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
    <div>
      <h1 class="page-title" style="text-align: left;">Riwayat Absensi</h1>

      <div class="filter-card" style="margin-bottom: var(--space-4);">
        <div class="form-group">
          <label>Filter Tanggal</label>
          <input
            type="date"
            value={filterDate()}
            onInput={(e) => {
              setFilterDate(e.currentTarget.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div class="form-group">
          <label>Filter Status</label>
          <select
            value={filterStatus()}
            onChange={(e) => {
              setFilterStatus(e.currentTarget.value);
              setCurrentPage(1);
            }}
          >
            <option value="">Semua Status</option>
            <option value="HADIR">HADIR</option>
            <option value="TELAT">TELAT</option>
            <option value="IZIN">IZIN</option>
            <option value="ALPHA">ALPHA</option>
          </select>
        </div>
        <button
          onClick={() => {
            setFilterDate("");
            setFilterStatus("");
            setCurrentPage(1);
          }}
          class="btn-ghost"
          style="width: auto;"
        >
          Reset Filter
        </button>
      </div>

      <Show when={history()} fallback={<p>Memuat...</p>}>
        {(rList) => {
          if (rList.length === 999999) console.log(rList);
          return (
            <>
            <div style="overflow-x: auto;">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Tanggal</th>
                    <th>Check-In</th>
                    <th>Check-Out</th>
                    <th>Status</th>
                    <th>Catatan</th>
                  </tr>
                </thead>
                <tbody>
                  <Show
                    when={paginatedRecords().length > 0}
                    fallback={
                      <tr>
                        <td
                          colspan="6"
                          style="text-align: center; color: var(--color-text-secondary); padding: var(--space-5);"
                        >
                          Belum ada riwayat absensi.
                        </td>
                      </tr>
                    }
                  >
                    <For each={paginatedRecords()}>
                      {(r, i) => (
                        <tr>
                          <td style="font-family: var(--font-mono); font-size: 13px;">
                            {(currentPage() - 1) * itemsPerPage + i() + 1}
                          </td>
                          <td>
                            {new Date(r.date).toLocaleDateString("id-ID", {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </td>
                          <td style="font-family: var(--font-mono);">
                            {r.checkIn
                              ? new Date(r.checkIn).toLocaleTimeString("id-ID")
                              : "-"}
                          </td>
                          <td style="font-family: var(--font-mono);">
                            {r.checkOut
                              ? new Date(r.checkOut).toLocaleTimeString("id-ID")
                              : "-"}
                          </td>
                          <td>
                            <span class={statusBadge(r.status)}>
                              {r.status}
                            </span>
                          </td>
                          <td>{r.notes ?? "-"}</td>
                        </tr>
                      )}
                    </For>
                  </Show>
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div class="pagination-container">
              <div class="pagination-info">
                Menampilkan {paginatedRecords().length} dari{" "}
                {filteredRecords().length} riwayat
              </div>
              <div class="pagination-buttons">
                <button
                  class="btn-pagination"
                  disabled={currentPage() === 1}
                  onClick={() => setCurrentPage(currentPage() - 1)}
                >
                  Sebelumnya
                </button>
                <For
                  each={Array.from({ length: totalPages() }, (_, i) => i + 1)}
                >
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
          </>
        ); }}
      </Show>
    </div>
  );
}
