/* Texturen für Beton, Boden und Innenwände aus frei lizenzierten Vorlagen (CC0, Poly Haven), im Browser erzeugt.
   Vorlagen (je 1k-JPG „Diffuse“ von dl.polyhaven.org, Lizenz CC0, https://polyhaven.com/license):
     concrete_wall_006 (Dario Barresi, Charlotte Baglioni)  – glatter Sichtbeton als Grund
     wood_textured_concrete (Dimitrios Savva)              – Holzmaserung der Schalung, nur schwach, 90° gedreht (Bretter waagrecht)
     concrete_floor_worn_001 (Dimitrios Savva, Rico Cilliers) – Betonboden
   Dazu gezeichnet: Schalungsfugen wie an La Congiunta (Bilder im Video [2]): waagrechte Fugen etwa alle 0,57 m, je Kachel eine
   senkrechte Stoßfuge der Schaltafeln, Tafeln mit leicht verschiedener Helligkeit; Holzmaserung nur angedeutet.
   Helligkeit und Farbton sind an die bisherigen Texturen angeglichen, damit das Licht im Modell gleich bleibt.
   Aufruf in einer Seite ohne strenge CSP, z. B. auf der eigenen Website: await laTexturen() liefert {A, B, I, F} als JPEG-Blobs
   (A, B = assets/img/tex-concrete-a/-b.jpg, I = tex-interior-wall.jpg, F = tex-floor.jpg). */
