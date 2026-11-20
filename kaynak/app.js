
const IMG="data:image/webp;base64,{{FIGUR}}",IW=1920,IH=1920;
/* ===== VERİ: Inspiration4 gerçek kan değerleri (inspiration4_kan.json'dan, donustur.py ile üretildi) =====
   NASA[astronot].t[test] = {ad, br, ort (uçuş öncesi ortalama), s:{zaman:[değer, min, max] | null}} */
const NASA={{NASA}};
const TP=["L-92","L-44","L-3","R+1","R+45","R+82","R+194"];
const TPAD={"L-92":"uçuştan 92 gün önce","L-44":"uçuştan 44 gün önce","L-3":"uçuştan 3 gün önce","R+1":"dönüşten 1 gün sonra","R+45":"dönüşten 45 gün sonra","R+82":"dönüşten 82 gün sonra","R+194":"dönüşten 194 gün sonra"};
const SARI=20; /* takım kararı (14 Kasım): uçuş öncesi ortalamadan en az %20 sapma = sarı */
const TESTS=Object.keys(NASA.C001.t);
const TA=k=>NASA.C001.t[k];
const KALKIS=Date.parse("2021-09-16T00:02:56Z"),DONUS=Date.parse("2021-09-18T23:06:49Z");

/* ADIM B: Bölge → organ → ilgili kan değeri (takım tasarımı, varsayım). Göstergeler yalnızca NASA dosyasında olanlar. */
const Z=[
{n:1,ad:"Baş",org:["Beyin","Göz","Kulak"],sem:["basagri","bas","bayilma","bulanti","ates","halsizlik"],lab:["hemoglobin","hematocrit","red_blood_cell_count","glucose","sodium","potassium"],s:["e",100,36,26,30]},
{n:2,ad:"Boyun",org:["Tiroid","Boğaz"],sem:["oksuruk","ates","sislik","nefes","halsizlik"],lab:["white_blood_cell_count"],s:["r",90,68,20,16,4]},
{n:3,ad:"Göğüs sol",org:["Kalp"],sem:["carp","nefes","yayilan","terleme","bayilma","bas","bulanti","halsizlik"],lab:["potassium","sodium","calcium","hemoglobin","hematocrit"],s:["r",100,86,46,50,8]},
{n:4,ad:"Göğüs sağ",org:["Akciğer"],sem:["oksuruk","nefes","ates","terleme","halsizlik"],lab:["white_blood_cell_count","carbon_dioxide","hemoglobin"],s:["r",54,86,46,50,8]},
{n:5,ad:"Karın üst",org:["Mide","Karaciğer","Pankreas"],sem:["karin","bulanti","sarilik","ates","susama","halsizlik"],lab:["alt","ast","alkaline_phosphatase","total_bilirubin","albumin","total_protein","globulin","glucose"],s:["r",62,138,76,40,8]},
{n:6,ad:"Karın alt",org:["Bağırsak","Böbrek","Mesane"],sem:["karin","bulanti","idrar","ates","susama","halsizlik"],lab:["creatinine","egfr_non_african_american","urea_nitrogen_bun","calcium","chloride","carbon_dioxide"],s:["r",66,182,68,44,8]},
{n:7,ad:"Sol kol",org:["Kas","Kemik","Sinir"],sem:["kramp","kemik","sislik","morarma","halsizlik"],lab:["potassium","calcium","sodium","platelet_count"],s:["r",150,88,22,138,10]},
{n:8,ad:"Sağ kol",org:["Kas","Kemik","Sinir"],sem:["kramp","kemik","sislik","morarma","halsizlik"],lab:["potassium","calcium","sodium","platelet_count"],s:["r",28,88,22,138,10]},
{n:9,ad:"Sol bacak",org:["Kas","Kemik","Damar"],sem:["kramp","kemik","sislik","morarma","halsizlik"],lab:["potassium","calcium","sodium","hemoglobin","hematocrit","platelet_count"],s:["r",102,232,32,190,10]},
{n:10,ad:"Sağ bacak",org:["Kas","Kemik","Damar"],sem:["kramp","kemik","sislik","morarma","halsizlik"],lab:["potassium","calcium","sodium","hemoglobin","hematocrit","platelet_count"],s:["r",66,232,32,190,10]},
{n:11,ad:"Sırt üst",org:["Omurga","Kürek kasları"],sem:["kemik","kramp","halsizlik"],lab:["calcium","alkaline_phosphatase"],v:"b",s:["r",54,86,92,58,8]},
{n:12,ad:"Sol böbrek",org:["Sol böbrek"],sem:["yan","idrar","ates","bulanti","susama","sislik"],lab:["creatinine","egfr_non_african_american","urea_nitrogen_bun","calcium","potassium","sodium","chloride","carbon_dioxide"],v:"b",s:["r",62,150,36,38,8]},
{n:13,ad:"Sağ böbrek",org:["Sağ böbrek"],sem:["yan","idrar","ates","bulanti","susama","sislik"],lab:["creatinine","egfr_non_african_american","urea_nitrogen_bun","calcium","potassium","sodium","chloride","carbon_dioxide"],v:"b",s:["r",102,150,36,38,8]},
{n:14,ad:"Bel / omurga alt",org:["Omurga","Bel kasları"],sem:["kemik","kramp","yan","halsizlik"],lab:["calcium","alkaline_phosphatase","creatinine"],v:"b",s:["r",62,192,76,36,8]}];
/* Mürettebat kuralı aynı bölge grubunu sayar (sol/sağ aynı grup) */
const GRP={3:"Göğüs",4:"Göğüs",7:"Kol",8:"Kol",9:"Bacak",10:"Bacak",12:"Böbrek",13:"Böbrek"};
const grp=n=>GRP[n]||Z[n-1].ad;
const SEM={halsizlik:"Halsizlik / yorgunluk",bas:"Baş dönmesi",bayilma:"Bayılma",bulanti:"Bulantı / kusma",ates:"Ateş",nefes:"Nefes darlığı",carp:"Çarpıntı",kramp:"Kramp / uyuşma",yan:"Yan ağrısı",yayilan:"Ağrı kola/çeneye yayılıyor",basagri:"Baş ağrısı",karin:"Karın ağrısı",oksuruk:"Öksürük",terleme:"Titreme / terleme",susama:"Susama",morarma:"Morarma / kanama",idrar:"İdrar değişikliği / azalması",sislik:"Şişlik",sarilik:"Sarılık / koyu idrar",kemik:"Kemik ağrısı"};
const SEM_ANA=10;
const KEL={halsizlik:["halsiz","yorgun","bitkin","güçsüz"],bas:["baş dön","sersem"],bayilma:["bayıl"],carp:["çarpıntı"],nefes:["nefes"],ates:["ateş"],oksuruk:["öksür"],bulanti:["bulantı","kus"],kramp:["kramp","uyuş","karıncal"],yan:["yan ağr","böğür"],basagri:["baş ağr","başım ağr"],karin:["karın","mide"],terleme:["titre","terle"],susama:["susa","ağız kuru"],morarma:["morar","kanama","burun kana","diş eti"],idrar:["idrar"],sislik:["şiş","ödem"],sarilik:["sarılık","sarar","koyu idrar","çay renk"],kemik:["kemik"]};

/* ADIM C: Kural tablosu = proje dokümanı 5.9 (olası ilişkili durum) + 5.10 (öneri kütüphanesi).
   Öneri yalnızca kaynağı olan satırlarda; ilaç/doz/takviye yok. */
/* ADIM C: Takımın gösterge tablosu (gosterge_tablosu.json, 14 Kasım 22:55). Her gösterge ve yön için:
   durum, öneri, kanıt düzeyi (kat: K1/K2/K3), hekime bildirme koşulları, uyumlu belirtiler (sem), not. Teşhis değildir. */
const GT={{GT}};
/* "karin" ve "kemik" belirtisi, ilgili bölge seçildiğinde de uyumlu sayılır */
const SEM_BOLGE={karin:[5,6],kemik:[7,8,9,10,11,14],yan:[12,13]};
const R=(()=>{const m={};for(const k in GT){const g=GT[k];[["dusuk","düşük"],["yuksek","yüksek"]].forEach(([f,yon])=>{const x=g[f];if(!x||!x.durum)return;
 if(!(x.sem||[]).length&&!(x.oneri||[]).length&&!(x.hekime||[]).length)return;
 const r=m[x.durum]??=({d:/önemsiz|önemi düşük/i.test(x.durum)?x.durum:x.durum+" ile ilişkili olabilir",ham:x.durum,kan:{},sem:new Set(),on:x.oneri||[],hk:x.hekime||[],kat:x.kat,not:new Set(),acil:(x.hekime||[]).some(h=>/HEMEN|acil/i.test(h))});
 (r.kan[k]??=[]).push(yon);(x.sem||[]).forEach(s=>r.sem.add(s));if(x.not)r.not.add(x.not)})}
 return Object.values(m).map(r=>({...r,sem:[...r.sem],not:[...r.not],z:[...new Set([...r.sem].flatMap(s=>SEM_BOLGE[s]||[]))]}))})();

const AST=["C001","C002","C003","C004"];
const yeniD=(n=true)=>{const D={};AST.forEach(a=>D[a]={c:[],l:{},tp:"R+1",nasa:n});return D};
let st={a:"C001",sel:null,D:yeniD(),saat:Date.now(),canli:true};
try{const s=JSON.parse(localStorage.getItem("kokpit3")||"null");if(s&&s.D){st.D=s.D;st.canli=s.canli!==false;st.saat=st.canli?Date.now():(s.saat||KALKIS)}}catch(e){}
const $=i=>document.getElementById(i);
const save=()=>{try{localStorage.setItem("kokpit3",JSON.stringify({D:st.D,saat:st.saat,canli:st.canli}))}catch(e){}};
const cur=()=>st.D[st.a];
const p2=n=>String(n).padStart(2,"0");
const fmt=ms=>{const t=new Date(ms);return `${p2(t.getUTCDate())}.${p2(t.getUTCMonth()+1)}.${t.getUTCFullYear()} ${p2(t.getUTCHours())}:${p2(t.getUTCMinutes())} UTC`};
const gorevTxt=ms=>ms<KALKIS?"kalkıştan önce":ms>DONUS?"dönüşten sonra":`uçuşun ${Math.floor((ms-KALKIS)/864e5)+1}. günü`;

