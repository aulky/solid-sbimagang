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

const NAV_ITEMS = ["tentang", "kuota", "syarat", "faq", "kontak"] as const;
const NAV_LABELS: Record<(typeof NAV_ITEMS)[number], string> = {
  tentang: "Tentang",
  kuota: "Kuota",
  syarat: "Syarat",
  faq: "FAQ",
  kontak: "Kontak",
};

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
    kuota: () => true,
    syarat: () => (syarat()?.length ?? 0) > 0,
    faq: () => (faq()?.length ?? 0) > 0,
    kontak: () => true,
  };

  const [activeId, setActiveId] = createSignal("");
  let pageRef!: HTMLDivElement;

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
      return h + 12;
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

  return (
    <div class="landing-page" ref={pageRef}>
      <header class="landing-header">
        <div class="landing-header-logo">
          <img
            src={theme() === "dark" ? "/logo-sigma-putih.png" : "/logo-sigma.png"}
            alt="Logo SIGMA"
            style="height: 36px;"
          />
          <span>SIGMA</span>
        </div>
        <nav class="landing-nav">
          <For each={NAV_ITEMS}>
            {(id) => (
              <Show when={navWhen[id]()}>
                <a
                  href={`#${id}`}
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
      </header>

      <section class="landing-hero">
        <h1>
          {settings()?.heroTitle ??
            "Program Magang PT Solusi Bangun Indonesia Cilacap"}
        </h1>
        <Show when={settings()?.heroSubtitle}>
          <p>{settings()!.heroSubtitle}</p>
        </Show>
        <a href="#kuota" class="btn-primary landing-cta">
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
      </section>

      <Show when={settings()?.aboutText}>
        <section class="landing-section" id="tentang" data-spy="">
          <h2 class="landing-section-title">Tentang Program</h2>
          <p style="color: var(--color-text-secondary); line-height: 1.7; text-align: center; max-width: 720px; margin: 0 auto;">
            {settings()!.aboutText}
          </p>
        </section>
      </Show>

      <section class="landing-section" id="kuota" data-spy="">
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
                <a href="#kontak" class="btn-ghost landing-ghost-cta">
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
                {(batch) => (
                  <div class="landing-batch-card">
                    <h3>{batch.name}</h3>
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
        <section class="landing-section" id="syarat" data-spy="">
          <h2 class="landing-section-title">Syarat &amp; Ketentuan</h2>
          <ul class="landing-syarat-list">
            <For each={syarat()}>
              {(s) => (
                <li>
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
        <section class="landing-section" id="faq" data-spy="">
          <h2 class="landing-section-title">Pertanyaan Umum (FAQ)</h2>
          <For each={faq()}>
            {(f) => (
              <details class="landing-faq-item">
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

      <Show when={testimoni() && testimoni()!.length > 0}>
        <section class="landing-section">
          <h2 class="landing-section-title">Kata Mereka</h2>
          <div class="landing-testimoni-grid">
            <For each={testimoni()}>
              {(t) => (
                <div class="landing-testimoni-card">
                  <div class="landing-testimoni-head">
                    <div
                      class="user-avatar landing-testimoni-avatar"
                      aria-hidden="true"
                    >
                      {initialOf(t.name)}
                    </div>
                    <div>
                      <div class="name">{t.name}</div>
                      <Show when={t.roleInfo}>
                        <div class="role">{t.roleInfo}</div>
                      </Show>
                    </div>
                  </div>
                  <p style="margin: 0; line-height: 1.6;">&ldquo;{t.message}&rdquo;</p>
                </div>
              )}
            </For>
          </div>
        </section>
      </Show>

      <footer class="landing-footer" id="kontak" data-spy="">
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
          &copy; PT Solusi Bangun Indonesia &mdash; Cilacap. Sistem Informasi dan
          Manajemen Magang.
        </p>
      </footer>

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
