import { createAsync, type RouteDefinition } from "@solidjs/router";
import { For, Show, createSignal } from "solid-js";
import { getAdminAuditLogs } from "~/lib";

export const route = {
  preload() {
    getAdminAuditLogs();
  },
} satisfies RouteDefinition;

export default function AdminAuditLog() {
  const logs = createAsync(() => getAdminAuditLogs());

  const [searchQuery, setSearchQuery] = createSignal("");
  const [filterAction, setFilterAction] = createSignal("");

  // Pagination setup
  const [currentPage, setCurrentPage] = createSignal(1);
  const itemsPerPage = 15;

  const totalPages = () => {
    const list = filteredLogs();
    return Math.max(1, Math.ceil(list.length / itemsPerPage));
  };

  const getPageNumbers = () => {
    const total = totalPages();
    const current = currentPage();
    const pages: (number | string)[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (current > 4) {
        pages.push("...");
      }

      const start = Math.max(2, current - 2);
      const end = Math.min(total - 1, current + 2);

      let adjustStart = start;
      let adjustEnd = end;
      if (current <= 4) {
        adjustEnd = 5;
      } else if (current >= total - 3) {
        adjustStart = total - 4;
      }

      for (let i = adjustStart; i <= adjustEnd; i++) {
        pages.push(i);
      }

      if (current < total - 3) {
        pages.push("...");
      }

      pages.push(total);
    }
    return pages;
  };

  const filteredLogs = () => {
    const list = logs();
    if (!list) return [];
    return list.filter((log) => {
      // Action type filter
      if (filterAction() && log.action !== filterAction()) return false;

      // Text query search
      const q = searchQuery().toLowerCase().trim();
      if (q) {
        const usernameMatch = log.username?.toLowerCase().includes(q);
        const nameMatch = log.user?.fullName?.toLowerCase().includes(q);
        const detailMatch = log.details?.toLowerCase().includes(q);
        const ipMatch = log.ip?.toLowerCase().includes(q);
        const locationMatch = log.location?.toLowerCase().includes(q);
        if (!usernameMatch && !nameMatch && !detailMatch && !ipMatch && !locationMatch) return false;
      }
      return true;
    });
  };

  const paginatedLogs = () => {
    const list = filteredLogs();
    const start = (currentPage() - 1) * itemsPerPage;
    return list.slice(start, start + itemsPerPage);
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

  const formatDateTime = (dateStr: Date | string) => {
    const d = new Date(dateStr);
    const dateFormatted = d.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const timeFormatted = d.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    return `${dateFormatted} ${timeFormatted}`;
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
                      {formatDateTime(row.createdAt)}
                    </td>
                    <td>
                      <Show when={row.user} fallback={
                        <span>
                          <strong style="color: var(--color-text-secondary);">{row.username || "Anonim"}</strong>
                          <div style="font-size: 11px; color: var(--color-text-secondary);">Non-aktif / Tamu</div>
                        </span>
                      }>
                        <strong>{row.user?.fullName}</strong>
                        <div style="font-size: 12px; color: var(--color-text-secondary);">
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
                      style="max-width: 250px; overflow: hidden; text-overflow: ellipsis; font-size: 13px;"
                      title={row.details || ""}
                    >
                      {row.details || "-"}
                    </td>
                    <td style="font-family: var(--font-mono); font-size: 13px;">
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
      <Show when={filteredLogs().length > 0}>
        <div class="pagination-container">
          <div class="pagination-info">
            Menampilkan {paginatedLogs().length} dari{" "}
            {filteredLogs().length} log aktivitas
          </div>
          <div class="pagination-buttons">
            <button
              class="btn-pagination"
              disabled={currentPage() === 1}
              onClick={() => setCurrentPage(currentPage() - 1)}
            >
              Sebelumnya
            </button>
            <For each={getPageNumbers()}>
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
