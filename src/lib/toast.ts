import { createSignal } from "solid-js";

export const [toastMessage, setToastMessage] = createSignal<string | null>(null);

let toastTimer: any;

export function showToast(message: string) {
  setToastMessage(message);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    setToastMessage(null);
  }, 10000); // 10 detik agar user sempat membaca
}
