# La Congiunta, Giornico – interaktives 3D-Modell

Ein begehbares 3D-Modell von **La Congiunta** in Giornico (Tessin), dem Haus für Reliefs und Halbfiguren von Hans Josephsohn, gebaut 1986–1992 nach Plänen von Peter Märkli. Die Website läuft im Browser, auf Rechnern ebenso wie auf Tablets und Handys; sie braucht keinen Build-Schritt.

**Online ansehen:** https://elreqanolo.github.io/la_congiunta_giorinco/

**Inhalt des Modells**

- Gebäude nach Grundriss und Schnitten bei Pireddu (2025), pixelgenau vermessen: 42,40 × 5,25 m außen (innen 4,60 m nach Peter Märkli, Wände daraus rund 0,33 m), Raumlängen 7,33 / 17,45 / 17,55 m, Türen 0,85 × 2,15 m, Zellentrakt 12,82 × 3,34 m; Länge, Breite, Drehung (21°), Lichtgaden und Höhensprünge mit dem Gebäudemodell swissBUILDINGS3D von swisstopo abgeglichen
- Dach und Lichtgaden nach Peter Märkli (Interview, VernissageTV 2011): Flachdach aus Holz-Dreischichtplatten auf Stahlträgern mit beschichteter Bitumenbahn, über den drei Haupträumen aufgeschnitten für den Lichtgaden; seitlich lichtstreuende Platten (Plexiglas) im Stahlrahmen, oben geschlossen. Innen fällt kein direktes Sonnenlicht und kein Schatten; die Räume sind diffus beleuchtet, die Helligkeit folgt Sonnenstand und Wolken. Die Zellen haben je ein kleines Oblicht mit senkrechtem Lichteinfall
- Keller (Lager) unter Raum 3 und dem Zellentrakt nach Kellergrundriss und Schnitten: Boden 2,44 m unter dem Erdgeschoss, Zugang über eine Außentreppe im Schacht an der Westwand mit breiter Öffnung ins Lager und schmaler Tür in den Zellenkeller; im Rundgang begehbar (Anker `#keller`), der Umriss erscheint mit „Maße“ gestrichelt
- Exponate nach Hans Josephsohn: Flachreliefs, Hochreliefs und Halbfiguren aus Messing mit grob bearbeiteter Oberfläche (Formen frei nachempfunden, keine Abbilder der einzelnen Werke); die Halbfiguren stehen auf Betonsockeln, die von der Wand abgerückt sind
- Gelände aus den Höhenmodellen und Luftbildern von swisstopo; Dorf entlang des Wegs mit echten Grundrissen, Höhen und Dachformen aus swissBUILDINGS3D 2.0 (Wandfarben nach Street View, Dachfarben aus dem Luftbild); übrige Häuser, Bahn, Straßen und Brücken nach OpenStreetMap
- Sonnenstand für Giornico nach Uhrzeit und Jahreszeit; innen diffuses Licht durch den Lichtgaden
- Wind: Böen ziehen talaufwärts durch Bäume, Gras und Reben; Wolken ziehen mit und werfen Schatten aufs Tal, drinnen wird es dann dunkler (Stärke und Wolken im Menü einstellbar)
- Fluss: Der Ticino fließt; Schaumstreifen und Wellen ziehen flussabwärts, Glanzlichter wandern mit der Strömung (Schalter „Fluss“ hält das Wasser an, unabhängig vom Wind)
- Rundgang mit dreizehn Infoschildern (drei am und im begehbaren Keller), Maßangaben und Quellenliste
- Grundrisse Erdgeschoss und Untergeschoss im Maßstab 1:200 (Blatt A3, Darstellung nach DIN 1356-1), von Claude (KI von Anthropic) aus den Maßen des Modells gezeichnet: auf der Seite unter „Grundrisse“ aufklappbar, auch groß anzeigbar und auf A3 quer im Maßstab 1:200 druckbar, dazu als SVG in `assets/plans/`. Es sind Rekonstruktionen (etwa ±0,10 m), keine Pläne des Architekten.
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

