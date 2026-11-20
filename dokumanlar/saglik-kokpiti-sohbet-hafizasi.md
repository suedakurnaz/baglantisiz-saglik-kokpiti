# Bağlantısız Sağlık Kokpiti — sohbet hafızası (14–15 Kasım 2026)

NASA Space Apps Challenge 2026 (Konya). Bu belge 14–15 Kasım sohbetinin özetidir; yeni bir sohbette bağlam olarak kullanın. Son güncelleme: 15.11.2026 02:15 (TR).

## Temel kurallar (kullanıcının talimatları)
- Proje dokümanındaki ("Bağlantısız Sağlık Kokpiti: Proje Dökümanı" PDF) kararlar kesin: **bozulmayacak**.
- Yalnızca 14 Kasım araştırmaları kullanılır; 11 Kasım çalışmaları yok sayılır.
- Kullanıcıyla Türkçe konuşulur; kısa, net, adım adım.

## Veri
- **NASA OSDR OSD-575** (Inspiration4): temel kan paneli CMP. DOI 10.26030/mc5d-p710. Ham dosya: `LSDS-8_Comprehensive_Metabolic_Panel_CMP_TRANSFORMED.csv`.
- **NASA OSDR OSD-569**: tam kan sayımı (CBC, Sysmex XN). `LSDS-7_Complete_Blood_Count_CBC_TRANSFORMED.csv`. C003'ün L-92 CBC satırı dışlandı.
- 4 astronot (dosyada C001–C004, uygulamada **AST1–AST4**; AST3 kadın), 7 zaman noktası: L-92, L-44, L-3 (uçuş öncesi), R+1, R+45, R+82, R+194 (dönüş sonrası). Kalkış 16.09.2021 00:02:56 UTC, dönüş 18.09.2021 23:06:49 UTC. **Uçuşta kan alınmadı**; uçuşa en yakın ölçüm R+1.
- Birleşik veri: `inspiration4_kan.json` (`donustur.py` ile). Her değer kendi satırındaki laboratuvar aralığıyla karşılaştırılır; hemoglobin birimi g/dL.
- **CRP çıkarıldı (takım kararı, 15.11):** OSD-575 kalp-damar panelindeki CRP araştırma testi (Eve HDCVD9); referans aralığı yok; değerler klinik ölçekle uyumsuz (AST3 L-92 = 75,75 mg/L); L-44'te dört kişide birden çöküş (ölçüm grubu etkisi). Birim çevirisi ham veriyle doğrulandı (pg/mL ÷ 1.000.000 = mg/L; 28/28 uyuşuyor) — sorun ölçüm yönteminde. Enfeksiyon için lökosit kullanılır. Sunum cümlesi: "CRP vardı ama aralığı yoktu ve ölçüm grubu etkisi gördük; gerçek görevde uçuş içi klinik CRP cihazıyla eklenir." Ham JSON ve gösterge tablosunda CRP satırları duruyor; build sırasında atlanıyor (`build4.py` içinde `CIKAR={'crp'}`).
- Kalan 21 kan göstergesi.

## Renk ve puan kuralları
- **Kan rengi:** kırmızı = dosyadaki aralık dışı (doküman 5.9); sarı = aralık içinde ama uçuş öncesi ortalamadan ≥%20 sapma (doküman 5.3, takım varsayımı); yeşil = normal.
- **Aciliyet puanı (doküman 5.8):** 3×şiddet bandı (1–3:0, 4–6:1, 7–10:2) + 2×süre bandı (<1 gün:0, 1–3:1, >3:2) + tekrar (0–2) + 2×kan sinyali (bölge değerleri; sarı 1, kırmızı 2) + 2×mürettebat (2/4:1, 3/4+:2) + kırmızı bayrak 10.
- **Sınıf:** Acil = kırmızı bayrak veya gösterge tablosunda "HEMEN/acil" yazan satır · Yüksek (kırmızı) = ≥12 puan **veya şiddet 7–10** · Orta (sarı) = 6–11 puan **veya şiddet 4–6** · İzlem (yeşil) = diğerleri. Şiddet bir alt sınırdır (15.11 kararı; eskiden "şiddet ≥8 en az Yüksek" idi).
- Kırmızı bayrak: bayılma; göğüs sol bölgesinde nefes darlığı / kola-çeneye yayılan ağrı / şiddet ≥8.
- **Mürettebat kuralı (5.5):** son 48 saatte aynı bölge grubunda 2/4 kişi = izleme (sarı), 3/4+ = uyarı (kırmızı); sol/sağ bölgeler tek grup.
- **Güven (5.4):** kan değeri + şikayet uyumu (belirti veya bölge) + mürettebat örüntüsü → 1–3 sinyal.
- **Yorum kuralları** doğrudan takımın `gosterge_tablosu.json` dosyasından (gösterge → düşükse/yüksekse: durum, öneri, kanıt K1–K3, hekime, uyumlu belirtiler, not). Kural tetiklenir: değer aralık dışı VE (bölgenin kan listesi veya kuralın bölgesi uyumlu VEYA belirti uyumlu). R+45 glikoz yorumlanmaz (tablo notu). 33 kural.

