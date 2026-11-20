"""Bağlantısız Sağlık Kokpiti — tek dosyalık çevrimdışı HTML'i parçalardan derler.

Kullanım (proje klasöründen):
    python3 kaynak/build.py [cikti.html]
Varsayılan çıktı: uygulama/Baglantisiz_Saglik_Kokpiti_v4.html

Girdiler:
    kaynak/sablon.html   HTML iskeleti ({{CSS}} ve {{JS}} yer tutucuları)
    kaynak/style.css     stiller (fontlar kaynak/fonts/ altından gömülür)
    kaynak/app.js        uygulama kodu ({{FIGUR}}, {{NASA}}, {{GT}} yer tutucuları)
    kaynak/figur.webp    vücut figürü
    veri/inspiration4_kan.json   NASA OSD-575 + OSD-569 birleşik kan verisi
    veri/gosterge_tablosu.json   takımın yorum tablosu
"""
import base64, json, re, sys
from pathlib import Path

KOK = Path(__file__).resolve().parent.parent
K, V = KOK / 'kaynak', KOK / 'veri'
CIKAR = {'crp'}  # takım kararı 15.11: CRP'nin referans aralığı yok, ölçüm grubu etkisi var

def js_json(obj):
    return json.dumps(obj, ensure_ascii=False, separators=(',', ':'))

def b64(p):
    return base64.b64encode(p.read_bytes()).decode()

css = re.sub(r'url\(fonts/([^)]+)\)',
             lambda m: f'url(data:font/woff2;base64,{b64(K / "fonts" / m.group(1))})',
             (K / 'style.css').read_text(encoding='utf-8'))

nasa = json.loads((V / 'inspiration4_kan.json').read_text(encoding='utf-8'))
for a in nasa.values():
    for k in CIKAR:
        a['t'].pop(k, None)
gt = json.loads((V / 'gosterge_tablosu.json').read_text(encoding='utf-8'))
for k in CIKAR:
    gt.pop(k, None)

js = ((K / 'app.js').read_text(encoding='utf-8')
      .replace('{{FIGUR}}', b64(K / 'figur.webp'), 1)
      .replace('{{NASA}}', js_json(nasa), 1)
      .replace('{{GT}}', js_json(gt), 1))

html = (K / 'sablon.html').read_text(encoding='utf-8').replace('{{CSS}}', css, 1).replace('{{JS}}', js, 1)
cikti = Path(sys.argv[1]) if len(sys.argv) > 1 else KOK / 'uygulama' / 'Baglantisiz_Saglik_Kokpiti_v4.html'
cikti.write_text(html, encoding='utf-8')
print(f'{cikti} yazıldı ({len(html.encode()) // 1024} KB)')
