# Panduan Perbaikan Production SolidStart + Prisma + PM2

Dokumen ini dibuat untuk memperbaiki error production pada project `solid-sbimagang`.

Error yang sudah muncul:

```text
ERR_INVALID_URL
input: '/'
```

dan setelah server berhasil tampil:

```text
Environment variable not found: DATABASE_URL
```

Urutan perbaikannya:

```text
cek runtime
→ siapkan MySQL
→ buat .env
→ validasi Prisma
→ buat tabel
→ isi data awal
→ build production
→ tes tanpa PM2
→ jalankan dengan PM2
→ konfigurasi Nginx dan HTTPS
→ amankan error production
```

---

## 1. Masuk ke folder project

```bash
cd /var/www/app

pwd
git status
node -v
pnpm -v
```

Pastikan Node.js minimal versi 22.

Cek MySQL:

```bash
mysql --version
sudo systemctl status mysql
```

Jika MySQL belum aktif:

```bash
sudo systemctl enable --now mysql
```

---

## 2. Hentikan aplikasi sementara

```bash
pm2 stop sbi-app
```

Jika nama proses berbeda:

```bash
pm2 list
```

---

## 3. Buat database dan user MySQL

Masuk ke MySQL:

```bash
sudo mysql
```

Jalankan:

```sql
CREATE DATABASE IF NOT EXISTS absensi_sbi
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'sbi_app'@'localhost'
IDENTIFIED BY 'GANTI_PASSWORD_DATABASE';

GRANT ALL PRIVILEGES ON absensi_sbi.*
TO 'sbi_app'@'localhost';

FLUSH PRIVILEGES;
EXIT;
```

Tes koneksi:

```bash
mysql -u sbi_app -p -h localhost absensi_sbi
```

Setelah berhasil masuk:

```sql
SELECT DATABASE();
EXIT;
```

Hasil yang diharapkan:

```text
absensi_sbi
```

---

## 4. Buat file `.env`

```bash
cd /var/www/app

umask 077
cp -n .env.example .env
chmod 600 .env
```

Buat secret sesi:

```bash
openssl rand -hex 32
```

Edit file:

```bash
nano .env
```

Isi contoh:

```env
DATABASE_URL="mysql://sbi_app:GANTI_PASSWORD_DATABASE@localhost:3306/absensi_sbi"
SESSION_SECRET="HASIL_OPENSSL_RAND_HEX_32"
COOKIE_SECURE=false
```

Catatan:

- Ganti `GANTI_PASSWORD_DATABASE` dengan password MySQL sebenarnya.
- Ganti `HASIL_OPENSSL_RAND_HEX_32` dengan hasil perintah `openssl`.
- Jangan upload `.env` ke GitHub.
- Jika password database mengandung `@`, `:`, `/`, `?`, `#`, `%`, atau `&`, password harus di-URL-encode.

---

## 5. Pastikan `.env` terbaca oleh Node

```bash
cd /var/www/app

node --env-file=.env -e '
console.log({
  DATABASE_URL: Boolean(process.env.DATABASE_URL),
  SESSION_SECRET: Boolean(process.env.SESSION_SECRET),
  COOKIE_SECURE: process.env.COOKIE_SECURE
})
'
```

Hasil yang diharapkan:

```text
{
  DATABASE_URL: true,
  SESSION_SECRET: true,
  COOKIE_SECURE: 'false'
}
```

Jika masih `false`:

```bash
ls -la .env
sed -n 's/^\([A-Z_]*\)=.*/\1=SET/p' .env
```

---

## 6. Install dependency dan generate Prisma Client

```bash
cd /var/www/app

pnpm install --frozen-lockfile
pnpm exec prisma generate
pnpm exec prisma validate
```

Jika `--frozen-lockfile` gagal karena dependency memang sudah diubah:

```bash
pnpm install
```

Hasil validasi yang diharapkan:

```text
The schema at prisma/schema.prisma is valid
```

---

## 7. Buat atau sinkronkan tabel database

Untuk database baru:

```bash
pnpm run db:push
```

Jangan menjalankan ini pada database yang sudah berisi data:

```bash
pnpm run db:reset
```

### Jika muncul `Access denied`

Periksa kembali username, password, izin user MySQL, dan nilai `DATABASE_URL`.