/* Değerlendirme: aralık dışı = kırmızı (5.9), aralık içi ama uçuş öncesinden ≥%20 sapma = sarı (5.3), diğer = yeşil */
/* Kan değerleri: NASA verisi yüklüyse (nasa) dosyadaki değer; elle girilen ölçüm her kan alma günü için ayrı saklanır (l[gün][gösterge]) */
function deg(a,tp){const o={},S=st.D[a],ov=(S.l&&S.l[tp])||{},nasa=S.nasa!==false;for(const k of TESTS){const T=NASA[a].t[k],b=T.s[tp]||null,el=ov[k]!==undefined&&ov[k]!=="";
 const v=el?+ov[k]:(nasa&&b?b[0]:null);if(v===null||Number.isNaN(v)){o[k]=null;continue}
 let rr=b||TP.map(t=>T.s[t]).filter(Boolean).pop()||[null,null,null],mn=rr[1],mx=rr[2]
 const yon=(mn===null&&mx===null)?null:(mn!==null&&v<mn?"düşük":mx!==null&&v>mx?"yüksek":"normal");
 const sp=nasa&&T.ort?Math.round((v-T.ort)/T.ort*1000)/10:null;
 const renk=yon===null?null:yon!=="normal"?"kırmızı":(sp!==null&&Math.abs(sp)>=SARI?"sarı":"yeşil");
 o[k]={v,mn,mx,yon,sp,renk,el}}return o}
const D=()=>deg(st.a,cur().tp);
const lt=()=>(cur().l[cur().tp]??={});
const kanVar=(a,tp)=>{const d=deg(a,tp);return TESTS.some(k=>d[k])};
const aralik=x=>x.mn===null&&x.mx===null?"aralık yok":`${x.mn??""}–${x.mx??""}`;
const spTxt=x=>x.sp===null?"–":(x.sp>0?"+":"")+String(x.sp).replace(".",",")+"%";
const bdg=x=>{if(!x)return `<span class="b yok">veri yok</span>`;if(!x.renk)return `<span class="b yok">renksiz</span>`;
 const c={kırmızı:"kr",sarı:"sr",yeşil:"yl"}[x.renk],t=x.renk==="kırmızı"?x.yon:x.renk==="sarı"?"sarı – değişim":"normal";return `<span class="b ${c}">${t}</span>`};

/* Mürettebat örüntüsü (5.5): son 48 saatte aynı bölge grubunda aktif şikayeti olan kişi sayısı. 2/4 izleme, 3/4+ uyarı */
function ekipDurum(){const m={};AST.forEach(a=>st.D[a].c.forEach(c=>{if(c.dur==="geçti")return;const dt=st.saat-c.ms;if(dt<0||dt>48*3600e3)return;(m[grp(c.z)]??=new Set()).add(a)}));return m}
const ekipN=c=>{const s=ekipDurum()[grp(c.z)];return s?s.size:0};
function ekipCls(){const m=ekipDurum(),o={};Z.forEach(z=>{const s=m[grp(z.n)];if(s&&s.size>=2)o[z.n]=s.size>=3?"r":"y"});return o}
function drawEkip(){const m=ekipDurum();let h="";Object.entries(m).filter(([,s])=>s.size>=2).sort((a,b)=>b[1].size-a[1].size).forEach(([g,s])=>{
 h+=s.size>=3?`<details class="alert"><summary>⚠️ Mürettebat örüntüsü: ${s.size}/4 kişide ${g.toLocaleLowerCase("tr")} bölgesinde şikayet (son 48 saat) — ortak bir etkene işaret edebilir</summary><span style="font-weight:400">Kontrol listesi: Ortak yemek veya su var mı? Belirtiler benzer mi? Ateş var mı? · Öneri: Ortak etkenleri kontrol edin, sıvı alımını artırın, uçuş hekimine özet hazırlayın. · Güven: Düşük (4 kişi, kural tabanlı). Eşikler takım varsayımıdır.</span></details>`
 :`<div class="hy"><b>İzleme:</b> ${s.size}/4 kişide ${g.toLocaleLowerCase("tr")} bölgesinde şikayet (son 48 saat).</div>`});$("ekip1").innerHTML=h;$("ekip2").innerHTML=h}

/* ADIM 1: Vücut figürü */
function cn(z){const[t,a,b,c,d]=z.s;return t=="r"?[a+c/2,b+d/2]:[a,b]}
const SIL=`<ellipse class="sil" cx="100" cy="36" rx="26" ry="30"/><rect class="sil" x="90" y="68" width="20" height="16" rx="4"/><rect class="sil" x="150" y="88" width="22" height="138" rx="10"/><rect class="sil" x="28" y="88" width="22" height="138" rx="10"/><rect class="sil" x="102" y="232" width="32" height="190" rx="10"/><rect class="sil" x="66" y="232" width="32" height="190" rx="10"/>`;
/* side: f=ön, b=arka. o: sel, cls (bölge→renk sınıfı), mk (işaretlenecek şikayetler), live (tıklanabilir) */
function fig(side,o){
 return (side=="b"?SIL:"")+Z.filter(z=>(z.v||"f")==side).map(z=>{const[t,a,b,c,d,r]=z.s,[x,y]=cn(z);
  const sh=t=="r"?`<rect x="${a}" y="${b}" width="${c}" height="${d}" rx="${r}"/>`:`<ellipse cx="${a}" cy="${b}" rx="${c}" ry="${d}"/>`;
  const k=(o.cls&&o.cls[z.n])||"";
  return `<g class="zn${o.sel==z.n?" on":""} ${k}" ${o.live?`data-n="${z.n}" tabindex="0" role="button" aria-label="Bölge ${z.n}: ${z.ad}"`:`style="pointer-events:none"`}>${sh}<text x="${x}" y="${y+4}">${z.n}</text></g>`}).join("")+(o.mk||[]).filter(c=>(Z[c.z-1].v||"f")==side).map(c=>{const[x,y]=cn(Z[c.z-1]);return `<circle class="mk" cx="${x+12}" cy="${y-12}" r="7"/>`}).join("")}
