import {
  createAsync,
  useSubmission,
  useSearchParams,
  type RouteDefinition,
} from "@solidjs/router";
import { Show, createSignal, createEffect } from "solid-js";
import { getUser, updateProfile, changePassword } from "~/lib";
import { showToast } from "~/lib/toast";

export const route = {
  preload: () => {
    getUser();
  },
} satisfies RouteDefinition;

export default function Profil() {
  const user = createAsync(() => getUser());
  const updating = useSubmission(updateProfile);
  const changing = useSubmission(changePassword);
  const [searchParams, setSearchParams] = useSearchParams();

  createEffect(() => {
    if (searchParams.success === "update") {
      showToast("Profil berhasil diperbarui!", "success");
      setSearchParams({ success: null });
    }
  });

  let changeFormRef: HTMLFormElement | undefined;
  const [successMessage, setSuccessMessage] = createSignal("");
  const [showOldPassword, setShowOldPassword] = createSignal(false);
  const [showNewPassword, setShowNewPassword] = createSignal(false);
  const [showConfirmPassword, setShowConfirmPassword] = createSignal(false);

  const activeTab = () => searchParams.tab || "profile";

  createEffect(() => {
    if (changing.result && !(changing.result instanceof Error)) {
      changeFormRef?.reset();
      setSuccessMessage("Kata sandi berhasil diperbarui.");
      const timer = setTimeout(() => setSuccessMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  });

  // Toast error and success notifications
  createEffect(() => { if (updating.result instanceof Error) showToast(updating.result.message, "error"); });
  createEffect(() => {
    if (changing.result) {
      if (changing.result instanceof Error) showToast(changing.result.message, "error");
      else showToast("Kata sandi berhasil diubah!", "success");
    }
  });

  return (
    <main style="max-width: 600px; margin: 0 auto; text-align: left;">
      <h1 class="page-title">Profil Saya</h1>

      <Show when={user()} fallback={
        <div class="settings-card skeleton-card" style="opacity: 0.6; pointer-events: none;">
          <div class="skeleton-form-field">
            <div class="skeleton" style="width: 80px; height: 16px;"></div>
            <div class="skeleton" style="width: 100%; height: 35px; border-radius: 6px;"></div>
          </div>
          <div class="skeleton-form-field">
            <div class="skeleton" style="width: 120px; height: 16px;"></div>
            <div class="skeleton" style="width: 100%; height: 35px; border-radius: 6px;"></div>
          </div>
          <div class="skeleton-form-field">
            <div class="skeleton" style="width: 100px; height: 16px;"></div>
            <div class="skeleton" style="width: 100%; height: 35px; border-radius: 6px;"></div>
          </div>
          <div class="skeleton" style="width: 130px; height: 38px; border-radius: var(--radius-md); margin-top: var(--space-4);"></div>
        </div>
      }>
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
              </form>
            </Show>

            <Show when={activeTab() === "password"}>
              <h2 style={{ "margin-top": "0" }}>Ubah Kata Sandi</h2>
              <form ref={changeFormRef} action={changePassword} method="post">
                <div class="form-group">
                  <label for="oldPassword">Kata Sandi Saat Ini</label>
                  <div class="password-input-container">
                    <input
                      type={showOldPassword() ? "text" : "password"}
                      name="oldPassword"
                      id="oldPassword"
                      placeholder="Masukkan password saat ini"
                      required
                    />
                    <button
                      type="button"
                      class="password-toggle-btn"
                      onClick={() => setShowOldPassword(!showOldPassword())}
                      title={showOldPassword() ? "Sembunyikan sandi" : "Tampilkan sandi"}
                    >
                      <Show
                        when={showOldPassword()}
                        fallback={
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        }
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      </Show>
                    </button>
                  </div>
                </div>
                <div class="form-group">
                  <label for="newPassword">Kata Sandi Baru</label>
                  <div class="password-input-container">
                    <input
                      type={showNewPassword() ? "text" : "password"}
                      name="newPassword"
                      id="newPassword"
                      placeholder="Masukkan password baru (min. 6 karakter)"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      class="password-toggle-btn"
                      onClick={() => setShowNewPassword(!showNewPassword())}
                      title={showNewPassword() ? "Sembunyikan sandi" : "Tampilkan sandi"}
                    >
                      <Show
                        when={showNewPassword()}
                        fallback={
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        }
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      </Show>
                    </button>
                  </div>
                </div>
                <div class="form-group">
                  <label for="confirmPassword">Konfirmasi Kata Sandi Baru</label>
                  <div class="password-input-container">
                    <input
                      type={showConfirmPassword() ? "text" : "password"}
                      name="confirmPassword"
                      id="confirmPassword"
                      placeholder="Ulangi password baru"
                      required
                    />
                    <button
                      type="button"
                      class="password-toggle-btn"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword())}
                      title={showConfirmPassword() ? "Sembunyikan sandi" : "Tampilkan sandi"}
                    >
                      <Show
                        when={showConfirmPassword()}
                        fallback={
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        }
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      </Show>
                    </button>
                  </div>
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
              </form>
            </Show>
          </div>
        )}
      </Show>
    </main>
  );
}