### Jika muncul `Unknown database`

```bash
sudo mysql
```

```sql
CREATE DATABASE absensi_sbi
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

EXIT;
```

### Jika database tidak bisa dijangkau

```bash
sudo systemctl status mysql
sudo ss -lntp | grep 3306
```

---

## 8. Isi data awal untuk database baru

Perhatian: script seed dapat menghapus data yang sudah ada. Jalankan hanya pada database baru atau kosong.

```bash
cd /var/www/app

node --env-file=.env prisma/seed.js
```

Akun admin default biasanya:

```text
username: admin
password: admin123456
```

Setelah login berhasil, segera ganti password admin.

---

## 9. Build production dari kondisi bersih

```bash
cd /var/www/app

rm -rf .output .vinxi .vite
pnpm run build
```

Pastikan file production tersedia:

```bash
test -f .output/server/index.mjs \
  && echo "Production entry ditemukan" \
  || echo "Production entry tidak ditemukan"
```

---

## 10. Tes production tanpa PM2

```bash
cd /var/www/app

NODE_ENV=production \
HOST=127.0.0.1 \
PORT=3000 \
node --env-file=.env .output/server/index.mjs
```

Biarkan terminal tetap berjalan.

Dari terminal SSH lain:

```bash
curl -i http://127.0.0.1:3000/
curl -i http://127.0.0.1:3000/login
```

Hasil yang diharapkan:

```text
HTTP/1.1 200
```

atau redirect normal ke `/login`.

Jika login berhasil saat dijalankan langsung dengan Node, berarti `.env`, database, tabel, dan production build sudah benar.

Hentikan server dengan `Ctrl+C`.

---

## 11. Buat konfigurasi PM2

Buat file:

```bash
cd /var/www/app
nano ecosystem.config.cjs
```

Isi:

```js
module.exports = {
  apps: [
    {
      name: "sbi-app",
      cwd: "/var/www/app",
      script: ".output/server/index.mjs",
      interpreter: "node",
      node_args: "--env-file=/var/www/app/.env",

      env: {
        NODE_ENV: "production",
        HOST: "127.0.0.1",
        PORT: "3000"
      },

      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      restart_delay: 3000,
      max_memory_restart: "500M",
      time: true
    }
  ]
};
```

Jalankan ulang PM2:

```bash
pm2 delete sbi-app || true
pm2 start ecosystem.config.cjs
pm2 save
pm2 status
pm2 logs sbi-app --lines 100
```

Tes:

```bash
curl -i http://127.0.0.1:3000/login
```

Pastikan log tidak lagi berisi:

```text
Environment variable not found: DATABASE_URL
```

atau:

```text
ERR_INVALID_URL
input: '/'
```

Aktifkan PM2 saat reboot:

```bash
pm2 startup
```

Jalankan command tambahan yang diberikan PM2, lalu:

```bash
pm2 save
```

---

## 12. Atur `COOKIE_SECURE`

Jika aplikasi masih diakses melalui HTTP:

```env
COOKIE_SECURE=false
```

Jika aplikasi sudah memakai HTTPS:

```env
COOKIE_SECURE=true
```

Setelah mengubah `.env`:

```bash
pm2 restart ecosystem.config.cjs --only sbi-app
```

Jika `COOKIE_SECURE=true` tetapi situs masih dibuka melalui HTTP, browser dapat menolak cookie sesi sehingga login terlihat gagal atau kembali ke halaman login.

---

## 13. Konfigurasi Nginx

Contoh:

```nginx
server {
    listen 80;
    server_name domain-anda.com;

    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name domain-anda.com;

    ssl_certificate /etc/letsencrypt/live/domain-anda.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/domain-anda.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

Tes:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## 14. Pastikan folder upload dapat ditulis

```bash
cd /var/www/app

mkdir -p public/uploads
touch settings.json