/* Anatomi görseli: bölgeler görselin üzerine çizilmiş tıklanabilir şekillerdir. Koordinatlar görsel pikselidir (Q'yu buradan ayarlayın). r=dikdörtgen(x,y,w,h) e=elips(cx,cy,rx,ry) p=çokgen */
const Q={
1:[["p","561,254 545,262 531,273 518,286 515,303 512,321 508,338 500,351 503,369 512,384 521,400 525,418 529,435 538,447 556,448 574,448 592,448 610,449 625,445 630,428 635,411 643,396 653,381 660,364 662,347 650,334 648,316 647,299 639,282 626,270 611,260 594,254 577,252"],["p","1315,259 1299,267 1285,278 1274,292 1267,308 1266,326 1261,342 1255,357 1261,373 1270,389 1278,405 1281,422 1285,440 1296,449 1314,450 1332,450 1350,450 1368,451 1380,443 1384,426 1388,408 1398,394 1407,379 1414,362 1412,346 1402,333 1400,315 1398,297 1388,283 1375,270 1359,262 1341,261 1323,260"]],
2:[["p","456,510 473,516 490,514 508,512 526,511 544,509 562,508 580,506 598,507 616,508 634,509 652,510 670,512 688,513 706,514 695,505 680,494 666,484 651,473 638,461 626,448 609,446 591,446 573,446 555,446 537,446 526,460 513,473 498,483 483,493 468,502"]],
3:[["p","580,506 580,524 580,542 580,560 580,578 580,596 580,614 580,632 580,650 580,668 587,679 605,679 623,679 641,679 659,679 677,679 695,679 713,679 730,678 735,661 739,643 743,626 748,608 752,591 756,573 754,556 748,539 742,522 726,517 708,513 690,512 672,511 654,510 636,509 618,508 600,507 582,506"]],
4:[["p","583,506 565,507 547,508 529,509 511,510 493,511 475,512 457,513 440,517 422,521 415,536 409,553 405,570 409,588 414,605 418,622 422,640 427,657 431,675 446,679 464,679 482,679 500,679 518,679 536,679 554,679 572,679 583,672 583,654 583,636 583,618 583,600 583,582 583,564 583,546 583,528 583,510"]],
5:[["p","434,680 443,696 451,712 460,728 468,743 470,761 472,779 474,797 472,814 466,832 464,849 472,859 490,859 508,859 526,859 544,859 562,859 580,859 598,859 616,859 634,859 652,859 670,859 688,859 696,851 692,833 688,816 687,798 688,780 690,762 695,745 700,728 708,712 720,699 727,683 713,680 695,680 677,680 659,680 641,680 623,680 605,680 587,680 569,680 551,680 533,680 515,680 497,680 479,680 461,680 443,680"]],
6:[["p","457,879 465,894 479,905 492,917 506,928 520,940 534,952 548,963 561,975 575,986 589,984 603,973 617,961 630,950 644,938 658,926 672,915 686,903 699,892 702,877 696,860 679,858 661,858 643,858 625,858 607,858 589,858 571,858 553,858 535,858 517,858 499,858 481,858 465,862 458,878"]],
7:[["p","745,521 745,537 751,554 753,571 749,589 744,606 740,623 736,641 731,658 727,676 723,693 729,709 738,725 747,741 755,757 764,772 768,790 772,808 776,825 780,843 784,860 794,875 804,890 814,905 824,920 831,937 836,954 838,971 827,984 815,997 806,1012 797,1028 788,1044 787,1060 801,1058 813,1045 825,1041 831,1056 821,1068 806,1075 801,1091 797,1108 806,1120 821,1115 836,1105 848,1091 859,1078 870,1063 873,1046 876,1028 879,1010 882,992 885,975 886,957 883,939 881,921 878,904 876,886 873,868 870,850 868,832 863,815 857,798 852,781 844,765 835,749 826,733 819,717 817,699 814,681 812,663 805,647 797,631 798,613 800,595 796,578 789,562 780,546 766,534 751,525"],["p","1165,521 1150,531 1136,542 1127,558 1119,573 1118,591 1118,609 1117,627 1111,644 1103,660 1097,677 1094,695 1092,713 1089,730 1080,746 1072,762 1063,778 1056,794 1050,811 1046,829 1043,846 1041,864 1038,882 1035,900 1033,918 1030,935 1028,953 1029,971 1033,989 1036,1006 1040,1024 1043,1042 1048,1059 1060,1072 1071,1086 1086,1097 1101,1106 1117,1108 1116,1090 1106,1075 1096,1060 1086,1045 1087,1028 1098,1017 1110,1030 1124,1038 1132,1027 1122,1012 1111,998 1101,983 1087,972 1077,959 1081,942 1087,925 1096,910 1107,895 1119,881 1127,866 1132,849 1136,831 1140,814 1144,796 1149,779 1156,762 1164,747 1173,731 1182,715 1190,699 1187,683 1180,666 1173,649 1167,632 1163,615 1159,597 1154,580 1150,562 1159,547 1167,531"]],
8:[["p","417,521 402,530 387,541 379,557 370,573 368,590 369,608 369,626 364,643 355,659 353,676 350,694 348,712 340,728 331,744 322,759 314,775 308,792 302,809 297,826 294,844 292,862 289,880 286,897 283,915 280,933 277,951 276,968 279,986 282,1004 285,1022 288,1039 291,1057 298,1073 310,1087 322,1100 336,1111 352,1116 363,1105 362,1088 355,1071 340,1063 327,1054 334,1039 346,1043 357,1057 371,1055 366,1039 357,1023 348,1007 340,992 331,976 322,960 329,944 336,927 342,910 352,895 362,880 372,865 382,851 387,833 392,816 397,799 398,781 399,763 409,748 420,734 428,718 436,701 437,684 432,667 428,649 424,632 419,615 415,597 411,580 408,562 414,545 421,529"],["p","1500,519 1501,535 1509,551 1515,567 1511,584 1506,602 1502,619 1498,637 1491,653 1485,670 1478,687 1479,703 1489,719 1498,734 1508,749 1517,765 1523,781 1527,799 1530,817 1534,834 1537,852 1545,868 1553,884 1564,898 1575,912 1582,929 1589,945 1589,963 1574,973 1561,985 1550,1000 1540,1014 1530,1029 1543,1036 1557,1026 1569,1017 1578,1033 1573,1050 1563,1065 1552,1079 1548,1096 1555,1109 1570,1099 1586,1090 1598,1077 1610,1064 1621,1050 1625,1032 1628,1015 1632,997 1635,979 1639,962 1639,944 1636,926 1634,908 1632,890 1630,872 1627,854 1625,837 1623,819 1615,802 1608,786 1601,770 1593,753 1586,737 1582,719 1579,702 1577,684 1574,666 1566,650 1558,634 1554,617 1554,599 1554,581 1548,564 1540,548 1528,535 1513,525"]],
9:[["p","702,886 688,898 674,909 661,921 647,932 633,944 619,955 605,967 592,978 581,992 588,1006 590,1024 591,1042 593,1060 597,1077 603,1094 608,1112 614,1129 616,1147 618,1164 619,1182 623,1200 629,1217 635,1234 641,1251 647,1268 645,1285 641,1303 637,1320 634,1338 638,1355 645,1372 651,1389 657,1406 664,1422 670,1439 673,1457 674,1475 675,1493 673,1511 671,1529 669,1546 667,1564 669,1581 681,1594 687,1610 683,1627 684,1644 697,1656 713,1662 731,1662 748,1657 764,1649 772,1634 766,1618 757,1603 748,1587 742,1570 737,1553 737,1535 737,1518 733,1500 731,1482 732,1464 732,1446 734,1429 736,1411 738,1393 740,1375 743,1357 745,1339 747,1321 744,1304 738,1287 731,1270 725,1254 721,1236 719,1218 717,1200 717,1183 724,1166 730,1149 735,1132 736,1114 737,1096 738,1078 738,1060 738,1042 736,1024 733,1007 730,989 727,971 722,954 717,936 712,919 707,902"],["p","1225,829 1217,843 1213,861 1209,878 1205,896 1202,913 1198,931 1194,949 1190,966 1186,984 1183,1001 1179,1019 1175,1037 1176,1055 1176,1073 1177,1091 1178,1109 1178,1127 1180,1144 1185,1162 1190,1179 1196,1196 1196,1214 1194,1232 1192,1250 1190,1267 1185,1285 1179,1302 1174,1319 1168,1336 1163,1353 1164,1371 1167,1389 1170,1407 1172,1424 1174,1442 1175,1460 1176,1478 1177,1496 1177,1514 1178,1532 1178,1550 1174,1568 1171,1585 1157,1596 1142,1604 1146,1620 1154,1635 1170,1643 1181,1657 1199,1663 1216,1662 1234,1661 1247,1649 1246,1631 1246,1613 1245,1595 1244,1577 1243,1559 1238,1542 1239,1524 1240,1506 1242,1488 1248,1471 1253,1454 1258,1436 1268,1422 1278,1407 1282,1389 1281,1371 1280,1353 1276,1336 1272,1318 1267,1301 1268,1284 1275,1267 1282,1250 1288,1234 1290,1216 1293,1198 1295,1180 1298,1162 1300,1144 1304,1127 1310,1110 1316,1093 1322,1076 1326,1059 1329,1041 1332,1023 1334,1005 1334,987 1334,969 1334,951 1334,933 1334,915 1334,897 1325,884 1310,876 1294,867 1278,858 1262,850 1247,841 1231,832"]],
10:[["p","459,885 454,902 449,920 444,937 439,954 434,971 430,989 427,1007 425,1025 422,1042 422,1060 422,1078 423,1096 424,1114 425,1132 431,1149 438,1166 444,1183 446,1200 444,1218 441,1236 438,1253 431,1270 425,1287 419,1304 417,1322 418,1340 418,1357 421,1375 424,1393 427,1411 431,1428 433,1446 433,1464 433,1482 431,1500 426,1517 427,1535 425,1552 418,1569 411,1585 400,1600 390,1615 386,1631 394,1646 409,1654 426,1655 443,1658 460,1653 473,1640 475,1622 471,1605 480,1592 493,1579 498,1564 495,1546 493,1528 491,1510 490,1492 490,1474 491,1456 493,1439 498,1421 503,1404 510,1387 518,1371 525,1355 531,1338 530,1320 527,1302 522,1285 517,1268 521,1251 528,1234 534,1217 532,1200 539,1184 545,1167 547,1149 549,1131 552,1113 554,1095 560,1078 566,1061 571,1044 574,1027 575,1009 583,994 573,981 560,969 546,958 532,946 518,935 504,923 491,911 477,900 463,888"],["p","1443,828 1427,837 1411,845 1396,854 1380,862 1364,871 1348,880 1332,888 1331,905 1331,923 1331,941 1331,959 1331,977 1331,995 1338,1011 1342,1028 1344,1046 1346,1064 1350,1081 1356,1098 1361,1116 1366,1133 1369,1150 1370,1168 1373,1186 1376,1204 1380,1221 1384,1239 1390,1256 1397,1272 1405,1289 1404,1306 1401,1324 1398,1342 1395,1359 1392,1377 1395,1394 1402,1411 1408,1428 1414,1445 1421,1462 1427,1478 1430,1496 1431,1514 1431,1532 1431,1550 1432,1568 1432,1586 1431,1604 1429,1622 1427,1640 1434,1654 1451,1659 1468,1659 1486,1655 1500,1645 1514,1633 1519,1616 1519,1600 1504,1590 1499,1574 1496,1556 1495,1538 1496,1520 1497,1502 1497,1484 1498,1466 1498,1448 1499,1430 1500,1412 1503,1395 1506,1377 1509,1359 1505,1342 1500,1325 1494,1308 1488,1291 1482,1274 1479,1256 1478,1238 1477,1220 1476,1202 1476,1185 1479,1167 1483,1149 1487,1132 1490,1114 1494,1096 1494,1078 1494,1060 1494,1042 1491,1025 1487,1007 1483,990 1479,972 1476,954 1472,937 1468,919 1464,902 1461,884 1457,866 1453,849 1449,831"]],
11:[["p","1167,523 1159,539 1152,556 1149,572 1153,590 1158,607 1162,625 1166,642 1173,659 1180,675 1187,692 1198,706 1213,714 1231,714 1249,714 1267,714 1285,715 1303,715 1321,715 1339,715 1357,715 1375,715 1393,715 1411,716 1429,716 1447,716 1462,710 1476,698 1483,682 1490,665 1497,649 1502,631 1506,614 1510,596 1514,579 1518,561 1512,545 1503,530 1490,518 1473,514 1458,505 1442,495 1427,485 1412,475 1398,464 1386,452 1368,450 1350,449 1332,449 1314,448 1296,448 1282,457 1269,469 1254,479 1239,489 1224,499 1209,509 1192,515 1175,520"]],
12:[["p","1208,715 1215,732 1222,748 1226,766 1228,784 1231,799 1249,799 1267,799 1285,799 1303,799 1314,792 1314,774 1314,756 1314,738 1314,720 1301,715 1283,715 1265,715 1247,715 1229,715 1211,715"]],
13:[["p","1352,715 1352,733 1352,751 1352,769 1352,787 1358,799 1376,799 1394,799 1412,799 1430,799 1440,790 1441,772 1444,754 1450,737 1455,720 1445,715 1427,715 1409,715 1391,715 1373,715 1355,715"]],
14:[["p","1315,713 1314,731 1313,749 1312,767 1311,785 1303,795 1285,796 1267,797 1249,797 1232,800 1226,817 1224,832 1240,840 1256,849 1272,857 1288,866 1303,874 1319,883 1335,890 1351,882 1367,873 1383,865 1398,856 1414,847 1430,839 1445,829 1442,813 1434,798 1416,798 1398,798 1380,798 1362,798 1357,784 1357,766 1356,748 1356,730 1352,715 1334,714 1316,713"]]};
const shp=s=>s[0]=="r"?`<rect x="${s[1]}" y="${s[2]}" width="${s[3]}" height="${s[4]}" rx="14"/>`:s[0]=="e"?`<ellipse cx="${s[1]}" cy="${s[2]}" rx="${s[3]}" ry="${s[4]}"/>`:`<polygon points="${s[1]}"/>`;
const ctr=s=>{if(s[0]=="r")return[s[1]+s[3]/2,s[2]+s[4]/2];if(s[0]=="e")return[s[1],s[2]];const p=s[1].split(" ").map(q=>q.split(",").map(Number));return[p.reduce((a,b)=>a+b[0],0)/p.length,p.reduce((a,b)=>a+b[1],0)/p.length]};
function mk2d(host,live){
 const sv=document.createElementNS("http://www.w3.org/2000/svg","svg");
 sv.setAttribute("viewBox","225 235 1470 1445");sv.setAttribute("preserveAspectRatio","xMidYMid meet");sv.setAttribute("role","img");sv.setAttribute("aria-label","Ön ve arka kas anatomisi");
 sv.style.cssText="display:block;width:100%;height:100%;max-width:none"+(live?"":";pointer-events:none");
 sv.innerHTML=`<image href="${IMG}" width="${IW}" height="${IH}"/>`+Object.entries(Q).map(([n,ss])=>`<g class="hz" data-n="${n}">${ss.map(shp).join("")}${ss.map(s=>{const[x,y]=ctr(s);return `<circle cx="${x}" cy="${y}" r="30" fill="#fff" fill-opacity=".9" pointer-events="none"/><text x="${x}" y="${y+12}" font-size="34" font-weight="700" text-anchor="middle" fill="#12222b" pointer-events="none">${n}</text><circle class="hm" cx="${x+34}" cy="${y-34}" r="15" fill="#c93232" stroke="#fff" stroke-width="4" style="display:none" pointer-events="none"/>`}).join("")}</g>`).join("");
 host.appendChild(sv);
 const V={el:sv,onPick:null,resize(){},flip(){},
  set(o){sv.querySelectorAll(".hz").forEach(g=>{const n=+g.dataset.n,k=o.cls&&o.cls[n];g.setAttribute("class","hz "+(o.sel==n?"on":k||""));const m=(o.mk||[]).some(c=>c.z==n);g.querySelectorAll(".hm").forEach(e=>e.style.display=m?"":"none")})}};
 if(live)sv.addEventListener("click",e=>{const g=e.target.closest(".hz");if(g&&V.onPick)V.onPick(+g.dataset.n)});
 return V}
const V1=mk2d($("v1"),1),V2=mk2d(document.createElement("div"),0);
function drawBody(){V1.set({sel:st.sel,mk:cur().c.filter(c=>c.dur!="geçti")})}
function pick(n){st.sel=n;const z=Z[n-1];$("selTxt").textContent=`Seçili: ${z.n} – ${z.ad} (${z.org.join(", ")})`;drawBody()}
V1.onPick=pick;

