import { createAsync, type RouteDefinition } from "@solidjs/router";
import { Show, For, createSignal, createEffect, onCleanup, onMount } from "solid-js";
import { Portal } from "solid-js/web";
import {
  getPublicUser,
  getLandingSettings,
  getPublicKuota,
  getPublicFaq,
  getPublicSyarat,
  getPublicTestimoni,
} from "~/lib";

export const route = {
  preload() {
    getPublicUser();
    getLandingSettings();
    getPublicKuota();
    getPublicFaq();
    getPublicSyarat();
    getPublicTestimoni();
  },
} satisfies RouteDefinition;

type DivisiKuota = {
  divisiId: string;
  divisiName: string;
  quota: number;
  filled: number;
};

const formatDate = (d: string | Date) =>
  new Date(d).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const sisaOf = (d: DivisiKuota) => Math.max(0, d.quota - d.filled);

/**
 * Persentase kuota yang sudah terisi, selalu dijepit ke 0..100.
 * quota <= 0 / bukan angka -> 100, konsisten dengan badge "Penuh".
 */
const persenTerisi = (d: DivisiKuota) => {
  if (!Number.isFinite(d.quota) || d.quota <= 0) return 100;
  const raw = (d.filled / d.quota) * 100;
  if (!Number.isFinite(raw)) return 100;
  return Math.min(100, Math.max(0, Math.round(raw)));
};

/**
 * Kuota batch = penjumlahan seluruh kuota divisi di batch tersebut (konsep
 * bisnis: batch tidak punya angka kuota sendiri, ia agregat per-divisi).
 */
const batchTotals = (divisi: readonly DivisiKuota[]) => {
  const quota = divisi.reduce((s, d) => s + d.quota, 0);
  const filled = divisi.reduce((s, d) => s + d.filled, 0);
  const sisa = Math.max(0, quota - filled);
  const pct =
    quota > 0
      ? Math.min(100, Math.max(0, Math.round((filled / quota) * 100)))
      : 100;
  return { quota, filled, sisa, pct };
};

/**
 * Divisi dengan sisa kuota tampil lebih dulu, "Penuh" di bawah.
 * .slice() wajib: array ini milik cache createAsync, tidak boleh dimutasi.
 * Array#sort stabil (ES2019+) sehingga urutan alfabet dari server tetap
 * terjaga di dalam masing-masing grup.
 */
const sortDivisi = (divisi: readonly DivisiKuota[]): DivisiKuota[] =>
  divisi
    .slice()
    .sort((a, b) => (sisaOf(a) > 0 ? 0 : 1) - (sisaOf(b) > 0 ? 0 : 1));

/** Inisial avatar yang aman untuk nama kosong/emoji/aksara non-Latin. */
const initialOf = (name: string | null | undefined) => {
  const trimmed = (name ?? "").trim();
  if (!trimmed) return "?";
  return (Array.from(trimmed)[0] ?? "?").toUpperCase();
};

type TestimoniItem = {
  name: string;
  roleInfo: string | null;
  message: string;
};

/** Kartu testimoni tunggal - dipakai grid statis (<3 item) & track marquee. */
function TestimoniCard(props: {
  t: TestimoniItem;
  /** Salinan kedua track marquee: murni dekoratif, disembunyikan dari AT. */
  dup?: boolean;
  /** Delay reveal (mode grid); undefined = tanpa data-reveal (mode marquee). */
  revealDelay?: string;
}) {
  return (
    <div
      class="landing-testimoni-card"
      aria-hidden={props.dup ? "true" : undefined}
      data-reveal={props.revealDelay !== undefined ? "" : undefined}
      style={
        props.revealDelay !== undefined
          ? { "--reveal-delay": props.revealDelay }
          : undefined
      }
    >
      <div class="landing-testimoni-head">
        <div class="user-avatar landing-testimoni-avatar" aria-hidden="true">
          {initialOf(props.t.name)}
        </div>
        <div>
          <div class="name">{props.t.name}</div>
          <Show when={props.t.roleInfo}>
            <div class="role">{props.t.roleInfo}</div>
          </Show>
        </div>
      </div>
      <p class="landing-testimoni-msg">&ldquo;{props.t.message}&rdquo;</p>
    </div>
  );
}

