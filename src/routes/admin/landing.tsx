import {
  createAsync,
  useSubmission,
  useSearchParams,
  type RouteDefinition,
} from "@solidjs/router";
import { Show, For, createSignal, createEffect } from "solid-js";
import { Portal } from "solid-js/web";
import {
  getAdminLandingSettings,
  updateLandingSettings,
  getAdminLandingList,
  createLandingListItem,
  updateLandingListItem,
  deleteLandingListItem,
  getAdminTestimoni,
  updateTestimoni,
  deleteTestimoni,
  getAdminKuota,
  upsertKuota,
  deleteKuota,
  getAllBatches,
} from "~/lib";
import { showToast } from "~/lib/toast";

export const route = {
  preload() {
    getAdminLandingSettings();
    getAllBatches();
  },
} satisfies RouteDefinition;

function HeroTab() {
  const settings = createAsync(() => getAdminLandingSettings());
  const updating = useSubmission(updateLandingSettings);

  createEffect(() => {
    if ((updating.result as any) instanceof Error)
      showToast((updating.result as any as Error).message, "error");
  });

  return (
    <Show
      when={settings()}
      fallback={
        <div
          class="settings-card skeleton-card"
          style="opacity: 0.6; pointer-events: none;"
        ></div>
      }
    >
      {(data) => (
        <div class="settings-card">
          <h3 style="margin-top: 0; font-family: var(--font-headline); font-weight: 700; margin-bottom: var(--space-4);">
            Hero &amp; Kontak
          </h3>
          <form action={updateLandingSettings} method="post">
            <div class="form-group">
              <label>Judul Hero</label>
              <input name="heroTitle" value={data().heroTitle} required minLength={3} />
            </div>
            <div class="form-group">
              <label>Subjudul Hero</label>
              <input name="heroSubtitle" value={data().heroSubtitle ?? ""} />
            </div>
            <div class="form-group">
              <label>Tentang Program</label>
              <textarea name="aboutText" rows="4">
                {data().aboutText ?? ""}
              </textarea>
            </div>
            <div class="form-group">
              <label>Nomor WhatsApp (contoh: 6281234567890)</label>
              <input name="contactWhatsapp" value={data().contactWhatsapp ?? ""} />
            </div>
            <div class="form-group">
              <label>Email Kontak</label>
              <input name="contactEmail" type="email" value={data().contactEmail ?? ""} />
            </div>
            <div class="form-group">
              <label>Alamat</label>
              <textarea name="contactAddress" rows="2">
                {data().contactAddress ?? ""}
              </textarea>
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
  );
}

function KuotaTab() {
  const [searchParams, setSearchParams] = useSearchParams();
  const batches = createAsync(() => getAllBatches());
  const selectedBatchId = () => (searchParams.batchId as string) || "";
  const kuotaList = createAsync(() =>
    selectedBatchId() ? getAdminKuota(selectedBatchId()) : getAdminKuota(),
  );

  const saving = useSubmission(upsertKuota);
  const removing = useSubmission(deleteKuota);

  createEffect(() => {
    if (saving.result instanceof Error)
      showToast(saving.result.message, "error");
  });
  createEffect(() => {
    if ((removing.result as any) instanceof Error)
      showToast((removing.result as any as Error).message, "error");
  });

  return (
    <div class="settings-card">
      <div class="form-group" style="max-width: 400px;">
        <label>Pilih Batch Magang</label>
        <select
          value={selectedBatchId()}
          onChange={(e) =>
            setSearchParams({
              tab: "kuota",
              batchId: e.currentTarget.value || null,
            })
          }
        >
          <option value="">-- Pilih Batch --</option>
          <For each={batches()}>{(b) => <option value={b.id}>{b.name}</option>}</For>
        </select>
      </div>

      <Show
        when={selectedBatchId()}
        fallback={
          <p style="color: var(--color-text-secondary);">
            Pilih batch magang untuk mengatur kuota per divisi.
          </p>
        }
      >
        <div style="overflow-x: auto;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Divisi</th>
                <th>Kuota</th>
                <th>Terisi</th>
                <th>Sisa</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <For each={kuotaList()}>
                {(row) => {
                  const [quota, setQuota] = createSignal(row.quota ?? 0);
                  const sisa = () => Math.max(0, quota() - row.filled);
                  return (
                    <tr>
                      <td>{row.divisi.name}</td>
                      <td>
                        <form
                          action={upsertKuota}
                          method="post"
                          style="display: flex; gap: var(--space-2); align-items: center;"
                        >
                          <input type="hidden" name="batchId" value={selectedBatchId()} />
                          <input type="hidden" name="divisiId" value={row.divisi.id} />
                          <input
                            type="number"
                            name="quota"
                            min="0"
                            value={quota()}
                            onInput={(e) => setQuota(Number(e.currentTarget.value))}
                            style="width: 80px;"
                          />
                          <button
                            class="btn-secondary"
                            type="submit"
                            disabled={saving.pending}
                            style="width: auto; height: 32px; padding: 0 12px; font-size: 13px;"
                          >
                            Simpan
                          </button>
                        </form>
                      </td>
                      <td>{row.filled}</td>
                      <td>
                        <span class={`badge ${sisa() > 0 ? "badge-approved" : "badge-rejected"}`}>
                          {sisa() > 0 ? `${sisa()} Tersedia` : "Penuh"}
                        </span>
                      </td>
                      <td>
                        <form action={deleteKuota} method="post">
                          <input type="hidden" name="batchId" value={selectedBatchId()} />
                          <input type="hidden" name="divisiId" value={row.divisi.id} />
                          <button
                            class="btn-danger"
                            type="submit"
                            disabled={row.quota === null || removing.pending}
                            style="width: auto; height: 32px; padding: 0 12px; font-size: 13px;"
                          >
                            Hapus
                          </button>
                        </form>
                      </td>
                    </tr>
                  );
                }}
              </For>
            </tbody>
          </table>
        </div>
      </Show>
    </div>
  );
}

function LandingListTab(props: { section: "FAQ" | "SYARAT"; label: string }) {
  const list = createAsync(() => getAdminLandingList(props.section));
  const [showCreate, setShowCreate] = createSignal(false);
  const [editingItem, setEditingItem] = createSignal<{
    id: string;
    title: string;
    body: string | null;
    order: number;
    isActive: boolean;
  } | null>(null);
  const [deletingItem, setDeletingItem] = createSignal<{
    id: string;
    title: string;
  } | null>(null);
  let createFormRef: HTMLFormElement | undefined;

  const creating = useSubmission(createLandingListItem);
  const updating = useSubmission(updateLandingListItem);
  const deleting = useSubmission(deleteLandingListItem);

  let prevCreatingPending = false;
  createEffect(() => {
    const pending = !!creating.pending;
    if (prevCreatingPending && !pending && !creating.error) {
      createFormRef?.reset();
      setShowCreate(false);
    }
    prevCreatingPending = pending;
  });
  let prevUpdatingPending = false;
  createEffect(() => {
    const pending = !!updating.pending;
    if (prevUpdatingPending && !pending && !updating.error) setEditingItem(null);
    prevUpdatingPending = pending;
  });
  let prevDeletingPending = false;
  createEffect(() => {
    const pending = !!deleting.pending;
    if (prevDeletingPending && !pending && !deleting.error) setDeletingItem(null);
    prevDeletingPending = pending;
  });

  createEffect(() => {
    if (creating.result instanceof Error)
      showToast(creating.result.message, "error");
  });
  createEffect(() => {
    if ((updating.result as any) instanceof Error)
      showToast((updating.result as any as Error).message, "error");
  });
  createEffect(() => {
    if ((deleting.result as any) instanceof Error)
      showToast((deleting.result as any as Error).message, "error");
  });

  const isFaq = () => props.section === "FAQ";

  return (
    <div>
      <div style="display: flex; justify-content: flex-end; margin-bottom: var(--space-3);">
        <button
          class="btn-primary"
          style="width: auto; padding: 0 var(--space-4); height: 40px;"
          onClick={() => setShowCreate(true)}
        >
          Tambah {props.label}
        </button>
      </div>

      <Show when={showCreate()}>
        <Portal>
          <div class="modal-overlay" onClick={() => setShowCreate(false)}>
            <div class="modal modal-animate" onClick={(e) => e.stopPropagation()}>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4); border-bottom: 1px solid var(--color-border); padding-bottom: var(--space-2);">
                <h3 style="margin: 0; font-family: var(--font-headline); font-weight: 700;">
                  Tambah {props.label}
                </h3>
                <button
                  class="theme-toggle"
                  style="font-size: 24px; padding: 0; cursor: pointer;"
                  onClick={() => setShowCreate(false)}
                >
                  ×
                </button>
              </div>
              <form ref={createFormRef} action={createLandingListItem} method="post">
                <input type="hidden" name="section" value={props.section} />
                <div class="form-group">
                  <label>{isFaq() ? "Pertanyaan" : "Teks Syarat"}</label>
                  <input
                    name="title"
                    required
                    minLength={3}
                    placeholder={isFaq() ? "Masukkan pertanyaan" : "Masukkan syarat pendaftaran"}
                  />
                </div>
                <Show when={isFaq()}>
                  <div class="form-group">
                    <label>Jawaban</label>
                    <textarea name="body" rows="3" placeholder="Masukkan jawaban" />
                  </div>
                </Show>
                <div class="form-group">
                  <label>Urutan</label>
                  <input name="order" type="number" min="0" value="0" />
                </div>
                <div style="display: flex; gap: var(--space-2); margin-top: var(--space-4);">
                  <button class="btn-primary" type="submit" disabled={creating.pending}>
                    {creating.pending ? "Menyimpan..." : "Simpan"}
                  </button>
                  <button class="btn-ghost" type="button" onClick={() => setShowCreate(false)}>
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Portal>
      </Show>

      <Show when={editingItem()}>
        {(item) => (
          <Portal>
            <div class="modal-overlay" onClick={() => setEditingItem(null)}>
              <div class="modal modal-animate" onClick={(e) => e.stopPropagation()}>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4); border-bottom: 1px solid var(--color-border); padding-bottom: var(--space-2);">
                  <h3 style="margin: 0; font-family: var(--font-headline); font-weight: 700;">
                    Edit {props.label}
                  </h3>
                  <button
                    class="theme-toggle"
                    style="font-size: 24px; padding: 0; cursor: pointer;"
                    onClick={() => setEditingItem(null)}
                  >
                    ×
                  </button>
                </div>
                <form action={updateLandingListItem} method="post">
                  <input type="hidden" name="id" value={item().id} />
                  <input type="hidden" name="section" value={props.section} />
                  <div class="form-group">
                    <label>{isFaq() ? "Pertanyaan" : "Teks Syarat"}</label>
                    <input name="title" value={item().title} required minLength={3} />
                  </div>
                  <Show when={isFaq()}>
                    <div class="form-group">
                      <label>Jawaban</label>
                      <textarea name="body" rows="3">
                        {item().body ?? ""}
                      </textarea>
                    </div>
                  </Show>
                  <div class="form-group">
                    <label>Urutan</label>
                    <input name="order" type="number" min="0" value={item().order} />
                  </div>
                  <div class="form-group" style="display: flex; align-items: center; gap: var(--space-2);">
                    <input
                      type="checkbox"
                      name="isActive"
                      id={`active-${item().id}`}
                      checked={item().isActive}
                      style="width: auto;"
                    />
                    <label for={`active-${item().id}`} style="margin: 0;">
                      Tampilkan di landing page
                    </label>
                  </div>
                  <div style="display: flex; gap: var(--space-2); margin-top: var(--space-4);">
                    <button class="btn-primary" type="submit" disabled={updating.pending}>
                      {updating.pending ? "Menyimpan..." : "Simpan"}
                    </button>
                    <button class="btn-ghost" type="button" onClick={() => setEditingItem(null)}>
                      Batal
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </Portal>
        )}
      </Show>

      <Show when={deletingItem()}>
        {(item) => (
          <Portal>
            <div class="modal-overlay" onClick={() => setDeletingItem(null)}>
              <div
                class="modal modal-animate"
                onClick={(e) => e.stopPropagation()}
                style="max-width: 400px;"
              >
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4); border-bottom: 1px solid var(--color-border); padding-bottom: var(--space-2);">
                  <h3 style="margin: 0; font-family: var(--font-headline); font-weight: 700;">
                    Konfirmasi Hapus
                  </h3>
                  <button
                    class="theme-toggle"
                    style="font-size: 24px; padding: 0; cursor: pointer;"
                    onClick={() => setDeletingItem(null)}
                  >
                    ×
                  </button>
                </div>
                <form action={deleteLandingListItem} method="post">
                  <input type="hidden" name="id" value={item().id} />
                  <input type="hidden" name="section" value={props.section} />
                  <p style="margin-top: 0; margin-bottom: var(--space-4); font-size: 14px; color: var(--color-text); line-height: 1.5; text-align: left;">
                    Apakah Anda yakin ingin menghapus <strong>{item().title}</strong>?
                  </p>
                  <div style="display: flex; gap: var(--space-2);">
                    <button
                      class="btn-danger"
                      type="submit"
                      disabled={deleting.pending}
                      style="width: auto; padding: 0 var(--space-4);"
                    >
                      {deleting.pending ? "Menghapus..." : "Hapus"}
                    </button>
                    <button
                      class="btn-ghost"
                      type="button"
                      onClick={() => setDeletingItem(null)}
                      style="width: auto; padding: 0 var(--space-4);"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </Portal>
        )}
      </Show>

      <div style="overflow-x: auto;">
        <table class="data-table">
          <thead>
            <tr>
              <th>{isFaq() ? "Pertanyaan" : "Teks Syarat"}</th>
              <Show when={isFaq()}>
                <th>Jawaban</th>
              </Show>
              <th>Urutan</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <Show
              when={list() && list()!.length > 0}
              fallback={
                <tr>
                  <td
                    colspan={isFaq() ? 5 : 4}
                    style="text-align: center; color: var(--color-text-secondary); padding: var(--space-5);"
                  >
                    Belum ada data {props.label.toLowerCase()}.
                  </td>
                </tr>
              }
            >
              <For each={list()}>
                {(item) => (
                  <tr>
                    <td
                      style="max-width: 260px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
                      title={item.title}
                    >
                      {item.title}
                    </td>
                    <Show when={isFaq()}>
                      <td
                        style="max-width: 260px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
                        title={item.body ?? ""}
                      >
                        {item.body ?? "-"}
                      </td>
                    </Show>
                    <td>{item.order}</td>
                    <td>
                      <span class={`badge ${item.isActive ? "badge-approved" : "badge-rejected"}`}>
                        {item.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td>
                      <button
                        class="btn-secondary"
                        style="display: inline-flex; width: auto; height: 32px; padding: 0 12px; font-size: 13px;"
                        onClick={() => setEditingItem(item)}
                      >
                        Edit
                      </button>{" "}
                      <button
                        class="btn-danger"
                        style="display: inline-flex; width: auto; height: 32px; padding: 0 12px; font-size: 13px;"
                        onClick={() => setDeletingItem({ id: item.id, title: item.title })}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                )}
              </For>
            </Show>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TestimoniTab() {
  const list = createAsync(() => getAdminTestimoni());
  const [editingItem, setEditingItem] = createSignal<{
    id: string;
    name: string;
    roleInfo: string | null;
    message: string;
    order: number;
    isActive: boolean;
  } | null>(null);
  const [deletingItem, setDeletingItem] = createSignal<{
    id: string;
    name: string;
  } | null>(null);

  const updating = useSubmission(updateTestimoni);
  const deleting = useSubmission(deleteTestimoni);

  let prevUpdatingPending = false;
  createEffect(() => {
    const pending = !!updating.pending;
    if (prevUpdatingPending && !pending && !updating.error) setEditingItem(null);
    prevUpdatingPending = pending;
  });
  let prevDeletingPending = false;
  createEffect(() => {
    const pending = !!deleting.pending;
    if (prevDeletingPending && !pending && !deleting.error) setDeletingItem(null);
    prevDeletingPending = pending;
  });

  createEffect(() => {
    if ((updating.result as any) instanceof Error)
      showToast((updating.result as any as Error).message, "error");
  });
  createEffect(() => {
    if ((deleting.result as any) instanceof Error)
      showToast((deleting.result as any as Error).message, "error");
  });

  return (
    <div>
      <div
        style="display: flex; gap: var(--space-2); align-items: flex-start; padding: var(--space-3) var(--space-4); margin-bottom: var(--space-3); background: rgba(37, 99, 235, 0.08); border-left: 4px solid var(--color-info); border-radius: var(--radius-md); font-size: 13px; color: var(--color-text-secondary); line-height: 1.5;"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          style="flex-shrink: 0; margin-top: 2px; color: var(--color-info);"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <span>
          Testimoni dikirim langsung oleh <strong>alumni</strong> dari dashboard
          mereka setelah batch magang selesai. Admin hanya dapat mengedit,
          menonaktifkan, atau menghapus testimoni yang masuk.
        </span>
      </div>

      <Show when={editingItem()}>
        {(item) => (
          <Portal>
            <div class="modal-overlay" onClick={() => setEditingItem(null)}>
              <div class="modal modal-animate" onClick={(e) => e.stopPropagation()}>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4); border-bottom: 1px solid var(--color-border); padding-bottom: var(--space-2);">
                  <h3 style="margin: 0; font-family: var(--font-headline); font-weight: 700;">
                    Edit Testimoni
                  </h3>
                  <button
                    class="theme-toggle"
                    style="font-size: 24px; padding: 0; cursor: pointer;"
                    onClick={() => setEditingItem(null)}
                  >
                    ×
                  </button>
                </div>
                <form action={updateTestimoni} method="post">
                  <input type="hidden" name="id" value={item().id} />
                  <div class="form-group">
                    <label>Nama</label>
                    <input name="name" value={item().name} required minLength={2} />
                  </div>
                  <div class="form-group">
                    <label>Peran / Divisi</label>
                    <input name="roleInfo" value={item().roleInfo ?? ""} />
                  </div>
                  <div class="form-group">
                    <label>Testimoni</label>
                    <textarea name="message" rows="4">
                      {item().message}
                    </textarea>
                  </div>
                  <div class="form-group">
                    <label>Urutan</label>
                    <input name="order" type="number" min="0" value={item().order} />
                  </div>
                  <div class="form-group" style="display: flex; align-items: center; gap: var(--space-2);">
                    <input
                      type="checkbox"
                      name="isActive"
                      id={`testi-active-${item().id}`}
                      checked={item().isActive}
                      style="width: auto;"
                    />
                    <label for={`testi-active-${item().id}`} style="margin: 0;">
                      Tampilkan di landing page
                    </label>
                  </div>
                  <div style="display: flex; gap: var(--space-2); margin-top: var(--space-4);">
                    <button class="btn-primary" type="submit" disabled={updating.pending}>
                      {updating.pending ? "Menyimpan..." : "Simpan"}
                    </button>
                    <button class="btn-ghost" type="button" onClick={() => setEditingItem(null)}>
                      Batal
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </Portal>
        )}
      </Show>

      <Show when={deletingItem()}>
        {(item) => (
          <Portal>
            <div class="modal-overlay" onClick={() => setDeletingItem(null)}>
              <div
                class="modal modal-animate"
                onClick={(e) => e.stopPropagation()}
                style="max-width: 400px;"
              >
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4); border-bottom: 1px solid var(--color-border); padding-bottom: var(--space-2);">
                  <h3 style="margin: 0; font-family: var(--font-headline); font-weight: 700;">
                    Konfirmasi Hapus
                  </h3>
                  <button
                    class="theme-toggle"
                    style="font-size: 24px; padding: 0; cursor: pointer;"
                    onClick={() => setDeletingItem(null)}
                  >
                    ×
                  </button>
                </div>
                <form action={deleteTestimoni} method="post">
                  <input type="hidden" name="id" value={item().id} />
                  <p style="margin-top: 0; margin-bottom: var(--space-4); font-size: 14px; color: var(--color-text); line-height: 1.5; text-align: left;">
                    Apakah Anda yakin ingin menghapus testimoni <strong>{item().name}</strong>?
                  </p>
                  <div style="display: flex; gap: var(--space-2);">
                    <button
                      class="btn-danger"
                      type="submit"
                      disabled={deleting.pending}
                      style="width: auto; padding: 0 var(--space-4);"
                    >
                      {deleting.pending ? "Menghapus..." : "Hapus"}
                    </button>
                    <button
                      class="btn-ghost"
                      type="button"
                      onClick={() => setDeletingItem(null)}
                      style="width: auto; padding: 0 var(--space-4);"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </Portal>
        )}
      </Show>

      <div style="overflow-x: auto;">
        <table class="data-table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Peran</th>
              <th>Testimoni</th>
              <th>Pengirim</th>
              <th>Urutan</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <Show
              when={list() && list()!.length > 0}
              fallback={
                <tr>
                  <td
                    colspan="7"
                    style="text-align: center; color: var(--color-text-secondary); padding: var(--space-5);"
                  >
                    Belum ada testimoni yang dikirim alumni.
                  </td>
                </tr>
              }
            >
              <For each={list()}>
                {(item) => (
                  <tr>
                    <td>{item.name}</td>
                    <td>{item.roleInfo ?? "-"}</td>
                    <td
                      style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
                      title={item.message}
                    >
                      {item.message}
                    </td>
                    <td>
                      <Show
                        when={item.user}
                        fallback={
                          <span style="color: var(--color-text-secondary);">
                            Data lama
                          </span>
                        }
                      >
                        {(u) => <span>@{u().username}</span>}
                      </Show>
                    </td>
                    <td>{item.order}</td>
                    <td>
                      <span class={`badge ${item.isActive ? "badge-approved" : "badge-rejected"}`}>
                        {item.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td>
                      <button
                        class="btn-secondary"
                        style="display: inline-flex; width: auto; height: 32px; padding: 0 12px; font-size: 13px;"
                        onClick={() => setEditingItem(item)}
                      >
                        Edit
                      </button>{" "}
                      <button
                        class="btn-danger"
                        style="display: inline-flex; width: auto; height: 32px; padding: 0 12px; font-size: 13px;"
                        onClick={() => setDeletingItem({ id: item.id, name: item.name })}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                )}
              </For>
            </Show>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminLanding() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = () => (searchParams.tab as string) || "hero";

  createEffect(() => {
    if (searchParams.success === "create") {
      showToast("Data berhasil ditambahkan!", "success");
      setSearchParams({ success: null });
    } else if (searchParams.success === "update") {
      showToast("Data berhasil diperbarui!", "success");
      setSearchParams({ success: null });
    } else if (searchParams.success === "delete") {
      showToast("Data berhasil dihapus!", "success");
      setSearchParams({ success: null });
    }
  });

  const tabs: Array<{ key: string; label: string }> = [
    { key: "hero", label: "Hero & Kontak" },
    { key: "kuota", label: "Kuota Magang" },
    { key: "faq", label: "FAQ" },
    { key: "syarat", label: "Syarat & Ketentuan" },
    { key: "testimoni", label: "Testimoni" },
  ];

  return (
    <main>
      <div style="display: flex; gap: var(--space-2); flex-wrap: wrap; margin-bottom: var(--space-4);">
        <For each={tabs}>
          {(t) => (
            <a
              href={`/admin/landing?tab=${t.key}`}
              class={activeTab() === t.key ? "btn-primary" : "btn-secondary"}
              style="width: auto; padding: 0 var(--space-4); height: 36px; text-decoration: none; display: inline-flex; align-items: center; font-size: 13px;"
            >
              {t.label}
            </a>
          )}
        </For>
      </div>

      <Show when={activeTab() === "hero"}>
        <HeroTab />
      </Show>
      <Show when={activeTab() === "kuota"}>
        <KuotaTab />
      </Show>
      <Show when={activeTab() === "faq"}>
        <LandingListTab section="FAQ" label="FAQ" />
      </Show>
      <Show when={activeTab() === "syarat"}>
        <LandingListTab section="SYARAT" label="Syarat" />
      </Show>
      <Show when={activeTab() === "testimoni"}>
        <TestimoniTab />
      </Show>
    </main>
  );
}
