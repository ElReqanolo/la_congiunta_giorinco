#!/usr/bin/env python3
"""Baut aus der Website eine einzige HTML-Datei (alles eingebettet ausser three.js vom CDN).

Gedacht für die Offline-Nutzung (Doppelklick, ohne Webserver) und zum Weitergeben als eine Datei.
Aufruf im Hauptordner der Website:  python3 tools/build_standalone.py [Zieldatei]
Standard-Ziel: dist/La_Congiunta_Giornico_3D.html
"""
import base64
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MIME = {'.jpg': 'image/jpeg', '.png': 'image/png', '.woff': 'font/woff', '.svg': 'image/svg+xml'}


def read(rel, mode='r'):
    with open(os.path.join(ROOT, rel), mode, **({} if 'b' in mode else {'encoding': 'utf-8'})) as f:
        return f.read()


def data_uri(rel):
    return 'data:%s;base64,%s' % (MIME[os.path.splitext(rel)[1]], base64.b64encode(read(rel, 'rb')).decode())


def no_script_end(text, what):
    if re.search(r'</script', text, re.I):
        raise SystemExit('Abbruch: "</script" in %s würde die Einzeldatei zerbrechen' % what)
    return text


def main():
    out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'dist', 'La_Congiunta_Giornico_3D.html')
    html = read('index.html')
    loader = read('js/loader.js')

    # Stylesheets einbetten, Schriften als data-URI
    def inline_css(m):
        css = read(m.group(1))
        css = re.sub(r'url\("\.\./(assets/[^"]+)"\)', lambda u: 'url("%s")' % data_uri(u.group(1)), css)
        return '<style>\n%s</style>' % css
    html = re.sub(r'<link rel="stylesheet" href="([^"?]+)(?:\?[^"]*)?">', inline_css, html)
    html = re.sub(r'<link rel="preload"[^>]*>\n', '', html)
    html = html.replace('href="assets/favicon.svg"', 'href="%s"' % data_uri('assets/favicon.svg'))

    # Daten und Bilder vorab setzen, App-Dateien als Textblöcke, die der Lader in Reihenfolge ausführt
    img_map = dict(re.findall(r"(\w+): '(assets/img/[^']+)'", re.search(r'var IMG = \{(.*?)\};', loader, re.S).group(1)))
    app = re.findall(r"'(js/[^']+\.js)'", re.search(r'var APP=\[(.*?)\];', loader).group(1))
    assets = json.loads(read('assets/data/model-data.json'))
    assets['img'] = {k: data_uri(v) for k, v in img_map.items()}
    blocks = ['<script>window.LC_ASSETS=%s;</script>' % no_script_end(json.dumps(assets, separators=(',', ':'), ensure_ascii=False), 'Daten')]
    for rel in app:
        blocks.append('<script type="text/plain" data-lc-src="%s">\n%s</script>' % (rel, no_script_end(read(rel), rel)))
    blocks.append('<script>\n%s</script>' % no_script_end(loader, 'loader.js'))
    html = re.sub(r'<script src="js/loader\.js(?:\?[^"]*)?" defer></script>\n', '', html)
    html = html.replace('</body>', '\n'.join(blocks) + '\n</body>')

    os.makedirs(os.path.dirname(out), exist_ok=True)
    with open(out, 'w', encoding='utf-8') as f:
        f.write(html)
    print('%s: %.2f MB' % (out, os.path.getsize(out) / 1e6))


if __name__ == '__main__':
    main()
