# La Congiunta, Giornico – interaktives 3D-Modell

Ein begehbares 3D-Modell von **La Congiunta** in Giornico (Tessin), dem Haus für Reliefs und Halbfiguren von Hans Josephsohn, gebaut 1986–1992 nach Plänen von Peter Märkli. Die Website läuft im Browser, auf Rechnern ebenso wie auf Tablets und Handys; sie braucht keinen Build-Schritt.

**Online ansehen:** https://elreqanolo.github.io/la_congiunta_giorinco/

**Inhalt des Modells**

- Gebäude nach Grundriss und Schnitten bei Pireddu (2025), pixelgenau vermessen: 42,4 × 5,25 m, Raumlängen 7,33 / 17,45 / 17,55 m, Türen 0,85 × 2,15 m, Zellentrakt 12,8 × 3,35 m; Länge, Breite, Drehung (21°), Laternen und Höhensprünge mit dem Gebäudemodell swissBUILDINGS3D von swisstopo abgeglichen
- Dachlaternen nach den Fotos: ringsum Plexiglas in Stahlrahmen, oben Blech, über die ganze Raumlänge; das Licht fällt seitlich ein
- Keller (Lager) unter Raum 3 und dem Zellentrakt nach Kellergrundriss und Schnitten: Boden 2,44 m unter dem Erdgeschoss, Zugang über eine Außentreppe im Schacht an der Westwand mit breiter Öffnung ins Lager und schmaler Tür in den Zellenkeller; im Rundgang begehbar (Anker `#keller`), der Umriss erscheint mit „Maße“ gestrichelt
- Exponate nach Hans Josephsohn: Flachreliefs, Hochreliefs und Halbfiguren aus Messing mit grob bearbeiteter Oberfläche (Formen frei nachempfunden, keine Abbilder der einzelnen Werke)
- Gelände aus den Höhenmodellen und Luftbildern von swisstopo; Dorf entlang des Wegs mit echten Grundrissen, Höhen und Dachformen aus swissBUILDINGS3D 2.0 (Wandfarben nach Street View, Dachfarben aus dem Luftbild); übrige Häuser, Bahn, Straßen und Brücken nach OpenStreetMap
- Sonnenstand für Giornico nach Uhrzeit und Jahreszeit, Licht durch die Dachlaternen
- Wind: Böen ziehen talaufwärts durch Bäume, Gras und Reben; Wolken ziehen mit und werfen Schatten (Stärke und Wolken im Menü einstellbar)
- Fluss: Der Ticino fließt; Schaumstreifen und Wellen ziehen flussabwärts, Glanzlichter wandern mit der Strömung (Schalter „Fluss“ hält das Wasser an, unabhängig vom Wind)
- Rundgang mit dreizehn Infoschildern (drei am und im begehbaren Keller), Maßangaben und Quellenliste
- Film „Weg zum Museum“: Schlüssel in der Osteria holen und zu Fuß über die zwei alten Steinbrücken talaufwärts zum Bau (Weg nach den Angaben der Stiftung, Linienführung nach OpenStreetMap angenähert)

## Bedienung

| | Rechner | Tablet und Handy |
|---|---|---|
| Drehen | Maus ziehen, oder Bild mit Tab anwählen und Pfeiltasten | mit einem Finger ziehen |
| Zoomen | Mausrad, oder + / − | zwei Finger |
| Fliegen, Rundgang | W A S D, E / Q, Shift | Pfeiltasten unten rechts |
| Schild lesen | hingehen und E drücken oder anklicken | „Schild lesen“ oder das Schild antippen |
| Film | Leertaste = Pause, Pfeiltasten = 5 s springen, Esc = beenden | Knöpfe unter dem Bild |
| Hell / dunkel | runder Knopf oben rechts | runder Knopf oben rechts |

Uhrzeit, Jahreszeit, Wind, Wolken, Fluss, Lichtstrahlen und Grafikqualität stehen am Rechner in der zweiten Zeile der Kopfzeile, auf Tablet und Handy unter „Licht & Qualität“. Die Spur des Uhrzeit-Reglers zeigt Nacht, Dämmerung und Tag der gewählten Jahreszeit. Der runde Knopf oben rechts schaltet zwischen heller und dunkler Darstellung; ohne Wahl gilt die Einstellung des Systems, eine Wahl bleibt im Browser gespeichert. Unter dem Modell lassen sich „Bedienung und Legende“ und „Quellen“ getrennt aufklappen.

