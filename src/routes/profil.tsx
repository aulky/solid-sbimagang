import {
  createAsync,
  useSubmission,
  useSearchParams,
  type RouteDefinition,
} from "@solidjs/router";
import { Show, createSignal, createEffect } from "solid-js";
import { getUser, updateProfile, changePassword } from "~/lib";

export const route = {
  preload: () => {
    getUser();
  },
} satisfies RouteDefinition;

export default function Profil() {
  const user = createAsync(() => getUser());
  const updating = useSubmission(updateProfile);
  const changing = useSubmission(changePassword);
  const [searchParams] = useSearchParams();

  let changeFormRef: HTMLFormElement | undefined;
  const [successMessage, setSuccessMessage] = createSignal("");

  const activeTab = () => searchParams.tab || "profile";

  createEffect(() => {
    if (changing.result && !(changing.result instanceof Error)) {
      changeFormRef?.reset();
      setSuccessMessage("Kata sandi berhasil diperbarui.");
      const timer = setTimeout(() => setSuccessMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  });

  return (
    <main style="max-width: 600px; margin: 0 auto; text-align: left;">
      <h1 class="page-title">Profil Saya</h1>

      <Show when={user()} fallback={<p>Memuat...</p>}>
        {(u) => (
          <div class="settings-card">
            <Show when={activeTab() === "profile"}>
              <p>
                <strong>Username:</strong> {u().username}
              </p>
              <p>
                <strong>Role:</strong> {u().role}
              </p>
              <p>
                <strong>Divisi:</strong> {u().divisi ?? "-"}
              </p>

              <h2 style={{ "margin-top": "1.5rem" }}>Edit Profil</h2>
              <form action={updateProfile} method="post">
                <div class="form-group">
                  <label for="fullName">Nama Lengkap</label>
                  <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    value={u().fullName}
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="email">Email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={u().email ?? ""}
                  />
                </div>
                <div class="form-group">
                  <label for="phone">No. Telepon</label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={u().phone ?? ""}
                  />
                </div>
                <button
                  class="btn-primary"
                  type="submit"
                  disabled={updating.pending}
                  style="width: auto; padding: 0 var(--space-4);"
                >
                  {updating.pending ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
                <Show when={updating.result instanceof Error}>
                  <div class="alert-error" style="margin-top: var(--space-3);">
                    {(updating.result as Error).message}
                  </div>
                </Show>
              </form>
            </Show>

            <Show when={activeTab() === "password"}>
              <h2 style={{ "margin-top": "0" }}>Ubah Kata Sandi</h2>
              <form ref={changeFormRef} action={changePassword} method="post">
                <div class="form-group">
                  <label for="oldPassword">Kata Sandi Saat Ini</label>
                  <input
                    type="password"
                    name="oldPassword"
                    id="oldPassword"
                    placeholder="Masukkan password saat ini"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="newPassword">Kata Sandi Baru</label>
                  <input
                    type="password"
                    name="newPassword"
                    id="newPassword"
                    placeholder="Masukkan password baru (min. 6 karakter)"
                    required
                    minLength={6}
                  />
                </div>
                <div class="form-group">
                  <label for="confirmPassword">Konfirmasi Kata Sandi Baru</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    placeholder="Ulangi password baru"
                    required
                  />
                </div>
                <button
                  class="btn-primary"
                  type="submit"
                  disabled={changing.pending}
                  style="width: auto; padding: 0 var(--space-4);"
                >
                  {changing.pending ? "Memproses..." : "Perbarui Kata Sandi"}
                </button>

                <Show when={successMessage()}>
                  <div
                    class="alert-success"
                    style="margin-top: var(--space-3); color: var(--color-success); font-weight: bold; font-size: 14px;"
                  >
                    {successMessage()}
                  </div>
                </Show>

                <Show when={changing.result instanceof Error}>
                  <div class="alert-error" style="margin-top: var(--space-3);">
                    {(changing.result as Error).message}
                  </div>
                </Show>
              </form>
            </Show>
          </div>
        )}
      </Show>
    </main>
  );
}
