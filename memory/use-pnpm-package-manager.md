---
name: use-pnpm-package-manager
description: Selalu gunakan pnpm sebagai package manager untuk project ini
metadata:
  type: feedback
---

User meminta untuk selalu menggunakan pnpm daripada npm di dalam project ini.

**Why:** Project menggunakan pnpm-lock.yaml dan pnpm-workspace.yaml, pnpm lebih cepat dan konsisten dengan lockfile yang ada.

**How to apply:** 
Gunakan perintah `pnpm` seperti `pnpm build`, `pnpm install`, `pnpm run db:seed`. Jangan gunakan `npm`.