/**
 * Status timeline batch untuk chip di kartu. Batch yang sudah lewat endDate
 * tidak pernah sampai ke sini (sudah difilter server di getPublicKuota:
 * endDate >= hari ini), jadi hasilnya hanya "berjalan" atau "akan-datang".
 * endDate dianggap inklusif sampai akhir hari, konsisten dengan filter server.
 */
const batchStatus = (b: { startDate: string | Date }) =>
  new Date() < new Date(b.startDate) ? "akan-datang" : "berjalan";

const NAV_ITEMS = ["tentang", "alur", "kuota", "syarat", "faq", "kontak"] as const;
const NAV_LABELS: Record<(typeof NAV_ITEMS)[number], string> = {
  tentang: "Tentang",
  alur: "Alur",
  kuota: "Kuota",
  syarat: "Syarat",
  faq: "FAQ",
  kontak: "Kontak",
};

/**
 * Alur proses magang - konten statis by design: ini deskripsi prosedur baku
 * perusahaan (bukan konten kampanye yang sering diganti admin), jadi tidak
 * lewat CMS seperti section lain.
 */
const ALUR_STEPS = [
  {
    title: "Hubungi HRD & Kirim Berkas",
    desc: "Kirim CV, surat pengantar kampus/sekolah, dan proposal magang melalui WhatsApp atau email HRD.",
  },
  {
    title: "Seleksi & Verifikasi",
    desc: "Tim HRD meninjau berkas dan mencocokkannya dengan sisa kuota divisi yang masih tersedia.",
  },
  {
    title: "Penempatan & Akun SIGMA",
    desc: "Peserta diterima, ditempatkan di divisi tujuan, dan mendapatkan akun SIGMA dari admin.",
  },
  {
    title: "Jalani Magang",
    desc: "Absensi harian, pengajuan izin, dan pemantauan kegiatan dilakukan melalui SIGMA.",
  },
  {
    title: "Lulus & Jadi Alumni",
    desc: "Status berubah menjadi alumni - dapatkan sertifikat dan bagikan testimonimu di halaman ini.",
  },
] as const;

function BatchSkeleton() {
  return (
    <div class="landing-batch-card landing-batch-skeleton" aria-hidden="true">
      <span class="skeleton" style="width: 45%; max-width: 240px; height: 22px; border-radius: var(--radius-md); display: block;"></span>
      <span class="skeleton" style="width: 30%; max-width: 170px; height: 13px; border-radius: var(--radius-sm); display: block; margin-top: var(--space-2); margin-bottom: var(--space-2);"></span>
      <div class="landing-batch-skeleton-rows">
        <span class="skeleton"></span>
        <span class="skeleton"></span>
        <span class="skeleton"></span>
        <span class="skeleton"></span>
      </div>
    </div>
  );
}