async function laTexturen() {
  var PH = 'https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/';
  function load(id) {
    return new Promise(function (res, rej) {
      var i = new Image(); i.crossOrigin = 'anonymous'; i.onload = function () { res(i); }; i.onerror = rej;
      i.src = PH + id + '/' + id + '_diff_1k.jpg';
    });
  }
  var IMG = { wall: await load('concrete_wall_006'), wood: await load('wood_textured_concrete'), floor: await load('concrete_floor_worn_001') };
  function cv(w, h) { var c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  function rot(im, deg) { var c = cv(im.width, im.height), x = c.getContext('2d'); x.translate(c.width / 2, c.height / 2); x.rotate(deg * Math.PI / 180); x.drawImage(im, -im.width / 2, -im.height / 2); return c; }
  /* die Vorlagen sind nahtlos: nx × ny Wiederholungen mit Versatz (Anteil der Kachel) */
  function tileInto(x, src, w, h, nx, ny, ox, oy) { var tw = w / nx, th = h / ny; for (var i = -1; i <= nx; i++) for (var j = -1; j <= ny; j++) x.drawImage(src, (i + ox) * tw, (j + oy) * th, tw, th); }
  /* Angleichung an Mittelwert und Streuung der bisherigen Texturen: Median und Perzentile, Ausreißer weich begrenzt, Leuchtdichte treibt alle Kanäle */
  function match(c, t, hi, lo) {
    var x = c.getContext('2d'), d = x.getImageData(0, 0, c.width, c.height), p = d.data, n = p.length / 4, L = new Float32Array(n), i, k;
    for (i = 0; i < n; i++) L[i] = 0.2126 * p[4 * i] + 0.7152 * p[4 * i + 1] + 0.0722 * p[4 * i + 2];
    var s = Float32Array.from(L).sort(), q = function (f) { return s[Math.floor(f * (n - 1))]; }, med = q(0.5), sg = (q(0.84) - q(0.16)) / 2;
    for (i = 0; i < n; i++) {
      var z = (L[i] - med) / sg; z = z > 0 ? hi * Math.tanh(z / hi) : -lo * Math.tanh(-z / lo);
      for (k = 0; k < 3; k++) p[4 * i + k] = Math.max(0, Math.min(255, t[0][k] + z * t[1][k]));
    }
    x.putImageData(d, 0, 0); return c;
  }
  function rnd(s) { return function () { s |= 0; s = s + 0x6D2B79F5 | 0; var t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  var woodSoft = (function () { var r = rot(IMG.wood, 90), c = cv(512, 512), x = c.getContext('2d'); x.filter = 'blur(1.2px)'; x.drawImage(r, 0, 0, 512, 512); return c; })();
  /* Schalungsbeton: ny Kacheln senkrecht, je „boards“ Tafelreihen; grain = Anteil der Maserung, jA = Stärke der Fugen, vx = Lage der Stoßfuge (Anteil der Breite) */
  function board(w, h, ny, boards, ox, oy, grain, seed, jA, vx) {
    var c = cv(w, h), x = c.getContext('2d'), r = rnd(seed); x.imageSmoothingQuality = 'high';
    tileInto(x, IMG.wall, w, h, 1, ny, ox, oy);
    x.globalCompositeOperation = 'overlay'; x.globalAlpha = grain; tileInto(x, woodSoft, w, h, 1, ny, ox * 0.7, oy * 0.3);
    x.globalCompositeOperation = 'source-over';
    var nb = ny * boards, bh = h / nb, lw = Math.max(1.2, h / ny / 512 * 2.2);
    for (var b = 0; b < nb; b++) {
      var v = (r() - 0.5) * 0.12; x.globalAlpha = Math.abs(v); x.fillStyle = v > 0 ? '#fff' : '#000'; x.fillRect(0, b * bh, w, bh);
      var a1 = (r() - 0.5) * 1.4, ph = r() * 6.283, y0 = b * bh, u, y;
      x.globalAlpha = jA; x.strokeStyle = '#000'; x.lineWidth = lw; x.beginPath();
      for (u = 0; u <= w; u += 4) { y = y0 + a1 * Math.sin(u / w * 6.283 * 2 + ph); if (u) x.lineTo(u, y); else x.moveTo(u, y); }
      x.stroke();
      x.globalAlpha = jA * 0.4; x.strokeStyle = '#fff'; x.lineWidth = lw * 0.8; x.beginPath();
      for (u = 0; u <= w; u += 4) { y = y0 + lw * 1.3 + a1 * Math.sin(u / w * 6.283 * 2 + ph); if (u) x.lineTo(u, y); else x.moveTo(u, y); }
      x.stroke();
    }
    /* senkrechte Stoßfuge, über die ganze Höhe der Kachel */
    x.globalAlpha = jA * 0.8; x.strokeStyle = '#000'; x.lineWidth = lw * 0.9; x.beginPath(); x.moveTo(vx * w, 0); x.lineTo(vx * w, h); x.stroke();
    x.globalAlpha = jA * 0.3; x.strokeStyle = '#fff'; x.beginPath(); x.moveTo(vx * w + lw * 1.2, 0); x.lineTo(vx * w + lw * 1.2, h); x.stroke();
    x.globalAlpha = 1; return c;
  }
  function floorTex() { var c = cv(512, 512), x = c.getContext('2d'); x.imageSmoothingQuality = 'high'; tileInto(x, IMG.floor, 512, 512, 1, 1, 0, 0); return c; }
  var out = {
    A: match(board(512, 512, 1, 4, 0, 0, 0.05, 11, 0.4, 0.62), [[127, 126.5, 123.5], [11.5, 11.5, 11.5]], 1.8, 2.6),
    B: match(board(512, 512, 1, 4, 0.5, 0.31, 0.05, 23, 0.4, 0.27), [[124.5, 123.5, 119.5], [10.5, 10.5, 10.5]], 1.8, 2.6),
    I: match(board(256, 448, 2, 3, 0.25, 0, 0.04, 37, 0.5, 0.45), [[178, 178, 175], [8, 8, 8.5]], 1.6, 2.4),
    F: match(floorTex(), [[160, 158.5, 154.5], [15, 15, 15.5]], 1.5, 2.2)
  };
  var res = {};
  for (var key in out) res[key] = await new Promise(function (r) { out[key].toBlob(r, 'image/jpeg', 0.86); });
  return res;
}
if (typeof module !== 'undefined' && module.exports) module.exports = laTexturen;