**Grafikqualität:** Voreingestellt ist „automatisch“. Die Seite erkennt Gerät (Rechner, Tablet, Handy), Grafikchip, Arbeitsspeicher und Datensparmodus und wählt danach „hoch“, „mittel“ oder „niedrig“. Die Stufe „ultra“ (noch weitere Sicht für Gras und ausführliche Bäume, dichterer Wald, größere Schatten- und Luftbildbereiche) wählt die Automatik nie; sie ist für schnelle Grafikkarten gedacht und lässt sich von Hand einstellen. Ruckelt die Darstellung beim Bewegen, senkt sie die Auflösung von selbst; ist es auch dann noch zu langsam, beginnt sie beim nächsten Besuch eine Stufe tiefer. Eine fest gewählte Stufe bleibt im Browser gespeichert (nur im lokalen Speicher des Browsers, keine Cookies).

**Ansichten per Link:** An die Adresse lässt sich ein Anker hängen, zum Beispiel

- `#raum3-t0930-winter` – Raum 3 an einem Wintermorgen
- `#zelle`, `#raum1`, `#raum2`, `#eingang`, `#decke`
- `#flachrelief`, `#hochrelief`, `#halbfigur` – direkt vor einem Exponat
- `#keller`, `#schacht` – im Lager unter Raum 3 bzw. unten im Kellerschacht
- `#film` – Film starten, `#film-s40` ab Sekunde 40
- `#tal`, `#aussen`, `#innen`, `#drauf`
- `#schild4` – direkt vor Infoschild 4 (`#schild11` bis `#schild13`: am und im Keller)
- `#ultra`, `#hoch`, `#mittel`, `#niedrig`, `#auto` – Grafikqualität
- `#diag` – technische Angaben (Grafikchip, Bildrate, Ladezeiten)

## Aufbau der Dateien

```
index.html            Seite: Kopf mit Beschreibung für Suchmaschinen, Kopfzeile, 3D-Bühne, Fußbereich
css/tokens.css        Design-Variablen: Farben (hell/dunkel), Schriften, Abstände, Radien, Schatten
css/base.css          Schriften, Grundtypografie, Knöpfe, Formularelemente, Fokus
css/layout.css        Kopfzeile, Werkzeugleiste, Bühne, Fußbereich, Umbrüche (mobil zuerst)
css/overlays.css      alles über dem 3D-Bild: Laden, Beschriftungen, Schildkarte, Steuerkreuz, Film
js/loader.js          lädt three.js, die Modelldaten und die App-Dateien und startet sie
js/core.js            Diagnose (#diag), Koordinaten, Qualitätsstufen, Höhenmodell
js/renderer.js        Renderer, Szene, Kamera, Shader-Bausteine
js/sky.js             Himmel, Wolken, Nachbearbeitung
js/terrain.js         Gelände, Fluss
js/building.js        Gebäude, Laternen, Zellen, Keller
js/exhibits.js        Exponate
js/vegetation.js      Bäume, Wiese, Reben
js/village.js         Dorf, Bahn, Brücken, Leitungen
js/signs.js           Infoschilder
js/light-beams.js     Lichtstrahlen
js/view.js            Kamera, Maßlinien, Bildschleife
js/controls.js        Bedienung, Rundgang, Links (#…), Einstellungen, Sonnenstand
js/film.js            Film „Weg zum Museum“
js/aerial-tiles.js    feine Luftbildkacheln von swisstopo
js/start.js           Aufbau in Stufen
assets/img/           Luftbilder, Texturen, Masken
assets/data/          Höhenmodell, OpenStreetMap, swissBUILDINGS3D (JSON)
assets/fonts/         TeX Gyre Heros und Pagella (GUST Font License)
tools/build_standalone.py   baut alles zu einer einzigen HTML-Datei zusammen
```