/* ===== v4 ARAYÜZ: kenar menü · astronot kartı + gösterge grafiği · figür · şikayet/sonuç/mürettebat · zaman çizelgesi ===== */
const GR=[["Kan sayımı",["hemoglobin","hematocrit","red_blood_cell_count","white_blood_cell_count","platelet_count"]],
 ["Elektrolit ve mineral",["sodium","potassium","chloride","carbon_dioxide","calcium"]],
 ["Böbrek",["urea_nitrogen_bun","creatinine","egfr_non_african_american"]],
 ["Karaciğer ve protein",["alt","ast","alkaline_phosphatase","total_bilirubin","albumin","total_protein","globulin"]],
 ["Şeker",["glucose"]]];
const VARS=["hemoglobin","glucose","potassium","sodium","calcium","ast","alt","creatinine"];
const GEN=[{s:["halsizlik"],o:"Dinlenin; uyku ve sıvı alımınızı düzenli tutun"},{s:["bas"],o:"Ayağa yavaş kalkın, sıvı alın"},{s:["ates"],o:"Ateşi 6 saatte bir ölçüp kaydedin, sıvı alın"},{s:["oksuruk","nefes"],o:"Dinlenin; nefes durumunuzu 6 saatte bir kaydedin"},{s:["bulanti"],o:"Küçük porsiyonlarla yiyin, sıvı alın"},{s:["kramp"],o:"Hafif germe yapın, programlı egzersize devam edin"},{s:["yan"],o:"Sıvı alımını artırın, ağrıyı izleyin"}];
const acil=c=>c.sem.includes("bayilma")||(c.z==3&&(c.sem.includes("nefes")||c.sem.includes("yayilan")||c.sv>=8));
const esc=t=>String(t).replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]));
const num=v=>String(v).replace(".",",");
const RK={kırmızı:"r",sarı:"y",yeşil:"g"};
/* Ekranda görünen ad: AST1–AST4 (veri dosyasındaki kodlar C001–C004 içeride aynen kalır) */
const ETK={C001:"AST1",C002:"AST2",C003:"AST3",C004:"AST4"},ad=a=>ETK[a]||a;
/* Zaman noktası etiketleri: NASA kodu (L = kalkış/launch, R = dönüş/return) yerine Türkçe */
const TPK={"L-92":"−92","L-44":"−44","L-3":"−3","R+1":"+1","R+45":"+45","R+82":"+82","R+194":"+194"},TPC=t=>t[0]==="L"?`${t.slice(2)} gün önce`:`${t.slice(2)} gün sonra`,TPS=t=>t[0]==="L"?`uçuş −${t.slice(2)} g`:`dönüş +${t.slice(2)} g`;

const pill=x=>!x?`<span class="pill n">veri yok</span>`:!x.renk?`<span class="pill n">renksiz</span>`:`<span class="pill ${x.renk==="kırmızı"?"r":x.renk==="sarı"?"y":""}">${x.renk==="kırmızı"?x.yon:x.renk==="sarı"?"sarı · değişim":"normal"}</span>`;
st.mk=st.mk||"hemoglobin";
const aktif=a=>st.D[a].c.filter(c=>c.dur!=="geçti");
const kirmiziSay=(a,tp,ov)=>{const d=deg(a,tp,ov||{});return TESTS.filter(k=>d[k]&&d[k].renk==="kırmızı").length};
function durumA(a){const d=deg(a,st.D[a].tp,st.D[a].l),ak=aktif(a);if(!ak.length)return "n";
 const rs=ak.map(c=>onem(a,c,d).r);return rs.includes("r")?"r":rs.includes("y")?"y":"g"}


/* Aciliyet = proje dokümanı 5.8 önem puanı:
   3×şiddet bandı (1–3:0, 4–6:1, 7–10:2) + 2×süre bandı (<1 gün:0, 1–3:1, >3:2) + 1×tekrar (0/1/2+)
   + 2×kan sinyali (bölgenin değerleri: yeşil 0, sarı 1, kırmızı 2) + 2×mürettebat (tek 0, 2/4:1, 3/4+:2) + kırmızı bayrak 10.
   Sınıf: kırmızı bayrak = Acil · ≥12 puan veya şiddet 7–10 = Yüksek (kırmızı) · 6–11 puan veya şiddet 4–6 = Orta (sarı) · diğerleri İzlem (yeşil). Eşikler takım varsayımı. */
const SINIF={Acil:{r:"r",o:0},Yüksek:{r:"r",o:1},Orta:{r:"y",o:2},"İzlem":{r:"g",o:3},"Geçti":{r:"n",o:4}};
function onem(a,c,d){if(c.dur==="geçti")return {s:"Geçti",r:"n",p:0,nd:["şikayet geçti"]};
 const z=Z[c.z-1],sb=c.sv>=7?2:c.sv>=4?1:0,gun=Math.max(0,(st.saat-c.ms)/864e5),su=gun>3?2:gun>=1?1:0;
 const tk=Math.min(2,st.D[a].c.filter(x=>x!==c&&x.z===c.z&&x.ms<c.ms).length);
 const kk=z.lab.filter(k=>d[k]&&d[k].renk),kv=kk.reduce((m,k)=>Math.max(m,{kırmızı:2,sarı:1}[d[k].renk]||0),0);
 const n=ekipN(c),mo=n>=3?2:n>=2?1:0,bay=acil(c)||yorum(c,d).some(y=>y.r.acil),p=3*sb+2*su+tk+2*kv+2*mo+(bay?10:0);
 const s=bay?"Acil":(p>=12||c.sv>=7)?"Yüksek":(p>=6||c.sv>=4)?"Orta":"İzlem";
 const nd=[`şiddet ${c.sv}/10 (+${3*sb})`,`süre ${gun<1?"<1 gün":Math.floor(gun)+" gün"} (+${2*su})`,tk?`tekrar ${tk} (+${tk})`:"",
  kv?`kan: ${kk.filter(k=>({kırmızı:2,sarı:1}[d[k].renk]||0)===kv).map(k=>TA(k).ad).join(", ")} ${kv===2?"aralık dışı":"sarı"} (+${2*kv})`:(z.lab.length?"kan temiz (+0)":"bölgede kan göstergesi yok"),
  mo?`mürettebat ${n}/4 (+${2*mo})`:"",bay?(acil(c)?"kırmızı bayrak (+10)":"kan değeri: hekime hemen bildirilmeli (+10)"):"",!bay&&c.sv>=7&&p<12?"şiddet 7–10: en az Yüksek (kırmızı)":!bay&&c.sv>=4&&p<6?"şiddet 4–6: en az Orta (sarı)":""].filter(Boolean);
 return {s,r:SINIF[s].r,p,nd}}
const siraLi=(a,d)=>st.D[a].c.map(c=>({c,o:onem(a,c,d)})).sort((x,y)=>SINIF[x.o.s].o-SINIF[y.o.s].o||y.o.p-x.o.p||y.c.sv-x.c.sv||y.c.ms-x.c.ms);
const sbadge=o=>`<span class="badge ${o.r==="n"?"":o.r}">${o.s}${o.s!=="Geçti"?" · "+o.p+" puan":""}</span>`;

/* Yorum (5.4): güven = kan değeri + şikayet uyumu (belirti veya bölge) + mürettebat örüntüsü */
function yorum(c,d){
 const z=Z[c.z-1],o=[],n=ekipN(c),tp=cur().tp;
 R.forEach(r=>{const hit=Object.entries(r.kan).filter(([k,ys])=>d[k]&&ys.includes(d[k].yon)&&!(k==="glucose"&&tp==="R+45"&&!d[k].el));if(!hit.length)return;
  const bl=hit.some(([k])=>z.lab.includes(k))||r.z.includes(c.z),sm=r.sem.filter(x=>c.sem.includes(x));
  if(!bl&&!sm.length)return;
  let s=1;const nd=[hit.map(([k])=>`${TA(k).ad} ${d[k].yon} (${num(d[k].v)} ${TA(k).br}; aralık ${aralik(d[k])})`).join(", ")];
  if(bl||sm.length){s++;nd.push([sm.length?`belirti uyumlu: ${sm.map(x=>SEM[x]).join(", ")}`:"",bl?"işaretlenen bölge uyumlu":""].filter(Boolean).join("; "))}
  if(n>=2){s++;nd.push(`mürettebat örüntüsü: ${n}/4 kişide aynı bölge`)}
  o.push({r,s:Math.min(s,3),nd})});
 return o.sort((a,b)=>(b.r.acil-a.r.acil)||b.s-a.s)}


/* --- (i) bilgi düğmesi: açıklamalar tıklayınca balonda görünür --- */
const INFO={};let infoN=0;
const ib=(html,lbl)=>{const id="i"+(++infoN);INFO[id]=html;return `<button type="button" class="ib" data-i="${id}" aria-label="${lbl||"Bilgi"}" aria-expanded="false">i</button>`};
const POP=document.createElement("div");POP.className="pop hidden";POP.setAttribute("role","dialog");document.body.appendChild(POP);let popBtn=null;
function popKapa(){POP.classList.add("hidden");if(popBtn)popBtn.setAttribute("aria-expanded","false");popBtn=null}
document.addEventListener("click",e=>{const b=e.target.closest(".ib");if(b){e.stopPropagation();if(popBtn===b){popKapa();return}popKapa();popBtn=b;b.setAttribute("aria-expanded","true");
 POP.innerHTML=INFO[b.dataset.i]||"";POP.classList.remove("hidden");const r=b.getBoundingClientRect(),w=Math.min(320,innerWidth-24);POP.style.width=w+"px";
 let x=Math.min(Math.max(12,r.left+r.width/2-w/2),innerWidth-w-12),y=r.bottom+8;POP.style.left=x+"px";POP.style.top=y+"px";
 const h=POP.offsetHeight;if(y+h>innerHeight-12){POP.style.top=Math.max(12,r.top-h-8)+"px"}return}
 if(!e.target.closest(".pop"))popKapa()},true);
document.addEventListener("keydown",e=>{if(e.key==="Escape")popKapa()});
const anlam=k=>{const g=GT[k];if(!g)return "";const sl=x=>(x||[]).map(s=>SEM[s]||s).join(", ");const yon=(x,b)=>!x?`<b>${b}:</b> –`:`<b>${b}:</b> ${x.durum}${x.kat?` <span style="opacity:.75">(${x.kat})</span>`:""}${(x.sem||[]).length?`<br><span style="opacity:.8">Uyumlu şikayet: ${sl(x.sem)}</span>`:""}${(x.oneri||[]).length?`<br><span style="opacity:.8">Öneri: ${x.oneri.join("; ")}</span>`:""}${x.not?`<br><span style="opacity:.8">Not: ${x.not}</span>`:""}`;
 return `<b>${g.ad}</b> (${g.br})<br><br>${yon(g.dusuk,"Düşükse")}<br><br>${yon(g.yuksek,"Yüksekse")}<br><br><span style="opacity:.75">Takımın gösterge tablosu; teşhis değildir.</span>`};
