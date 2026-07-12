// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";
import { getRequestEvent } from "solid-js/web";

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => {
      const event = getRequestEvent();
      const host = event
        ? event.request.headers.get("host") || "absensi.tup.web.id"
        : "absensi.tup.web.id";
      const protocol =
        event &&
        (event.request.headers.get("x-forwarded-proto") === "https" ||
          event.request.headers.get("x-forwarded-protocol") === "https")
          ? "https"
          : "http";
      const origin = `${protocol}://${host}`;
      const requestUrl = event ? new URL(event.request.url, origin) : null;
      const path = requestUrl ? requestUrl.pathname : "/";
      const logoUrl = `${origin}/logo-sbi-seo.png`;

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
        "/admin/audit-log": "Audit Log Aktivitas",
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
            <link rel="canonical" href={`${origin}${path}`} />

            {/* SEO Meta Tags */}
            <meta
              name="description"
              content="Sistem Absensi Magang PT Solusi Bangun Indonesia Cilacap. Mempermudah pencatatan kehadiran, pengajuan izin, dan rekap laporan."
            />
            <meta name="robots" content="index, follow" />
            <meta name="author" content="PT Solusi Bangun Indonesia Cilacap" />
            <meta name="theme-color" content="#E11D48" />
            <meta name="google" content="notranslate" />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={fullTitle} />
            <meta
              property="og:description"
              content="Aplikasi pemantauan absensi harian dan perizinan anak magang PT SBI Cilacap."
            />
            <meta property="og:image" content={logoUrl} />
            <meta property="og:image:type" content="image/png" />
            <meta property="og:url" content={`${origin}${path}`} />
            <meta property="og:site_name" content="Absensi Magang PT SBI" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta
              name="twitter:description"
              content="Aplikasi pemantauan absensi harian dan perizinan anak magang PT SBI Cilacap."
            />
            <meta name="twitter:image" content={logoUrl} />

            {/* Google / Bing Structured Data (JSON-LD) */}
            <script type="application/ld+json">{`
              {
                "@context": "https://schema.org",
                "@type": "WebApplication",
                "name": "${fullTitle}",
                "url": "${origin}${path}",
                "logo": "${logoUrl}",
                "description": "Sistem absensi harian dan perizinan anak magang PT Solusi Bangun Indonesia Cilacap.",
                "applicationCategory": "BusinessApplication",
                "operatingSystem": "All"
              }
            `}</script>

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
