// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";
import { getRequestEvent } from "solid-js/web";

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => {
      const event = getRequestEvent();
      const path = event ? new URL(event.request.url).pathname : "/";

      const titleMap: Record<string, string> = {
        "/dashboard": "Dashboard",
        "/riwayat": "Riwayat Absensi",
        "/izin": "Pengajuan Izin",
        "/profil": "Profil Saya",
        "/login": "Masuk Sistem",
        "/unauthorized": "Akses Ditolak",
        "/admin/dashboard": "Dashboard Admin",
        "/admin/users": "Kelola Pengguna",
        "/admin/divisi": "Kelola Divisi",
        "/admin/absensi": "Monitor Absensi",
        "/admin/izin": "Kelola Pengajuan Izin",
        "/admin/laporan": "Laporan Absensi",
        "/admin/settings": "Pengaturan Sistem",
      };

      const pageTitle = titleMap[path] || "Absensi Magang";
      const fullTitle = `${pageTitle} | PT Solusi Bangun Indonesia`;

      return (
        <html lang="id">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>{fullTitle}</title>
            <link rel="icon" type="image/png" href="/favicon.png" />

            {/* SEO Meta Tags */}
            <meta
              name="description"
              content="Sistem Absensi Magang PT Solusi Bangun Indonesia Cilacap. Mempermudah pencatatan kehadiran, pengajuan izin, dan rekap laporan."
            />
            <meta name="robots" content="index, follow" />
            <meta name="author" content="PT Solusi Bangun Indonesia Cilacap" />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={fullTitle} />
            <meta
              property="og:description"
              content="Aplikasi pemantauan absensi harian dan perizinan anak magang PT SBI Cilacap."
            />
            <meta property="og:image" content="/favicon.png" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content={fullTitle} />
            <meta
              name="twitter:description"
              content="Aplikasi pemantauan absensi harian dan perizinan anak magang PT SBI Cilacap."
            />
            <meta name="twitter:image" content="/favicon.png" />

            <script>{`
              (function() {
                var saved = localStorage.getItem("theme");
                if (saved === "dark" || (!saved && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
                  document.documentElement.setAttribute("data-theme", "dark");
                }
              })();
            `}</script>
            {assets}
          </head>
          <body>
            <div id="app">{children}</div>
            {scripts}
          </body>
        </html>
      );
    }}
  />
));
