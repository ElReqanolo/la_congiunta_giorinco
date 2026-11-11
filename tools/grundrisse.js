/* Grundrisse La Congiunta (EG, UG) als SVG-Blatt A3 quer, M 1:200, Darstellung nach DIN 1356-1.
   Gezeichnet von Claude (KI von Anthropic). Maße aus dem 3D-Modell (js/building.js, js/exhibits.js); Einheit im SVG: mm auf dem Blatt.
   Aufruf: node tools/grundrisse.js assets/plans/la-congiunta-grundrisse.svg
   Das Blatt steht zusätzlich in index.html (Bereich „Grundrisse“), dort ohne width/height. */
'use strict';
function grundrisse() {
  var W = 5.25, TOT = 42.4, T0 = 0.325;
  var L = [0.1731 * TOT, 0.41224 * TOT, 0.41466 * TOT];
  var zS = [-TOT / 2, -TOT / 2 + L[0], -TOT / 2 + L[0] + L[1]];
  var Wi = W - 2 * T0;
  var DOFF = -0.47, DW = 0.85, CDW = 0.7;
  var CX0 = -(W / 2 + 3.34), CZ0 = TOT / 2 - 12.82, zE = TOT / 2 - T0 / 2, CP = (zE - (CZ0 + T0 / 2)) / 4;
  var KD = 2.44, KPX1 = -W / 2, KPW = 0.87, KPT = 0.15, KPX0 = KPX1 - KPW;
  var KPZS = TOT / 2 - 12.82, KPZM = TOT / 2 - 17.64, KPZN = TOT / 2 - 21.04;
  var oz0 = TOT / 2 - 16.61, oz1 = TOT / 2 - 14.99, dx0 = KPX0 + 0.01, dx1 = KPX0 + 0.86;   // Kellertür 0,85 m nach dem Kellergrundriss [1]
  var LOFF = -0.42, LW = 1.6, LB = LW + 0.1;
  var SKX0 = (CX0 + T0 - W / 2) / 2 - 0.5, SKX1 = SKX0 + 1.0, SKZ = 0.3;
  var H = [5.3, 3.5, 6.6];
  var NS = 13, RUN = (KPZM - KPZN) / NS, RISE = KD / NS;
  var E = W / 2;  // Außenkante Ost
  function zA(i) { return zS[i] + (i === 0 ? T0 : T0 / 2); }
  function zB(i) { return zS[i] + L[i] - (i === 2 ? T0 : T0 / 2); }
  function cellZ(k) { return zE - (k + 0.5) * CP; }

  var S = 5.0;            // 1:200 -> 5 mm je m
  var OX = 52.0;          // Blatt-x der Nordfront
  var OYE = 48.0, OYU = 154.0;   // Blatt-y der Ostkante (EG, UG)
  var FONT = "'LC Heros', 'TeX Gyre Heros', Helvetica, Arial, sans-serif";
  var out = [];
  function o(s) { out.push(s); }
  function f(v) { return v.toFixed(2).replace(/0+$/, '').replace(/\.$/, ''); }
  function de(v, d) { return v.toFixed(d).replace('.', ','); }

  function Plan(oy) {
    this.X = function (z) { return OX + (z + TOT / 2) * S; };
    this.Y = function (x) { return oy + (E - x) * S; };
    this.P = function (x, z) { return [this.X(z), this.Y(x)]; };
  }
  function rect_b(p, x0, x1, z0, z1, cls) {
    var X0 = Math.min(p.X(z0), p.X(z1)), X1 = Math.max(p.X(z0), p.X(z1)), Y0 = Math.min(p.Y(x0), p.Y(x1)), Y1 = Math.max(p.Y(x0), p.Y(x1));
    o('<rect class="' + cls + '" x="' + f(X0) + '" y="' + f(Y0) + '" width="' + f(X1 - X0) + '" height="' + f(Y1 - Y0) + '"/>');
  }
  function line(cls, x1, y1, x2, y2) { o('<line class="' + cls + '" x1="' + f(x1) + '" y1="' + f(y1) + '" x2="' + f(x2) + '" y2="' + f(y2) + '"/>'); }
  function line_b(p, x0, z0, x1, z1, cls) { var a = p.P(x0, z0), b = p.P(x1, z1); line(cls, a[0], a[1], b[0], b[1]); }
  function poly_b(p, pts, cls, closed) {
    var q = pts.map(function (t) { return f(p.X(t[1])) + ',' + f(p.Y(t[0])); }).join(' ');
    o('<' + (closed === false ? 'polyline' : 'polygon') + ' class="' + cls + '" points="' + q + '"/>');
  }
  function txt(x, y, s, size, anchor, cls, rot, weight) {
    size = size || 2.5; anchor = anchor || 'start';
    var tr = rot != null ? ' transform="rotate(' + f(rot) + ' ' + f(x) + ' ' + f(y) + ')"' : '';
    var wt = weight ? ' font-weight="' + weight + '"' : '';
    var c = cls ? ' class="' + cls + '"' : '';
    o('<text x="' + f(x) + '" y="' + f(y) + '" font-size="' + f(size) + '" text-anchor="' + anchor + '"' + wt + c + tr + '>' + s + '</text>');
  }
  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  /* ---------- Maßzahlen nach DIN 1356-1: ab 1 m in m, darunter in cm, 5 mm hochgestellt ---------- */
  function r5(v) { return Math.floor(v / 0.005 + 0.5 + 1e-9) * 0.005; }
  function mz(v) {
    v = r5(v); var mm = Math.round(v * 1000), sup = (mm % 10) === 5, base = mm - (sup ? 5 : 0);
    var s = v < 1 ? String(Math.floor(base / 10)) : (base / 1000).toFixed(2).replace('.', ',');
    return sup ? s + '<tspan class="p-sup" dy="-0.75" font-size="0.7em">5</tspan>' : s;
  }
  function mzlen(v) { var t = mz(v); return t.split('<')[0].length + (t.indexOf('<') >= 0 ? 0.6 : 0); }

  /* ---------- Maßketten: Schrägstrich 45° in Kommarichtung, Zahl über der Maßlinie ----------
     axis 'h': Kette entlang Blatt-x bei y = fixed; 'v': entlang Blatt-y bei x = fixed. pts: Blattkoordinaten.
     under: {Index des Abschnitts: Text unter der Maßlinie (Öffnungshöhe)} */
  function chain(axis, fixed, pts, under, side, size, ext) {
    under = under || {}; side = side == null ? -1 : side; size = size || 1.8; ext = ext == null ? 3.0 : ext;
    var a = pts[0], b = pts[pts.length - 1], i;
    if (axis === 'h') line('p-dim', a - 1.5, fixed, b + 1.5, fixed); else line('p-dim', fixed, a - 1.5, fixed, b + 1.5);
    pts.forEach(function (q) {
      if (axis === 'h') { line('p-dim', q, fixed + side * ext, q, fixed - side * 1.5); line('p-tick', q - 1.1, fixed + 1.1, q + 1.1, fixed - 1.1); }
      else { line('p-dim', fixed - side * ext, q, fixed + side * 1.5, q); line('p-tick', fixed + 1.1, q + 1.1, fixed - 1.1, q - 1.1); }
    });
    var level = 0;
    for (i = 0; i < pts.length - 1; i++) {
      var seg = pts[i + 1] - pts[i], val = seg / S, need = mzlen(val) * size * 0.56 + 0.6, mid = (pts[i] + pts[i + 1]) / 2;
      level = need > seg ? (level !== 1 ? 1 : 2) : 0;     // enge Abschnitte: Zahl höher setzen, aufeinanderfolgende abwechselnd
      var lift = 0.8 + (size + 0.4) * level;
      if (axis === 'h') {
        txt(mid, fixed - lift, mz(val), size, 'middle', 'p-dimt');
        if (under[i]) txt(mid, fixed + 0.8 + size, under[i], size, 'middle', 'p-dimt');
      } else {
        txt(fixed - lift, mid, mz(val), size, 'middle', 'p-dimt', -90);
        if (under[i]) txt(fixed + 0.8 + size, mid, under[i], size, 'middle', 'p-dimt', -90);
      }
    }
  }
  /* coords in Gebäudemetern; Positionen auf 5 mm gerundet, damit die Kette aufgeht */
  function chain_b(p, axis, at, coords, under, side, ext) {
    var c0 = coords[0];
    var pts = coords.map(function (c) { return axis === 'h' ? p.X(c0) + r5(c - c0) * S : p.Y(c0) + r5(c0 - c) * S; });
    chain(axis, at, pts, under, side, null, ext);
  }

  /* ---------- Symbole ---------- */
  function door(p, h, c, op) {
    line_b(p, h[0], h[1], op[0], op[1], 'p-leaf');
    var r = Math.hypot(c[0] - h[0], c[1] - h[1]) * S, a = p.P(op[0], op[1]), b = p.P(c[0], c[1]), hp = p.P(h[0], h[1]);
    var cr = (a[0] - hp[0]) * (b[1] - hp[1]) - (a[1] - hp[1]) * (b[0] - hp[0]);   // Bogen vom offenen Blatt zur geschlossenen Lage
    o('<path class="p-arc" d="M' + f(a[0]) + ' ' + f(a[1]) + ' A' + f(r) + ' ' + f(r) + ' 0 0 ' + (cr > 0 ? 1 : 0) + ' ' + f(b[0]) + ' ' + f(b[1]) + '"/>');
  }
  function kote(x, y, label) {
    o('<path class="p-kote" d="M' + f(x) + ' ' + f(y) + ' l-1.1 -1.6 h2.2 z"/>');
    line('p-thin', x - 1.6, y, x + 1.6, y);
    txt(x + 1.6, y - 0.4, label, 1.8);
  }
  function stamp(x, y, lines, size) {
    size = size || 2.5; var lh = size * 1.3, y0 = y - (lines.length - 1) * lh / 2 + size * 0.35;
    lines.forEach(function (l, i) { txt(x, y0 + i * lh, l[0], size, 'middle', 'p-st', null, l[1]); });
  }
  function lauflinie(p, x, zs, ze, zbr) {
    var a = p.P(x, zs), b = p.P(x, ze);
    o('<circle class="p-ll" cx="' + f(a[0]) + '" cy="' + f(a[1]) + '" r="0.75"/>');
    if (zbr == null) line('p-ll', a[0] - 0.75, a[1], b[0] + 1.6, b[1]);
    else { var c = p.P(x, zbr); line('p-ll', a[0] - 0.75, a[1], c[0], c[1]); line('p-ll p-above', c[0], c[1], b[0] + 1.6, b[1]); }
    o('<path class="p-arrow" d="M' + f(b[0]) + ' ' + f(b[1]) + ' l2 -0.75 v1.5 z"/>');
  }
  function area(a, b) { return de(a * b, 1); }

  /* ---------- Blatt ---------- */
  o('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 297" width="420mm" height="297mm" role="img" aria-labelledby="gr-t gr-d" class="plan-svg">');
  o('<title id="gr-t">Grundrisse La Congiunta, Erdgeschoss und Untergeschoss, M 1:200</title>');
  o('<desc id="gr-d">Von Claude (KI von Anthropic) gezeichnete Rekonstruktion nach den Maßen des 3D-Modells, Darstellung nach DIN 1356-1. ' +
    'Erdgeschoss: drei Räume hintereinander, 42,40 × 5,25 m außen, vier Zellen an der Westseite von Raum 3, Eingang an der Nordseite, Kellerabgang außen an der Westwand. ' +
    'Untergeschoss: Lager unter Raum 3 und Keller unter den Zellen, Zugang nur über die Außentreppe. Kein amtlicher Plan.</desc>');
  o('<style>' +
    '.plan-svg{background:#fff;font-family:' + FONT + ';color:#000}' +
    '.plan-svg text{fill:#000;paint-order:stroke;stroke:#fff;stroke-width:0.55;stroke-linejoin:round}.plan-svg text.p-kit{stroke:none}' +
    '.plan-svg text.p-st{stroke-width:1.1}.plan-svg .p-cut{fill:#000;stroke:#000;stroke-width:0.05}' +
    '.plan-svg .p-vis,.plan-svg .p-leaf{fill:none;stroke:#000;stroke-width:0.35}' +
    '.plan-svg .p-arc,.plan-svg .p-thin,.plan-svg .p-equip,.plan-svg .p-ll{fill:none;stroke:#000;stroke-width:0.25}' +
    '.plan-svg .p-above{fill:none;stroke:#000;stroke-width:0.35;stroke-dasharray:0.01 0.9;stroke-linecap:round}' +
    '.plan-svg .p-dim{stroke:#000;stroke-width:0.25}.plan-svg .p-tick{stroke:#000;stroke-width:0.5}' +
    '.plan-svg .p-arrow,.plan-svg .p-kote,.plan-svg .p-ki{fill:#000}.plan-svg .p-kit{fill:#fff}' +
    '.plan-svg .p-frame{fill:none;stroke:#000;stroke-width:0.7}' +
    '.plan-svg .p-box,.plan-svg .p-brk{fill:none;stroke:#000;stroke-width:0.35}.plan-svg .p-boxt{fill:none;stroke:#000;stroke-width:0.25}' +
    '</style>');
  o('<rect x="0" y="0" width="420" height="297" fill="#fff"/>');
  o('<rect class="p-frame" x="20" y="10" width="390" height="277"/>');

  /* ===================== Erdgeschoss ===================== */
  var p = new Plan(OYE), k, i;
  o('<g class="p-eg">');
  txt(OX, 21, 'Grundriss Erdgeschoss', 5, null, null, null, 700);
  txt(OX + 62, 21, 'M 1:200 · Schnitthöhe 1,00 m über Fußboden', 2.5);
  var walls = [[W / 2 - T0, W / 2, -TOT / 2, TOT / 2]];                         // Ostwand
  var cur = -TOT / 2;                                                            // Westwand mit Zellentüren
  [3, 2, 1, 0].forEach(function (k) { var g = cellZ(k); walls.push([-W / 2, -W / 2 + T0, cur, g - CDW / 2]); cur = g + CDW / 2; });
  walls.push([-W / 2, -W / 2 + T0, cur, TOT / 2]);
  [[-TOT / 2, -TOT / 2 + T0], [zS[1] - T0 / 2, zS[1] + T0 / 2], [zS[2] - T0 / 2, zS[2] + T0 / 2]].forEach(function (z) {   // Nordwand und Innenwände mit Türöffnung
    walls.push([-W / 2, DOFF - DW / 2, z[0], z[1]]); walls.push([DOFF + DW / 2, W / 2, z[0], z[1]]);
  });
  walls.push([CX0, W / 2, TOT / 2 - T0, TOT / 2]);                              // Südwand mit Zellentrakt
  walls.push([CX0, CX0 + T0, CZ0, TOT / 2]);                                     // Westwand Zellentrakt
  walls.push([CX0, -W / 2, CZ0, CZ0 + T0]);                                      // Nordwand Zellentrakt
  [1, 2, 3].forEach(function (k) { var c = zE - k * CP; walls.push([CX0, -W / 2, c - T0 / 2, c + T0 / 2]); });
  walls.forEach(function (w) { rect_b(p, w[0], w[1], w[2], w[3], 'p-cut'); });
  // Kellerabgang (unter der Schnittebene, sichtbar): Stützmauer, Stufen, Podest
  rect_b(p, KPX0 - KPT, KPX0, KPZN - 0.2, KPZS, 'p-vis');
  line_b(p, KPX0, KPZN, KPX1, KPZN, 'p-vis');
  for (k = 0; k <= NS; k++) { var zz = KPZM - k * RUN; line_b(p, KPX0, zz, KPX1, zz, 'p-vis'); }
  lauflinie(p, (KPX0 + KPX1) / 2, KPZM - RUN / 2, KPZN);
  // Eingang: Stufe, Tür nach außen aufgeschlagen
  rect_b(p, DOFF - DW / 2 - 0.05, DOFF + DW / 2 + 0.05, -TOT / 2 - 0.4, -TOT / 2, 'p-vis');
  door(p, [DOFF + DW / 2, -TOT / 2], [DOFF - DW / 2, -TOT / 2], [DOFF + DW / 2, -TOT / 2 - DW]);
  // Lichtgaden und Oblichter (über der Schnittebene)
  for (i = 0; i < 3; i++) rect_b(p, LOFF - LB / 2, LOFF + LB / 2, zA(i), zB(i), 'p-above');
  for (k = 0; k < 4; k++) rect_b(p, SKX0, SKX1, cellZ(k) - SKZ, cellZ(k) + SKZ, 'p-above');
  // Sockel der Halbfiguren (Ausstattung)
  [[4.2, 0.25], [8.9, -0.2], [13.6, 0.4]].forEach(function (d) {
    var cx = 0.55, cz = zA(2) + d[0], rot = d[1];
    poly_b(p, [[-0.33, -0.27], [0.33, -0.27], [0.33, 0.27], [-0.33, 0.27]].map(function (s) {
      return [cx + s[0] * Math.cos(rot) + s[1] * Math.sin(rot), cz - s[0] * Math.sin(rot) + s[1] * Math.cos(rot)];
    }), 'p-equip');
  });
  // Raumstempel
  var lens = [0, 1, 2].map(function (i) { return zB(i) - zA(i); });
  var cellL = CP - T0, cellW = -W / 2 - (CX0 + T0);
  var names = [['0.01 Raum 1', 'Vorraum, Eingang'], ['0.02 Raum 2', null], ['0.03 Raum 3', null]];
  var posz = [(zA(0) + zB(0)) / 2, (zA(1) + zB(1)) / 2 - 1.2, zA(2) + 6.55];
  for (i = 0; i < 3; i++) {
    var ln = [[names[i][0], 700]];
    if (names[i][1]) ln.push([names[i][1], null]);
    ln.push(['NRF ≈ ' + area(lens[i], Wi) + ' m²', null], ['LH ' + de(H[i], 2) + ' m', null]);
    stamp(p.X(posz[i]), p.Y(0.55), ln);
    kote(p.X(posz[i]) + (i ? 13 : -15), p.Y(1.75), '±0,00');
  }
  [3, 2, 1, 0].forEach(function (k, n) {
    stamp(p.X(cellZ(k)), p.Y(-5.135), [['0.0' + (4 + n) + ' Zelle ' + (n + 1), 700], ['≈ ' + area(cellL, cellW) + ' m², LH ≈ 4,30', null]], 1.6);
  });
  txt(p.X((KPZN + KPZM) / 2), p.Y(KPX0 - KPT) + 3.4, 'Kellerabgang außen, 13 Stg. ≈ 18,8/26,2', 1.8, 'middle');
  // Bemaßung außen
  var top = OYE - 7, wb = p.Y(CX0), xl = p.X(-TOT / 2), xr = p.X(TOT / 2);
  chain_b(p, 'h', top, [-TOT / 2, -TOT / 2 + T0, zS[1] - T0 / 2, zS[1] + T0 / 2, zS[2] - T0 / 2, zS[2] + T0 / 2, TOT / 2 - T0, TOT / 2], null, 1, 6);
  chain_b(p, 'h', top - 7, [-TOT / 2, TOT / 2], null, 1, 13);
  var cc = [CZ0, CZ0 + T0];
  [3, 2, 1].forEach(function (k) { cc.push(zE - k * CP - T0 / 2, zE - k * CP + T0 / 2); });
  cc.push(TOT / 2 - T0, TOT / 2);
  chain_b(p, 'h', wb + 7, cc, null, -1, 6);
  chain_b(p, 'h', wb + 14, [-TOT / 2, KPZN, CZ0, TOT / 2], null, -1, 13);
  chain_b(p, 'v', xl - 10, [E, E - T0, DOFF + DW / 2, DOFF - DW / 2, -W / 2 + T0, -W / 2], { 2: '2,15' }, 1, 9);
  chain_b(p, 'v', xl - 17, [E, -W / 2], null, 1, 16);
  chain_b(p, 'v', xr + 7, [E, E - T0, -W / 2 + T0, -W / 2, CX0 + T0, CX0], null, -1);
  chain_b(p, 'v', xr + 14, [E, -W / 2, CX0], null, -1);
  chain_b(p, 'v', xr + 21, [E, CX0], null, -1);
  // innen: Zellentüren in Raum 3, Lage des Lichtgadens in Raum 2
  var dz = [zA(2)];
  [3, 2, 1, 0].forEach(function (k) { dz.push(cellZ(k) - CDW / 2, cellZ(k) + CDW / 2); });
  dz.push(zB(2));
  chain_b(p, 'h', p.Y(-1.45), dz, { 1: '2,15', 3: '2,15', 5: '2,15', 7: '2,15' }, 1, 4.2);
  chain_b(p, 'v', p.X(zA(1) + 2.0), [W / 2 - T0, LOFF + LB / 2, LOFF - LB / 2, -W / 2 + T0], null, 1, 1.5);
  o('</g>');

  /* ===================== Untergeschoss ===================== */
  p = new Plan(OYU);
  o('<g class="p-ug">');
  txt(OX, OYU - 27, 'Grundriss Untergeschoss', 5, null, null, null, 700);
  txt(OX + 65, OYU - 27, 'M 1:200 · Schnitthöhe 1,00 m über Kellerboden', 2.5);
  // Erdgeschoss über dem nicht unterkellerten Teil (Punktlinie)
  poly_b(p, [[E, zS[2] - T0 / 2], [E, -TOT / 2], [-W / 2, -TOT / 2], [-W / 2, KPZN]], 'p-above', false);
  txt(p.X((-TOT / 2 + zS[2]) / 2), p.Y(0) + 0.9, 'Raum 1 und 2 darüber, nicht unterkellert', 2.5, 'middle');
  [[W / 2 - T0, W / 2, zS[2] - T0 / 2, TOT / 2], [-W / 2, W / 2, zS[2] - T0 / 2, zS[2] + T0 / 2], [CX0, W / 2, TOT / 2 - T0, TOT / 2],
   [-W / 2, -W / 2 + T0, KPZN, oz0], [-W / 2, -W / 2 + T0, oz1, TOT / 2], [CX0, CX0 + T0, KPZS, TOT / 2],
   [CX0, dx0, KPZS, KPZS + T0], [dx1, -W / 2, KPZS, KPZS + T0], [KPX0 - KPT, KPX0, KPZN - 0.2, KPZS]].forEach(function (w) { rect_b(p, w[0], w[1], w[2], w[3], 'p-cut'); });
  // Treppe: bis zur Schnitthöhe sichtbar, darüber Punktlinie, Bruchlinie
  var cutk = Math.floor(1.0 / RISE) - 1;          // letzte Stufe ganz unter der Schnittebene (1,00 m über Kellerboden)
  var zbr = KPZM - (cutk + 1.5) * RUN;
  for (k = 0; k <= NS; k++) { var z2 = KPZM - k * RUN; line_b(p, KPX0, z2, KPX1, z2, k <= cutk + 1 ? 'p-vis' : 'p-above'); }
  var ba = p.P(KPX0, zbr + 0.35), bb = p.P(KPX1, zbr - 0.35);
  line('p-brk', ba[0], ba[1], bb[0], bb[1]);
  lauflinie(p, (KPX0 + KPX1) / 2, KPZM - RUN / 2, KPZN, zbr);
  // Türen: Doppeltür ins Lager (nach innen), Tür des Zellenkellers (in den Schacht)
  var hw = (oz1 - oz0) / 2, xi = -W / 2 + T0;
  door(p, [xi, oz0], [xi, oz0 + hw], [xi + hw, oz0]);
  door(p, [xi, oz1], [xi, oz1 - hw], [xi + hw, oz1]);
  door(p, [dx1, KPZS], [dx0, KPZS], [dx1, KPZS - (dx1 - dx0)]);
  // Raumstempel
  var mz0 = zS[2] + T0 / 2, mz1 = TOT / 2 - T0, cz0 = KPZS + T0, cz1 = TOT / 2 - T0;
  stamp(p.X(16.9), p.Y(0.55), [['-1.01 Lager', 700], ['NRF ≈ ' + area(mz1 - mz0, Wi) + ' m²', null], ['LH ≈ 2,21 m', null]]);
  kote(p.X(8.6), p.Y(1.55), '−2,44');
  stamp(p.X(15.0), p.Y((CX0 + T0 - W / 2) / 2), [['-1.02 Zellenkeller', 700], ['NRF ≈ ' + area(cz1 - cz0, cellW) + ' m²', null], ['LH ≈ 2,21 m', null]]);
  kote(p.X(15.0) + 15, p.Y((CX0 + T0 - W / 2) / 2) + 0.6, '−2,44');
  txt(p.X((KPZM + KPZS) / 2), p.Y(KPX0 - KPT) + 3.4, 'Podest −2,44', 1.8, 'middle');
  txt(p.X((KPZN + KPZM) / 2), p.Y(KPX0 - KPT) + 3.4, '13 Stg. ≈ 18,8/26,2', 1.8, 'middle');
  // Bemaßung
  top = OYU - 7; wb = p.Y(CX0); xr = p.X(TOT / 2);
  chain_b(p, 'h', top, [zS[2] - T0 / 2, zS[2] + T0 / 2, TOT / 2 - T0, TOT / 2], null, 1, 6);
  chain_b(p, 'h', top - 7, [-TOT / 2, zS[2] - T0 / 2, TOT / 2], null, 1, 13);
  chain_b(p, 'h', wb + 7, [KPZN, KPZM, KPZS, KPZS + T0, TOT / 2 - T0, TOT / 2], null, -1, 6);
  chain_b(p, 'h', wb + 14, [-TOT / 2, KPZN, TOT / 2], null, -1, 13);
  chain_b(p, 'v', xr + 7, [E, E - T0, -W / 2 + T0, -W / 2, CX0 + T0, CX0], null, -1);
  chain_b(p, 'v', xr + 14, [E, -W / 2, CX0], null, -1);
  chain_b(p, 'v', xr + 21, [E, CX0], null, -1);
  chain_b(p, 'h', p.Y(-0.6), [mz0, oz0, oz1, mz1], { 1: '2,00' }, 1, 8.3);
  chain_b(p, 'v', p.X(KPZN - 0.2) - 6, [-W / 2 + T0, -W / 2, KPX0, KPX0 - KPT], null, 1);
  chain_b(p, 'v', p.X(KPZS + T0 + 0.9), [dx1, dx0], { 0: '2,00' }, -1, 3.0);
  o('</g>');

  /* ===================== Kennzeichnung, Zeichenerklärung, Nordpfeil, Maßstab ===================== */
  var LX = 300, y = 45;
  o('<g class="p-legend">');
  o('<rect class="p-ki" x="' + LX + '" y="15" width="105" height="15"/>');
  txt(LX + 3, 21, 'Gezeichnet von Claude (KI von Anthropic)', 2.5, null, 'p-kit', null, 700);
  txt(LX + 3, 26.5, 'Rekonstruktion aus Plänen und Modell, kein amtlicher Plan', 1.8, null, 'p-kit');
  txt(LX, 38, 'Zeichenerklärung', 3.5, null, null, null, 700);
  function leg(draw, text) {
    draw(LX, y);
    text.forEach(function (t, i) { txt(LX + 14, y + 0.6 + i * 2.6, t, 1.8); });
    y += Math.max(6.2, 2.6 * text.length + 2.2);
  }
  leg(function (x, yy) { o('<rect class="p-cut" x="' + f(x) + '" y="' + f(yy - 1.2) + '" width="10" height="2.4"/>'); }, ['Ortbeton, geschnitten (bei M 1:200 geschwärzt)']);
  leg(function (x, yy) { line('p-vis', x, yy, x + 10, yy); }, ['Sichtbare Kanten unter der Schnittebene']);
  leg(function (x, yy) { line('p-above', x, yy, x + 10, yy); }, ['Bauteile über der Schnittebene: Lichtgaden,', 'Oblichter der Zellen; im UG das Erdgeschoss']);
  leg(function (x, yy) { o('<rect class="p-equip" x="' + f(x + 3.3) + '" y="' + f(yy - 1.35) + '" width="3.3" height="2.7"/>'); }, ['Sockel der Halbfiguren (≈ 0,66 × 0,54 m, Lage angenähert)']);
  leg(function (x, yy) {
    line('p-leaf', x + 2, yy + 1.5, x + 2, yy - 2.5);
    o('<path class="p-arc" d="M' + f(x + 2) + ' ' + f(yy - 2.5) + ' A4 4 0 0 1 ' + f(x + 6) + ' ' + f(yy + 1.5) + '"/>');
    o('<line class="p-cut" x1="' + f(x) + '" y1="' + f(yy + 1.5) + '" x2="' + f(x + 2) + '" y2="' + f(yy + 1.5) + '" style="stroke-width:0.8"/>');
    o('<line class="p-cut" x1="' + f(x + 6) + '" y1="' + f(yy + 1.5) + '" x2="' + f(x + 10) + '" y2="' + f(yy + 1.5) + '" style="stroke-width:0.8"/>');
  }, ['Tür mit Aufschlag; ohne Bogen: offene Durchgänge']);
  leg(function (x, yy) {
    o('<circle class="p-ll" cx="' + f(x + 0.75) + '" cy="' + f(yy) + '" r="0.75"/>');
    line('p-ll', x + 1.5, yy, x + 9, yy);
    o('<path class="p-arrow" d="M' + f(x + 10) + ' ' + f(yy) + ' l-2 -0.75 v1.5 z"/>');
  }, ['Lauflinie: Kreis an der ersten, Pfeil an der letzten', 'Stufe, immer aufwärts; Stg. = Steigungen h/a in cm']);
  leg(function (x, yy) { kote(x + 2, yy + 0.8, '±0,00'); }, ['Höhe Oberkante Fußboden; ±0,00 = Fußboden EG,', '≈ 398,10 m ü. M. (swissALTI3D)']);
  leg(function (x, yy) { txt(x + 5, yy - 0.6, '0.01', 1.8, 'middle', null, null, 700); txt(x + 5, yy + 1.8, 'NRF · LH', 1.6, 'middle'); },
    ['Raumnummer (0 = EG, -1 = UG), Netto-Raumfläche', 'nach DIN 277, lichte Raumhöhe']);
  leg(function (x, yy) { chain('h', yy + 1, [x, x + 10], null, 1, null, 1.5); },
    ['Maße in m, unter 1,00 m in cm, hochgestellt mm:', '32<tspan dy="-0.7" font-size="0.7em">5</tspan><tspan dy="0.7"> = 32,5 cm.</tspan> Öffnungen: Breite über, Höhe', 'unter der Maßlinie. Gerundet auf 5 mm.']);
  y += 1;
  // Nordpfeil: Gebäudeachse 21,1° gegen Nord gedreht (swissBUILDINGS3D); Nord zeigt im Plan nach links oben
  var TH = 0.36826, nx = Math.sin(TH), nz = -Math.cos(TH);   // Nordrichtung in Gebäudekoordinaten (x Ost, z Süd)
  var ang = Math.atan2(-nx, nz) * 180 / Math.PI, cx = LX + 15, cy = y + 12;   // Blatt: +X = +z, +Y = -x
  o('<circle class="p-box" cx="' + f(cx) + '" cy="' + f(cy) + '" r="9"/>');
  // Nadel durch den Kreis, Spitze nach Nord: eine Hälfte schwarz, eine Hälfte offen; N vor der Spitze
  o('<g transform="translate(' + f(cx) + ' ' + f(cy) + ') rotate(' + f(ang) + ')"><line x1="-9" y1="0" x2="9" y2="0" stroke="#000" stroke-width="0.35"/>' +
    '<path d="M9 0 L-4 -2.8 L-4 0 Z" fill="#000" stroke="#000" stroke-width="0.25" stroke-linejoin="round"/>' +
    '<path d="M9 0 L-4 2.8 L-4 0 Z" fill="#fff" stroke="#000" stroke-width="0.25" stroke-linejoin="round"/>' +
    '<text x="12.6" y="1.25" font-size="3.5" font-weight="700" text-anchor="middle" transform="rotate(' + f(-ang) + ' 12.6 0)">N</text></g>');
  txt(LX + 30, y + 9, 'Nord (geografisch)', 1.8);
  txt(LX + 30, y + 11.8, 'Gebäudeachse 21° gegen Nord gedreht', 1.8);
  txt(LX + 30, y + 14.6, 'nach swissBUILDINGS3D', 1.8);
  y += 28;
  // Maßstabsleiste
  txt(LX, y, 'Maßstabsleiste', 1.8, null, null, null, 700); y += 3;
  for (i = 0; i < 10; i++) o('<rect x="' + (LX + i * 5) + '" y="' + f(y) + '" width="5" height="1.6" fill="' + (i % 2 === 0 ? '#000' : '#fff') + '" stroke="#000" stroke-width="0.25"/>');
  [0, 1, 5, 10].forEach(function (m) { txt(LX + m * 5, y + 4.6, String(m), 1.8, 'middle'); });
  txt(LX + 53, y + 1.6, 'm', 1.8);
  y += 9;
  var nrfEG = lens.reduce(function (s, l) { return s + l * Wi; }, 0) + 4 * cellL * cellW, nrfUG = (mz1 - mz0) * Wi + (cz1 - cz0) * cellW;
  txt(LX, y, 'Flächen (DIN 277, aus der Rekonstruktion)', 1.8, null, null, null, 700); y += 2.7;
  txt(LX, y, 'NRF EG ≈ ' + de(nrfEG, 1) + ' m², UG ≈ ' + de(nrfUG, 1) + ' m²', 1.8);
  o('</g>');

  /* ===================== Hinweise (unten links) ===================== */
  o('<rect class="p-box" x="20" y="232" width="210" height="55"/>');
  txt(24, 238, 'Hinweise', 2.5, null, null, null, 700);
  ['Diese Grundrisse hat Claude, ein KI-Modell von Anthropic, am 11.11.2026 gezeichnet. Es ist eine Rekonstruktion',
   'für die Website, keine Bauaufnahme und kein Plan des Architekten. Nicht für Ausführung oder Vermessung verwenden.',
   'Grundlage sind die Maße des 3D-Modells: Grundriss, Kellergrundriss und Schnitte bei Pireddu 2025 [1], im Maßstab',
   'der Gesamtlänge vermessen (±0,10 m) und mit swissBUILDINGS3D [3] abgeglichen; Innenbreite 4,60 m und Sockel',
   'nach Peter Märkli im Video [2]; lichte Höhen nach Pireddu [1], Fußnote 10; alle übrigen Maße berechnet oder geschätzt (≈).',
   'Darstellung nach DIN 1356-1 (Bauzeichnungen) mit Linienbreiten der Gruppe 0,5 für M 1:100 bis 1:500, Bemaßung',
   'nach DIN 406-11 und DIN 1356-1, Blattgröße A3 nach DIN EN ISO 5457, Schriftfeld in Anlehnung an DIN EN ISO 7200,',
   'Schriftgrößen nach DIN EN ISO 3098, Flächen nach DIN 277. Quellennummern wie auf der Website.'
  ].forEach(function (t, i) { txt(24, 243.5 + i * 5.2, esc(t), 2.0); });

  /* ===================== Schriftfeld ===================== */
  var SX = 235, SY = 232, SW = 175;
  o('<rect class="p-box" x="' + SX + '" y="' + SY + '" width="' + SW + '" height="55"/>');
  [246, 258, 270].forEach(function (yy) { o('<line class="p-boxt" x1="' + SX + '" y1="' + yy + '" x2="' + (SX + SW) + '" y2="' + yy + '"/>'); });
  o('<line class="p-boxt" x1="' + (SX + 90) + '" y1="258" x2="' + (SX + 90) + '" y2="270"/>');
  [SX + 70, SX + 105, SX + 140].forEach(function (xx) { o('<line class="p-boxt" x1="' + xx + '" y1="270" x2="' + xx + '" y2="287"/>'); });
  function lab(x, yy, t) { txt(x, yy, t, 1.8); }
  lab(SX + 2, SY + 3.2, 'Bauvorhaben');
  txt(SX + 2, SY + 7.8, 'La Congiunta, Haus für Reliefs und Halbfiguren von Hans Josephsohn', 2.5, null, null, null, 700);
  txt(SX + 2, SY + 12, 'Via Stazione Vecchia 2, 6745 Giornico TI, Schweiz', 2.0);
  lab(SX + 2, 249.2, 'Planinhalt');
  txt(SX + 2, 255, 'Grundriss Erdgeschoss und Untergeschoss', 3.5, null, null, null, 700);
  lab(SX + 2, 261.2, 'Entwurf'); txt(SX + 2, 266.5, 'Peter Märkli, 1986–1992 (Mitarbeit Stefan Bellwalder)', 2.0);
  lab(SX + 92, 261.2, 'Planart'); txt(SX + 92, 266.5, 'Rekonstruktion des Bestands, nicht maßverbindlich', 2.0);
  o('<rect class="p-ki" x="' + SX + '" y="270" width="70" height="17"/>');
  txt(SX + 2, 273.4, 'Gezeichnet', 1.8, null, 'p-kit');
  txt(SX + 2, 278.6, 'Claude (KI von Anthropic)', 2.5, null, 'p-kit', null, 700);
  txt(SX + 2, 283.6, 'KI-generiert, aus dem 3D-Modell', 1.8, null, 'p-kit');
  lab(SX + 72, 273.4, 'Datum'); txt(SX + 72, 280, '11.11.2026', 2.5);
  lab(SX + 107, 273.4, 'Maßstab'); txt(SX + 107, 280, '1:200 (A3)', 2.5); txt(SX + 107, 284.6, 'Maße in m / cm', 1.8);
  lab(SX + 142, 273.4, 'Blatt'); txt(SX + 142, 280, 'LC-GR-01', 2.5, null, null, null, 700); txt(SX + 142, 284.6, 'Index a', 1.8);
  o('</svg>');
  return out.join('\n');
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = grundrisse;
  if (require.main === module) require('fs').writeFileSync(process.argv[2], grundrisse());
}
