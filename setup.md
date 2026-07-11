# Setup Produksi Aplikasi (Panduan DevOps)

Panduan deployment dan setup server Ubuntu/Debian untuk production aplikasi web SolidStart + Prisma + MySQL.

---

## 1. Persiapan Server
Update repository dan paket sistem:
```bash
sudo apt update && sudo apt upgrade -y
```

Install tools pendukung yang dibutuhkan:
```bash
sudo apt install -y curl git build-essential ufw
```

---

## 2. Install Node.js (v22+)
Gunakan repositori NodeSource resmi untuk menginstal Node.js versi LTS v22:
```bash
# Unduh dan import GPG key NodeSource
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg

# Konfigurasi repositori deb
NODE_MAJOR=22
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list

# Update package list dan install Node.js
sudo apt-get update
sudo apt-get install nodejs -y
```

Verifikasi instalasi Node.js dan npm:
```bash
node -v
npm -v
```

---

## 3. Install & Konfigurasi MySQL
Install MySQL Server:
```bash
sudo apt install -y mysql-server
```

Pastikan service MySQL berjalan dan otomatis menyala saat server reboot:
```bash
sudo systemctl enable mysql
sudo systemctl start mysql
```

Jalankan script keamanan interaktif untuk membersihkan user bawaan dan memperkuat password root:
```bash
sudo mysql_secure_installation
```

Login ke MySQL sebagai root untuk membuat database dan user khusus aplikasi:
```bash
sudo mysql -u root -p
```

Jalankan perintah SQL berikut di dalam prompt MySQL (sesuaikan nama database, user, dan password):
```sql
-- Buat database baru dengan format utf8mb4
CREATE DATABASE sbimagang CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Buat user database baru (ganti 'password_sangat_kuat' dengan password aman anda)
CREATE USER 'sbi_user'@'localhost' IDENTIFIED BY 'password_sangat_kuat';

-- Berikan semua hak akses ke database sbimagang
GRANT ALL PRIVILEGES ON sbimagang.* TO 'sbi_user'@'localhost';

-- Terapkan perubahan dan keluar
FLUSH PRIVILEGES;
EXIT;
```

---

## 4. Setup Project & Environment Variables
Persiapkan direktori web root dan clone repositori:
```bash
sudo mkdir -p /var/www
sudo chown -R $USER:$USER /var/www
cd /var/www
git clone <url-repository-anda> app
cd app
```

Install seluruh dependency NPM:
```bash
npm install
```

Buat file `.env` di root project:
```bash
nano .env
```

Masukkan variabel konfigurasi environment berikut:
```env
DATABASE_URL="mysql://sbi_user:password_sangat_kuat@localhost:3306/sbimagang"
PORT=3000
HOST=127.0.0.1
NODE_ENV=production
```

Jalankan migrasi database Prisma untuk menyusun skema tabel di MySQL:
```bash
npx prisma db push
```

*(Opsional)* Jika ada seed data bawaan yang ingin dimasukkan:
```bash
npm run db:seed
```

Build aplikasi untuk optimasi production:
```bash
npm run build
```

---

## 5. Konfigurasi Process Manager (PM2)
PM2 berfungsi untuk menjalankan aplikasi Node.js di background, merestartnya jika crash, dan menyalakannya kembali saat server reboot.

Install PM2 secara global:
```bash
sudo npm install pm2 -g
```

Jalankan server build SolidStart (.output/server/index.mjs):
```bash
pm2 start .output/server/index.mjs --name "sbi-app" --env PORT=3000
```

Konfigurasi startup PM2 agar otomatis jalan saat server reboot:
```bash
pm2 startup systemd
```
*Salin dan jalankan perintah yang muncul pada output terminal setelah mengetikkan command di atas.*

Simpan konfigurasi proses PM2 yang sedang berjalan saat ini:
```bash
pm2 save
```

Periksa status aplikasi:
```bash
pm2 list
pm2 logs sbi-app
```

---

## 6. Konfigurasi Nginx (Reverse Proxy & Cache)
Install Nginx server:
```bash
sudo apt install -y nginx
sudo systemctl enable nginx
```

Hapus konfigurasi default bawaan Nginx:
```bash
sudo rm /etc/nginx/sites-enabled/default
```

Buat file konfigurasi virtual host baru untuk aplikasi:
```bash
sudo nano /etc/nginx/sites-available/sbi-app
```

Masukkan blok konfigurasi Nginx berikut (sesuaikan `domain_anda_atau_ip`):
```nginx
server {
    listen 80;
    server_name domain_anda_atau_ip;

    # Optimasi kompresi gzip
    gzip on;
    gzip_proxied any;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    gzip_min_length 1000;

    # Sajikan aset statis secara langsung via Nginx demi kecepatan
    location /_build/assets/ {
        alias /var/www/app/.output/public/_build/assets/;
        expires 365d;
        add_header Cache-Control "public, no-transform";
        try_files $uri =404;
    }

    # Proxy ke aplikasi Node.js/SolidStart
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Batas ukuran upload berkas (misal file attachment izin sakit)
    client_max_body_size 10M;
}
```

Aktifkan konfigurasi Nginx tersebut:
```bash
sudo ln -s /etc/nginx/sites-available/sbi-app /etc/nginx/sites-enabled/
```

Uji coba kecocokan sintaks konfigurasi Nginx:
```bash
sudo nginx -t
```

Jika tidak ada error, restart service Nginx:
```bash
sudo systemctl restart nginx
```

---

## 7. Firewall (UFW)
Aktifkan firewall dan izinkan port akses standar Nginx (HTTP/HTTPS) serta SSH:
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

Periksa status aturan firewall:
```bash
sudo ufw status
```

---

## 8. Setup SSL / HTTPS (Let's Encrypt - Opsional)
Jika server sudah menggunakan domain aktif, amankan koneksi dengan SSL gratis dari Let's Encrypt:
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d domain_anda_atau_ip
```
Ikuti petunjuk interaktif untuk konfigurasi redirection otomatis dari HTTP ke HTTPS.
