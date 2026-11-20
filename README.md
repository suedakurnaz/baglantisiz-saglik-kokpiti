# Bağlantısız Sağlık Kokpiti

**NASA Space Apps Challenge 2026, Konya — Takım: Steppe to Stars**

Astronotların Dünya ile bağlantı gecikmesi/kesintisi yaşadığı durumlarda belirtilerini ve kan değerlerini
çevrimdışı izleyip aciliyeti değerlendiren, tek dosyalık bir tarayıcı uygulaması. Yalnızca NASA'nın açık
verisi (Inspiration4 — OSD-569 / OSD-575) kullanılmıştır.

## Hızlı başlangıç

`uygulama/Baglantisiz_Saglik_Kokpiti_v5.html` dosyasını tarayıcıda açın. İnternet gerekmez; veri, gösterge
tablosu ve fontlar dosyanın içindedir.

![Genel bakış](ekran_goruntuleri/1_genel_bakis_on.png)

## Klasörler

| Klasör | İçerik |
|---|---|
| `uygulama/` | Çalışan uygulama (son sürüm v5) |
| `ekran_goruntuleri/` | Son sürümün ekran görüntüleri |
| `sunum/` | Jüri sunumu (.pptx) |
| `dokumanlar/` | Proje dokümanı, "yalnızca NASA verisi" kuralı, karar notları |
| `arastirma_raporlari/` | 8 araştırma raporu (R1–R8) |
| `kaynak/` | Uygulamanın kaynak dosyaları ve derleme betikleri |
| `veri/` | Birleşik NASA kan verisi, ham NASA CSV'leri ve metadata |

Ayrıntılı dosya açıklamaları için [OKUBENI.txt](OKUBENI.txt).

## Yeniden derleme

```bash
python3 kaynak/donustur.py   # NASA CSV'leri → veri/inspiration4_kan.json
python3 kaynak/build.py      # parçalar → uygulama/...v4.html
```

> Not: `kaynak/` kodu 15.11 sürümüdür (Astronot sayfası yok). Güncel uygulama `uygulama/` altındaki v5'tir.

## Veri kaynakları

- NASA OSDR **OSD-569** — Inspiration4 tam kan sayımı (CBC)
- NASA OSDR **OSD-575** — Inspiration4 kapsamlı metabolik panel (CMP)

Fontlar (Inter, Public Sans, DM Mono) SIL Open Font License kapsamındadır.
