import { createAsync, type RouteDefinition } from "@solidjs/router";
import { For, Show, Suspense, createSignal } from "solid-js";
import { getAdminAbsensi, getAllDivisi, getPageNumbers } from "~/lib";

export const route = {
  preload() {
    getAdminAbsensi({ page: 1, limit: 10, search: "", date: "", status: "", divisiId: "" });
    getAllDivisi();
  },
} satisfies RouteDefinition;

export default function AdminAbsensi() {
  const divisiList = createAsync(() => getAllDivisi());

  // Get local today date as YYYY-MM-DD
  const getTodayString = () => {
    const tzoffset = new Date().getTimezoneOffset() * 60000;
    const localISOTime = new Date(Date.now() - tzoffset)
      .toISOString()
      .slice(0, 10);
    return localISOTime;
  };

  const [filterDate, setFilterDate] = createSignal(getTodayString());
  const [searchQuery, setSearchQuery] = createSignal("");
  const [debouncedSearch, setDebouncedSearch] = createSignal("");
  const [filterDivisi, setFilterDivisi] = createSignal("");
  const [filterStatus, setFilterStatus] = createSignal("");

  // Pagination setup
  const [currentPage, setCurrentPage] = createSignal(1);
  const itemsPerPage = 10;

  let debounceTimer: any;
  const handleSearchInput = (val: string) => {
    setSearchQuery(val);
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      setDebouncedSearch(val);
      setCurrentPage(1);
    }, 400);
  };

  const recordsData = createAsync(() =>
    getAdminAbsensi({
      page: currentPage(),
      limit: itemsPerPage,
      search: debouncedSearch(),
      date: filterDate(),
      status: filterStatus(),
      divisiId: filterDivisi(),
    })
  );

  const totalPages = () => {
    const total = recordsData()?.total ?? 0;
    return Math.max(1, Math.ceil(total / itemsPerPage));
  };

  const paginatedRecords = () => {
    return recordsData()?.items ?? [];
  };

  return (
    <main>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4); flex-wrap: wrap; gap: var(--space-3); text-align: left;">
        <h1 class="page-title" style="margin-bottom: 0;">
          Monitor Absensi
        </h1>
      </div>

      <div class="filter-card" style="margin-bottom: var(--space-4);">
        <div class="form-group">
          <label>Cari Nama/Username</label>
          <input
            type="text"
            placeholder="Cari nama/username..."
            value={searchQuery()}
            onInput={(e) => handleSearchInput(e.currentTarget.value)}
          />
        </div>
        <div class="form-group">
          <label>Tanggal</label>
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
          <label>Status Kehadiran</label>
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
        <div class="form-group">
          <label>Pilih Divisi</label>
          <select
            value={filterDivisi()}
            onChange={(e) => {
              setFilterDivisi(e.currentTarget.value);
              setCurrentPage(1);
            }}
          >
            <option value="">Semua Divisi</option>
            <For each={divisiList()}>
              {(d) => <option value={d.id}>{d.name}</option>}
            </For>
          </select>
        </div>
        <button
          onClick={() => {
            setSearchQuery("");
            setDebouncedSearch("");
            setFilterDate(getTodayString());
            setFilterStatus("");
            setFilterDivisi("");
            setCurrentPage(1);
          }}
          class="btn-ghost"
          style="width: auto;"
        >
          Reset Filter
        </button>
      </div>

      <Suspense fallback={
        <div style="text-align: center; padding: var(--space-6); color: var(--color-text-secondary);">
          Memuat data absensi...
        </div>
      }>
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
                    <td
                      colspan="8"
                      style="text-align: center; color: var(--color-text-secondary); padding: var(--space-5);"
                    >
                      Tidak ada catatan absensi untuk kriteria yang dipilih.
                    </td>
                  </tr>
                }
              >
                <For each={paginatedRecords()}>
                  {(row, idx) => {
                    const dateFormatted = new Date(row.date).toLocaleDateString(
                      "id-ID",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    );

                    const checkInTime = row.checkIn
                      ? new Date(row.checkIn).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "-";

                    const checkOutTime = row.checkOut
                      ? new Date(row.checkOut).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
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
                        <td style="font-family: var(--font-mono);">
                          {checkInTime}
                        </td>
                        <td style="font-family: var(--font-mono);">
                          {checkOutTime}
                        </td>
                        <td>
                          <span class={`badge badge-${row.status.toLowerCase()}`}>
                            {row.status}
                          </span>
                        </td>
                        <td
                          style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
                          title={row.notes ?? ""}
                        >
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
        <Show when={(recordsData()?.total ?? 0) > 0}>
          <div class="pagination-container">
            <div class="pagination-info">
              Menampilkan {paginatedRecords().length} dari{" "}
              {recordsData()?.total ?? 0} catatan absensi
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
      </Suspense>
    </main>
  );
}