Uhrzeit, Jahreszeit, Wind, Wolken, Fluss und Grafikqualität stehen am Rechner in der zweiten Zeile der Kopfzeile, auf Tablet und Handy unter „Licht & Qualität“. Die Spur des Uhrzeit-Reglers zeigt Nacht, Dämmerung und Tag der gewählten Jahreszeit. Der runde Knopf oben rechts schaltet zwischen heller und dunkler Darstellung; ohne Wahl gilt die Einstellung des Systems, eine Wahl bleibt im Browser gespeichert. Unter dem Modell lassen sich „Bedienung und Legende“ und „Quellen“ getrennt aufklappen. Der runde Knopf oben rechts im Bild (oder die Taste F) schaltet ins Vollbild: nur das Modell über den ganzen Bildschirm, am Handy, wo der Browser es zulässt, im Querformat; erlaubt der Browser kein Vollbild (iPhone, eingebettete Fassung), blendet die Seite Kopf und Fuss aus. Derselbe Knopf oder Esc beendet es.

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
js/building.js        Gebäude, Lichtgaden, Zellen, Keller
js/exhibits.js        Exponate
js/vegetation.js      Bäume, Wiese, Reben
js/village.js         Dorf, Bahn, Brücken, Leitungen
js/signs.js           Infoschilder
js/view.js            Kamera, Maßlinien, Bildschleife
js/controls.js        Bedienung, Rundgang, Links (#…), Einstellungen, Sonnenstand
js/film.js            Film „Weg zum Museum“
js/aerial-tiles.js    feine Luftbildkacheln von swisstopo
js/start.js           Aufbau in Stufen
assets/img/           Luftbilder, Texturen, Masken
assets/data/          Höhenmodell, OpenStreetMap, swissBUILDINGS3D (JSON)
assets/fonts/         TeX Gyre Heros und Pagella (GUST Font License)
assets/plans/         Grundrisse als SVG (Blatt A3, M 1:200), gezeichnet von Claude (KI)
tools/build_standalone.py   baut alles zu einer einzigen HTML-Datei zusammen
tools/grundrisse.js   zeichnet die Grundrisse (SVG) aus den Modellmaßen: node tools/grundrisse.js assets/plans/la-congiunta-grundrisse.svg
tools/texturen.js     erzeugt die Beton- und Bodentexturen aus CC0-Vorlagen (im Browser)
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
- Schärfere Luftbilder: Beim Start lädt die Seite für Dorf, Brücken und Weg zum Museum (ab mittlerer Qualität auch für die Umgebung) Luftbildkacheln SWISSIMAGE vom Kacheldienst von swisstopo (`wmts.geo.admin.ch`) nach, mit bis zu 0,20 m pro Pixel statt bisher 0,80 bis 3,00 m (Umgebung bei „mittel“ und „hoch“ ±600,00 m, bei „ultra“ ±800,00 m um das Gebäude). Dabei sieht swisstopo die IP-Adresse der Besucher. Ohne Verbindung, im Datensparmodus oder auf sehr alten Geräten bleibt es bei den mitgelieferten Luftbildern.
- Dorf: 352 Gebäude im Umkreis von 200,00 m um den Weg stammen aus swissBUILDINGS3D 2.0 (in `assets/data/model-data.json`, etwa 90 kB). Im Film werden Dächer und Wände, die in den engen Gassen die Sicht auf die Figur verdecken, auf der Sichtlinie ausgeschnitten.
- Gras, Bäume und Schatten werden um den Blickpunkt in Detailstufen geladen; die Reichweite hängt von der Grafikqualität ab. Schatten reichen beim Gehen und Fliegen gleich weit: vom Bildmittelpunkt aus rund 48,00 m (niedrig), 72,00 m (mittel), 96,00 m (hoch) und 160,00 m (ultra) in jede Richtung, der Bereich liegt vor der Kamera und wächst mit der Flughöhe bis aufs 2,6-Fache; im Gebäude ist er kleiner und die Schatten dafür schärfer.
- Rundgang: Gehen mit 4,5 m/s, nach knapp einer Sekunde ohne Pause bis 6 m/s, rennen mit Shift oder am Touchscreen mit dem Doppelpfeil-Knopf am Steuerkreuz (9 m/s); schnelle Schritte werden in Teilschritte von höchstens 0,20 m zerlegt, damit man nicht durch Wände rutscht. Beim Fliegen macht derselbe Knopf schneller (wie Shift).
- Fluss: ein Band entlang der Flussachse aus OpenStreetMap (alle 3,00 m abgetastet, 28,00 m breit), auf dem der Shader Wasser und Schaum zeichnet. Wo Wasser ist, sagt rund um den Bau die Wassermaske aus dem Luftbild, weiter weg die Breite um die Achse. Schaum und Wellen ziehen mit rund 2 bis 3 m/s flussabwärts.
- Wind und Wolken: Die Pflanzen werden im Vertex-Shader gebogen (Böenfeld in Weltkoordinaten, Biegung nach Höhe, Flattern der Blätter). Die Wolken sind ein kachelbares Rauschmuster (10,24 km), das einmal beim Start berechnet wird; Himmel und Wolkenschatten lesen dieselbe Textur. Ohne Bedienung läuft die Animation zwei Minuten (Handy 40 s) weiter, dann ruht die Grafikkarte. Bei „niedrig“ und bei der Systemeinstellung „Bewegung reduzieren“ ist der Wind anfangs aus.
- Keine Cookies, kein Tracking, keine Formulare.
- Getestet in Chromium am Rechner sowie in Tablet- und Handy-Ansicht. Aktuelle Versionen von Firefox und Safari (auch auf iOS) unterstützen die verwendete Technik (WebGL) ebenfalls; vor der Veröffentlichung lohnt ein kurzer Blick auf dem eigenen Handy.

## Wie die Maße entstanden

Direkt veröffentlicht sind nur die lichten Raumhöhen (Pireddu), die Innenbreite (Märkli im Video) und die Weglänge. Alles andere ist gemessen, umgerechnet oder geschätzt; die vollständige Tabelle steht in der Seite unter „Wie die Maße entstanden“. Das Wichtigste:

- **Länge außen** (Gebäude): ≈ 42,40 m – Am Luftbild SWISSIMAGE gemessen (±0,50 m) und mit dem Gebäudemodell swissBUILDINGS3D abgeglichen, das 42,30 m ergibt [7]. Diese Länge ist der Maßstab für alle Planmaße.
- **Planmaßstab** (Gebäude): 1 pt ≈ 0,11 m – Grundriss und Schnitte bei Pireddu [1] S. 126–127 haben keinen brauchbaren Maßstab. Im Plan ist der Bau 393,7 pt lang; 42,40 m geteilt durch 393,7 pt ergibt den Maßstab. Planmaße sind damit auf rund ±0,10 m genau.
- **Breite außen** (Gebäude): 5,25 m – Im Grundriss 48,8 pt: 48,8 / 393,7 × 42,40 m = 5,26 m. swissBUILDINGS3D ergibt 5,27 m [7].
- **Breite innen** (Gebäude): 4,60 m – Direkt angegeben von Peter Märkli im Video [14].
- **Wandstärke** (Gebäude): ≈ 0,33 m – Berechnet: (5,25 m − 4,60 m) / 2 ≈ 0,33 m. Im Plan sind das rund 3 pt, also nicht genauer messbar.
- **Raumlängen (bis Wandmitte)** (Gebäude): 7,33 / 17,45 / 17,55 m – Im Grundriss als Anteile der Gesamtlänge gemessen (0,1731 / 0,4122 / 0,4147) und mit 42,40 m multipliziert.
- **Lichte Raumhöhen** (Gebäude): 5,30 / 3,50 / 6,60 m – Direkt angegeben bei Pireddu [1], Fußnote 10; die Höhensprünge außen stimmen mit swissBUILDINGS3D überein [7].
- **Drehung der Längsachse** (Gebäude): ≈ 21° – Richtung der Längsachse im Luftbild und in swissBUILDINGS3D gegen Nord gemessen [7].
- **Türen** (Gebäude): 0,85 × 2,15 m, 0,47 m westlich der Mitte – Im Grundriss und im Querschnitt gemessen, Höhe zusätzlich am Foto S. 129 im Verhältnis zur Raumhöhe [1]. Zellentüren 0,70 m breit (Grundriss).
- **Dachstärke** (Dach und Lichtgaden): ≈ 0,20 m – Doppellinie im Schnitt [1], im Planmaßstab gemessen.
- **Lichtgaden** (Dach und Lichtgaden): 1,70 m breit, 1,50 m hoch, 0,42 m westlich der Mitte – In den Querschnitten [1] gemessen; Lage und Höhe mit swissBUILDINGS3D abgeglichen [7]. Dass er über die ganze Länge der Haupträume läuft, sagt Märkli [14].
- **Pfosten- und Trägerabstand** (Dach und Lichtgaden): ≈ 1,20 m (geschätzt) – An Fotos der Vorlage [11] und bei Pireddu [1] abgezählt. Im Video [14] wirkt er eher etwas größer (rund 1,30–1,50 m), ist dort aber nicht sicher messbar.
- **Zellentrakt** (Zellen): 12,82 × 3,34 m, Dach 4,50 m, innen 4,30 m hoch – Grundriss und Querschnitt [1] im Planmaßstab, mit swissBUILDINGS3D abgeglichen [7].
- **Zelle innen** (Zellen): ≈ 3,02 × 2,80 m – Berechnet: Trakt abzüglich der Wände, in vier gleiche Zellen geteilt.
- **Oblicht** (Zellen): ≈ 1,00 × 0,60 m (geschätzt) – Märkli nennt es klein, mit senkrechtem Lichteinfall [14]. Die Größe ist am Videobild im Verhältnis zur Zellendecke geschätzt, die Lage aus dem Schnitt [1].
- **Kellerboden** (Keller): 2,44 m unter dem Erdgeschoss, lichte Höhe 2,21 m – Im Kellergrundriss und im Längsschnitt [1] im Planmaßstab gemessen.
- **Abgang** (Keller): Schacht ≈ 0,87 m breit, 13 Stufen – Im Kellergrundriss [1] gemessen, Stufen gezählt. Podest 12,82–17,64 m und Treppe bis 21,04 m, jeweils von der Südfront aus gemessen.
- **Öffnungen unten** (Keller): 1,62 m ins Lager, Tür 0,85 m – Kellergrundriss [1]; welche Öffnung Durchgang und welche Tür ist, ist aus dem Plan gelesen.
- **Lager und Zellenkeller** (Keller): ≈ 17,09 × 4,60 m (79 m²) und 12,17 × 3,02 m (37 m²); zusammen ≈ 115 m², 255 m³ – Berechnet aus Innenbreite, Raumlänge, Wandstärke und 2,21 m Höhe.
- **Sockel der Halbfiguren** (Exponate): ≈ 0,66 × 0,54 × 0,70 m (geschätzt) – Am Videobild [14] gemessen: Der Sockel ist etwa so hoch wie breit, die Figur knapp doppelt so hoch wie der Sockel. Dass er von der Wand abgerückt steht, sagt Märkli [14].
- **Reliefs und Halbfiguren** (Exponate): angenähert – Veröffentlichte Maße gibt es nicht; Größen nach Fotos [1] und dem Video [14] geschätzt. Die Anzahl stammt von Pireddu [1], die vier späteren Reliefs in Raum 3 aus dem Video [14].
- **Höhe über Meer** (Umgebung): ≈ 398,10 m ü. M. – Im Höhenmodell swissALTI3D am Gebäude abgelesen [7].
- **Bahn, Ticino, Feldweg** (Umgebung): Bahn 40,00–45,00 m westlich, 16,00 m höher; Ticino ≈ 40,00 m östlich, 9,00 m tiefer; Feldweg ≈ 18,00 m – Eigene Messung im Höhenmodell und Luftbild [7] und in OpenStreetMap [8], jeweils ab der Gebäudeachse.
- **Osteria, San Nicolao** (Umgebung): ≈ 585,00 m und 640,00 m (Luftlinie) – In OpenStreetMap [8] gemessen.
- **Fußweg zum Museum** (Umgebung): ≈ 750,00 m, etwa 10 Minuten – Länge laut Pireddu [1]; die Gehzeit ist geschätzt (rund 4,5 km/h).

## Quellen und Lizenzen

Die vollständige Quellenliste steht in der Seite unter „Quellen“. Wichtig für die Weitergabe:

- Höhenmodelle swissALTI3D und DHM25, Gebäudemodell swissBUILDINGS3D 2.0, Luftbild SWISSIMAGE: © swisstopo (Bundesamt für Landestopografie), freie Geodaten mit Quellenangabe.
- Kartendaten © OpenStreetMap-Mitwirkende, Lizenz ODbL 1.0.
- three.js: MIT-Lizenz.
- Schriften TeX Gyre Heros und Pagella: GUST Font License (siehe `assets/fonts/`).
- Pläne und Angaben nach A. Pireddu, „Peter Märkli – La Congiunta“, *Firenze Architettura* 29 (2025), doi:10.36253/FiA-16824 (CC BY-SA 4.0); im Modell nur zitiert und nachgezeichnet.
- Texturen für Betonwände, Innenwände und Boden: aus frei lizenzierten Vorlagen von Poly Haven (CC0, gemeinfrei, keine Namensnennung nötig; „Concrete Wall 006“ von Dario Barresi und Charlotte Baglioni, „Wood Textured Concrete“ von Dimitrios Savva, „Concrete Floor Worn 001“ von Dimitrios Savva und Rico Cilliers), die Brettfugen dazugezeichnet, erzeugt mit `tools/texturen.js`. Die früheren Fototexturen aus der Vorlage-Datei, deren Herkunft unbekannt war, sind nicht mehr enthalten.
- Die Werke von Hans Josephsohn sind urheberrechtlich geschützt. Das Modell zeigt keine Abbilder einzelner Werke, sondern frei nachempfundene, prozedural erzeugte Formen in Anzahl und Anordnung nach den Quellen.

Für den eigenen Code des Modells ist keine Lizenz festgelegt; wer ihn anderen zur Nutzung freigeben möchte, ergänzt eine Lizenzdatei (zum Beispiel MIT).
