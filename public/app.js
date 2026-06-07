// Live chat widget (pelanggan) — WebSocket mentah ke server chat (port 3000).
(function () {
  var toggle = document.getElementById('chat-toggle');
  var box = document.getElementById('chat-box');
  var close = document.getElementById('chat-close');
  var msgs = document.getElementById('chat-msgs');
  var input = document.getElementById('chat-input');
  var send = document.getElementById('chat-send');
  if (!toggle) return;
  var ws = null, siap = false, nama = 'Tamu' + Math.floor(Math.random() * 1000);
  function add(text) {
    var d = document.createElement('div'); d.className = 'chat-line';
    var b = document.createElement('span'); b.className = 'bubble'; b.textContent = text;
    d.appendChild(b); msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight;
  }
  function connect() {
    try { ws = new WebSocket(window.WS_URL); } catch (e) { jadwalkan(); return; }
    ws.onopen = function () { siap = true; add('Terhubung ke layanan chat.'); };
    ws.onmessage = function (e) { add(e.data); };
    ws.onclose = function () { if (siap) add('Koneksi terputus, menyambung ulang...'); siap = false; jadwalkan(); };
    ws.onerror = function () { try { ws.close(); } catch (_) {} };
  }
  function jadwalkan() { setTimeout(connect, 3000); } // auto-reconnect tiap 3 dtk
  connect(); // sambung otomatis saat halaman dimuat
  toggle.addEventListener('click', function () { box.classList.toggle('d-none'); });
  if (close) close.addEventListener('click', function () { box.classList.add('d-none'); });
  function kirim() {
    var v = (input.value || '').trim();
    if (!v || !ws || ws.readyState !== 1) return;
    ws.send(nama + ': ' + v); input.value = '';
  }
  if (send) send.addEventListener('click', kirim);
  if (input) input.addEventListener('keydown', function (e) { if (e.key === 'Enter') kirim(); });
})();

// Galeri produk: klik thumbnail -> ganti gambar utama.
function gantiGambar(el){
  var main=document.getElementById('pd-main'); if(main){ main.src=el.src; }
  document.querySelectorAll('.pd-thumb').forEach(function(t){ t.classList.remove('active'); });
  el.classList.add('active');
}

// Pilih ukuran / warna (visual)
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('size-chip')) {
    document.querySelectorAll('.size-chip').forEach(function(c){c.classList.remove('active');});
    e.target.classList.add('active');
  }
  if (e.target.classList.contains('color-sw')) {
    document.querySelectorAll('.color-sw').forEach(function(c){c.classList.remove('active');});
    e.target.classList.add('active');
  }
  if (e.target.closest && e.target.closest('.pc-fav')) { e.preventDefault(); e.target.closest('.pc-fav').innerHTML='<i class="bi bi-heart-fill"></i>'; }
});
