import { createSignal, onMount, Show, type JSX } from "solid-js";
import { Portal } from "solid-js/web";

/**
 * Menempatkan tombol aksi halaman (mis. "Tambah Pengguna", "Export PDF") ke
 * slot #topbar-actions di top bar global (app.tsx). Dirender via Portal
 * setelah mount: saat SSR tidak menghasilkan apa-apa (document belum ada),
 * lalu muncul begitu hydrate - slot-nya persisten lintas navigasi sehingga
 * unmount halaman otomatis membersihkan tombolnya.
 */
export default function TopbarActions(props: { children: JSX.Element }) {
  const [mount, setMount] = createSignal<HTMLElement>();
  onMount(() => {
    setMount(document.getElementById("topbar-actions") ?? undefined);
  });
  return (
    <Show when={mount()}>
      {(m) => <Portal mount={m()}>{props.children}</Portal>}
    </Show>
  );
}
