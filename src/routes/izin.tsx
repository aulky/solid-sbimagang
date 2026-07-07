import { createAsync, useSubmission, type RouteDefinition } from "@solidjs/router";
import { For, Show } from "solid-js";
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
      : "badge-rejected";

export default function Izin() {
  const izinList = createAsync(() => getUserIzinList());
  const submitting = useSubmission(submitIzin);

  return (
    <div>
      <h1 class="page-title">Pengajuan Izin</h1>

      <div class="form-card">
        <h2>Ajukan Izin Baru</h2>
        <form action={submitIzin} method="post">
          <div class="form-group">
            <label for="type">Tipe</label>
            <select name="type" id="type" required>
              <option value="">-- Pilih Tipe --</option>
              <option value="SAKIT">Sakit</option>
              <option value="IZIN">Izin</option>
              <option value="CUTI">Cuti</option>
            </select>
          </div>
          <div class="form-group">
            <label for="startDate">Tanggal Mulai</label>
            <input type="date" name="startDate" id="startDate" required />
          </div>
          <div class="form-group">
            <label for="endDate">Tanggal Selesai</label>
            <input type="date" name="endDate" id="endDate" required />
          </div>
          <div class="form-group">
            <label for="reason">Alasan</label>
            <textarea name="reason" id="reason" rows="3" required />
          </div>
          <button class="btn-primary" type="submit" disabled={submitting.pending}>
            {submitting.pending ? "Mengirim..." : "Kirim Pengajuan"}
          </button>
          <Show when={submitting.result && "error" in (submitting.result as any)}>
            <p class="alert-error">{(submitting.result as any)?.error}</p>
          </Show>
        </form>
      </div>

      <h2 style={{ "margin-top": "2rem" }}>Riwayat Pengajuan</h2>
      <Show when={izinList()} fallback={<p>Memuat...</p>}>
        {(list) => (
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
              <For each={list()}>
                {(r, i) => (
                  <tr>
                    <td>{i() + 1}</td>
                    <td>{new Date(r.startDate).toLocaleDateString("id-ID")}</td>
                    <td>{new Date(r.endDate).toLocaleDateString("id-ID")}</td>
                    <td>{r.type}</td>
                    <td>{r.reason}</td>
                    <td><span class={statusBadge(r.status)}>{r.status}</span></td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        )}
      </Show>
    </div>
  );
}