const BILGI={
 kan:`<b>Kan değerleri</b><br>Inspiration4 görevinin gerçek kan verisi (NASA OSD-575 ve OSD-569). Kutuya kendi ölçümünüzü yazarsanız aynı referans aralığıyla karşılaştırılır.<br><br><b>Renkler:</b> kırmızı = aralık dışı · sarı = aralık içinde ama uçuş öncesi ortalamadan en az %20 farklı (takım varsayımı) · yeşil = normal.<br><b>Δ</b> = uçuş öncesi ortalamaya göre değişim.<br><br><b>Kan alma zamanları:</b> uçuştan 92, 44 ve 3 gün önce; dönüşten 1, 45, 82 ve 194 gün sonra. NASA dosyasında bunlar L-92 … R+194 diye yazılır (L = kalkış, R = dönüş). Zamanı alttaki çizelgeden değiştirin.`,
 ent:`Kutu boşsa NASA değeri kullanılır. Kendi ölçümünüzü yazınca renk yeniden hesaplanır; turuncu çerçeve elle girildiğini gösterir. ↺ ile NASA değerine dönersiniz.`,
 sira:`<b>Aciliyet sırası</b> (proje dokümanı 5.8 önem puanı)<br>3×şiddet bandı + 2×süre bandı + tekrar + 2×kan sinyali + 2×mürettebat + kırmızı bayrak 10.<br><br>kırmızı = Acil / Yüksek (12+ puan veya şiddet 7–10) · sarı = Orta (6–11 puan veya şiddet 4–6) · yeşil = İzlem.<br>Şiddet rengi alt sınırdır: puan daha yüksekse puanın rengi geçerlidir.<br>Liste teşhis değildir; hangi şikayetin önce ele alınacağını gösterir. Eşikler takım varsayımıdır.`,
 r1:`Uçuş sırasında kan alınmadı. Uçuşa en yakın ölçüm dönüşten 1 gün sonra alınan kandır (NASA kodu R+1).`,
 tl:`<b>Görev zaman çizelgesi</b><br>Soldan sağa: uçuş öncesi kan alma günleri (damla) · kalkış (16.09.2021) · uçuş sırasında girilen şikayetler (bölge numarası, renk = aciliyet) · şimdi (görev saati) · dönüş (18.09.2021) · dönüş sonrası kan alma günleri.<br><br>Damlaya tıklayınca o günün kan değerleri gösterilir; kırmızı damla o günde aralık dışı değer olduğunu gösterir. Şikayete tıklayınca o bölge seçilir.`,
 ekip:`<b>Mürettebat kuralı</b> (proje dokümanı 5.5)<br>Son 48 saatte aynı bölge grubunda 2/4 kişi = izleme (sarı), 3/4 ve üstü = uyarı (kırmızı). Sol/sağ bölgeler tek grup sayılır. Uygulama nedeni söylemez, kontrol listesi verir. Eşikler takım varsayımıdır.`,
 teshis:`Bu bir teşhis değildir; uçuş hekimi değerlendirmelidir. Öneriler yalnızca kaynaklı, düşük riskli türdendir; ilaç, doz veya takviye önerilmez.`,
 kat:`<b>Kanıt düzeyi</b><br>K1 = hakemli çalışmada ölçülmüş bulgu · K2 = ajansın resmî sayfasındaki bilgi · K3 = nitel / genel tıp bilgisi. Takımın araştırma raporlarındaki ölçek (NASA HRP kanıt kategorilerinden uyarlandı).`,
 kaynak:`<b>Veri kaynakları</b><br>Kan: NASA OSDR OSD-575 (temel kan paneli CMP; DOI 10.26030/mc5d-p710) ve OSD-569 (tam kan sayımı). Inspiration4, 3 günlük görev, 4 sivil astronot. Uçuşta kan alınmadı.<br>CRP (iltihap belirteci) NASA dosyasında var ama referans aralığı yok ve bir ölçüm gününde dört kişide birden ölçüm grubu etkisi görülüyor; güvenilir yorum yapılamadığı için kullanılmadı. Enfeksiyon için lökosit sayısı kullanılır.<br>Referans aralıkları dosyadaki Dünya yetişkin laboratuvar aralıklarıdır, uzaya özel değildir.<br>Astronot adları AST1–AST4, NASA dosyasındaki C001–C004 kodlarına karşılık gelir.<br>Bölge–organ–kan değeri ve bölge–belirti eşlemesi takım tasarımıdır.<br>Şikayetler simüledir. Sarı (%20), mürettebat ve aciliyet eşikleri takım varsayımıdır. Yapay zekâ kullanılmaz.<br><br><i>This material includes data, models, or resources provided by the National Aeronautics and Space Administration (NASA). Any findings, interpretations, or conclusions presented do not necessarily reflect the views of NASA.</i><br><br>NASA Space Apps Challenge 2026 için geliştirildi. Bu uygulama NASA ürünü değildir, NASA tarafından onaylanmamıştır.`};

/* --- Üst çubuk: astronot düğmeleri, zil --- */
function drawTop(){
 $("crew").innerHTML=AST.map(a=>`<button role="tab" aria-selected="${a===st.a}" class="${a===st.a?"on":""}" data-a="${a}" title="${aktif(a).length} aktif şikayet · ${kirmiziSay(a,st.D[a].tp,st.D[a].l)} kırmızı değer (${TPS(st.D[a].tp)})"><span class="dot ${durumA(a)}"></span>${ad(a)}</button>`).join("");
 $("crew").querySelectorAll("button").forEach(b=>b.onclick=()=>secA(b.dataset.a));
 $("topSub").textContent=`Inspiration4 · ${gorevTxt(st.saat)}`}
function secA(a){st.a=a;st.sel=null;st.son=null;save();tumu()}

/* --- Astronot kartı: ad + 3 sayı --- */
function drawWho(){$("ibKan").innerHTML=ib(BILGI.kan+"<br><br>"+BILGI.r1,"Kan göstergesi hakkında");const d=D(),kr=TESTS.filter(k=>d[k]&&d[k].renk==="kırmızı").length,sr=TESTS.filter(k=>d[k]&&d[k].renk==="sarı").length,ak=aktif(st.a).length;
 $("nm").textContent=ad(st.a);
 $("ds").textContent=`${NASA[st.a].cins==="K"?"Kadın":"Erkek"} · sivil astronot`;
 $("chips").innerHTML=`<div class="stat ${ak?"a":""}"><b>${ak}</b><span>aktif şikayet</span></div><div class="stat ${kr?"r":""}"><b>${kr}</b><span>kırmızı değer</span></div><div class="stat ${sr?"y":""}"><b>${sr}</b><span>sarı değer</span></div>`;
 $("kanZ").textContent=kanVar(st.a,cur().tp)?`Ölçüm: ${TPAD[cur().tp]}`:"Henüz kan ölçümü yok"}

/* --- Gösterge sekmeleri + çizgi grafik (7 zaman noktası, referans bandı) + değer girişi --- */
function mkListe(){return VARS.includes(st.mk)?VARS:[...VARS,st.mk]}
function drawTabs(){const d=D(),gr=[["Aralık dışı",k=>d[k]&&d[k].renk==="kırmızı"],["Uçuş öncesinden farklı (sarı)",k=>d[k]&&d[k].renk==="sarı"],["Normal",k=>d[k]&&d[k].renk==="yeşil"],["Aralığı yok / veri yok",k=>!d[k]||!d[k].renk]];
 const ks=TESTS.filter(k=>TA(k)),ad2=k=>TA(k).ad.replace(" (iltihap belirteci)",""),dur=k=>{const x=d[k];return !x?"veri yok":!x.renk?"renksiz":x.renk==="kırmızı"?x.yon:x.renk==="sarı"?"değişim":"normal"};
 if(!ks.includes(st.mk))st.mk=ks[0];
 $("mSel").innerHTML=gr.map(([g,f])=>{const o=ks.filter(f);return o.length?`<optgroup label="${g}">${o.map(k=>`<option value="${k}"${k===st.mk?" selected":""}>${ad2(k)} · ${dur(k)}</option>`).join("")}</optgroup>`:""}).join("");
 const x=d[st.mk];$("mDot").className="dot "+(x&&x.renk?RK[x.renk]:"n");
 $("mSel").onchange=()=>{st.mk=$("mSel").value;save();drawTabs();drawChart();drawEnt()}}