Die App-Dateien teilen sich einen gemeinsamen Bereich (wie früher innerhalb einer Funktion) und laufen in der Reihenfolge, die `js/loader.js` in `APP` festlegt. Eine neue Datei wird dort an der passenden Stelle eingetragen.

**Lokal ansehen:** Wegen der getrennten Dateien braucht die Seite einen kleinen Webserver, z. B. im Ordner `python3 -m http.server` und dann http://localhost:8000 öffnen. Für eine Datei zum Doppelklicken (offline, ohne Server): `python3 tools/build_standalone.py` erzeugt `dist/La_Congiunta_Giornico_3D.html` (der Ordner `dist/` gehört nicht ins Repository).

## Als Website veröffentlichen (GitHub Pages)

1. Auf GitHub ein neues, öffentliches Repository anlegen, zum Beispiel `la-congiunta-3d`.
2. „Add file“ → „Upload files“ und die Ordner `css`, `js`, `assets` und `tools` sowie `index.html`, `README.md` und `.nojekyll` hineinziehen (Ordner per Drag-and-drop, damit die Unterordner erhalten bleiben). Mit „Commit changes“ bestätigen.
3. Im Repository „Settings“ → „Pages“ öffnen. Unter „Build and deployment“ als Quelle „Deploy from a branch“ wählen, Branch `main` und Ordner `/ (root)`, dann „Save“.
4. Nach ein bis zwei Minuten ist die Seite unter `https://BENUTZERNAME.github.io/la-congiunta-3d/` erreichbar.

Mit git auf der Kommandozeile geht es ebenso:

```bash
git init
git add index.html README.md .nojekyll css js assets tools
git commit -m "La Congiunta 3D"
git branch -M main
git remote add origin https://github.com/BENUTZERNAME/la-congiunta-3d.git
git push -u origin main
```

Für eine Aktualisierung genügt es, die geänderten Dateien hochzuladen; GitHub Pages veröffentlicht sie nach kurzer Zeit. Ändern sich CSS oder JavaScript, in `index.html` die Zahl hinter `?v=` (an allen fünf Stellen) um eins erhöhen: GitHub Pages lässt Browser Dateien zehn Minuten zwischenspeichern, und mit neuer Zahl holen sie sofort die neuen.

## Technik