## Bölgeler ve belirtiler (14 bölge, arkadaşın figürü)
Her bölgede yalnızca o bölgeye uygun belirtiler gösterilir (15.11; takım önerisi, tıbbi kaynağa bağlı değil; dosya `bolge_belirti.json`):
- Baş: baş ağrısı, baş dönmesi, bayılma, bulantı, ateş, halsizlik
- Boyun: öksürük, ateş, şişlik, nefes darlığı, halsizlik
- Göğüs sol (kalp): çarpıntı, nefes darlığı, ağrı kola/çeneye yayılıyor, titreme/terleme, bayılma, baş dönmesi, bulantı, halsizlik
- Göğüs sağ (akciğer): öksürük, nefes darlığı, ateş, titreme/terleme, halsizlik
- Karın üst: karın ağrısı, bulantı, sarılık/koyu idrar, ateş, susama, halsizlik
- Karın alt: karın ağrısı, bulantı, idrar değişikliği, ateş, susama, halsizlik
- Kollar ve bacaklar: kramp/uyuşma, kemik ağrısı, şişlik, morarma/kanama, halsizlik
- Sırt üst: kemik ağrısı, kramp/uyuşma, halsizlik
- Böbrekler: yan ağrısı, idrar değişikliği, ateş, bulantı, susama, şişlik
- Bel/omurga alt: kemik ağrısı, kramp/uyuşma, yan ağrısı, halsizlik
Not alanındaki anahtar kelimeler de yalnızca bölgenin belirtilerini işaretler.