function drawChart(){const host=$("chart"),W=host.clientWidth||300,H=host.clientHeight||170,k=st.mk,T=NASA[st.a].t[k];
 const pts=TP.map((t,i)=>{const ov=t===cur().tp?cur().l:{};const x=deg(st.a,t,ov)[k];return x?{t,i,...x}:{t,i,v:null}});
 const vals=pts.filter(p=>p.v!==null).map(p=>p.v),rr=pts.find(p=>p.v!==null&&(p.mn!==null||p.mx!==null));
 if(!vals.length){host.innerHTML=`<div class="bos"><b>Henüz ${T.ad.replace(" (iltihap belirteci)","")} değeri yok.</b><span>Aşağıya ölçümünüzü girin${cur().nasa===false?" ya da Inspiration4 verisini yükleyin.":"."}</span>${cur().nasa===false?`<button class="pri" id="kanYukle">NASA kan verisini yükle</button>`:""}</div>`;
  if($("kanYukle"))$("kanYukle").onclick=()=>{cur().nasa=true;save();tumu()};return}
 const mn=rr?rr.mn:null,mx=rr?(rr.mx??(rr.mn!==null?rr.mn*1.6:null)):null;
 let lo=Math.min(...vals,mn??Infinity),hi=Math.max(...vals,mx??-Infinity);const pad=(hi-lo||1)*.18;lo-=pad;hi+=pad;
 const L=34,Rr=10,Tp=26,B=26,X=i=>L+i*(W-L-Rr)/6,Y=v=>Tp+(1-(v-lo)/(hi-lo))*(H-Tp-B);
 let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${T.ad} zaman içinde">`;
 if(mn!==null)s+=`<rect x="${L}" y="${Y(mx)}" width="${W-L-Rr}" height="${Math.max(2,Y(mn)-Y(mx))}" rx="6" fill="#dff4ee"/>`;
 else s+=`<text x="${W-Rr}" y="${Tp-8}" text-anchor="end" font-size="10.5" fill="#6b7a90">aralık yok · renksiz</text>`;
 for(let g=0;g<=3;g++){const v=lo+(hi-lo)*g/3;s+=`<line x1="${L}" x2="${W-Rr}" y1="${Y(v)}" y2="${Y(v)}" stroke="#eef2f7"/><text x="${L-6}" y="${Y(v)+3.5}" text-anchor="end" font-size="10" fill="#8a97a8">${num(Math.round(v*10)/10)}</text>`}
 const fx=(X(2)+X(3))/2;s+=`<line x1="${fx}" x2="${fx}" y1="${Tp-6}" y2="${H-B+4}" stroke="#9fb0c4" stroke-dasharray="3 4"/><text x="${fx}" y="${Tp-10}" text-anchor="middle" font-size="9.5" fill="#8a97a8">uçuş</text><text x="2" y="${H-8}" text-anchor="start" font-size="9.5" fill="#8a97a8">gün</text>`;
 const seg=[];let cu=[];pts.forEach(p=>{if(p.v===null){if(cu.length)seg.push(cu);cu=[]}else cu.push(p)});if(cu.length)seg.push(cu);
 seg.forEach(q=>{if(q.length<2)return;let dd=`M${X(q[0].i)},${Y(q[0].v)}`;for(let j=0;j<q.length-1;j++){const p0=q[Math.max(0,j-1)],p1=q[j],p2=q[j+1],p3=q[Math.min(q.length-1,j+2)];
  const c1x=X(p1.i)+(X(p2.i)-X(p0.i))/6,c1y=Y(p1.v)+(Y(p2.v)-Y(p0.v))/6,c2x=X(p2.i)-(X(p3.i)-X(p1.i))/6,c2y=Y(p2.v)-(Y(p3.v)-Y(p1.v))/6;dd+=` C${c1x},${c1y} ${c2x},${c2y} ${X(p2.i)},${Y(p2.v)}`}
  s+=`<path d="${dd}" fill="none" stroke="#14233a" stroke-width="2.2" stroke-linecap="round"/>`});
 pts.forEach(p=>{const x=X(p.i);s+=`<text x="${x}" y="${H-8}" text-anchor="middle" font-size="10.5" fill="${p.t===cur().tp?"#0032A0":"#8a97a8"}" font-weight="${p.t===cur().tp?700:400}">${TPK[p.t]}</text>`;
  if(p.v===null)return;
  const col=p.renk==="kırmızı"?"#e5484d":p.renk==="sarı"?"#e59a1b":p.renk==="yeşil"?"#1f9d6b":"#6b7a90",y=Y(p.v);
  if(p.t===cur().tp){s+=`<line x1="${x}" x2="${x}" y1="${y}" y2="${H-B}" stroke="#c9d3df"/><circle cx="${x}" cy="${y}" r="9" fill="#fff" stroke="${col}" stroke-width="4"/><text x="${x}" y="${y<Tp+18?y+26:y-16}" text-anchor="middle" font-size="15" font-weight="800" fill="#14233a">${num(p.v)}</text>`}
  else s+=`<circle cx="${x}" cy="${y}" r="5" fill="${col}" stroke="#fff" stroke-width="2"/>`;
  s+=`<rect x="${x-18}" y="${Tp-6}" width="36" height="${H-Tp}" fill="transparent" data-tp="${p.t}" style="cursor:pointer"><title>${TPAD[p.t]}${p.v!==null?" · "+num(p.v)+" "+T.br:""}</title></rect>`});
 host.innerHTML=s+"</svg>";host.querySelectorAll("[data-tp]").forEach(r=>r.onclick=()=>tpSec(r.dataset.tp))}
function drawEnt(){const k=st.mk,T=TA(k),x=D()[k],b=NASA[st.a].t[k].s[cur().tp];
 $("ent").innerHTML=`<div class="eh"><span class="ibrow"><b>${T.ad}</b>${ib(anlam(k),T.ad+" ne anlama gelir")}</span>${pill(x)}</div>
 <div class="ev2"><div class="big">${x?num(x.v):"–"}<small>${T.br}</small></div><div class="meta">${x?(x.mn!==null||x.mx!==null?`Normal: ${aralik(x)}`:"Normal aralık yok"):"Değer yok"}${x&&x.sp!==null?`<br>Uçuş öncesine göre ${spTxt(x)}`:""}</div></div>
 <div class="ein"><label for="eIn">Yeni ölçüm${x&&x.el?' <span class="elt">elle girildi</span>':""}</label><input id="eIn" type="number" step="any" inputmode="decimal" class="${x&&x.el?"el":""}" value="${x&&x.el?x.v:""}" placeholder="${cur().nasa!==false&&b?num(b[0]):"değer"}" title="Boşsa NASA değeri kullanılır" aria-label="${T.ad} için yeni ölçüm">${x&&x.el?`<button id="eSil" title="NASA değerine dön" aria-label="NASA değerine dön">↺</button>`:""}</div>`;
 $("eIn").onchange=()=>{const v=$("eIn").value;if(v===""||(cur().nasa!==false&&b&&+v===b[0]))delete lt()[k];else lt()[k]=+v;save();tumu()};
 if($("eSil"))$("eSil").onclick=()=>{delete lt()[k];save();tumu()}}
function tpSec(t){cur().tp=t;save();tumu()}

/* --- Figür: bölge renkleri (şikayet + değer), işaretler, ipucu balonu --- */
function drawBody(){const d=D(),cls={},rk={r:0,y:1,g:2};aktif(st.a).forEach(c=>{const r=onem(st.a,c,d).r;if(!cls[c.z]||rk[r]<rk[cls[c.z]])cls[c.z]=r});
 V1.set({sel:st.sel,cls,mk:aktif(st.a)});$("selTxt").innerHTML=`<span><i class="sw r"></i>Acil / Yüksek</span><span><i class="sw y"></i>Orta</span><span><i class="sw g"></i>İzlem</span>`;V1.el.querySelectorAll(".hz").forEach(g=>{const n=+g.dataset.n;if(cls[n])g.classList.add(cls[n]);if(n===st.sel)g.classList.add("on")})}
(function(){const host=$("v1"),tip=$("tip");host.addEventListener("mousemove",e=>{const g=e.target.closest(".hz");if(!g){tip.classList.add("hidden");return}const z=Z[+g.dataset.n-1],r=host.parentElement.getBoundingClientRect();
 tip.textContent=`${z.n} · ${z.ad} — ${z.org.join(", ")}`;tip.style.left=(e.clientX-r.left)+"px";tip.style.top=(e.clientY-r.top)+"px";tip.classList.remove("hidden")});host.addEventListener("mouseleave",()=>tip.classList.add("hidden"));
 host.querySelectorAll(".hz").forEach(g=>{const z=Z[+g.dataset.n-1];g.setAttribute("tabindex","0");g.setAttribute("role","button");g.setAttribute("aria-label",`Bölge ${z.n}: ${z.ad}`);g.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();V1.onPick(z.n)}})})})();
V1.onPick=n=>{st.sel=st.sel===n?null:n;$("kMsg").textContent="";if(ARKA_YALNIZ.includes(n)&&st.yon!=="arka")setYon("arka");if(ON_YALNIZ.includes(n)&&st.yon!=="on")setYon("on");tumu()};


/* --- Ön / arka görünüm (tek figür, yüksekliği doldurur) --- */
const VB={on:"228 235 708 1446",arka:"980 235 708 1446"};
const ARKA_YALNIZ=Z.filter(z=>z.v==="b").map(z=>z.n),ON_YALNIZ=[2,3,4,5,6];
st.yon=st.yon||"on";
function setYon(y){st.yon=y;V1.el.setAttribute("viewBox",VB[y]);drawYon()}
function drawYon(){const ak=aktif(st.a).map(c=>c.z),ar=ak.filter(n=>ARKA_YALNIZ.includes(n)).length,on=ak.filter(n=>ON_YALNIZ.includes(n)).length;
 $("yOn").className=st.yon==="on"?"on":"";$("yArka").className=st.yon==="arka"?"on":"";
 $("yOn").innerHTML=`Ön${st.yon!=="on"&&on?`<i>${on}</i>`:""}`;$("yArka").innerHTML=`Arka${st.yon!=="arka"&&ar?`<i>${ar}</i>`:""}`}
$("yOn").onclick=()=>setYon("on");$("yArka").onclick=()=>setYon("arka");

/* --- Şikayet kartı --- */
function drawSel(){const el=$("selChip");$("sikKart").classList.toggle("kapali",!st.sel);if(!st.sel){el.innerHTML="Önce figürden ağrıyan bölgeyi seçin.";return}const z=Z[st.sel-1];
 el.innerHTML=`<span class="ibrow"><b>${z.ad}</b><span class="mu">${z.org.join(", ")}</span>${ib(`<b>Bu bölgede bakılan kan değerleri</b><br>${z.lab.length?z.lab.map(k=>TA(k).ad).join(", "):"NASA dosyasında bu bölge için doğrudan gösterge yok; değerlendirme şikayete ve mürettebat örüntüsüne dayanır."}`,"Bölge hakkında")}</span>`}
/* Şiddet rengi: 1 yeşil → 5 sarı → 10 kırmızı, yumuşak geçiş (ton noktaları arasında doğrusal) */
const SEV_TON=[[1,150],[3,108],[4,54],[5,44],[7,20],[10,356]];
const sevTon=i=>{for(let j=0;j<SEV_TON.length-1;j++){const [a,ha]=SEV_TON[j],[b,hb]=SEV_TON[j+1];if(i<=b){const t=(i-a)/(b-a),d=((hb-ha+540)%360)-180;return (ha+d*t+360)%360}}return SEV_TON.at(-1)[1]};
const sevRenk=(i,al=1)=>{const h=Math.round(sevTon(i)),sic=h<75||h>300;return `hsl(${h} ${sic?84:60}% ${sic&&h>15&&h<75?50:43}% / ${al})`};
function drawSev(){const v=+$("sv").value;$("svTxt").textContent=`${v} / 10`;
 $("sev").innerHTML=Array.from({length:10},(_,i)=>{const n=i+1,st_=n===v?`background:${sevRenk(n)};color:#fff`:n<v?`background:${sevRenk(n,.55)};color:#fff`:`background:${sevRenk(n,.14)};color:${sevRenk(n)}`;return `<button type="button" role="radio" aria-checked="${n===v}" class="${n===v?"on":""}" style="${st_}" data-v="${n}">${n}</button>`}).join("");
 $("sev").querySelectorAll("button").forEach(b=>b.onclick=()=>{$("sv").value=b.dataset.v;drawSev()})}
/* Belirtiler bölgeye göre: yalnızca o bölgede anlamlı olanlar (Z[].sem, takım tanımı) */
let semZ=null;
function drawSem(){if(st.sel===semZ)return;semZ=st.sel;if(!st.sel){$("chk").innerHTML="";return}
 $("chk").innerHTML=Z[st.sel-1].sem.map(k=>`<label><input type="checkbox" value="${k}"><span>${SEM[k]}</span></label>`).join("")}
