# Vücut figürü ve bölgeler — 18–20 Kasım 2026

**Sorun:** Eski kas anatomisi figürü bir Pngtree stok görseliydi (lisanssız, filigranlı). Arşivden çıkarıldı.

**Güncel durum — `uygulama/Baglantisiz_Saglik_Kokpiti_v5.html`**

1. **Figür:** Sueda'nın kendi ürettiği 3D kas modelinin ön ve arka görüntüleri kullanılıyor (`kaynak/figur_ve_bolgeler/3d_model_on.png`, `3d_model_arka.png`).
   - Koyu arka plan ayıklandı ve görüntüler eski figürün ölçülerine yerleştirildi (1920×1920 tuval; ön: orta x 581, arka: orta x 1333). Parlaklık eşlendi.
   - Sonuç dosyası: `kaynak/figur.webp`. Üretici betik: `figur_hazirla.py`.
   - CSS filtresi değişmedi.
   - Veri kaynakları balonuna şu satır eklendi: "Vücut figürü takımın kendi ürettiği 3D modelin görüntüsüdür."

2. **Bölgeler (aynı 14 bölge):** Numara, ad, organ, belirti, kan değeri bağlantıları ve kurallar değişmedi. Yalnızca çizgiler yeni figürün hatlarına göre yeniden çizildi (`const Q`). Üretici betik: `bolgeler.py`. Sınırlar (1920 koordinatında):
   - **Ön:** baş < 448 · boyun → köprücük (505 + 0,08·|dx|) · göğüs sol/sağ → 680 · karın üst 680–860 · karın alt 860 → kasık V çizgisi (990 − 0,85·|dx|) · bacaklar kasık çizgisinden ayağa.
   - **Kollar:** omuz kası dahil; koltuk altı (y 706) altında gövdeden ayrı parça = kol + el.
   - **Arka:** baş < 450 · sırt üst 450–715 · böbrekler 715–800 (omurga şeridinin ±20 px iki yanı) · bel/omurga alt: omurga şeridi + 800 → kalça üst çizgisi (890 − 0,55·|dx|) · kalça ve arka bacak → bacak bölgeleri.
   - **Sol/sağ:** önde astronotun solu ekranın sağında, arkada solunda.

**Doğrulama (headless Chrome):**
- Konsol hatası yok.
- Her bölgenin noktası kendi görünümünde kendi bölgesini seçiyor.
- `kaynak/build.py` yeni figürle derleniyor.

**Not:** `kaynak/` kodu 15.11 08:49 sürümüdür (Astronot sayfası yok); `Q` ve figür orada da güncellendi. Güncel uygulama `uygulama/` altındaki v5'tir.