chmod 750 public/uploads
chmod 640 settings.json
```

Cek user PM2:

```bash
ps -o user,group,pid,cmd -C node
```

Sesuaikan ownership:

```bash
sudo chown -R USER_PM2:GROUP_PM2 /var/www/app/public/uploads
sudo chown USER_PM2:GROUP_PM2 /var/www/app/settings.json
```

Ganti `USER_PM2` dan `GROUP_PM2` sesuai user yang menjalankan PM2.

---

## 15. Jangan tampilkan error Prisma ke pengguna

Cari blok seperti:

```ts
catch (err) {
  return err as Error;
}
```

Ubah menjadi:

```ts
catch (err) {
  console.error("Authentication error:", err);

  if (
    err instanceof Error &&
    [
      "Username atau password salah",
      "Akun Anda dinonaktifkan.\nSilakan hubungi admin.",
      "Username sudah terdaftar"
    ].includes(err.message)
  ) {
    return new Error(err.message);
  }

  return new Error(
    "Terjadi gangguan pada server. Silakan hubungi administrator."
  );
}
```

Build ulang:

```bash
rm -rf .output
pnpm run build
pm2 restart ecosystem.config.cjs --only sbi-app
```

---

## 16. Wajibkan `SESSION_SECRET`

Jangan memakai fallback secret tetap di production.

Gunakan pola:

```ts
export function getSession() {
  const sessionSecret = process.env.SESSION_SECRET;

  if (!sessionSecret) {
    throw new Error(
      "SESSION_SECRET belum dikonfigurasi pada environment production"
    );
  }

  return useSession({
    name: "sbi_session",
    password: sessionSecret,
    cookie: {
      secure: process.env.COOKIE_SECURE === "true",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7
    }
  });
}
```

Build ulang:

```bash
rm -rf .output
pnpm run build
pm2 restart ecosystem.config.cjs --only sbi-app
```

---

## 17. Periksa field registrasi Prisma

Jika schema Prisma memiliki:

```prisma
status String @default("AKTIF")
```

 tetapi kode menggunakan:

```ts
isActive: true
```

ubah menjadi:

```ts
status: "AKTIF"
```

Contoh:

```ts
data: {
  username,
  password: hashedPassword,
  fullName: username,
  email: `${username}@magang.sbi.co.id`,
  role: "USER",
  status: "AKTIF"
}
```

Kemudian:

```bash
pnpm exec prisma generate
rm -rf .output
pnpm run build
pm2 restart ecosystem.config.cjs --only sbi-app
```

---

## 18. Pemeriksaan akhir

```bash
pm2 status
pm2 logs sbi-app --lines 100
curl -I http://127.0.0.1:3000/login
```

Cek database:

```bash
mysql -u sbi_app -p -h localhost absensi_sbi
```

Lalu:

```sql
SHOW TABLES;
SELECT username, role, status FROM User;
EXIT;
```

---

## Checklist

```text
[ ] Node minimal versi 22
[ ] MySQL aktif
[ ] Database absensi_sbi tersedia
[ ] User database memiliki izin
[ ] File .env tersedia
[ ] Permission .env adalah 600
[ ] DATABASE_URL terbaca
[ ] SESSION_SECRET tersedia
[ ] prisma generate berhasil
[ ] prisma validate berhasil
[ ] prisma db push berhasil
[ ] Data admin tersedia
[ ] pnpm run build berhasil
[ ] Direct Node production berhasil
[ ] PM2 menjalankan .output/server/index.mjs
[ ] PM2 memuat .env
[ ] Nginx meneruskan proxy headers
[ ] COOKIE_SECURE sesuai HTTP atau HTTPS
[ ] Error Prisma tidak tampil ke browser
[ ] Folder upload dapat ditulis
[ ] Tidak ada ERR_INVALID_URL
[ ] Tidak ada DATABASE_URL missing
```

---

## Urutan Command Ringkas

```bash
cd /var/www/app

pm2 stop sbi-app
sudo systemctl enable --now mysql

cp -n .env.example .env
chmod 600 .env
nano .env

pnpm install --frozen-lockfile
pnpm exec prisma generate
pnpm exec prisma validate
pnpm run db:push

node --env-file=.env prisma/seed.js

rm -rf .output .vinxi .vite
pnpm run build

NODE_ENV=production \
HOST=127.0.0.1 \
PORT=3000 \
node --env-file=.env .output/server/index.mjs
```

Setelah direct Node berhasil:

```bash
pm2 delete sbi-app || true
pm2 start ecosystem.config.cjs
pm2 save
pm2 logs sbi-app --lines 100

curl -i http://127.0.0.1:3000/login
```
