# Toko Tenun & Batik

E-commerce **wastra Nusantara** (batik, tenun, songket) — bahasa **Tenun**, kerangka **Jala** (MVC), struktur **ala Laravel**. PostgreSQL (via ORM) + Redis (sesi/keranjang) + live chat WebSocket. UI Bootstrap 5 + jQuery + DataTables, responsif.

## Fitur
- Etalase: katalog, filter kategori, pencarian, detail produk.
- Keranjang (Redis) + checkout + halaman sukses.
- Akun: daftar/masuk/keluar (sandi PBKDF2; sesi di Redis).
- Admin: dashboard (omzet/jumlah), kelola produk (DataTables + tambah/hapus), pesanan (DataTables), live chat.
- Live chat WebSocket (widget pelanggan + panel admin).

## Prasyarat
- PostgreSQL + Redis berjalan (default `127.0.0.1:5432` / `:6379`).
- Buat database: `createdb toko_tenun` (atau `CREATE DATABASE toko_tenun;`).
- Kredensial via env (default lokal): `PGHOST PGPORT PGUSER PGPASSWORD PGDATABASE REDIS_HOST REDIS_PORT`.

## Menjalankan
```
tenun add jala          # web, tampilan, auth
tenun add orm           # postgres, mysql
tenun add redis
tenun add websocket

tenun database/Migrasi.tenun    # buat tabel
tenun tools/scrape.tenun        # scrape 30 produk batik asli (modul jaring) -> database/seeders/produk.csv
tenun database/Seeder.tenun     # isi produk (dari produk.csv) + admin

# Web + live chat jadi SATU proses (WebSocket di port yang sama, 8080):
TENUN_WORKERS=1 tenun
# atau:
powershell -ExecutionPolicy Bypass -File tools/start.ps1   # Windows
bash tools/start.sh                                         # Linux/macOS
```
Admin: **admin@toko.id** / **admin123**.

> **TENUN_WORKERS=1**: tiap proses memakai 1 worker karena memegang koneksi soket (DB/Redis) sendiri. Skalakan dengan menjalankan **banyak proses** di belakang load balancer (lihat di bawah), bukan banyak thread satu proses.

## Struktur (Laravel-style)
```
index.tenun                     bootstrap (entry; `tenun` menjalankan ini)
chat.tenun                      server live chat WebSocket
config/
  app.tenun                     nama app, ws_url, folder view
  database.tenun                koneksi Postgres+Redis (env), db_init()
routes/
  web.tenun                     rute + grup (/admin, /api)
app/
  Http/Controllers/             Home, Keranjang, Checkout, Auth, Admin
  Models/                       Produk, Pengguna, Pesanan (SKEMA ORM saja)
  Services/Cart.tenun           keranjang (Redis)
  Support/Helper.tenun          sesi (Redis), pengguna, rupiah, sajikan()
database/
  Migrasi.tenun  Seeder.tenun   runner
  migrations/                   01_produk, 02_pengguna, 03_pesanan
  seeders/                      ProdukSeeder, PenggunaSeeder
resources/views/                Batik (layout, partials, home, keranjang, checkout, auth, admin)
public/                         style.css, app.js
```
Model = **definisi skema saja**; query ada di controller (via ORM/qb). Seeder & migrasi terpisah di `database/`.

## Skala besar (10rb–1jt+ pengguna)
Model **proses stateless** (mirip PHP-FPM):
```
            [ CDN ]  (aset statis)
               |
       [ Nginx / Load Balancer ]
       |        |        |
   tenun:8081 tenun:8082 ...   (N proses, TENUN_WORKERS=1, stateless)
       \        |        /
         [ Redis ]  sesi, keranjang, cache, rate-limit, pubsub chat
              |
   [ PostgreSQL + read-replica ]
```
- **Stateless**: sesi/keranjang di Redis, jadi request mana pun bisa dilayani proses mana pun.
- **Scale-out**: jalankan banyak proses `TENUN_WORKERS=1` di port berbeda; Nginx `upstream` round-robin. Tambah proses = tambah kapasitas (k8s: replika pod).
- **DB**: index pada kolom yang difilter; read-replica untuk query berat.
- **Cache**: `redis_setex("cache:produk", 60, ...)`; **rate-limit**: `redis_batas(...)`.
- **Live chat**: untuk banyak instance, fan-out via Redis Pub/Sub (publish lalu tiap instance `ws_siar`).

## Lisensi
MIT.
