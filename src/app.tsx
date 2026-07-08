import { Router, useLocation, useNavigate, useIsRouting } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense, Show, createSignal, onMount, createEffect } from "solid-js";
import { Portal } from "solid-js/web";
import { createAsync } from "@solidjs/router";
import { getUser, logout } from "~/lib";
import "./app.css";

interface ThemeToggleProps {
  theme: () => string;
  setTheme: (theme: string) => void;
}

function ThemeToggle(props: ThemeToggleProps) {
  const toggle = () => {
    const next = props.theme() === "light" ? "dark" : "light";
    props.setTheme(next);
    if (next === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <button class="theme-toggle" onClick={toggle} title="Ganti tema">
      <Show
        when={props.theme() === "dark"}
        fallback={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        }
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      </Show>
    </button>
  );
}

export default function App() {
  return (
    <Router
      root={(props) => {
        const location = useLocation();
        const navigate = useNavigate();
        const isRouting = useIsRouting();
        const [theme, setTheme] = createSignal("light");
        const [showLogoutConfirm, setShowLogoutConfirm] = createSignal(false);

        onMount(() => {
          const saved = localStorage.getItem("theme");
          if (saved === "dark") {
            document.documentElement.setAttribute("data-theme", "dark");
            setTheme("dark");
          } else if (!saved && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
            document.documentElement.setAttribute("data-theme", "dark");
            setTheme("dark");
          }
        });

        const isLoginPage = () => location.pathname === "/login" || location.pathname === "/unauthorized";
        const user = createAsync(() => isLoginPage() ? Promise.resolve(null) : getUser(), { deferStream: true });

        createEffect(() => {
          const u = user();
          const path = location.pathname;

          // Close logout modal on any route transition or user state change
          setShowLogoutConfirm(false);

          if (isLoginPage()) return;

          if (u === undefined) return; // Wait for load

          if (!u) {
            navigate("/login");
          } else {
            if (path === "/") {
              navigate(u.role === "ADMIN" ? "/admin/dashboard" : "/dashboard");
            } else if (path.startsWith("/admin") && u.role !== "ADMIN") {
              navigate("/unauthorized");
            }
          }
        });

        return (
          <Suspense fallback={<div class="loading-screen">Memuat...</div>}>
            <Show when={isRouting()}>
              <div class="loading-bar-container">
                <div class="loading-bar"></div>
              </div>
            </Show>

            <div class="app-layout" classList={{ "has-sidebar": !!user() }}>
              <Show when={user()}>
                {(u) => (
                  <aside class="app-sidebar">
                    <div class="sidebar-header">
                      <img
                        src={theme() === "dark" ? "/logo-sbi-putih.png" : "/logo-sbi.png"}
                        alt="PT SBI Logo"
                        class="sidebar-logo"
                        style="height: 28px; width: auto; object-fit: contain;"
                      />
                      <span class="sidebar-title">Absensi Magang</span>
                      <span class="sidebar-subtitle">PT SBI Cilacap</span>
                    </div>

                    <nav class="sidebar-nav">
                      <Show when={u().role === "ADMIN"}>
                        <a class="nav-link" classList={{ active: location.pathname === "/admin/dashboard" }} href="/admin/dashboard">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="3" y="3" width="7" height="9" />
                            <rect x="14" y="3" width="7" height="5" />
                            <rect x="14" y="12" width="7" height="9" />
                            <rect x="3" y="16" width="7" height="5" />
                          </svg>
                          <span>Dashboard</span>
                        </a>
                        <a class="nav-link" classList={{ active: location.pathname === "/admin/users" }} href="/admin/users">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                          <span>Pengguna</span>
                        </a>
                        <a class="nav-link" classList={{ active: location.pathname === "/admin/divisi" }} href="/admin/divisi">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
                            <line x1="9" y1="22" x2="9" y2="16" />
                            <line x1="15" y1="22" x2="15" y2="16" />
                            <line x1="9" y1="16" x2="15" y2="16" />
                            <path d="M8 6h.01" />
                            <path d="M16 6h.01" />
                            <path d="M8 10h.01" />
                            <path d="M16 10h.01" />
                          </svg>
                          <span>Divisi</span>
                        </a>
                        <a class="nav-link" classList={{ active: location.pathname === "/admin/absensi" }} href="/admin/absensi">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          <span>Log Absensi</span>
                        </a>
                        <a class="nav-link" classList={{ active: location.pathname === "/admin/izin" }} href="/admin/izin">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <polyline points="10 9 9 9 8 9" />
                          </svg>
                          <span>Kelola Izin</span>
                        </a>
                        <a class="nav-link" classList={{ active: location.pathname === "/admin/laporan" }} href="/admin/laporan">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                            <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                          </svg>
                          <span>Laporan</span>
                        </a>
                      </Show>

                      <Show when={u().role === "USER"}>
                        <a class="nav-link" classList={{ active: location.pathname === "/dashboard" }} href="/dashboard">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="3" y="3" width="7" height="9" />
                            <rect x="14" y="3" width="7" height="5" />
                            <rect x="14" y="12" width="7" height="9" />
                            <rect x="3" y="16" width="7" height="5" />
                          </svg>
                          <span>Dashboard</span>
                        </a>
                        <a class="nav-link" classList={{ active: location.pathname === "/riwayat" }} href="/riwayat">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          <span>Riwayat</span>
                        </a>
                        <a class="nav-link" classList={{ active: location.pathname === "/izin" }} href="/izin">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <polyline points="10 9 9 9 8 9" />
                          </svg>
                          <span>Pengajuan Izin</span>
                        </a>
                        <a class="nav-link" classList={{ active: location.pathname === "/profil" }} href="/profil">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                          <span>Profil Saya</span>
                        </a>
                      </Show>
                    </nav>

                    <div class="sidebar-user" style="border-top: 1px solid var(--color-border); border-bottom: none; margin-bottom: 0; margin-top: var(--space-3); padding: var(--space-3) 0 0 0;">
                      <div class="user-avatar">
                        {u().fullName ? u().fullName.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div class="user-info">
                        <div class="user-name">{u().fullName}</div>
                        <div class="user-role">{u().role === "ADMIN" ? "Administrator" : u().divisi || "Anak Magang"}</div>
                      </div>
                    </div>

                    <div class="sidebar-footer">
                      <ThemeToggle theme={theme} setTheme={setTheme} />
                      <button class="btn-logout-sidebar" type="button" onClick={() => setShowLogoutConfirm(true)}>Keluar</button>
                    </div>
                  </aside>
                )}
              </Show>

              {/* Logout Confirmation Modal */}
              <Show when={showLogoutConfirm()}>
                <Portal>
                  <div class="modal-overlay" onClick={() => setShowLogoutConfirm(false)}>
                    <div class="modal modal-animate" onClick={(e) => e.stopPropagation()} style="max-width: 400px; text-align: center;">
                      <div style="margin-bottom: var(--space-4);">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-error)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: var(--space-3);">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        <h3 style="margin: 0 0 var(--space-2) 0; font-family: var(--font-headline); font-weight: 700; font-size: 1.25rem;">Konfirmasi Keluar</h3>
                        <p style="margin: 0; color: var(--color-text-secondary); font-size: 14px;">
                          Apakah Anda yakin ingin keluar dari sistem?
                        </p>
                      </div>
                      <div style="display: flex; gap: var(--space-3); justify-content: center;">
                        <button class="btn-ghost" style="width: auto; padding: 0 var(--space-4); height: 40px;" type="button" onClick={() => setShowLogoutConfirm(false)}>
                          Batal
                        </button>
                        <form action={logout} method="post" style="margin: 0;">
                          <button class="btn-danger" style="width: auto; padding: 0 var(--space-4); height: 40px;" type="submit">
                            Ya, Keluar
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </Portal>
              </Show>

              <main class="app-main-content">
                <div class="fade-in">
                  {props.children}
                </div>
              </main>
            </div>
          </Suspense>
        );
      }}
    >
      <FileRoutes />
    </Router>
  );
}