export default function Home() {
  const user = createAsync(() => getPublicUser(), { deferStream: true });
  const settings = createAsync(() => getLandingSettings(), { deferStream: true });
  const kuota = createAsync(() => getPublicKuota(), { deferStream: true });
  const faq = createAsync(() => getPublicFaq(), { deferStream: true });
  const syarat = createAsync(() => getPublicSyarat(), { deferStream: true });
  const testimoni = createAsync(() => getPublicTestimoni(), { deferStream: true });

  const waLink = () => {
    const wa = settings()?.contactWhatsapp;
    if (!wa) return null;
    const digits = wa.replace(/[^0-9]/g, "");
    return digits ? `https://wa.me/${digits}` : null;
  };

  // Section mana saja yang benar-benar dirender saat ini - dipakai untuk
  // menyembunyikan item nav yang targetnya tidak ada (bukan sekadar warna beda).
  const navWhen: Record<(typeof NAV_ITEMS)[number], () => boolean> = {
    tentang: () => !!settings()?.aboutText,
    alur: () => true,
    kuota: () => true,
    syarat: () => (syarat()?.length ?? 0) > 0,
    faq: () => (faq()?.length ?? 0) > 0,
    kontak: () => true,
  };

  const [activeId, setActiveId] = createSignal("");
  let pageRef!: HTMLDivElement;

  // Scroll ke section tanpa menyentuh URL (tidak ada #hash): preventDefault
  // membatalkan navigasi hash bawaan, scrollIntoView menghormati
  // scroll-margin-top section sehingga judul mendarat di bawah header sticky.
  // href="#id" tetap dipertahankan sebagai fallback no-JS/aksesibilitas.
  const goTo = (id: string) => (e: MouseEvent) => {
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  };

  // Sinkron dengan mekanisme tema app-wide: data-theme sudah di-set lebih
  // dulu oleh inline script anti-FOYT di entry-server.tsx (sebelum hydrate),
  // signal lokal ini hanya perlu dikoreksi sekali di onMount, persis pola
  // ThemeToggle di app.tsx (default "light" -> dikoreksi via localStorage/
  // prefers-color-scheme).
  const [theme, setTheme] = createSignal("light");

  onMount(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      setTheme("dark");
    } else if (
      !saved &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setTheme("dark");
    }
  });

  const toggleTheme = () => {
    const next = theme() === "light" ? "dark" : "light";
    setTheme(next);
    if (next === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    }
  };

  // Scroll-spy header: highlight item nav sesuai section yang sedang terlihat.
  // createEffect (bukan onMount) supaya observer dibangun ulang saat section
  // kondisional (#tentang/#syarat/#faq) muncul/hilang mengikuti data CMS.
  createEffect(() => {
    // Dependency eksplisit: memicu rebuild saat data section opsional berubah.
    void settings()?.aboutText;
    void syarat()?.length;
    void faq()?.length;

    if (typeof IntersectionObserver === "undefined") return;

    const scroller = pageRef.closest<HTMLElement>(".app-main-content");
    const sections = Array.from(
      pageRef.querySelectorAll<HTMLElement>("[data-spy]"),
    );
    if (sections.length === 0) return;

    let io: IntersectionObserver | undefined;
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;

    const spyOffset = () => {
      const header = pageRef.querySelector<HTMLElement>(".landing-header");
      const h = header ? header.getBoundingClientRect().height : 56;
      // +18 > scroll-margin-top section (header + 16px): section yang baru
      // di-scroll lewat goTo() langsung terhitung "aktif" oleh garis spy.
      return h + 18;
    };

    const recompute = () => {
      // Di dasar scroll, section terakhir (#kontak) selalu menang - kalau
      // tidak, footer yang pendek tidak akan pernah mencapai garis atas layar.
      if (
        scroller &&
        scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 4
      ) {
        setActiveId(sections[sections.length - 1].id);
        return;
      }
      const rootTop = scroller ? scroller.getBoundingClientRect().top : 0;
      const line = rootTop + spyOffset();
      let current = "";
      for (const el of sections) {
        if (el.getBoundingClientRect().top - line <= 1) current = el.id;
        else break;
      }
      setActiveId(current);
    };

    const build = () => {
      io?.disconnect();
      io = new IntersectionObserver(recompute, {
        root: scroller,
        rootMargin: `-${Math.round(spyOffset())}px 0px -45% 0px`,
        threshold: 0,
      });
      for (const el of sections) io.observe(el);
      recompute();
    };

    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(build, 150);
    };

    build();
    window.addEventListener("resize", onResize, { passive: true });

    onCleanup(() => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      io?.disconnect();
    });
  });

  // Reveal-on-scroll: elemen [data-reveal] fade+slide halus saat masuk
  // viewport, sekali saja. Dibangun ulang saat data async berubah supaya
  // elemen yang baru dirender ikut diobservasi (elemen yang sudah ter-reveal
  // mempertahankan class-nya karena node DOM-nya tidak dibuat ulang).
  createEffect(() => {
    void settings()?.aboutText;
    void syarat()?.length;
    void faq()?.length;
    void kuota()?.length;
    void testimoni()?.length;

    if (typeof IntersectionObserver === "undefined") return;
    // Penanda "JS + IO aktif": CSS hanya menyembunyikan elemen di bawah class
    // ini, jadi tanpa JS/IO seluruh konten tetap terlihat normal.
    pageRef.classList.add("reveal-ready");

    const scroller = pageRef.closest<HTMLElement>(".app-main-content");
    const els = Array.from(
      pageRef.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-revealed)"),
    );
    if (els.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            io.unobserve(entry.target);
          }
        }
      },
      { root: scroller, rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    for (const el of els) io.observe(el);
    onCleanup(() => io.disconnect());
  });

  return (
    <div class="landing-page" ref={pageRef}>
      <header class="landing-header">
        <div class="landing-header-inner">
        <div class="landing-header-logo">
          <img
            src={theme() === "dark" ? "/logo-sigma-putih.png" : "/logo-sigma.png"}
            alt="Logo SIGMA"
            style="height: 36px;"
          />
        </div>
        <nav class="landing-nav">
          <For each={NAV_ITEMS}>
            {(id) => (
              <Show when={navWhen[id]()}>
                <a
                  href={`#${id}`}
                  onClick={goTo(id)}
                  classList={{ active: activeId() === id }}
                  aria-current={activeId() === id ? "true" : undefined}
                >
                  {NAV_LABELS[id]}
                </a>
              </Show>
            )}
          </For>
        </nav>
        <div class="landing-header-actions">
          <Show
            when={user()}
            fallback={
              <a
                href="/login"
                class="btn-primary"
                style="width: auto; padding: 0 var(--space-4); height: 36px; text-decoration: none; display: inline-flex; align-items: center;"
              >
                Login
              </a>
            }
          >
            {(u) => (
              <a
                href={u().role === "ADMIN" ? "/admin/dashboard" : "/dashboard"}
                class="btn-primary"
                style="width: auto; padding: 0 var(--space-4); height: 36px; text-decoration: none; display: inline-flex; align-items: center;"
              >
                Masuk Dashboard
              </a>
            )}
          </Show>
          <span class="landing-header-divider" aria-hidden="true" />
          <button
            type="button"
            class="theme-toggle"
            onClick={toggleTheme}
            title="Ganti tema"
            aria-label="Ganti tema terang/gelap"
          >
            <Show
              when={theme() === "dark"}
              fallback={
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              }
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
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
        </div>
        </div>
      </header>

      {/* Shell: kolom konten dengan batas kiri-kanan yang terlihat (border
          samping) supaya alur baca halaman jelas - semua section & footer
          hidup di dalamnya, hanya header yang full-width. */}
      <div class="landing-shell">

      <section class="landing-hero">
        <h1 data-reveal="">
          {settings()?.heroTitle ??
            "Program Absensi Magang"}
        </h1>
        <Show when={settings()?.heroSubtitle}>
          <p data-reveal="" style={{ "--reveal-delay": "90ms" }}>
            {settings()!.heroSubtitle}
          </p>
        </Show>
        <div
          class="landing-hero-actions"
          data-reveal=""
          style={{ "--reveal-delay": "180ms" }}
        >
          <a href="#kuota" class="btn-primary landing-cta" onClick={goTo("kuota")}>
            <span>Lihat Kuota Tersedia</span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
          <a
            href="#alur"
            class="btn-ghost landing-ghost-cta landing-ghost-cta-lg"
            onClick={goTo("alur")}
          >
            Pelajari Alurnya
          </a>
        </div>
      </section>

      <Show when={settings()?.aboutText}>
        <section class="landing-section" id="tentang" data-spy="" data-reveal="">
          <span class="landing-eyebrow">Profil Program</span>
          <h2 class="landing-section-title">Tentang Program</h2>
          <p style="color: var(--color-text-secondary); line-height: 1.7; text-align: center; max-width: 720px; margin: 0 auto;">
            {settings()!.aboutText}
          </p>
        </section>
      </Show>

      <section class="landing-section" id="alur" data-spy="" data-reveal="">
        <span class="landing-eyebrow">Langkah demi Langkah</span>
        <h2 class="landing-section-title">Alur Program Magang</h2>
        <p class="landing-section-sub">
          Dari pendaftaran sampai resmi menjadi alumni &mdash; begini perjalanan
          absensi magang.
        </p>
        <ol class="landing-alur">
          <For each={ALUR_STEPS}>
            {(step, i) => (
              <li
                class="landing-alur-step"
                data-reveal=""
                style={{ "--reveal-delay": `${i() * 70}ms` }}
              >
                <span class="landing-alur-num" aria-hidden="true">
                  {i() + 1}
                </span>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </li>
            )}
          </For>
        </ol>
        <p class="landing-alur-cta">
          Siap memulai?{" "}
          <a href="#kontak" onClick={goTo("kontak")}>
            Hubungi HRD
          </a>{" "}
          atau cek{" "}
          <a href="#kuota" onClick={goTo("kuota")}>
            kuota yang tersedia
          </a>
          .
        </p>
      </section>

      <section class="landing-section" id="kuota" data-spy="" data-reveal="">
        <span class="landing-eyebrow">Transparansi Kuota</span>
        <h2 class="landing-section-title">Kuota &amp; Periode Batch</h2>
        <Show
          when={kuota() !== undefined}
          fallback={
            <div class="landing-batch-grid is-multi">
              <BatchSkeleton />
              <BatchSkeleton />
            </div>
          }
        >
          <Show
            when={(kuota()?.length ?? 0) > 0}
            fallback={
              <div class="landing-empty">
                <p style="text-align: center; color: var(--color-text-secondary);">
                  Belum ada informasi batch magang yang dibuka saat ini.
                </p>
                <a
                  href="#kontak"
                  class="btn-ghost landing-ghost-cta"
                  onClick={goTo("kontak")}
                >
                  <span>Hubungi HRD untuk info batch berikutnya</span>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              </div>
            }
          >
            <div
              class="landing-batch-grid"
              classList={{ "is-multi": (kuota()?.length ?? 0) > 1 }}
            >
              <For each={kuota()}>
                {(batch, bi) => (
                  <div
                    class="landing-batch-card"
                    data-reveal=""
                    style={{ "--reveal-delay": `${bi() * 90}ms` }}
                  >
                    <div class="landing-batch-head">
                      <h3>{batch.name}</h3>
                      <span
                        class="landing-batch-status"
                        classList={{
                          "is-upcoming": batchStatus(batch) === "akan-datang",
                        }}
                      >
                        {batchStatus(batch) === "akan-datang"
                          ? "Akan Datang"
                          : "Sedang Berjalan"}
                      </span>
                    </div>
                    <div class="landing-batch-meta">
                      {formatDate(batch.startDate)} &ndash;{" "}
                      {formatDate(batch.endDate)}
                    </div>
                    <Show when={batch.description}>
                      <p style="color: var(--color-text-secondary); margin: 0 0 var(--space-3);">
                        {batch.description}
                      </p>
                    </Show>
                    <Show
                      when={batch.divisi.length > 0}
                      fallback={
                        <p style="color: var(--color-text-secondary); font-size: 14px;">
                          Kuota per divisi belum diatur untuk batch ini.
                        </p>
                      }
                    >
                      {(() => {
                        const t = () => batchTotals(batch.divisi);
                        return (
                          <div
                            class="landing-batch-total"
                            classList={{ "is-full": t().sisa === 0 }}
                          >
                            <div class="landing-divisi-head">
                              <span class="landing-batch-total-label">
                                Kuota Batch
                              </span>
                              <span
                                class={`badge ${t().sisa > 0 ? "badge-approved" : "badge-rejected"}`}
                              >
                                {t().sisa > 0 ? `${t().sisa} Tersedia` : "Penuh"}
                              </span>
                            </div>
                            <div class="landing-divisi-bar" aria-hidden="true">
                              <span
                                class="landing-divisi-bar-fill"
                                style={{ width: `${t().pct}%` }}
                              />
                            </div>
                            <div class="landing-batch-total-meta">
                              {t().filled} dari {t().quota} kuota terisi &mdash;
                              total seluruh divisi
                            </div>
                          </div>
                        );
                      })()}
                      <div class="landing-batch-divisi-label">
                        Rincian per Divisi
                      </div>
                      <div class="landing-divisi-grid">
                        <For each={sortDivisi(batch.divisi)}>
                          {(d) => {
                            const sisa = sisaOf(d);
                            const pct = persenTerisi(d);
                            return (
                              <div
                                class="landing-divisi-row"
                                classList={{ "is-full": sisa === 0 }}
                              >
                                <div class="landing-divisi-head">
                                  <span class="landing-divisi-name">
                                    {d.divisiName}
                                  </span>
                                  <span
                                    class={`badge ${sisa > 0 ? "badge-approved" : "badge-rejected"}`}
                                  >
                                    {sisa > 0 ? `${sisa} Tersedia` : "Penuh"}
                                  </span>
                                </div>
                                <div class="landing-divisi-bar" aria-hidden="true">
                                  <span
                                    class="landing-divisi-bar-fill"
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                              </div>
                            );
                          }}
                        </For>
                      </div>
                    </Show>
                  </div>
                )}
              </For>
            </div>
          </Show>
        </Show>
      </section>

      <Show when={syarat() && syarat()!.length > 0}>
        <section class="landing-section" id="syarat" data-spy="" data-reveal="">
          <span class="landing-eyebrow">Sebelum Mendaftar</span>
          <h2 class="landing-section-title">Syarat &amp; Ketentuan</h2>
          <ul class="landing-syarat-list">
            <For each={syarat()}>
              {(s, i) => (
                <li data-reveal="" style={{ "--reveal-delay": `${i() * 50}ms` }}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{s.title}</span>
                </li>
              )}
            </For>
          </ul>
        </section>
      </Show>

      <Show when={faq() && faq()!.length > 0}>
        <section class="landing-section" id="faq" data-spy="" data-reveal="">
          <span class="landing-eyebrow">FAQ</span>
          <h2 class="landing-section-title">Pertanyaan Umum</h2>
          <For each={faq()}>
            {(f, i) => (
              <details
                class="landing-faq-item"
                data-reveal=""
                style={{ "--reveal-delay": `${i() * 60}ms` }}
              >
                <summary>
                  <span>{f.title}</span>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </summary>
                <p>{f.body}</p>
              </details>
            )}
          </For>
        </section>
      </Show>

      <Show when={(testimoni()?.length ?? 0) > 0}>
        <section class="landing-section" id="testimoni" data-reveal="">
          <span class="landing-eyebrow">Testimoni Alumni</span>
          <h2 class="landing-section-title">Kata Mereka</h2>
          <p class="landing-section-sub">
            Cerita langsung dari para alumni absensi magang.
          </p>
          {/* >=3 testimoni: marquee berjalan otomatis, berhenti saat kursor
              di atasnya. <3: track terlalu pendek untuk loop mulus (celah
              kosong terlihat) - pakai grid statis biasa. */}
          <Show
            when={(testimoni()?.length ?? 0) >= 3}
            fallback={
              <div class="landing-testimoni-grid">
                <For each={testimoni()}>
                  {(t, i) => (
                    <TestimoniCard t={t} revealDelay={`${i() * 80}ms`} />
                  )}
                </For>
              </div>
            }
          >
            <div class="landing-testimoni-marquee">
              <div
                class="landing-testimoni-track"
                style={{
                  "animation-duration": `${testimoni()!.length * 7}s`,
                }}
              >
                <For each={testimoni()}>{(t) => <TestimoniCard t={t} />}</For>
                <For each={testimoni()}>
                  {(t) => <TestimoniCard t={t} dup />}
                </For>
              </div>
            </div>
          </Show>
        </section>
      </Show>

      <footer class="landing-footer" id="kontak" data-spy="" data-reveal="">
        <p class="landing-section-title" style="margin-bottom: var(--space-2);">
          Hubungi Kami
        </p>
        <p style="margin: 0 0 var(--space-4); max-width: 480px; margin-left: auto; margin-right: auto;">
          Ada pertanyaan seputar program magang? Hubungi tim HRD kami.
        </p>
        <div style="display: flex; gap: var(--space-2); justify-content: center; flex-wrap: wrap; margin-bottom: var(--space-4);">
          <Show when={waLink()}>
            <a
              href={waLink()!}
              target="_blank"
              rel="noopener noreferrer"
              class="btn-primary"
              style="width: auto; padding: 0 var(--space-4); height: 40px; text-decoration: none; display: inline-flex; align-items: center;"
            >
              Chat WhatsApp
            </a>
          </Show>
          <Show when={settings()?.contactEmail}>
            <a
              href={`mailto:${settings()!.contactEmail}`}
              class="btn-secondary"
              style="width: auto; padding: 0 var(--space-4); height: 40px; text-decoration: none; display: inline-flex; align-items: center;"
            >
              Email: {settings()!.contactEmail}
            </a>
          </Show>
        </div>
        <Show when={settings()?.contactAddress}>
          <p style="margin: 0 0 var(--space-3);">{settings()!.contactAddress}</p>
        </Show>
        <p style="margin: 0; font-size: 13px;">
          &copy; Absensi Magang. Sistem Informasi dan
          Manajemen Magang.
        </p>
      </footer>

      </div>
      {/* ^ penutup .landing-shell */}

      {/* Floating WhatsApp button (mobile/tablet). Dirender via <Portal> ke
          document.body karena .fade-in (pembungkus route di app.tsx) punya
          transform non-`none` (fadeIn ... forwards) sehingga menjadi
          containing block untuk position:fixed - persis alasan modal/toast
          lain di app ini juga memakai Portal. */}
      <Show when={waLink()}>
        {(link) => (
          <Portal>
            <a
              class="landing-wa-fab"
              href={link()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat WhatsApp"
            >
              {/* TODO: ganti dengan aset resmi setelah tersedia di public/whatsapp.svg:
                  <img src="/whatsapp.svg" alt="" width="28" height="28" /> */}
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </a>
          </Portal>
        )}
      </Show>
    </div>
  );
}