$("ft").oninput=()=>{const tx=$("ft").value.toLocaleLowerCase("tr");for(const k in KEL)if(KEL[k].some(w=>tx.includes(w))){const i=document.querySelector(`#chk input[value="${k}"]`);if(i)i.checked=true}};
$("ft").onkeydown=e=>{if(e.key==="Enter")$("kaydet").click()};
$("kaydet").onclick=()=>{if(!st.sel){$("kMsg").textContent="Önce figürden bir bölge seçin.";return}
 const tx=$("ft").value.toLocaleLowerCase("tr"),sem=new Set([...document.querySelectorAll("#chk input:checked")].map(i=>i.value));
 const izin=Z[st.sel-1].sem;for(const k in KEL)if(izin.includes(k)&&KEL[k].some(w=>tx.includes(w)))sem.add(k);
 cur().c.push({z:st.sel,sv:Math.min(10,Math.max(1,+$("sv").value||5)),sem:[...sem],txt:$("ft").value,ms:st.saat,t:fmt(st.saat),dur:"aktif",kaynak:"canlı giriş"});
 $("kMsg").textContent=`Kaydedildi: ${Z[st.sel-1].ad} · ${fmt(st.saat)}`;st.son=st.sel;st.sel=null;save();$("ft").value="";semZ=-1;$("sv").value=5;tumu()};

/* --- Sonuç kartı: en son aktif şikayetin yorumu --- */
function sonucHtml(c,d,kisa){const z=Z[c.z-1],ys=yorum(c,d),ab=z.lab.filter(k=>d[k]&&d[k].renk==="kırmızı"),sr=z.lab.filter(k=>d[k]&&d[k].renk==="sarı"),n=ekipN(c);let h="";
 if(acil(c))return h+`<div class="alert">Kırmızı bayrak: uçuş hekimine hemen bildirin. Öneri gösterilmez.</div>`;
 if(n>=2)h+=`<div class="small" style="margin:4px 0"><span class="badge ${n>=3?"r":"y"}">Mürettebat ${n}/4</span> aynı bölgede şikayet (48 sa)</div>`;
 if(ys.length){const {r,s,nd}=ys[0];h+=(r.acil?`<div class="alert" style="margin-top:6px">Uçuş hekimine hemen bildirin.</div>`:"")+`<div class="hl" style="margin-top:6px">${r.d}</div><div style="margin:4px 0" class="ibrow"><span class="badge ${s===3?"r":s===2?"y":"g"}">Güven: ${["","Düşük","Orta","Yüksek"][s]} · ${s} sinyal</span>${r.kat?`<span class="badge">Kanıt: ${r.kat}</span>${ib(BILGI.kat,"Kanıt düzeyi nedir")}`:""}</div><div class="small mu">Neden: ${nd.join("; ")}</div>`+
  (r.on.length?`<div class="small" style="margin-top:6px"><b>Dünyaya inene kadar</b></div><ul class="small">${r.on.map(x=>`<li>${x}</li>`).join("")}</ul>`:`<div class="small" style="margin:6px 0"><b>Öneri yok:</b> uçuş hekimine bildirin.</div>`)+
  (r.hk.length?`<div class="small mu">Hekime bildirin: ${r.hk.join("; ")}</div>`:"")+(r.not.length?`<div class="small mu" style="margin-top:4px">Not: ${r.not.join(" · ")}</div>`:"")+(ys.length>1&&kisa?`<div class="small mu">+${ys.length-1} başka olası durum (Rapor)</div>`:"")+(kisa?"":ys.slice(1).map(({r,s,nd})=>`<div class="hy"><b>${r.d}</b> · güven ${["","Düşük","Orta","Yüksek"][s]}<br><span class="mu">Neden: ${nd.join("; ")}</span></div>`).join(""))}
 else{const o=GEN.filter(g=>g.s.some(x=>c.sem.includes(x))).map(g=>g.o);o.push("48 saat sonra yeniden değerlendirin; sürerse uçuş hekimine bildirin");
  const dis=TESTS.filter(k=>d[k]&&d[k].renk==="kırmızı"&&!z.lab.includes(k));
  h+=`<div class="hl" style="margin-top:6px">${z.lab.length?"Bu bölgeyle ilgili kan değerleri normal":"Bu bölge için kan değeri yok"}</div>`+(dis.length?`<div class="small mu" style="margin-top:2px">Başka aralık dışı değer: ${dis.map(k=>`${TA(k).ad} ${d[k].yon}`).join(", ")}. Bu bölgeyle ilişkili sayılmadı.</div>`:"")+(sr.length?`<div class="small mu" style="margin-top:4px">Kişisel geçmişe göre değişen (sarı): ${sr.map(k=>`${TA(k).ad} ${num(d[k].v)} (${spTxt(d[k])})`).join(", ")}. Sarı değer güveni artırmaz.</div>`:"")+`<div class="small" style="margin-top:6px"><b>Genel öneri</b></div><ul class="small">${o.map(x=>`<li>${x}</li>`).join("")}</ul>`}
 return h+`<div class="small mu" style="margin-top:8px">Teşhis değildir; kararı uçuş hekimi verir.</div>`}
function drawRes(){const d=D(),L=siraLi(st.a,d).filter(x=>x.c.dur!=="geçti"),odak=st.sel||st.son,sec=odak&&L.find(x=>x.c.z===odak),top=sec||L[0];
 let h=`<h3>Sonuç <button class="lnk" id="resR">Astronot sayfası ›</button></h3>`;
 if(!top)h+=`<p class="small mu">${ad(st.a)} için aktif şikayet yok. Figürden bir bölge seçip şikayet kaydedin; sonuç burada çıkar.</p>`;
 else{if(L.length>1)h+=`<div class="sira">${L.map((x,i)=>`<button data-z="${x.c.z}" class="${x===top?"on":""}"><span class="dot ${x.o.r}"></span>${i+1}. ${Z[x.c.z-1].ad}</button>`).join("")}</div>`;
  h+=`<div class="rh"><b>${Z[top.c.z-1].ad}</b><span class="ibrow">${sbadge(top.o)}${ib(`<b>Neden ${top.o.s}?</b><br>${top.o.nd.join("<br>")}<br><br>${BILGI.sira}`,"Aciliyet puanı ayrıntısı")}</span></div><div class="small mu">Şiddet ${top.c.sv}/10 · ${top.c.t}</div>`+sonucHtml(top.c,d,true)}
 $("res").innerHTML=h;$("resR").onclick=()=>ac("rapor");$("res").querySelectorAll(".sira [data-z]").forEach(b=>b.onclick=()=>{st.son=+b.dataset.z;st.sel=null;tumu()})}

/* --- Mürettebat kartı --- */
function ekipHtml(){const m=ekipDurum();return Object.entries(m).filter(([,s])=>s.size>=2).sort((a,b)=>b[1].size-a[1].size).map(([g,s])=>s.size>=3
 ?`<div class="crewalert r"><details><summary>⚠️ ${s.size}/4 kişide ${g.toLocaleLowerCase("tr")} bölgesinde şikayet (48 sa)</summary><div style="font-weight:400;margin-top:4px">Ortak bir etkene işaret edebilir. Kontrol listesi: ortak yemek veya su? Belirtiler benzer mi? Ateş var mı? Öneri: ortak etkenleri kontrol edin, sıvı alımını artırın, uçuş hekimine özet hazırlayın. Güven: Düşük (4 kişi, kural tabanlı). Eşikler takım varsayımı.</div></details></div>`
 :`<div class="crewalert y">İzleme: ${s.size}/4 kişide ${g.toLocaleLowerCase("tr")} bölgesinde şikayet (48 sa)</div>`).join("")}
function drawCrew(){$("crewAlert").innerHTML=ekipHtml()}

