/* La Congiunta 3D – Lader: holt three.js, die Modelldaten und die App-Dateien und startet die App.
   Die App-Dateien teilen sich einen gemeinsamen Bereich und laufen in der Reihenfolge von APP direkt
   nacheinander (in einem Zug, damit kein Klick dazwischen auf halb geladenen Code trifft).
   Die Einzeldatei (tools/build_standalone.py) bringt Daten und App-Code schon eingebettet mit. */
(function () {
  'use strict';
  var THREE_BASE = 'https://cdn.jsdelivr.net/npm/three@0.128.0/';
  var LIBS = ['build/three.min.js', 'examples/js/shaders/CopyShader.js', 'examples/js/shaders/LuminosityHighPassShader.js',
    'examples/js/postprocessing/EffectComposer.js', 'examples/js/postprocessing/RenderPass.js', 'examples/js/postprocessing/ShaderPass.js',
    'examples/js/postprocessing/MaskPass.js', 'examples/js/postprocessing/UnrealBloomPass.js', 'examples/js/objects/Sky.js'];
  var DATA = 'assets/data/model-data.json';
  var IMG = {
    o19: 'assets/img/ortho-z19.jpg', o17: 'assets/img/ortho-z17.jpg', o15: 'assets/img/ortho-z15.jpg', o13: 'assets/img/ortho-z13.jpg',
    TA: 'assets/img/tex-concrete-a.jpg', TB: 'assets/img/tex-concrete-b.jpg', TI: 'assets/img/tex-interior-wall.jpg', TF: 'assets/img/tex-floor.jpg',
    canN: 'assets/img/mask-canopy-near.png', canM: 'assets/img/mask-canopy-mid.png', canF: 'assets/img/mask-canopy-far.png',
    grass: 'assets/img/mask-meadow.png', water: 'assets/img/mask-water.png'
  };
  /* Version aus dem Aufruf in index.html (js/loader.js?v=…): hängt an alle nachgeladenen Dateien, damit nach einer Änderung nichts Altes aus dem Zwischenspeicher kommt */
  var VER = (document.currentScript && /[?&]v=([^&#]+)/.exec(document.currentScript.src) || [])[1] || '';
  function ver(url) { return VER ? url + '?v=' + VER : url; }
  var APP=['js/core.js','js/renderer.js','js/sky.js','js/terrain.js','js/building.js','js/exhibits.js','js/vegetation.js','js/village.js','js/signs.js','js/view.js','js/controls.js','js/film.js','js/aerial-tiles.js','js/start.js'];

  function say(text, isError) {
    var el = document.getElementById('loadTxt');
    if (el) { el.textContent = text; el.className = isError ? 'err' : ''; }
  }

  function loadLibs() {
    return new Promise(function (resolve) {
      var left = LIBS.length;
      LIBS.forEach(function (path) {
        var s = document.createElement('script');
        s.src = THREE_BASE + path;
        s.async = false;
        s.crossOrigin = 'anonymous';
        s.onload = s.onerror = function () { if (--left === 0) resolve(); };
        document.head.appendChild(s);
      });
    });
  }

  function fetchText(url) {
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error(url + ' (' + r.status + ')');
      return r.text();
    });
  }

  /* eingebettete App-Dateien der Einzeldatei, sonst null */
  function inlineSources() {
    var blocks = document.querySelectorAll('script[type="text/plain"][data-lc-src]');
    if (!blocks.length) return null;
    var byPath = {};
    [].forEach.call(blocks, function (b) { byPath[b.getAttribute('data-lc-src')] = b.textContent; });
    return APP.map(function (p) { return byPath[p]; });
  }

  function loadData() {
    if (window.LC_ASSETS) return Promise.resolve();
    return fetch(ver(DATA)).then(function (r) {
      if (!r.ok) throw new Error(DATA + ' (' + r.status + ')');
      return r.json();
    }).then(function (data) {
      data.img = {};
      Object.keys(IMG).forEach(function (k) { data.img[k] = ver(IMG[k]); });
      window.LC_ASSETS = data;
    });
  }

  function runApp(sources) {
    for (var i = 0; i < APP.length; i++) {
      if (window.LC_ABORT) return;
      var s = document.createElement('script');
      s.textContent = sources[i] + '\n//# sourceURL=' + APP[i];
      document.head.appendChild(s);
    }
  }

  function start() {
    var inline = inlineSources();
    if (!inline && location.protocol === 'file:') {
      say('Diese Fassung braucht einen Webserver (z. B. „python3 -m http.server“ im Ordner) oder die Einzeldatei La_Congiunta_Giornico_3D.html.', true);
      return;
    }
    say('3D-Bibliothek und Modelldaten werden geladen …');
    var app = inline ? Promise.resolve(inline) : Promise.all(APP.map(function (p) { return fetchText(ver(p)); }));
    Promise.all([loadLibs(), loadData(), app]).then(function (res) {
      window.LC_T1 = performance.now();
      if (!window.THREE) {
        say('Die 3D-Bibliothek (three.js) konnte nicht von cdn.jsdelivr.net geladen werden. Bitte die Seite neu laden oder die Internetverbindung prüfen.', true);
        return;
      }
      setTimeout(function () { runApp(res[2]); }, 0);
    }).catch(function (e) {
      say('Die Modelldaten konnten nicht geladen werden (' + e.message + '). Bitte die Seite neu laden.', true);
    });
  }

  /* Hell/Dunkel-Schalter: die Wahl bleibt im Browser gespeichert; die App färbt Maßlinien und Uhrzeit-Spur nach (Ereignis lc-theme) */
  var THEME_BAR = { light: '#f2f2ef', dark: '#1f201d' };
  var darkMq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') || (darkMq && darkMq.matches ? 'dark' : 'light');
  }
  function showTheme() {
    var t = currentTheme(), b = document.getElementById('themeBtn');
    if (b) {
      b.setAttribute('aria-pressed', String(t === 'dark'));
      b.title = t === 'dark' ? 'Helle Darstellung einschalten' : 'Dunkle Darstellung einschalten';
    }
    if (document.documentElement.getAttribute('data-theme')) {
      [].forEach.call(document.querySelectorAll('meta[name="theme-color"]'), function (m) { m.content = THEME_BAR[t]; });
    }
  }
  function setTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    try { localStorage.setItem('lcTheme', t); } catch (e) {}
    showTheme();
    document.dispatchEvent(new CustomEvent('lc-theme', { detail: t }));
  }
  var themeBtn = document.getElementById('themeBtn');
  if (themeBtn) themeBtn.addEventListener('click', function () { setTheme(currentTheme() === 'dark' ? 'light' : 'dark'); });
  if (darkMq && darkMq.addEventListener) darkMq.addEventListener('change', showTheme);
  showTheme();

  /* Vollbild: nur das Modell, über den ganzen Bildschirm. Kopf und Fuss werden immer ausgeblendet (Klasse lc-full);
     wo der Browser es erlaubt, kommt echtes Vollbild dazu, am Handy ins Querformat gedreht. Wo nicht (iPhone,
     eingebettete Fassung), bleibt es beim Ausblenden, das Bild bekommt trotzdem die ganze Fläche des Fensters. */
  var root = document.documentElement, fsBtn = document.getElementById('fsBtn'), fsNative = false;
  function fsEl() { return document.fullscreenElement || document.webkitFullscreenElement || null; }
  function fsOn() { return root.classList.contains('lc-full'); }
  function isPhone() {
    return !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches) && Math.min(screen.width, screen.height) < 600;
  }
  function showFs() {
    if (!fsBtn) return;
    var on = fsOn();
    fsBtn.setAttribute('aria-pressed', String(on));
    fsBtn.setAttribute('aria-label', on ? 'Vollbild beenden' : 'Vollbild');
    fsBtn.title = on ? 'Vollbild beenden (F oder Esc)' : 'Vollbild (F)';
  }
  function portraitHint() {
    if (window.innerHeight > window.innerWidth && typeof window.toast === 'function') window.toast('Für mehr Sicht das Handy quer halten.');
  }
  /* am Handy ins Querformat drehen (geht nur im echten Vollbild); steht das Handy nach gut einer Sekunde noch hochkant, ein Hinweis */
  var hintDone = false;
  function phoneHint() { if (!hintDone && fsOn()) { hintDone = true; portraitHint(); } }
  function landscape() {
    var so = screen.orientation;
    if (isPhone() && fsEl() && so && so.lock) so.lock('landscape').catch(phoneHint);
  }
  function enterFs() {
    var hdr = document.querySelector('.site-header.open'), sb = document.getElementById('setBtn');
    if (hdr) { hdr.classList.remove('open'); if (sb) sb.setAttribute('aria-expanded', 'false'); }
    root.classList.add('lc-full');
    showFs();
    hintDone = false;
    if (isPhone()) setTimeout(phoneHint, 1500);
    var req = root.requestFullscreen || root.webkitRequestFullscreen;
    if (!req || !(document.fullscreenEnabled || document.webkitFullscreenEnabled) || fsEl()) return;
    try {
      fsNative = true;
      var p = req.call(root, { navigationUI: 'hide' });
      /* wurde inzwischen schon wieder beendet (schnelles Doppeltippen), das echte Vollbild gleich wieder verlassen */
      if (p && p.then) p.then(function () { if (fsOn()) landscape(); else leaveNative(); }, function () { fsNative = false; });
      else setTimeout(landscape, 300);
    } catch (e) { fsNative = false; }
  }
  function exitFs() {
    root.classList.remove('lc-full');
    showFs();
    var so = screen.orientation;
    try { if (so && so.unlock) so.unlock(); } catch (e) {}
    leaveNative();
    fsNative = false;
  }
  function leaveNative() {
    var ex = document.exitFullscreen || document.webkitExitFullscreen;
    if (fsEl() && ex) { try { var p = ex.call(document); if (p && p.catch) p.catch(function () {}); } catch (e) {} }
  }
  function toggleFs() { if (fsOn()) exitFs(); else enterFs(); }
  if (fsBtn) fsBtn.addEventListener('click', toggleFs);
  /* mit Esc oder der Zurück-Geste beendetes echtes Vollbild: auch Kopf und Fuss wieder zeigen */
  ['fullscreenchange', 'webkitfullscreenchange'].forEach(function (n) {
    document.addEventListener(n, function () { if (!fsEl() && fsNative) exitFs(); });
  });
  /* Taste F schaltet um; Esc beendet das Ersatz-Vollbild, solange weder Schild noch Film die Taste brauchen */
  window.addEventListener('keydown', function (e) {
    var t = e.target, tg = t && t.tagName;
    if (e.altKey || e.ctrlKey || e.metaKey || /^(INPUT|SELECT|TEXTAREA)$/.test(tg) || (t && t.isContentEditable)) return;
    if (e.code === 'KeyF' && !e.repeat) { toggleFs(); e.preventDefault(); return; }
    if (e.code === 'Escape' && fsOn() && !fsEl()) {
      var card = document.getElementById('card'), film = document.getElementById('filmUI');
      if ((card && !card.hidden) || (film && !film.hidden)) return;
      exitFs();
    }
  });
  showFs();

  /* erst nach dem load-Ereignis: Text und Bedienung stehen sofort, die schwere Arbeit folgt danach */
  if (document.readyState === 'complete') setTimeout(start, 0);
  else window.addEventListener('load', function () { setTimeout(start, 30); });
})();
