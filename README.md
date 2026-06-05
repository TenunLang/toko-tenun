# Toko Tenun & Batik

Contoh **e-commerce lengkap** yang dibangun 100% dengan bahasa [Tenun](https://github.com/TenunLang/Tenun). Struktur **MVC**, memakai banyak modul resmi sekaligus.

## Modul yang dipakai

| Modul | Untuk |
|-------|-------|
| `web` | Routing, middleware, cookie, static, response |
| `orm` | Model + CRUD ke PostgreSQL (produk, pengguna, pesanan) |
| `tampilan` (Batik) | Template HTML `.batik` |
| `auth` | Hash & verifikasi sandi (PBKDF2) |
| `sesi` | Login session + keranjang (cookie) |
| `mail` | Email konfirmasi pesanan |
| `socketio` | (bonus) notifikasi realtime — `src/notif.tenun` |

## Struktur (MVC)

```
toko-tenun/
  src/
    app.tenun              entry: impor + rute + setup + layani
    config.tenun           koneksi DB + helper (render, sesi, rupiah)
    model/
      produk.tenun         skema + akses data produk
      pengguna.tenun       skema + akses data pengguna
      pesanan.tenun        skema + akses data pesanan
    controller/
      produk_ctl.tenun     beranda, detail, API
      auth_ctl.tenun       daftar, masuk, keluar
      keranjang_ctl.tenun  tambah, lihat, checkout
      admin_ctl.tenun      tambah produk
    notif.tenun            (bonus) server Socket.IO realtime
  view/                    *.batik (tata, beranda, kartu, produk, masuk, daftar, keranjang, admin)
  publik/gaya.css
```

Controller tidak menyentuh SQL — semua lewat fungsi model. View hanya Batik.

## Jalankan

Prasyarat: **PostgreSQL** di `localhost:5432` (user `postgres`, tanpa sandi, database `postgres`). Opsional: **Mailpit** di `:1025` untuk melihat email.

```
tenun add web
tenun add orm
tenun add tampilan
tenun add auth
tenun add sesi
tenun add mail
tenun run src/app.tenun       # http://localhost:8080
```

Tabel dibuat otomatis + 4 produk contoh ditambahkan saat pertama jalan.

## Fitur

- Katalog produk (tenun & batik) dari database
- Halaman detail produk
- Daftar & masuk (sandi di-hash, session cookie HttpOnly)
- Keranjang per pengguna
- Checkout → simpan pesanan + kirim email konfirmasi
- Halaman admin tambah produk (khusus login)
- API JSON: `GET /api/produk`

## Rute

```
GET  /                       beranda (katalog)
GET  /produk/:id             detail produk
GET  /api/produk             daftar produk (JSON)
GET  /daftar  POST /daftar   registrasi
GET  /masuk   POST /masuk    login
GET  /keluar                 logout
GET  /keranjang/tambah/:id   tambah ke keranjang
GET  /keranjang              lihat keranjang
POST /checkout               buat pesanan + email
GET  /admin   POST /admin    tambah produk (login)
```

## Bonus realtime

```
tenun add socketio
tenun run src/notif.tenun     # Socket.IO di :3001
```

## Produksi

Server berjalan HTTP. Untuk HTTPS, terminasi TLS di reverse proxy (Caddy/nginx).

## Lisensi

MIT.
