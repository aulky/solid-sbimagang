import { createSignal } from "solid-js";

export interface ToastData {
  message: string;
  type: "success" | "error";
}

export const [toastMessage, setToastMessage] = createSignal<ToastData | null>(null);

let toastTimer: any;

export function showToast(message: string, type: "success" | "error" = "error") {
  setToastMessage({ message, type });
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    setToastMessage(null);
  }, type === "success" ? 4000 : 10000);
}
