import { createAsync, useSubmission, type RouteDefinition } from "@solidjs/router";
import { Show } from "solid-js";
import { getUser, updateProfile } from "~/lib";

export const route = {
  preload: () => {
    getUser();
  },
} satisfies RouteDefinition;

export default function Profil() {
  const user = createAsync(() => getUser());
  const updating = useSubmission(updateProfile);

  return (
    <div>
      <h1 class="page-title">Profil Saya</h1>

      <Show when={user()} fallback={<p>Memuat...</p>}>
        {(u) => (
          <div class="form-card">
            <p><strong>Username:</strong> {u().username}</p>
            <p><strong>Role:</strong> {u().role}</p>
            <p><strong>Divisi:</strong> {u().divisi}</p>

            <h2 style={{ "margin-top": "1.5rem" }}>Edit Profil</h2>
            <form action={updateProfile} method="post">
              <div class="form-group">
                <label for="fullName">Nama Lengkap</label>
                <input type="text" name="fullName" id="fullName" value={u().fullName} required />
              </div>
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" name="email" id="email" value={u().email ?? ""} />
              </div>
              <div class="form-group">
                <label for="phone">No. Telepon</label>
                <input type="tel" name="phone" id="phone" value={u().phone ?? ""} />
              </div>
              <button class="btn-primary" type="submit" disabled={updating.pending}>
                {updating.pending ? "Menyimpan..." : "Simpan"}
              </button>
              <Show when={updating.result && "error" in (updating.result as any)}>
                <p class="alert-error">{(updating.result as any)?.error}</p>
              </Show>
            </form>
          </div>
        )}
      </Show>
    </div>
  );
}
