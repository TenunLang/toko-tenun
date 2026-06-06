// Live chat widget (pelanggan) — WebSocket mentah ke server chat (port 3000).
(function () {
  var toggle = document.getElementById('chat-toggle');
  var box = document.getElementById('chat-box');
  var close = document.getElementById('chat-close');
  var msgs = document.getElementById('chat-msgs');
  var input = document.getElementById('chat-input');
  var send = document.getElementById('chat-send');
  if (!toggle) return;

  var ws = null, nama = 'Tamu' + Math.floor(Math.random() * 1000);

  function add(text, me) {
    var d = document.createElement('div');
    d.className = 'chat-line' + (me ? ' me' : '');
    d.innerHTML = '<span class="bubble"></span>';
    d.querySelector('.bubble').textContent = text;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function connect() {
    try { ws = new WebSocket(window.WS_URL); } catch (e) { return; }
    ws.onopen = function () { add('Terhubung ke layanan chat.', false); };
    ws.onmessage = function (e) { add(e.data, false); };
    ws.onclose = function () { add('Koneksi chat terputus.', false); };
  }

  toggle.addEventListener('click', function () {
    box.classList.toggle('d-none');
    if (!ws) connect();
  });
  if (close) close.addEventListener('click', function () { box.classList.add('d-none'); });

  function kirim() {
    var v = (input.value || '').trim();
    if (!v || !ws || ws.readyState !== 1) return;
    ws.send(nama + ': ' + v);
    input.value = '';
  }
  if (send) send.addEventListener('click', kirim);
  if (input) input.addEventListener('keydown', function (e) { if (e.key === 'Enter') kirim(); });
})();
