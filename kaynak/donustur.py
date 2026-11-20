"""NASA OSDR CSV'lerini uygulamanın kullandığı inspiration4_kan.json dosyasına çevirir.

Kullanım (proje klasöründen):
    python3 kaynak/donustur.py

Kaynak (NASA Open Science Data Repository, Inspiration4):
    veri/nasa_ham/LSDS-8_Comprehensive_Metabolic_Panel_CMP_TRANSFORMED.csv   (OSD-575, DOI 10.26030/mc5d-p710)
    veri/nasa_ham/LSDS-7_Complete_Blood_Count_CBC_TRANSFORMED.csv            (OSD-569)

Kurallar:
  - Her değer kendi satırındaki laboratuvar referans aralığıyla birlikte saklanır: [değer, alt, üst].
    Değer veya sınır yoksa (NA, N/A, boş) null yazılır.
  - "ort": uçuş öncesi (L-92, L-44, L-3) değerlerin ortalaması; uygulamadaki %20 sapma (sarı) kuralı bunu kullanır.
  - C003'ün L-92 kan sayımı satırı dışlanır: sütunlar kaymış görünüyor
    (ör. nötrofil 10,1 hücre/µL, MPV 330 fL, trombosit 12,9 bin/µL).
  - Hemoglobin sütununun adı NASA dosyasında "percent" geçse de değerler g/dL'dir.
  - Not: 15.11 kararıyla çıkarılan CRP bu dosyada yer almaz (Eve kalp-damar paneli, referans aralığı yok).
"""
import csv, json
from pathlib import Path

KOK = Path(__file__).resolve().parent.parent
HAM = KOK / 'veri' / 'nasa_ham'
CIKTI = KOK / 'veri' / 'inspiration4_kan.json'

TP = ['L-92', 'L-44', 'L-3', 'R+1', 'R+45', 'R+82', 'R+194']
ONCESI = TP[:3]
CINS = {'C001': 'E', 'C002': 'K', 'C003': 'K', 'C004': 'E'}
DISLA = {('C003', 'L-92', 'cbc')}

# gösterge: (Türkçe ad, birim)
CMP = {
    'glucose': ('Glukoz', 'mg/dL'), 'calcium': ('Kalsiyum', 'mg/dL'), 'sodium': ('Sodyum', 'mmol/L'),
    'potassium': ('Potasyum', 'mmol/L'), 'chloride': ('Klorür', 'mmol/L'),
    'carbon_dioxide': ('Bikarbonat (CO2)', 'mmol/L'), 'urea_nitrogen_bun': ('Üre azotu (BUN)', 'mg/dL'),
    'creatinine': ('Kreatinin', 'mg/dL'), 'egfr_non_african_american': ('eGFR', 'mL/dk/1.73m²'),
    'albumin': ('Albümin', 'g/dL'), 'total_protein': ('Total protein', 'g/dL'), 'globulin': ('Globulin', 'g/dL'),
    'alt': ('ALT', 'U/L'), 'ast': ('AST', 'U/L'), 'alkaline_phosphatase': ('ALP', 'U/L'),
    'total_bilirubin': ('Total bilirubin', 'mg/dL'),
}
CBC = {
    'hemoglobin': ('Hemoglobin', 'g/dL'), 'hematocrit': ('Hematokrit', '%'),
    'red_blood_cell_count': ('Alyuvar sayısı', 'milyon/µL'), 'white_blood_cell_count': ('Akyuvar sayısı', 'bin/µL'),
    'platelet_count': ('Trombosit', 'bin/µL'),
}

def sayi(x):
    try:
        return float(x)
    except (TypeError, ValueError):
        return None

def sutun(basliklar, k, tur):
    adaylar = {'deger': [f'{k}_value_'], 'alt': [f'{k}_range_min_'], 'ust': [f'{k}_range_max_', f'{k}_max_']}[tur]
    for b in basliklar:
        if any(b.startswith(a) for a in adaylar):
            return b
    raise KeyError(f'{k} {tur}')

def oku(dosya, panel, gostergeler, veri):
    with open(dosya, encoding='utf-8-sig', newline='') as f:
        r = csv.DictReader(f)
        sut = {k: [sutun(r.fieldnames, k, t) for t in ('deger', 'alt', 'ust')] for k in gostergeler}
        for satir in r:
            parca = satir['Sample Name'].split('_')
            a, tp = parca[0], parca[2]
            if (a, tp, panel) in DISLA:
                continue
            for k, cs in sut.items():
                veri[a][k][tp] = [sayi(satir[c]) for c in cs]

def main():
    gostergeler = {**CMP, **CBC}
    veri = {a: {k: {} for k in gostergeler} for a in CINS}
    oku(HAM / 'LSDS-8_Comprehensive_Metabolic_Panel_CMP_TRANSFORMED.csv', 'cmp', CMP, veri)
    oku(HAM / 'LSDS-7_Complete_Blood_Count_CBC_TRANSFORMED.csv', 'cbc', CBC, veri)
    cikti = {}
    for a in CINS:
        t = {}
        for k, (ad, br) in gostergeler.items():
            s = {tp: veri[a][k].get(tp) for tp in TP}
            once = [s[tp][0] for tp in ONCESI if s[tp] and s[tp][0] is not None]
            t[k] = {'ad': ad, 'br': br, 'ort': round(sum(once) / len(once), 3) if once else None, 's': s}
        cikti[a] = {'cins': CINS[a], 't': t}
    CIKTI.write_text(json.dumps(cikti, ensure_ascii=False, indent=1), encoding='utf-8')
    print(f'{CIKTI} yazıldı: {len(cikti)} astronot, {len(gostergeler)} gösterge, {len(TP)} zaman noktası')

if __name__ == '__main__':
    main()
