import { createAsync, type RouteDefinition } from "@solidjs/router";
import { For, Show, createSignal } from "solid-js";
import { getAdminAuditLogs, getPageNumbers } from "~/lib";

export const route = {
  preload() {
    getAdminAuditLogs({ page: 1, limit: 15, search: "", action: "" });
  },
} satisfies RouteDefinition;

export default function AdminAuditLog() {
  const [searchQuery, setSearchQuery] = createSignal("");
  const [filterAction, setFilterAction] = createSignal("");

  // Pagination setup
  const [currentPage, setCurrentPage] = createSignal(1);
  const itemsPerPage = 15;

  const logs = createAsync(() =>
    getAdminAuditLogs({
      page: currentPage(),
      limit: itemsPerPage,
      search: searchQuery(),
      action: filterAction(),
    })
  );

  const totalPages = () => {
    const total = logs()?.total ?? 0;
    return Math.max(1, Math.ceil(total / itemsPerPage));
  };

  const paginatedLogs = () => {
    return logs()?.items ?? [];
  };

  const getActionBadgeClass = (action: string) => {
    switch (action) {
      case "LOGIN":
      case "REGISTER":
      case "BUAT_PENGGUNA":
      case "BUAT_DIVISI":
      case "SETUJUI_IZIN":
      case "CHECK_IN":
        return "badge-approved";
      case "UPDATE_PENGGUNA":
      case "UPDATE_DIVISI":
      case "UPDATE_PENGATURAN":
      case "CHECK_OUT":
        return "badge-pending";
      case "LOGOUT":
      case "HAPUS_PENGGUNA":
      case "HAPUS_DIVISI":
      case "TOLAK_IZIN":
        return "badge-rejected";
      case "AKSES_HALAMAN":
      case "PENGAJUAN_IZIN":
        return "badge-izin";
      default:
        return "badge-pending";
    }
  };

  const formatDate = (dateStr: Date | string) => {
    const d = new Date(dateStr);
    const day = d.getDate();
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const formatTime = (dateStr: Date | string) => {
    const d = new Date(dateStr);
    const h = String(d.getHours()).padStart(2, "0");
    const m = String(d.getMinutes()).padStart(2, "0");
    const s = String(d.getSeconds()).padStart(2, "0");
    return `${h}.${m}.${s}`;
  };

  return (
    <main>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4); flex-wrap: wrap; gap: var(--space-3); text-align: left;">
        <h1 class="page-title" style="margin-bottom: 0;">
          Audit Log Aktivitas
        </h1>
      </div>

      <div class="filter-card" style="margin-bottom: var(--space-4);">
        <div class="form-group">
          <label>Cari Informasi</label>
          <input
            type="text"
            placeholder="Cari user, IP, lokasi, atau detail..."
            value={searchQuery()}
            onInput={(e) => {
              setSearchQuery(e.currentTarget.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div class="form-group">
          <label>Filter Aktivitas</label>
          <select
            value={filterAction()}
            onChange={(e) => {
              setFilterAction(e.currentTarget.value);
              setCurrentPage(1);
            }}
          >
            <option value="">Semua Aktivitas</option>
            <option value="LOGIN">LOGIN</option>
            <option value="REGISTER">REGISTER</option>
            <option value="LOGOUT">LOGOUT</option>
            <option value="AKSES_HALAMAN">AKSES HALAMAN</option>
            <option value="CHECK_IN">CHECK IN</option>
            <option value="CHECK_OUT">CHECK OUT</option>
            <option value="PENGAJUAN_IZIN">PENGAJUAN IZIN</option>
            <option value="SETUJUI_IZIN">SETUJUI IZIN</option>
            <option value="TOLAK_IZIN">TOLAK IZIN</option>
            <option value="BUAT_PENGGUNA">BUAT PENGGUNA</option>
            <option value="UPDATE_PENGGUNA">UPDATE PENGGUNA</option>
            <option value="HAPUS_PENGGUNA">HAPUS PENGGUNA</option>
            <option value="BUAT_DIVISI">BUAT DIVISI</option>
            <option value="UPDATE_DIVISI">UPDATE DIVISI</option>
            <option value="HAPUS_DIVISI">HAPUS DIVISI</option>
            <option value="UPDATE_PENGATURAN">UPDATE CONFIG</option>
          </select>
        </div>
        <button
          onClick={() => {
            setSearchQuery("");
            setFilterAction("");
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
              <th>Waktu</th>
              <th>Pengguna</th>
              <th>Aktivitas</th>
              <th>Detail</th>
              <th>IP Address</th>
              <th>Lokasi</th>
              <th>Browser / OS</th>
            </tr>
          </thead>
          <tbody>
            <Show
              when={paginatedLogs().length > 0}
              fallback={
                <tr>
                  <td
                    colspan="8"
                    style="text-align: center; color: var(--color-text-secondary); padding: var(--space-5);"
                  >
                    Tidak ada log aktivitas untuk kriteria yang dipilih.
                  </td>
                </tr>
              }
            >
              <For each={paginatedLogs()}>
                {(row, idx) => (
                  <tr>
                    <td style="font-family: var(--font-mono); font-size: 13px;">
                      {(currentPage() - 1) * itemsPerPage + idx() + 1}
                    </td>
                    <td style="font-size: 13px; white-space: nowrap;">
                      <div>{formatDate(row.createdAt)}</div>
                      <div style="font-size: 12px; color: var(--color-text-secondary);">{formatTime(row.createdAt)}</div>
                    </td>
                    <td style="max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title={row.user?.fullName ? `${row.user.fullName} (@${row.username})` : row.username || "Anonim"}>
                      <Show when={row.user} fallback={
                        <span>
                          <strong style="color: var(--color-text-secondary); display: block; overflow: hidden; text-overflow: ellipsis;">{row.username || "Anonim"}</strong>
                          <div style="font-size: 11px; color: var(--color-text-secondary); overflow: hidden; text-overflow: ellipsis;">Non-aktif / Tamu</div>
                        </span>
                      }>
                        <strong style="display: block; overflow: hidden; text-overflow: ellipsis;">{row.user?.fullName}</strong>
                        <div style="font-size: 12px; color: var(--color-text-secondary); overflow: hidden; text-overflow: ellipsis;">
                          @{row.username}
                        </div>
                      </Show>
                    </td>
                    <td>
                      <span class={`badge ${getActionBadgeClass(row.action)}`}>
                        {row.action.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td
                      style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; font-size: 13px;"
                      title={row.details || ""}
                    >
                      {row.details || "-"}
                    </td>
                    <td
                      style="font-family: var(--font-mono); font-size: 13px; max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; cursor: pointer;"
                      title={`Klik untuk menyalin IP: ${row.ip || "-"}`}
                      onClick={() => {
                        if (row.ip) {
                          navigator.clipboard.writeText(row.ip);
                          alert(`IP Address (${row.ip}) disalin ke clipboard!`);
                        }
                      }}
                    >
                      {row.ip || "-"}
                    </td>
                    <td style="font-size: 13px;" title={row.location || ""}>
                      {row.location || "-"}
                    </td>
                    <td style="font-size: 12px;" title={row.userAgent || ""}>
                      {row.userAgent || "-"}
                    </td>
                  </tr>
                )}
              </For>
            </Show>
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <Show when={(logs()?.total ?? 0) > 0}>
        <div class="pagination-container">
          <div class="pagination-info">
            Menampilkan {paginatedLogs().length} dari{" "}
            {logs()?.total ?? 0} log aktivitas
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