- Ohne Build-Schritt: HTML, CSS und JavaScript liegen getrennt; Luftbilder und Texturen als JPG/PNG (rund 1,2 MB), Höhenmodell und Kartendaten als JSON (0,3 MB, komprimiert übertragen rund 0,15 MB). Der Browser kann alles einzeln zwischenspeichern.
- Schriften selbst gehostet (TeX Gyre Heros und Pagella, rund 30 kB), damit beim Laden keine Anfrage an Google o. ä. geht.
- 3D mit [three.js](https://threejs.org) r128; die Bibliothek wird beim Start von `cdn.jsdelivr.net` geladen. Dafür ist eine Internetverbindung nötig, und jsDelivr sieht dabei die IP-Adresse der Besucher. Wer das vermeiden will, legt die neun Dateien, die in `js/loader.js` unter `LIBS` aufgeführt sind (`build/three.min.js` und acht Dateien aus `examples/js/`), in denselben Ordnerstrukturen ins Repository und ersetzt dort die Adresse `https://cdn.jsdelivr.net/npm/three@0.128.0/` durch `./three/`.
- Schärfere Luftbilder: Beim Start lädt die Seite für Dorf, Brücken und Weg zum Museum (ab mittlerer Qualität auch für die Umgebung) Luftbildkacheln SWISSIMAGE vom Kacheldienst von swisstopo (`wmts.geo.admin.ch`) nach, mit bis zu 0,2 m pro Pixel statt bisher 0,8 bis 3 m (Umgebung bei „mittel“ und „hoch“ ±600 m, bei „ultra“ ±800 m um das Gebäude). Dabei sieht swisstopo die IP-Adresse der Besucher. Ohne Verbindung, im Datensparmodus oder auf sehr alten Geräten bleibt es bei den mitgelieferten Luftbildern.
- Dorf: 352 Gebäude im Umkreis von 200 m um den Weg stammen aus swissBUILDINGS3D 2.0 (in `assets/data/model-data.json`, etwa 90 kB). Im Film werden Dächer und Wände, die in den engen Gassen die Sicht auf die Figur verdecken, auf der Sichtlinie ausgeschnitten.
- Gras, Bäume und Schatten werden um den Blickpunkt in Detailstufen geladen; die Reichweite hängt von der Grafikqualität ab. Schatten reichen beim Gehen und Fliegen gleich weit: vom Bildmittelpunkt aus rund 48 m (niedrig), 72 m (mittel), 96 m (hoch) und 160 m (ultra) in jede Richtung, der Bereich liegt vor der Kamera und wächst mit der Flughöhe bis aufs 2,6-Fache; im Gebäude ist er kleiner und die Schatten dafür schärfer.
- Rundgang: Gehen mit 3,4 m/s, nach gut einer Sekunde ohne Pause bis 5 m/s, mit Shift rennen (7 m/s).
- Fluss: ein Band entlang der Flussachse aus OpenStreetMap (alle 3 m abgetastet, 28 m breit), auf dem der Shader Wasser und Schaum zeichnet. Wo Wasser ist, sagt rund um den Bau die Wassermaske aus dem Luftbild, weiter weg die Breite um die Achse. Schaum und Wellen ziehen mit rund 2 bis 3 m/s flussabwärts.
- Wind und Wolken: Die Pflanzen werden im Vertex-Shader gebogen (Böenfeld in Weltkoordinaten, Biegung nach Höhe, Flattern der Blätter). Die Wolken sind ein kachelbares Rauschmuster (10,24 km), das einmal beim Start berechnet wird; Himmel und Wolkenschatten lesen dieselbe Textur. Ohne Bedienung läuft die Animation zwei Minuten (Handy 40 s) weiter, dann ruht die Grafikkarte. Bei „niedrig“ und bei der Systemeinstellung „Bewegung reduzieren“ ist der Wind anfangs aus.
- Keine Cookies, kein Tracking, keine Formulare.
- Getestet in Chromium am Rechner sowie in Tablet- und Handy-Ansicht. Aktuelle Versionen von Firefox und Safari (auch auf iOS) unterstützen die verwendete Technik (WebGL) ebenfalls; vor der Veröffentlichung lohnt ein kurzer Blick auf dem eigenen Handy.

## Quellen und Lizenzen

Die vollständige Quellenliste steht in der Seite unter „Quellen“. Wichtig für die Weitergabe:

- Höhenmodelle swissALTI3D und DHM25, Gebäudemodell swissBUILDINGS3D 2.0, Luftbild SWISSIMAGE: © swisstopo (Bundesamt für Landestopografie), freie Geodaten mit Quellenangabe.
- Kartendaten © OpenStreetMap-Mitwirkende, Lizenz ODbL 1.0.
- three.js: MIT-Lizenz.
- Schriften TeX Gyre Heros und Pagella: GUST Font License (siehe `assets/fonts/`).
- Pläne und Angaben nach A. Pireddu, „Peter Märkli – La Congiunta“, *Firenze Architettura* 29 (2025), doi:10.36253/FiA-16824 (CC BY-SA 4.0); im Modell nur zitiert und nachgezeichnet.
- **Bitte vor der Veröffentlichung prüfen:** Die Fototexturen für Beton, Boden und Innenwände stammen aus der Vorlage-Datei „La Congiunta – schematisches 3D-Modell“; ihre Herkunft ist dort nicht angegeben. Vor einer öffentlichen Website sollten die Rechte daran geklärt oder die Texturen durch eigene Fotos bzw. frei lizenzierte (z. B. CC0) Texturen ersetzt werden.
- Die Werke von Hans Josephsohn sind urheberrechtlich geschützt. Das Modell zeigt keine Abbilder einzelner Werke, sondern frei nachempfundene, prozedural erzeugte Formen in Anzahl und Anordnung nach den Quellen.

Für den eigenen Code des Modells ist keine Lizenz festgelegt; wer ihn anderen zur Nutzung freigeben möchte, ergänzt eine Lizenzdatei (zum Beispiel MIT).
