import { ssr, ssrHydrationKey, escape, createComponent, ssrStyleProperty, ssrAttribute } from "solid-js/web";
import { createEffect, createSignal, Show } from "solid-js";
import { c as createAsync, u as useSubmission, a as useSearchParams, s as showToast, k as updateProfile, m as changePassword, g as getUser } from "../../entry-server.js";
import "solid-js/web/storage";
import "fs";
import "path";
import "crypto";
import "@prisma/client";
import "node:stream";
import "xlsx";
var _tmpl$ = ["<main", ' style="max-width:600px;margin:0 auto;text-align:left;"><h1 class="page-title">Profil Saya</h1><!--$-->', "<!--/--></main>"], _tmpl$2 = ["<div", ' class="settings-card skeleton-card" style="opacity:0.6;pointer-events:none;"><div class="skeleton-form-field"><div class="skeleton" style="width:80px;height:16px;"></div><div class="skeleton" style="width:100%;height:35px;border-radius:6px;"></div></div><div class="skeleton-form-field"><div class="skeleton" style="width:120px;height:16px;"></div><div class="skeleton" style="width:100%;height:35px;border-radius:6px;"></div></div><div class="skeleton-form-field"><div class="skeleton" style="width:100px;height:16px;"></div><div class="skeleton" style="width:100%;height:35px;border-radius:6px;"></div></div><div class="skeleton" style="width:130px;height:38px;border-radius:var(--radius-md);margin-top:var(--space-4);"></div></div>'], _tmpl$3 = ["<p", "><strong>Username:</strong> <!--$-->", "<!--/--></p>"], _tmpl$4 = ["<p", "><strong>Role:</strong> <!--$-->", "<!--/--></p>"], _tmpl$5 = ["<p", "><strong>Divisi:</strong> <!--$-->", "<!--/--></p>"], _tmpl$6 = ["<h2", ' style="', '">Edit Profil</h2>'], _tmpl$7 = ["<form", ' method="post"><div class="form-group"><label for="fullName">Nama Lengkap</label><input type="text" name="fullName" id="fullName"', ' required></div><div class="form-group"><label for="email">Email</label><input type="email" name="email" id="email"', '></div><div class="form-group"><label for="phone">No. Telepon</label><input type="tel" name="phone" id="phone"', '></div><button class="btn-primary" type="submit"', ' style="width:auto;padding:0 var(--space-4);">', "</button></form>"], _tmpl$8 = ["<h2", ' style="', '">Ubah Kata Sandi</h2>'], _tmpl$9 = ["<svg", ' width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>'], _tmpl$0 = ["<div", ' class="alert-success" style="margin-top:var(--space-3);color:var(--color-success);font-weight:bold;font-size:14px;">', "</div>"], _tmpl$1 = ["<form", ' method="post"><div class="form-group"><label for="oldPassword">Kata Sandi Saat Ini</label><div class="password-input-container"><input', ' name="oldPassword" id="oldPassword" placeholder="Masukkan password saat ini" required><button type="button" class="password-toggle-btn"', ">", '</button></div></div><div class="form-group"><label for="newPassword">Kata Sandi Baru</label><div class="password-input-container"><input', ' name="newPassword" id="newPassword" placeholder="Masukkan password baru (min. 6 karakter)" required minlength="6"><button type="button" class="password-toggle-btn"', ">", '</button></div></div><div class="form-group"><label for="confirmPassword">Konfirmasi Kata Sandi Baru</label><div class="password-input-container"><input', ' name="confirmPassword" id="confirmPassword" placeholder="Ulangi password baru" required><button type="button" class="password-toggle-btn"', ">", '</button></div></div><button class="btn-primary" type="submit"', ' style="width:auto;padding:0 var(--space-4);">', "</button><!--$-->", "<!--/--></form>"], _tmpl$10 = ["<div", ' class="settings-card"><!--$-->', "<!--/--><!--$-->", "<!--/--></div>"], _tmpl$11 = ["<svg", ' width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>'];
const id$$ = "src/routes/profil.tsx?pick=default&pick=$css";
function Profil() {
  const user = createAsync(() => getUser());
  const updating = useSubmission(updateProfile);
  const changing = useSubmission(changePassword);
  const [searchParams, setSearchParams] = useSearchParams();
  createEffect(() => {
    if (searchParams.success === "update") {
      showToast("Profil berhasil diperbarui!", "success");
      setSearchParams({
        success: null
      });
    }
  });
  const [successMessage, setSuccessMessage] = createSignal("");
  const [showOldPassword, setShowOldPassword] = createSignal(false);
  const [showNewPassword, setShowNewPassword] = createSignal(false);
  const [showConfirmPassword, setShowConfirmPassword] = createSignal(false);
  const activeTab = () => searchParams.tab || "profile";
  createEffect(() => {
    if (changing.result && !(changing.result instanceof Error)) {
      setSuccessMessage("Kata sandi berhasil diperbarui.");
      const timer = setTimeout(() => setSuccessMessage(""), 5e3);
      return () => clearTimeout(timer);
    }
  });
  createEffect(() => {
    if (updating.result instanceof Error) showToast(updating.result.message, "error");
  });
  createEffect(() => {
    if (changing.result) {
      if (changing.result instanceof Error) showToast(changing.result.message, "error");
      else showToast("Kata sandi berhasil diubah!", "success");
    }
  });
  return ssr(_tmpl$, ssrHydrationKey(), escape(createComponent(Show, {
    get when() {
      return user();
    },
    get fallback() {
      return ssr(_tmpl$2, ssrHydrationKey());
    },
    children: (u) => ssr(_tmpl$10, ssrHydrationKey(), escape(createComponent(Show, {
      get when() {
        return activeTab() === "profile";
      },
      get children() {
        return [ssr(_tmpl$3, ssrHydrationKey(), escape(u().username)), ssr(_tmpl$4, ssrHydrationKey(), escape(u().role)), ssr(_tmpl$5, ssrHydrationKey(), escape(u().divisi ?? "-")), ssr(_tmpl$6, ssrHydrationKey(), ssrStyleProperty("margin-top:", "1.5rem")), ssr(_tmpl$7, ssrHydrationKey() + ssrAttribute("action", escape(updateProfile, true), false), ssrAttribute("value", escape(u().fullName, true), false), ssrAttribute("value", escape(u().email ?? "", true), false), ssrAttribute("value", escape(u().phone ?? "", true), false), ssrAttribute("disabled", updating.pending, true), updating.pending ? "Menyimpan..." : "Simpan Perubahan")];
      }
    })), escape(createComponent(Show, {
      get when() {
        return activeTab() === "password";
      },
      get children() {
        return [ssr(_tmpl$8, ssrHydrationKey(), ssrStyleProperty("margin-top:", "0")), ssr(_tmpl$1, ssrHydrationKey() + ssrAttribute("action", escape(changePassword, true), false), ssrAttribute("type", showOldPassword() ? "text" : "password", false), ssrAttribute("title", showOldPassword() ? "Sembunyikan sandi" : "Tampilkan sandi", false), escape(createComponent(Show, {
          get when() {
            return showOldPassword();
          },
          get fallback() {
            return ssr(_tmpl$11, ssrHydrationKey());
          },
          get children() {
            return ssr(_tmpl$9, ssrHydrationKey());
          }
        })), ssrAttribute("type", showNewPassword() ? "text" : "password", false), ssrAttribute("title", showNewPassword() ? "Sembunyikan sandi" : "Tampilkan sandi", false), escape(createComponent(Show, {
          get when() {
            return showNewPassword();
          },
          get fallback() {
            return ssr(_tmpl$11, ssrHydrationKey());
          },
          get children() {
            return ssr(_tmpl$9, ssrHydrationKey());
          }
        })), ssrAttribute("type", showConfirmPassword() ? "text" : "password", false), ssrAttribute("title", showConfirmPassword() ? "Sembunyikan sandi" : "Tampilkan sandi", false), escape(createComponent(Show, {
          get when() {
            return showConfirmPassword();
          },
          get fallback() {
            return ssr(_tmpl$11, ssrHydrationKey());
          },
          get children() {
            return ssr(_tmpl$9, ssrHydrationKey());
          }
        })), ssrAttribute("disabled", changing.pending, true), changing.pending ? "Memproses..." : "Perbarui Kata Sandi", escape(createComponent(Show, {
          get when() {
            return successMessage();
          },
          get children() {
            return ssr(_tmpl$0, ssrHydrationKey(), escape(successMessage()));
          }
        })))];
      }
    })))
  })));
}
export {
  Profil as default,
  id$$
};
//# sourceMappingURL=profil-b3LixNAI.js.map
