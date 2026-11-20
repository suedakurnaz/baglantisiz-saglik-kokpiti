# Dönüş Kalibratörü — proje bağlamı (güncelleme: 14 Kasım 2026)

Ana çalışma alanı (Claude Docs): https://claude.ai/artifact/PXdhNUb3tWwqreZ7QcAco1
Karar raporu (kısa, takımla paylaşmak için): https://claude.ai/artifact/Xgvtdm3FBRjRQsYQ2Zq6vd

## ÖNEMLİ KURAL
- Resmi Participant FAQ: "Teams are not allowed to begin working on the challenges prior to the hackathon." (Daha önce yanlışlıkla "yok" denmişti; 11 Kasım'da düzeltildi.) Kod, maket, veri çıkarma, CSV doldurma Cumartesi 11:00'den sonra. Önceden sadece okuma, kayıt, soru. Konya'ya "okuma ve not alma serbest mi" sorulacak; proje sayfasında önceden yapılan hazırlık (okuma/plan) beyan edilecek.

## Karar (11 Kasım)
- Takım mevcut fikirde kalıyor; alternatiflere gerek görmedi (3 rapor da aynı yönde).
- Akıllı saat verisi eklenecek: bir takım üyesinin son haftalık nabız/uyku verisi dosya olarak dışa aktarılıp "uçuş öncesi değer" olarak yüklenecek. Canlı bağlantı sadece zaman kalırsa. Ham veri repoya konmaz; ekranda "akıllı saat verisi, tıbbi cihaz değil" etiketi. Saat markası henüz bilinmiyor.
- Hazır ölçüm cihazları (tansiyon aleti, oksimetre, ateş ölçer) canlı demo için seçenek; Arduino sensörü sadece deneyimli biri varsa, katı süre sınırıyla.

## Ekip ve etkinlik
- Takım adı: Steppe to Stars. Üyeler: Azra, Sueda, Elif Naz, Bilal, Şengül Sıla. Rol ataması henüz yapılmadı.
- Roller: 1 Literatür ve bilimsel doğruluk, 2 OSDR verisi, 3 Uygulama, 4 Arayüz ve demo akışı, 5 Hikâye, video ve teslim.
- Yerel etkinlik: Konya. Cmt 11:00 geliştirme başlar; Pzr 09:00–14:00 proje tamamlama; 16:30–20:00 jüri (5 dk + 2 dk soru). Gerçek çalışma süresi ~27 saat. Herkes kendi bilgisayarını ve projeye özel ekipmanını getirir.
- Yerel Relevance tanımı: "NASA açık verilerinin doğru ve derin entegrasyonu" → OSDR I4 verisi demoda görünür olmalı.
- Öneri: 7 slayt ana ürün (yerel sunum + global teslim); 30 sn video zaman kalırsa.

## Challenge (tam metin okundu: hackathlone.com/challenges/health-monitoring-software)
- "Create Health Monitoring Software for Astronauts on Space Missions", Intermediate. Resources 13 Kasım.
- Görev: "build a health monitoring software that gathers health indicators and enables astronauts to evaluate and act on the status of their health." Objectives: "create a visual tool that helps astronauts assess their own health during space missions"; tedavi ve sağlığı iyileştirme yönlendirmesi de isteniyor.
- HRP'nin beş tehlikesi sayılıyor; biri "gravity fields" → evreye duyarlı referans fikrinin dayanağı.
- Örnek göstergeler (teyitli): tansiyon, nabız, kan şekeri, vücut sıcaklığı, günlük uyku saati, ruh hali. Sağlık göstergesi olduğu sürece her veri kabul.
- İsteğe bağlı: farklı ortamlar, hatırlatmalar, oyunlaştırma, dinamik grafikler, renk kodu, açıklamalar. Örnek UI: tıklanabilir insan vücudu diyagramı. Veri: NASA HRP + diğer ajanslar.

## Çerçeve ve MVP
- Astronot birincil kullanıcı; topla → değerlendir → harekete geç. Ayırt edici özellik: "normal" aralık görev evresine göre değişir.
- MVP: 1) 6 göstergeli günlük öz kontrol (akıllı saat verisiyle); 2) trend + renk, kişisel uçuş öncesi değer, iniş günü işareti; 3) evreye duyarlı lab modülü (Hb, Hct, ferritin, serum demiri, transferrin; kaynak/güven; SS yoksa renkli karar yok; I4 OSDR değerleri); 4) eylem merdiveni; 5) açıklamalar; 6) ortam seçici; 7) demo düğmesi.
- Rekabet: fark yalnızca 3. madde → süre oraya.

