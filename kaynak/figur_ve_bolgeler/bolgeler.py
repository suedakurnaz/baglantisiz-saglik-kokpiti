"""Yeni figür için tıklama bölgeleri: figürün siluetini 14 bölgeye ayırır, her bölgenin dış hattını
çokgene çevirir ve uygulamadaki `const Q={...};` biçiminde yazar.
Kullanım: python3 -I bolgeler.py figur.webp q.js onizleme.png
"""
import sys
import numpy as np
import cv2
from PIL import Image

A = np.asarray(Image.open(sys.argv[1]))[:, :, 3] > 128
H, W = A.shape
yy, xx = np.mgrid[0:H, 0:W]
lab = np.zeros((H, W), np.uint8)


def interp(y, pts):
    ys, xs = zip(*pts)
    return np.interp(y, ys, xs)


# kol/gövde sınırı (orta çizgiden uzaklık): köprücük → omuz kası önü → koltuk altı
ARM_ON = [(500, 150), (560, 176), (640, 160), (695, 142), (706, 140)]
ARM_ARKA = [(500, 150), (560, 185), (640, 165), (695, 142), (706, 142)]


def torso_half(view_mask, cx):
    """Her satırda orta çizgiyi içeren parçanın yarı genişliği (kollar ayrıldıktan sonra)."""
    hw = np.zeros(H)
    for y in range(H):
        row = view_mask[y]
        if not row[cx]:
            # bacak arası: orta piksel boş; en yakın iki parçanın dışını al
            continue
        l = cx
        while l > 0 and row[l - 1]:
            l -= 1
        r = cx
        while r < W - 1 and row[r + 1]:
            r += 1
        hw[y] = max(cx - l, r - cx)
    return hw


def label_view(x0, x1, cx, back):
    M = np.zeros_like(A)
    M[:, x0:x1] = A[:, x0:x1]
    dx = xx - cx
    adx = np.abs(dx)
    armline = interp(yy, ARM_ARKA if back else ARM_ON)
    # kol: omuz bölgesinde sınır çizgisinin dışı; koltuk altından sonra gövdeden ayrı parça
    # koltuk altının altında: gövde-bacak bütünüyle bağlantısı olmayan parçalar koldur (el dahil)
    low = (M & (yy >= 706)).astype(np.uint8)
    nlab, cc = cv2.connectedComponents(low, connectivity=8)
    trunk = cc == cc[900, cx]
    arm_low = (low > 0) & ~trunk
    arm = M & (yy >= 495) & (((yy < 706) & (adx > armline)) | arm_low)
    head_end = 450 if back else 448
    head = M & (yy < head_end) & ~arm
    rest = M & ~arm & ~head
    L = np.zeros((H, W), np.uint8)
    L[head] = 1
    # sol/sağ: önde astronotun solu ekranın sağında, arkada solunda
    left = (dx > 0) if not back else (dx < 0)
    L[arm & left] = 7
    L[arm & ~left] = 8
    if not back:
        clav = 505 + 0.08 * adx
        ing = 990 - 0.85 * adx                       # kasık çizgisi (V)
        L[rest & (yy < clav)] = 2                    # boyun
        chest = rest & (yy >= clav) & (yy < 680)
        L[chest & left] = 3
        L[chest & ~left] = 4
        L[rest & (yy >= 680) & (yy < 860)] = 5       # karın üst
        L[rest & (yy >= 860) & (yy < ing)] = 6       # karın alt
        leg = rest & (yy >= np.maximum(860, ing))
    else:
        glute = 890 - 0.55 * adx                     # kalça üst çizgisi
        L[rest & (yy < 715)] = 11                    # sırt üst (boyun arkası dahil)
        kid = rest & (yy >= 715) & (yy < 800) & (adx > 20)
        L[kid & left] = 12
        L[kid & ~left] = 13
        L[rest & (yy >= 715) & (yy < glute) & ~kid] = 14
        leg = rest & (yy >= np.maximum(800, glute))
    L[leg & left] = 9
    L[leg & ~left] = 10
    return L


lab = np.maximum(label_view(150, 960, 581, False), label_view(960, 1780, 1333, True))

K = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9))
Q = {}
for n in range(1, 15):
    m = (lab == n).astype(np.uint8)
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, K)
    m = cv2.morphologyEx(m, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5)))
    m = cv2.dilate(m, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5)))  # kenarda tıklama payı
    cs, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    shapes = []
    for c in sorted(cs, key=lambda c: cv2.boundingRect(c)[0]):
        if cv2.contourArea(c) < 800:
            continue
        # parmak ayrıntısını düzelt: dışbükey olmayan küçük girintileri at
        c = cv2.approxPolyDP(c, 4, True)[:, 0, :]
        # ctr() köşe ortalaması kullandığı için köşeleri çevre boyunca eşit aralıkla yeniden örnekle
        seg = np.r_[c, c[:1]].astype(float)
        d = np.r_[0, np.cumsum(np.hypot(*np.diff(seg, axis=0).T))]
        step = 18
        t = np.arange(0, d[-1], step)
        px = np.interp(t, d, seg[:, 0]); py = np.interp(t, d, seg[:, 1])
        pts = np.c_[px, py]
        # düz kenarlarda gereksiz köşeleri azalt (ama dağılımı eşit tut)
        shapes.append(" ".join(f"{x:.0f},{y:.0f}" for x, y in pts))
    Q[n] = shapes

js = "const Q={\n" + ",\n".join(f'{n}:[' + ",".join(f'["p","{s}"]' for s in Q[n]) + "]" for n in range(1, 15)) + "};"
open(sys.argv[2], "w").write(js)
print({n: len(v) for n, v in Q.items()}, len(js), "bytes")

# önizleme: renkli bölgeler + nokta (ctr = köşe ortalaması)
pal = [(0, 0, 0), (230, 25, 75), (60, 180, 75), (255, 225, 25), (0, 130, 200), (245, 130, 48), (145, 30, 180),
       (70, 240, 240), (240, 50, 230), (210, 245, 60), (250, 190, 212), (0, 128, 128), (220, 190, 255), (170, 110, 40), (128, 0, 0)]
fig = Image.open(sys.argv[1]).convert("RGBA")
base = Image.new("RGBA", fig.size, (255, 255, 255, 255)); base.alpha_composite(fig)
ov = np.zeros((H, W, 4), np.uint8)
from PIL import ImageDraw
over = Image.new("RGBA", fig.size, (0, 0, 0, 0)); d = ImageDraw.Draw(over)
for n, ss in Q.items():
    for s in ss:
        pts = [tuple(map(float, p.split(","))) for p in s.split()]
        d.polygon(pts, fill=pal[n] + (110,), outline=pal[n] + (255,))
        cxp = sum(p[0] for p in pts) / len(pts); cyp = sum(p[1] for p in pts) / len(pts)
        d.ellipse([cxp - 14, cyp - 14, cxp + 14, cyp + 14], fill=(255, 255, 255, 255), outline=(0, 0, 0, 255), width=3)
        d.text((cxp - 6, cyp - 7), str(n), fill=(0, 0, 0, 255))
base.alpha_composite(over)
base.crop((200, 230, 1720, 1690)).convert("RGB").resize((1013, 973)).save(sys.argv[3])
