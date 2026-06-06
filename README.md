# Toko Tenun & Batik

E-commerce **wastra Nusantara** (batik, tenun, songket) — dibangun dengan bahasa **Tenun** di atas kerangka **Jala** (MVC). Tampilan Bootstrap 5 + jQuery + DataTables, responsif, profesional. Dilengkapi **live chat WebSocket** (pelanggan ↔ admin) dan panel admin.

![stack](https://img.shields.io/badge/Tenun-Jala_MVC-5c3a21) ![ui](https://img.shields.io/badge/UI-Bootstrap_5-7952b3)

## Fitur

- **Etalase**: katalog produk, filter kategori, pencarian, halaman detail.
- **Keranjang & Checkout**: keranjang per-sesi, ringkasan, pembuatan pesanan, halaman sukses.
- **Akun**: daftar, masuk, keluar (sandi di-hash PBKDF2 via modul `auth`).
- **Admin**: dashboard (omzet/jumlah), kelola produk (DataTables + tambah/hapus), daftar pesanan (DataTables), live chat.
- **Live chat**: widget mengambang untuk pelanggan + panel admin, real-time via WebSocket.
- **Responsif**: mobile-first, Bootstrap 5, Bootstrap Icons.

## Menjalankan

Butuh binari `tenun` terpasang.

```
tenun add jala          # pasang kerangka + dependensi (web, tampilan, auth)
tenun add websocket     # untuk live chat
tenun                   # jalankan toko  -> http://localhost:8080
```

Live chat (proses terpisah):

```
tenun chat.tenun        # server WebSocket -> ws://localhost:3000
```

Akun admin default: **admin@toko.id** / **admin123** (ubah di produksi).

> Data contoh (produk + admin) otomatis di-seed saat pertama jalan, disimpan di penyimpanan kunci-nilai bawaan (`tenun_data.json`). Gambar produk memakai layanan foto (placeholder bertema batik/tenun) — ganti URL via panel admin.

## Struktur (MVC ala Laravel)

```
index.tenun                 bootstrap (tenun menjalankan ini)
chat.tenun                  server live chat WebSocket (proses terpisah)
Routes.tenun                definisi rute -> controller
App/
  Config.tenun              konfigurasi (nama app, rahasia, ws_url, admin)
  Helper.tenun              sesi (cookie+kv), pengguna aktif, rupiah, sajikan()
  Controllers/              Home, Produk, Keranjang, Checkout, Auth, Admin
  Models/                   Produk, Keranjang, Pengguna, Pesanan (repo kv)
Views/                      Batik (.batik)
  Layout.batik              kerangka HTML (Bootstrap/jQuery/DataTables CDN)
  Partials/                 Header, Footer, Chat (widget)
  Home/ Keranjang/ Checkout/ Auth/ Admin/
Public/                     style.css, app.js (widget chat)
```

## Arsitektur skala besar (10rb–1jt+ pengguna)

Aplikasi dirancang **stateless** agar bisa di-scale horizontal:

1. **Worker stateless + load balancer.** Jalankan N instance `tenun` di belakang Nginx/HAProxy (round-robin). Tidak ada state di memori proses.
2. **State bersama di Redis** (modul `redis` sudah jadi dependensi). Pindahkan dari kv bawaan ke Redis:
   - Sesi & keranjang: `redis_setex("sesi:<sid>", ttl, email)` / `cart:<sid>` — semua worker konsisten.
   - Cache katalog: `redis_setex("cache:produk", 60, ...)` agar tidak hit DB tiap request.
   - **Rate limiting**: `redis_batas("rl:"+ip, 100, 60)` cegah abuse.
3. **Basis data**: pindahkan Model dari kv ke modul `orm` (MySQL/Postgres) — tambah index pada kolom yang difilter; pakai read-replica untuk query berat. Repository (`App/Models/*`) sudah memisah akses data sehingga penggantian backend terlokalisir.
4. **Aset statis via CDN**: Bootstrap/jQuery/DataTables sudah dari CDN; sajikan `Public/` lewat CDN/edge.
5. **Live chat horizontal**: `chat.tenun` saat ini broadcast in-process. Untuk banyak instance, publish pesan ke **Redis Pub/Sub** lalu tiap instance subscribe & `ws_siar` lokal (fan-out). Sticky-session di LB untuk koneksi WS.
6. **Stateless = auto-scaling**: tambah/kurang worker sesuai beban (k8s HPA). Karena tak ada state lokal, scaling aman.

Diagram ringkas:

```
        [ CDN ]  (aset statis)
           |
[ Load Balancer / Nginx ]
     |      |      |
  worker  worker  worker   (tenun index.tenun, stateless)
     \     |      /
      [ Redis ]  (sesi, keranjang, cache, rate-limit, pubsub chat)
           |
   [ MySQL/Postgres + replica ]
```

## Lisensi

MIT.