## Veri
- Smith 2005 J Nutr Tablo 4 (n=11): Hb 140±10 → 135±10 g/L; Hct 0,42 → 0,40; ferritin 94,8 → 138,8; serum demiri 16,8 → 11,1; transferrin 2,54 → 2,27.
- Trudel 2020 Am J Hematol (10.1002/ajh.25699): kısa (5,4 gün) R+3 −0,61 g/dL, dönüş 24 gün; orta (11,5) R+8–29 −0,82, 49 gün; uzun (145) R+4–7 −1,66, 49 gün. Tablo S3 indirilecek (Cumartesi).
- I4 venöz kan: L-92, L-44, L-3, R+1, R+45, R+82, R+194. OSD-569 ayrıntıları (81 numune, CC0) teyit edilmedi.
- Spaceflight Standard Measures, NASA-STD-3001 [V1 3017], Lee 2020.

## Resmi kaynak taraması (14 Kasım, organizasyonun paylaştığı 5 sayfa + iç bağlantılar)
- NASA HRP Hazards: 5 tehlike. Gravity Fields sayfası: ağırlık taşıyan kemikler ayda ort. %1–1,5 mineral yoğunluğu kaybeder; yerçekimine geçişte baş dönmesi/bayılma; Mars'ta iniş sonrası uyum süresi gerekir. Distance from Earth: Mars'ta tek yön iletişim gecikmesi 20 dakikaya kadar → mürettebat az destekle karar vermeli (öz değerlendirme aracının gerekçesi).
- NASA HRP Risks: 17 risk, 3 grup (Fizyoloji 11, Davranış/İnsan faktörleri 5, Radyasyon 1). Sayfada renk/olasılık derecesi yok. Kardiyovasküler risk sayfası: iniştte düşük tansiyon → bayılma; önlem: kompresyon giysisi, iniş öncesi bol sıvı.
- Ongoing HRP Research: ARCHeR (Artemis II, bilek aktigrafisi: hareket, uyku, ışık; uçuş öncesi/sırası), Standard Measures (bilek sensörü, kan/idrar biyokimyası, kan sayımı dahil hücresel profil, 10 bilişsel test, günlük uyku/ruh hali anketi, iniş öncesi-sonrası nabız/tansiyon; veriler LSDA'da), Tempus Pro (telemedisin, mürettebat tıbbi görevlisi simüle teşhis), Immune Biomarkers, Venous Haemostasis.
- humanresearchroadmap.nasa.gov otomatik çekmeyi engelliyor (robots); kanıt raporu PDF'leri elle açılmalı (ör. Cardio Risk EB 2022, Nutrition ER 2020, Fracture.pdf).
- CSA MARROW (PI Guy Trudel, 14 astronot, 6 ay ISS): uçuşta kırmızı kan hücresi yıkımı uçuş öncesine göre ~%54 fazla; iniş sonrası kanı alınan 13 kişiden 5'i anemik; düzelme 3–4 ay; 1 yıl sonra yıkım hâlâ ~%30 yüksek. → Lab modülünün en güçlü resmi dayanağı.
- CSA SPARK (Trudel, 10 astronot, 2025–2031): uzay anemisinde dalak rolü + karbon monoksit nefes ölçümüyle hemoliz; sonuç yok.
- CSA BP Reg: uzun görev dönüşünde astronotların %80'e kadarı baş dönmesi yaşar; uçuşta bacak manşonu testi kimin önlem alması gerektiğini belirledi (eylem merdiveni örneği).
- CSA Space Health (Bio-Monitor gömlek + Artemis yapay zekâ platformu; nabız, solunum, SpO2; uçuş öncesi/sırası/sonrası 48 saat sürekli) ve CARDIOBREATH (Bio-Monitor, nabız/tansiyon/solunum, kadın-erkek farkı). CANS: nötron radyasyonu ISS toplam dozunun ~%30'u.
- CSA infografik: kemik iliği etkisi → az alyuvar = anemi; astronotlar ayda %1,5'e kadar kemik kaybı (50 yaş üstü yetişkinde yılda ~%1).

## Açık işler
- Rol ataması; saat markası; Konya'ya sorular (okuma serbest mi, 14:00 teslim mi, hazır ekipman getirip kurulumu etkinlikte yapmak doğru mu); 7 slayt ve video metni (Cumartesi).
