import { createAsync, type RouteDefinition } from "@solidjs/router";
import { For, Show, createSignal } from "solid-js";
import { getAdminAbsensi } from "~/lib";

export const route = {
  preload() {
    getAdminAbsensi();
  }
} satisfies RouteDefinition;

export default function AdminAbsensi() {
  const records = createAsync(() => getAdminAbsensi());

  // Get local today date as YYYY-MM-DD
  const getTodayString = () => {
    const tzoffset = (new Date()).getTimezoneOffset() * 60000;
    const localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 10);
    return localISOTime;
  };

  const [filterDate, setFilterDate] = createSignal(getTodayString());

  // Pagination setup
  const [currentPage, setCurrentPage] = createSignal(1);
  const itemsPerPage = 10;

  const totalPages = () => {
    const list = filteredRecords();
    return Math.max(1, Math.ceil(list.length / itemsPerPage));
  };

  const filteredRecords = () => {
    const list = records();
    if (!list) return [];
    if (!filterDate()) return list;
    return list.filter(r => {
      const rDate = new Date(r.date).toISOString().slice(0, 10);
      return rDate === filterDate();
    });
  };

  const paginatedRecords = () => {
    const list = filteredRecords();
    const start = (currentPage() - 1) * itemsPerPage;
    return list.slice(start, start + itemsPerPage);
  };

  return (
    <main>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4); flex-wrap: wrap; gap: var(--space-3);">
        <h1 class="page-title" style="margin-bottom: 0;">Monitor Absensi</h1>

        <div style="display: flex; align-items: center; gap: var(--space-2); flex-wrap: wrap;">
          <label style="font-family: var(--font-headline); font-weight: 600; font-size: 14px; color: var(--color-text-secondary);">
            Tanggal:
          </label>
          <input
            type="date"
            value={filterDate()}
            onInput={(e) => {
              setFilterDate(e.currentTarget.value);
              setCurrentPage(1); // Reset page on filter change
            }}
            style="width: auto; height: 38px; padding: 6px 12px; font-size: 14px;"
          />
          <button
            onClick={() => {
              setFilterDate("");
              setCurrentPage(1);
            }}
            class="btn-ghost"
            style="width: auto; height: 38px; padding: 0 var(--space-3);"
          >
            Semua Hari
          </button>
        </div>
      </div>

      <div style="overflow-x: auto;">
        <table class="data-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Lengkap</th>
              <th>Divisi</th>
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
                  <td colspan="8" style="text-align: center; color: var(--color-text-secondary); padding: var(--space-5);">
                    Tidak ada catatan absensi untuk kriteria yang dipilih.
                  </td>
                </tr>
              }
            >
              <For each={paginatedRecords()}>
                {(row, idx) => {
                  const dateFormatted = new Date(row.date).toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  });

                  const checkInTime = row.checkIn
                    ? new Date(row.checkIn).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit"
                      })
                    : "-";

                  const checkOutTime = row.checkOut
                    ? new Date(row.checkOut).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit"
                      })
                    : "-";

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
                      </td>
                      <td>{row.user.divisi?.name ?? "-"}</td>
                      <td>{dateFormatted}</td>
                      <td style="font-family: var(--font-mono);">{checkInTime}</td>
                      <td style="font-family: var(--font-mono);">{checkOutTime}</td>
                      <td>
                        <span class={`badge badge-${row.status.toLowerCase()}`}>
                          {row.status}
                        </span>
                      </td>
                      <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title={row.notes ?? ""}>
                        {row.notes ?? "-"}
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
      <Show when={filteredRecords().length > 0}>
        <div class="pagination-container">
          <div class="pagination-info">
            Menampilkan {paginatedRecords().length} dari {filteredRecords().length} catatan absensi
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
