import { createAsync, useSubmission, type RouteDefinition } from "@solidjs/router";
import { For, Show } from "solid-js";
import { getAdminIzin, approveIzin } from "~/lib";

export const route = {
  preload() {
    getAdminIzin();
  }
} satisfies RouteDefinition;

export default function AdminIzin() {
  const records = createAsync(() => getAdminIzin());
  const approving = useSubmission(approveIzin);

  return (
    <main>
      <h1 class="page-title">Kelola Pengajuan Izin</h1>

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
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <Show
              when={records() && records()!.length > 0}
              fallback={
                <tr>
                  <td colspan="8" style="text-align: center; color: var(--color-text-secondary); padding: var(--space-5);">
                    Belum ada pengajuan izin.
                  </td>
                </tr>
              }
            >
              <For each={records()}>
                {(row, idx) => {
                  const startDate = new Date(row.startDate).toLocaleDateString("id-ID");
                  const endDate = new Date(row.endDate).toLocaleDateString("id-ID");

                  return (
                    <tr>
                      <td style="font-family: var(--font-mono); font-size: 13px;">{idx() + 1}</td>
                      <td>
                        <strong>{row.user.fullName}</strong>
                        <div style="font-size: 12px; color: var(--color-text-secondary);">@{row.user.username}</div>
                      </td>
                      <td>
                        <span class="badge badge-izin">{row.type}</span>
                      </td>
                      <td>{startDate}</td>
                      <td>{endDate}</td>
                      <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title={row.reason}>
                        {row.reason}
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
                              <input type="hidden" name="status" value="APPROVED" />
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
                              <input type="hidden" name="status" value="REJECTED" />
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
                          <span style="color: var(--color-text-secondary); font-size: 13px;">—</span>
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
    </main>
  );
}
