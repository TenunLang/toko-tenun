# Toko Tenun & Batik

E-commerce **real use case** yang dibangun 100% dengan bahasa [Tenun](https://github.com/TenunLang/Tenun). Struktur **ala Laravel** (MVC + driver + migration/seeder + artisan), memakai banyak modul resmi.

## Modul

| Modul | Untuk |
|-------|-------|
| `web` | Routing, middleware, cookie, static, response |
| `orm` | Model + CRUD ke PostgreSQL |
| `tampilan` (Batik) | Template `.batik` |
| `auth` | Hash & verifikasi sandi |
| `sesi` | Login session + keranjang |
| `mail` | Email konfirmasi pesanan |
| `redis` | Cache API produk (graceful bila Redis mati) |

## Struktur (ala Laravel)

```
toko-tenun/
  index.tenun                inti: muat semua driver + lapisan aplikasi
  artisan.tenun              runner CLI (migrasi / seed / layani)
  tenun.json                 dependensi + "skrip" (mirip package.json)
  driver/                    include modul (provider)
    database.tenun  cache.tenun  view.tenun  identitas.tenun  mailer.tenun  http.tenun
  app/
    config.tenun
    Models/                  Produk · Pengguna · Pesanan
    Http/
      Middleware/Middleware.tenun     mwKeamanan · mwAuth
      Controllers/          Produk · Auth · Keranjang · Pesanan · Admin
  database/
    migrations/             01_buat_produk · 02_buat_pengguna · 03_buat_pesanan
    seeders/                ProdukSeeder
    Migrator.tenun          jalankanMigrasi() · jalankanSeed()
  routes/web.tenun          daftarRute() — bind URL ke controller + middleware
  resources/views/          *.batik
  public/gaya.css
```

## Jalankan

Prasyarat: **PostgreSQL** di `localhost:5432` (`postgres`, tanpa sandi). Opsional: **Redis** `:6379` (cache), **Mailpit** `:1025` (email).

```
tenun add web orm tampilan auth sesi mail redis

tenun jalan migrasi     # buat tabel        (= tenun run artisan.tenun migrasi)
tenun jalan seed        # data contoh
tenun jalan layani      # server http://localhost:8080
```

`tenun jalan <skrip>` membaca bagian `"skrip"` di `tenun.json` (mirip `npm run` / `bun run`).

## Fitur (real use case)

- Katalog + **pencarian** (`?cari=`) & **filter jenis** (`?jenis=tenun|batik`)
- Detail produk, API JSON `GET /api/produk` (di-cache Redis, header `X-Cache`)
- Registrasi & login (sandi di-hash, validasi email, session cookie HttpOnly)
- **Middleware**: header keamanan (`mwKeamanan`) + proteksi rute login (`mwAuth`)
- Keranjang dengan **jumlah** + hapus item (per-sesi)
- Checkout: cek stok, kurangi stok, simpan pesanan, kirim email
- **Riwayat pesanan** per pengguna
- **Flash message** antar-redirect
- Admin tambah produk

## Bonus realtime

```
tenun add socketio
tenun run notif.tenun     # Socket.IO :3001  (file terpisah)
```

## Produksi

HTTP; untuk HTTPS terminasi TLS di reverse proxy (Caddy/nginx).

## Lisensi

MIT.