## Uygulama (tek HTML, çevrimdışı) — `Baglantisiz_Saglik_Kokpiti_v4.html`
Kaynak dosyalar: `app_top.js` (veri, bölgeler, kurallar, durum), `v4/ui.js` (arayüz), `v4/style.css`, `v4/body.html`, `v4/gosterge_tablosu.json`, `v4/fonts/`. Derleme: `python3 -I build4.py <arkadaşın_html> inspiration4_kan.json Baglantisiz_Saglik_Kokpiti_v4.html`.
Ekran (sayfa kaydırmasız):
- Sol menü: Genel bakış, Kan değerleri, Astronot sayfası; Demo kutusu (Başlat, Sonraki, Tüm veri, Sıfırla); Space Apps yazılı atfı; "Karar destek aracıdır, teşhis koymaz"; kaynaklar (i).
- Üst: astronot seçici AST1–AST4 (renk = en acil durumu), görev saati. **Bildirim (zil) ekranı kaldırıldı.**
- **Görev saati canlı:** gerçek UTC saatini gösterir, dakikada bir güncellenir ("canlı" etiketi); şikayetler gerçek saatle kaydedilir. Demo düğmeleri, saati elle değiştirmek ya da "+6 sa" saati 2021'e/elle moda alır; "Şimdi" düğmesi canlıya döner. Yazı yazılırken veya (i) balonu açıkken güncelleme bekler.
- Astronot kartı: ad + 3 sayı (aktif şikayet, kırmızı değer, sarı değer).
- Kan göstergesi: gruplu açılır liste (Aralık dışı / Sarı / Normal), 7 noktalı grafik ve referans bandı, değer satırı ("Normal: …", "Uçuş öncesine göre …"), "Yeni ölçüm" girişi. Kan paneli bölge tıklamasıyla değişmez, yalnızca ölçüm/değer seçimiyle.
- Figür (arkadaşın orijinal görseli; 15.11'de nötrleştirilmiş sürümden **orijinale geri dönüldü**): Ön/Arka; bölge rengi aciliyete göre; altında renk açıklaması.
- Şikayet kartı: bölge seçilmeden form gizli; şiddet 1–10 (renk geçişli: yeşil→sarı→kırmızı), bölgeye göre belirtiler, not, Kaydet. Kaydedince form kapanır, sonuç görünür.
- Sonuç kartı: en acil (veya son seçilen) şikayet; aciliyet etiketi ve (i) puan dökümü; mürettebat rozeti; durum, güven, kanıt; "Dünyaya inene kadar" önerileri; hekime bildirin; bölge dışı kırmızı değer notu; "Teşhis değildir; kararı uçuş hekimi verir."
- Mürettebat uyarı şeridi sağ sütun üstünde (zil kaldırıldığı için tek yer).
- Zaman çizelgesi: kan alma günleri, kalkış, şikayetler, dönüş, şimdi; olaylar zamana göre sıralı.
- **Sıfırla yalnızca seçili astronotu siler** (şikayetler + kan değerleri); diğerleri ve saat değişmez.
- NASA kimliği: renkler #0032A0 / #E4002B, yazı tipleri Inter, Public Sans, DM Mono (SIL OFL, gömülü). **NASA logosu kullanılmaz** (14 CFR 1221; Space Apps kuralı) — yazılı atıf + yasal not var. Data Insignia yeri boş (onay gerekir).

## Demo senaryosu (simüle şikayetler)
D001 AST2 göğüs, 16.09 16:00, geçti · D002 AST1 karın üst 17.09 08:00 · D003 AST2 karın üst 17.09 14:00 · D004 AST4 karın üst şiddet 7, 18.09 09:00 · D005 AST3 sol bacak kramp, 18.09 10:00.
Sonuçlar: AST1 Orta 11 (kural yok) · AST2 Orta 11 (kural yok) · AST3 Orta 7 → "Kas güçsüzlüğü, kramp, ritim etkisi" (potasyum 3,0 düşük; K2; 3 öneri) · AST4 Yüksek 14 → "Karaciğer yükü veya kas yorgunluğu/hasarı" (AST 48 U/L; K3/K2; mürettebat 3/4).
Demo dokümanı (Claude Docs, proje içinde) 4–5. adımlar ve CRP güncellendi; arayüz sadeleştirmesi, Sıfırla, canlı saat değişiklikleri henüz dokümana işlenmedi; dokümanda adlar hâlâ C001–C004.

## İçerik riskleri (jüri gözüyle, 15.11)
1. **Zaman uyuşmazlığı:** uçuş içi şikayetler dönüş sonrası (R+1) kanla değerlendiriliyor. Cevap: "uçuşa en yakın ölçüm; gerçek görevde uçuş içi yerinde ölçüm cihazı". Öneri: kan kartına "uçuş içi ölçümün yerine geçen değer" etiketi.
2. **Kaynaksız eşlemeler:** bölge–kan değeri, bölge–belirti, puan ağırlıkları takım tasarımı. Kaynağa bağlanmalı ya da "kural tabanlı, ayarlanabilir" diye anlatılmalı.
3. **Dünya referans aralıkları;** uzayda beklenen değişimler (sıvı kayması) kırmızı görünebilir. Kişisel %20 kuralı güçlü yan.
4. **Şikayetler simüle;** senaryo bilinen uzay sorunlarına (uzay adaptasyon bulantısı, sırt ağrısı) dayandırılabilir.
5. **Demoda AST1/AST2 "kural yok"** — senaryo güçlendirilmeli veya bilerek anlatılmalı.
Küçükler: canlı saatte 2026 şikayeti 2021 kanıyla karşılaştırılır (jüriye demo modu); figür herkes için erkek (AST3 kadın); mürettebat uyarısı 4 kişiye dayalı, güven düşük.

## Teslim gereklilikleri (Space Apps rehberi; 2026 için teyit edin)
- Teslim büyük ihtimalle **15 Kasım 23:59 yerel saat**.
- Demo: ≤30 sn video (İngilizce altyazı) veya ≤7 slayt (İngilizce); harici, herkese açık bağlantı.
- Final proje bağlantısı herkese açık olmalı (öneri: GitHub Pages).
- Proje sayfası ve bağlantılı materyaller **İngilizce** → uygulamaya TR/EN dil düğmesi gerekli (uygulama şu an tamamen Türkçe).
- NASA verisi açıklaması; kullanılan tüm kaynaklar (yazı tipleri, figür görseli, gösterge tablosu kaynakları); **yapay zekâ kullanım beyanı** (geliştirmede Claude kullanıldı; uygulama çalışırken yapay zekâ kullanmaz).
- **Figür görseli riski:** büyütünce stok görsel filigranına benzeyen silik izler görülüyor → arkadaşa kaynağı/lisansı sorulmalı; lisanssızsa değiştirilmeli.

## Açık kararlar
- Bölge–belirti listelerinin takımca onayı.
- Şiddet eşiği kararının proje dokümanı 5.8'e işlenmesi.
- Demo dokümanında C001–C004 → AST1–AST4; "AST4" adı AST enzimiyle karışabilir.
- Figürün kadın astronot için durumu.

## Sıradaki işler (önerilen sıra)
1. Figür görselinin lisansını arkadaşa sor.
2. Uygulamaya İngilizce arayüz (TR/EN düğmesi).
3. Kan kartına R+1 "uçuş içi ölçüm yerine" etiketi; demo senaryosunu güçlendirme.
4. Proje sayfası İngilizce metinleri (özet, açıklama, NASA verisi, kaynaklar, AI beyanı).
5. 7 slaytlık İngilizce demo veya 30 sn video senaryosu.
6. GitHub Pages'te yayınlama; demo dokümanını son arayüze göre güncelleme.

## Dosyalar
- Uygulama: `Baglantisiz_Saglik_Kokpiti_v4.html` (sohbette gönderildi; yeni sohbette dosyayı ekleyin — proje belgelerine HTML konmadı).
- `bolge_belirti.json` (bölge–belirti eşlemesi), `gosterge_tablosu.json` (takımın yorum tablosu), `inspiration4_kan.json` (birleşik NASA kan verisi), arkadaşın orijinal figür HTML'i.
- Demo dokümanı: proje içindeki Claude Docs belgesi (Uygulama Kokpit v2 / demo senaryosu).
