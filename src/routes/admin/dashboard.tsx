import { createAsync, type RouteDefinition, A } from "@solidjs/router";
import { getAdminStats, getUser } from "~/lib";

export const route = {
  preload() {
    getAdminStats();
    getUser();
  }
} satisfies RouteDefinition;

export default function AdminDashboard() {
  const stats = createAsync(() => getAdminStats(), { deferStream: true });
  const user = createAsync(() => getUser(), { deferStream: true });

  return (
    <main>
      <div style="margin-bottom: var(--space-5);">
        <h1 class="page-title" style="margin-bottom: var(--space-1);">Dashboard Admin</h1>
        <p style="color: var(--color-text-secondary); font-size: 15px; margin: 0;">
          Selamat datang kembali, <strong>{user()?.fullName}</strong>. Berikut rekap operasional program magang hari ini.
        </p>
      </div>

      {/* Stats Section */}
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: var(--space-4); margin-bottom: var(--space-6);">
        <div class="stat-card" style="border-left: 4px solid #3b82f6;">
          <div class="stat-value">{stats()?.totalUsers ?? 0}</div>
          <div class="stat-label">Total Anak Magang</div>
        </div>

        <div class="stat-card" style="border-left: 4px solid #8b5cf6;">
          <div class="stat-value">{stats()?.totalDivisi ?? 0}</div>
          <div class="stat-label">Total Divisi</div>
        </div>

        <div class="stat-card" style="border-left: 4px solid #10b981;">
          <div class="stat-value">{stats()?.todayHadir ?? 0}</div>
          <div class="stat-label">Hadir Hari Ini</div>
        </div>

        <div class="stat-card" style="border-left: 4px solid #f59e0b;">
          <div class="stat-value">{stats()?.todayTelat ?? 0}</div>
          <div class="stat-label">Terlambat Hari Ini</div>
        </div>

        <div class="stat-card" style="border-left: 4px solid #ef4444;">
          <div class="stat-value">{stats()?.pendingIzin ?? 0}</div>
          <div class="stat-label">Izin Menunggu Persetujuan</div>
        </div>
      </div>

      {/* Quick Actions / Shortcuts */}
      <div>
        <h2 style="font-family: var(--font-headline); font-weight: 700; font-size: 1.5rem; margin-bottom: var(--space-3); color: var(--color-text);">Aksi Cepat</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--space-4);">

          <A href="/admin/users" class="stat-card" style="text-decoration: none; cursor: pointer; transition: transform 0.2s;">
            <div style="display: flex; align-items: center; gap: var(--space-3);">
              <div style="font-size: 24px; padding: 8px; background: rgba(37, 99, 235, 0.1); border-radius: var(--radius-md); color: var(--color-secondary);">👥</div>
              <div>
                <h4 style="margin: 0; color: var(--color-text); font-family: var(--font-headline); font-weight: 700;">Kelola Pengguna</h4>
                <p style="margin: 4px 0 0 0; font-size: 12px; color: var(--color-text-secondary);">Tambah, edit, dan kelola akun anak magang</p>
              </div>
            </div>
          </A>

          <A href="/admin/divisi" class="stat-card" style="text-decoration: none; cursor: pointer; transition: transform 0.2s;">
            <div style="display: flex; align-items: center; gap: var(--space-3);">
              <div style="font-size: 24px; padding: 8px; background: rgba(139, 92, 246, 0.1); border-radius: var(--radius-md); color: #8b5cf6;">🏢</div>
              <div>
                <h4 style="margin: 0; color: var(--color-text); font-family: var(--font-headline); font-weight: 700;">Kelola Divisi</h4>
                <p style="margin: 4px 0 0 0; font-size: 12px; color: var(--color-text-secondary);">Kelola unit divisi operasional magang</p>
              </div>
            </div>
          </A>

          <A href="/admin/absensi" class="stat-card" style="text-decoration: none; cursor: pointer; transition: transform 0.2s;">
            <div style="display: flex; align-items: center; gap: var(--space-3);">
              <div style="font-size: 24px; padding: 8px; background: rgba(16, 185, 129, 0.1); border-radius: var(--radius-md); color: var(--color-success);">🕒</div>
              <div>
                <h4 style="margin: 0; color: var(--color-text); font-family: var(--font-headline); font-weight: 700;">Log Absensi</h4>
                <p style="margin: 4px 0 0 0; font-size: 12px; color: var(--color-text-secondary);">Monitor waktu masuk/keluar harian</p>
              </div>
            </div>
          </A>

          <A href="/admin/izin" class="stat-card" style="text-decoration: none; cursor: pointer; transition: transform 0.2s;">
            <div style="display: flex; align-items: center; gap: var(--space-3);">
              <div style="font-size: 24px; padding: 8px; background: rgba(239, 68, 68, 0.1); border-radius: var(--radius-md); color: var(--color-error);">✉️</div>
              <div>
                <h4 style="margin: 0; color: var(--color-text); font-family: var(--font-headline); font-weight: 700;">Persetujuan Izin</h4>
                <p style="margin: 4px 0 0 0; font-size: 12px; color: var(--color-text-secondary);">Tinjau & verifikasi berkas izin sakit/cuti</p>
              </div>
            </div>
          </A>

          <A href="/admin/laporan" class="stat-card" style="text-decoration: none; cursor: pointer; transition: transform 0.2s;">
            <div style="display: flex; align-items: center; gap: var(--space-3);">
              <div style="font-size: 24px; padding: 8px; background: rgba(245, 158, 11, 0.1); border-radius: var(--radius-md); color: var(--color-tertiary);">📋</div>
              <div>
                <h4 style="margin: 0; color: var(--color-text); font-family: var(--font-headline); font-weight: 700;">Cetak Laporan</h4>
                <p style="margin: 4px 0 0 0; font-size: 12px; color: var(--color-text-secondary);">Rekap kehadiran & export ke PDF / Excel</p>
              </div>
            </div>
          </A>

        </div>
      </div>
    </main>
  );
}
