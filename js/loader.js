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
  var APP=['js/core.js','js/renderer.js','js/sky.js','js/terrain.js','js/building.js','js/exhibits.js','js/vegetation.js','js/village.js','js/signs.js','js/light-beams.js','js/view.js','js/controls.js','js/film.js','js/aerial-tiles.js','js/start.js'];

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
    return fetch(DATA).then(function (r) {
      if (!r.ok) throw new Error(DATA + ' (' + r.status + ')');
      return r.json();
    }).then(function (data) {
      data.img = IMG;
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
    var app = inline ? Promise.resolve(inline) : Promise.all(APP.map(fetchText));
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

  /* erst nach dem load-Ereignis: Text und Bedienung stehen sofort, die schwere Arbeit folgt danach */
  if (document.readyState === 'complete') setTimeout(start, 0);
  else window.addEventListener('load', function () { setTimeout(start, 30); });
})();