/* --- Zaman çizelgesi --- */
const IC={kalk:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2c3 2 5 6 5 10l-2 4H9l-2-4c0-4 2-8 5-10z"/><circle cx="12" cy="10" r="2"/><path d="M9 16l-2 5 3-2M15 16l2 5-3-2"/></svg>`,
 don:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 16c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2"/><path d="M12 3v8M8 7l4 4 4-4"/></svg>`,
 kan:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/></svg>`};
const TPMS=t=>t[0]==="L"?KALKIS-(+t.slice(2))*864e5:DONUS+(+t.slice(2))*864e5;
function drawTl(){const ev=[];INFO.tl=BILGI.tl;
 TP.forEach(t=>ev.push({k:"kan",t,ms:TPMS(t)}));ev.push({k:"kalk",ms:KALKIS},{k:"don",ms:DONUS});
 st.D[st.a].c.forEach(c=>ev.push({k:"sik",c,ms:c.ms}));ev.sort((x,y)=>x.ms-y.ms);
 const d2=x=>{const t=new Date(x),y=t.getUTCFullYear();return `${p2(t.getUTCDate())}.${p2(t.getUTCMonth()+1)}${y!==2021?"."+String(y).slice(2):""} ${p2(t.getUTCHours())}:${p2(t.getUTCMinutes())}`};
 let h="",simdi=false;const now=st.saat;
 const SIMDI=`<div class="ev now" title="Görev saati ${d2(now)}"><span class="c"></span><span class="t">şimdi</span><span class="d">&nbsp;</span></div>`;
 ev.forEach(e=>{if(!simdi&&now<e.ms){simdi=true;h+=SIMDI}  if(e.k==="kan"){const kr=kirmiziSay(st.a,e.t),var_=kanVar(st.a,e.t);h+=`<button class="ev ${e.t===cur().tp?"on":""}" data-tp="${e.t}" title="Kan alma: ${TPAD[e.t]} (NASA kodu ${e.t}) · ${kr} aralık dışı değer · tıklayınca bu günün değerleri"><span class="c ${!var_?"n":kr?"r":"k"}">${IC.kan}</span><span class="t">${TPC(e.t)}</span><span class="d ${kr?"r":""}">${!var_?"veri yok":kr?kr+" kırmızı":"&nbsp;"}</span></button>`}
  else if(e.k==="kalk")h+=`<div class="ev"><span class="c p">${IC.kalk}</span><span class="t">Kalkış</span><span class="d">${d2(KALKIS).slice(0,5)}</span></div>`;
  else if(e.k==="don")h+=`<div class="ev"><span class="c p">${IC.don}</span><span class="t">Dönüş</span><span class="d">${d2(DONUS).slice(0,5)}</span></div>`;
  else{const c=e.c,o=onem(st.a,c,D()),s=c.dur==="geçti"?"":o.r;h+=`<button class="ev" data-z="${c.z}" title="${Z[c.z-1].ad} · şiddet ${c.sv}/10 · ${c.dur} · ${o.s}"><span class="c ${s}">${c.z}</span><span class="t">${Z[c.z-1].ad}</span><span class="d">${d2(c.ms)}</span></button>`}});
 if(!simdi)h+=SIMDI;$("tl").innerHTML=`<div class="tlh"><b>Zaman çizelgesi</b><button type="button" class="ib" data-i="tl" aria-label="Zaman çizelgesi nedir">i</button></div>`+h;$("tl").querySelectorAll("[data-tp]").forEach(b=>b.onclick=()=>tpSec(b.dataset.tp));$("tl").querySelectorAll("[data-z]").forEach(b=>b.onclick=()=>{st.son=+b.dataset.z;st.sel=null;tumu()})}

/* --- Çekmeceler: tüm kan değerleri, rapor, mürettebat uyarıları --- */
let acik=null;
function ac(n){acik=n;$("drw").classList.add("open");$("drw").setAttribute("aria-hidden","false");$("scrim").classList.remove("hidden");
 ["navGenel","navKan","navRapor"].forEach(i=>$(i).classList.toggle("on",(i==="navKan"&&n==="kan")||(i==="navRapor"&&n==="rapor")));drawDrw()}
function kapa(){acik=null;$("drw").classList.remove("open");$("drw").setAttribute("aria-hidden","true");$("scrim").classList.add("hidden");["navGenel","navKan","navRapor"].forEach(i=>$(i).classList.toggle("on",i==="navGenel"))}
$("drwX").onclick=kapa;$("scrim").onclick=kapa;$("navGenel").onclick=kapa;$("navKan").onclick=()=>ac("kan");$("navRapor").onclick=()=>ac("rapor");$("tumKan").onclick=()=>ac("kan");
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&acik)kapa()});
function cubuk(x){if(!x||x.mn===null&&x.mx===null)return `<span class="small mu">aralık yok</span>`;
 const mn=x.mn??0,mx=x.mx??mn*1.6,w=(mx-mn)||1,a=Math.min(mn-w*.5,x.v),b=Math.max(mx+w*.5,x.v),p=v=>((v-a)/(b-a)*100).toFixed(1),col={kırmızı:"var(--bad)",sarı:"var(--wr)",yeşil:"var(--ok)"}[x.renk]||"var(--mu)";
 return `<div class="bar"><span class="band" style="left:${p(mn)}%;width:${(p(mx)-p(mn)).toFixed(1)}%"></span><span class="pt" style="left:${p(x.v)}%;background:${col}"></span></div>`}
function drawDrw(){const d=D();
 if(acik==="kan"){$("drwH").textContent=`Kan değerleri · ${ad(st.a)} · ${TPAD[cur().tp]}`;
  let h=`<p class="small mu ibrow">${TPAD[cur().tp]} ${ib(BILGI.kan,"Kan değerleri hakkında")}</p>`+(cur().nasa===false?`<div class="bos sm"><span>NASA kan verisi yüklü değil. Değerleri kendiniz girebilir ya da Inspiration4 verisini yükleyebilirsiniz.</span><button class="pri" id="kanYukle2">NASA kan verisini yükle</button></div>`:"");
  GR.forEach(([g,ks])=>{h+=`<div class="grp">${g}</div>`;ks.forEach(k=>{const T=TA(k),x=d[k];h+=`<div class="lr"><label for="d_${k}"><span class="ibrow">${T.ad}${ib(anlam(k),T.ad+" ne anlama gelir")}</span><small>${T.br}${x?" · "+aralik(x):""}</small></label><input id="d_${k}" data-k="${k}" type="number" step="any" class="${x&&x.el?"el":""}" value="${x?x.v:""}">${cubuk(x)}<span class="st">${pill(x)}<br>${x&&x.sp!==null?"Δ "+spTxt(x):""}${x&&x.el?" · elle":""}</span></div>`})});
  $("drwB").innerHTML=h;if($("kanYukle2"))$("kanYukle2").onclick=()=>{cur().nasa=true;save();tumu()};$("drwB").querySelectorAll("input").forEach(i=>i.onchange=()=>{const k=i.dataset.k,b=NASA[st.a].t[k].s[cur().tp];if(i.value===""||(cur().nasa!==false&&b&&+i.value===b[0]))delete lt()[k];else lt()[k]=+i.value;st.mk=k;save();tumu()})}
 else if(acik==="rapor"){$("drwH").textContent=`Astronot sayfası · ${ad(st.a)} · ${fmt(st.saat)}`;
  const L=siraLi(st.a,d);
  let h=L.length?`<p class="small mu ibrow">En acilden başlayarak sıralı ${ib(BILGI.sira,"Sıralama nasıl yapılıyor")}</p>`:`<p class="mu">Kayıtlı şikayet yok.</p>`;
  L.forEach(({c,o},j)=>{const i=st.D[st.a].c.indexOf(c);h+=`<div class="rep ${o.r}"><h4><span class="sn">${c.dur==="geçti"?"–":j+1}</span><span class="badge">${c.z}</span> ${Z[c.z-1].ad} – ${Z[c.z-1].org.join(", ")} ${sbadge(o)}</h4>${ib(`<b>Neden ${o.s}?</b><br>${o.nd.join("<br>")}<br><br>${BILGI.sira}`,"Aciliyet puanı ayrıntısı")}<div class="small mu">${c.t} (${gorevTxt(c.ms)}) · şiddet ${c.sv}/10 · ${c.dur}${c.sem.length?" · "+c.sem.map(k=>SEM[k]).join(", "):""}${c.txt?" · “"+esc(c.txt)+"”":""} · ${c.kaynak||""}</div>${c.dur==="geçti"?"":sonucHtml(c,d,false)+`<button data-g="${i}" style="margin-top:6px">Geçti olarak işaretle</button>`}</div>`});
  h+=`<div class="grp ibrow">Kan değerleri · ${TPAD[cur().tp]} ${ib(BILGI.r1)}</div><table><tr><th>Değer</th><th>Sonuç</th><th>Aralık</th><th>Δ</th><th>Durum</th></tr>`+TESTS.filter(k=>d[k]).sort((a,b)=>({kırmızı:0,sarı:1,yeşil:2}[d[a].renk]??3)-({kırmızı:0,sarı:1,yeşil:2}[d[b].renk]??3)).map(k=>`<tr><td>${TA(k).ad}</td><td>${num(d[k].v)} ${TA(k).br}</td><td>${aralik(d[k])}</td><td>${spTxt(d[k])}</td><td>${pill(d[k])}</td></tr>`).join("")+`</table>`;
  $("drwB").innerHTML=h;$("drwB").querySelectorAll("[data-g]").forEach(b=>b.onclick=()=>{st.D[st.a].c[+b.dataset.g].dur="geçti";save();tumu()})}}

/* --- Hepsini çiz --- */
function tumu(){popKapa();for(const k in INFO)if(k!=="kaynak"&&k!=="tl")delete INFO[k];drawYon();drawTop();drawWho();drawTabs();drawChart();drawEnt();drawSel();drawSem();drawSev();drawBody();drawRes();drawCrew();drawTl();if(acik)drawDrw()}
function drawEkip(){}
addEventListener("resize",()=>drawChart());

/* Görev saati (UTC) */
const toLocalInput=ms=>new Date(ms).toISOString().slice(0,16);
function setSaat(ms){st.saat=ms;$("gs").value=toLocalInput(ms);drawSaat();save();tumu()}
function elle(ms){st.canli=false;setSaat(ms)}
function drawSaat(){$("canliT").classList.toggle("hidden",!st.canli);$("simdiB").classList.toggle("hidden",st.canli)}
$("gs").onchange=e=>{const v=Date.parse(e.target.value+":00Z");if(!Number.isNaN(v))elle(v)};
$("ileri").onclick=()=>elle(st.saat+6*3600e3);
$("simdiB").onclick=()=>{st.canli=true;setSaat(Date.now())};
/* Canlı saat: her 5 sn kontrol, dakika değişince güncelle. Kullanıcı bir alana yazarken ya da bilgi balonu açıkken bekler. */
setInterval(()=>{if(!st.canli)return;const n=Date.now();if(Math.floor(n/6e4)===Math.floor(st.saat/6e4))return;
 const ae=document.activeElement;if(!POP.classList.contains("hidden")||(ae&&/INPUT|SELECT|TEXTAREA/.test(ae.tagName)))return;setSaat(n)},5000);

/* Demo senaryosu (SİMÜLE şikayetler; zamanlar Inspiration4 uçuş penceresinde) */
const DEMO=[
 {id:"D001",a:"C002",iso:"2021-09-16T16:00:00Z",z:4,sv:3,sem:["oksuruk"],txt:"",dur:"geçti"},
 {id:"D002",a:"C001",iso:"2021-09-17T08:00:00Z",z:5,sv:6,sem:["bulanti"],txt:""},
 {id:"D003",a:"C002",iso:"2021-09-17T14:00:00Z",z:5,sv:5,sem:["bulanti"],txt:""},
 {id:"D004",a:"C004",iso:"2021-09-18T09:00:00Z",z:5,sv:7,sem:["bulanti"],txt:""},
 {id:"D005",a:"C003",iso:"2021-09-18T10:00:00Z",z:9,sv:5,sem:["kramp"],txt:""}];
const SIRA=["D003","D004"];
function demoEkle(r){const ms=Date.parse(r.iso);if(st.D[r.a].c.some(c=>c.id===r.id))return false;
 st.D[r.a].c.push({id:r.id,z:r.z,sv:r.sv,sem:r.sem,txt:r.txt,ms,t:fmt(ms),dur:r.dur||"aktif",kaynak:"demo senaryosu (simüle)"});return true}
$("dbas").onclick=()=>{st.D=yeniD();demoEkle(DEMO[0]);st.a="C001";st.sel=null;st.mk="hemoglobin";kapa();$("dMsg").textContent="AST1 · 17.09 08:00 UTC · NASA kan verisi yüklendi";elle(Date.parse("2021-09-17T08:00:00Z"))};
$("dson").onclick=()=>{const id=SIRA.find(i=>{const r=DEMO.find(x=>x.id===i);return !st.D[r.a].c.some(c=>c.id===i)});
 if(!id){$("dMsg").textContent="Sıradaki demo şikayeti kalmadı";return}const r=DEMO.find(x=>x.id===id);demoEkle(r);
 $("dMsg").textContent=`${ad(r.a)}: ${Z[r.z-1].ad}, şiddet ${r.sv} (simüle)`;elle(st.canli?Date.parse(r.iso):Math.max(st.saat,Date.parse(r.iso)))};
$("dhep").onclick=()=>{st.D=yeniD();DEMO.forEach(demoEkle);st.sel=null;$("dMsg").textContent="5 demo şikayeti yüklendi (simüle)";elle(Date.parse("2021-09-18T18:00:00Z"))};
/* Sıfırla: yalnızca seçili astronot (şikayetleri + kan değerleri); diğerleri ve görev saati aynen kalır */
$("dsil").onclick=()=>{st.D[st.a]=yeniD(false)[st.a];st.sel=null;st.son=null;$("dMsg").textContent=`${ad(st.a)} sıfırlandı: şikayetleri ve kan değerleri boş. Diğer astronotlar aynen duruyor.`;save();tumu()};
$("dsil").title="Yalnızca seçili astronotu sıfırlar";

/* NASA Data Insignia ("DATA AT WORK") yeri: NASA ön onayıyla gelen resmî dosya data URL olarak buraya yazılır.
   Onay yoksa boş kalır ve hiçbir logo gösterilmez (14 CFR 1221; nasa.gov/nasa-data-insignia). */
const DATA_INSIGNIA="";
if(DATA_INSIGNIA){$("insignia").innerHTML=`<img src="${DATA_INSIGNIA}" alt="NASA Data Insignia — DATA AT WORK">`;$("insignia").classList.remove("hidden")}
$("gs").value=toLocalInput(st.saat);drawSaat();
setYon(st.yon);
INFO.kaynak=BILGI.kaynak;$("ibKaynak").dataset.i="kaynak";
tumu();

