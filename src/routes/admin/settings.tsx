import { createAsync, useSubmission, type RouteDefinition } from "@solidjs/router";
import { Show, createEffect } from "solid-js";
import { getSystemSettings, updateSystemSettings } from "~/lib";
import { showToast } from "~/lib/toast";

export const route = {
  preload() {
    getSystemSettings();
  },
} satisfies RouteDefinition;

export default function AdminSettings() {
  const settings = createAsync(() => getSystemSettings());
  const updating = useSubmission(updateSystemSettings);

  createEffect(() => { if ((updating.result as any) instanceof Error) showToast(((updating.result as any) as Error).message); });

  return (
    <main style="max-width: 600px; margin: 0 auto; text-align: left;">
      <h1 class="page-title">Pengaturan Sistem</h1>

      <Show when={settings()} fallback={<p>Memuat pengaturan...</p>}>
        {(data) => (
          <div class="settings-card">
            <h3 style="margin-top: 0; font-family: var(--font-headline); font-weight: 700; margin-bottom: var(--space-4);">
              Konfigurasi Absensi
            </h3>
            <form action={updateSystemSettings} method="post">
              <div class="form-group">
                <label for="jam-masuk">Jam Masuk (Format 24 Jam)</label>
                <input
                  id="jam-masuk"
                  name="jamMasuk"
                  type="time"
                  value={data().jamMasuk || "08:00"}
                  required
                />
              </div>

              <div class="form-group">
                <label for="toleransi-menit">Toleransi Keterlambatan (Menit)</label>
                <input
                  id="toleransi-menit"
                  name="toleransiMenit"
                  type="number"
                  min="0"
                  value={data().toleransiMenit ?? 0}
                  required
                />
              </div>

              <div class="form-group">
                <label for="jam-mulai-checkout">Jam Mulai Check-Out (Format 24 Jam)</label>
                <input
                  id="jam-mulai-checkout"
                  name="jamMulaiCheckout"
                  type="time"
                  value={data().jamMulaiCheckout || "16:00"}
                  required
                />
              </div>

              <div class="form-group">
                <label for="lokasi-kantor">Lokasi Kantor (Default)</label>
                <input
                  id="lokasi-kantor"
                  name="lokasiKantor"
                  type="text"
                  placeholder="Masukkan lokasi kantor"
                  value={data().lokasiKantor || "Kantor PT. SBI Cilacap"}
                  required
                />
              </div>

              <button
                class="btn-primary"
                type="submit"
                disabled={updating.pending}
                style="width: auto; padding: 0 var(--space-4); margin-top: var(--space-4);"
              >
                {updating.pending ? "Menyimpan..." : "Simpan Pengaturan"}
              </button>
            </form>
          </div>
        )}
      </Show>
    </main>
  );
}
