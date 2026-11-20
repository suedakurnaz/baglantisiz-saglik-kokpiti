"""Takımın 3D model görüntülerinden uygulama figürünü üretir.
Kullanım: python3 -I figur_hazirla.py 3d_model_on.png 3d_model_arka.png ../figur.webp
"""
import sys
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as nd

# hedef parlaklık dağılımı (uygulamadaki CSS filtresiyle eski figür kadar açık görünür)
o_p5, o_p50, o_p95 = 30, 92, 192  # biraz daha açık: eski figürün uygulamadaki görünümüne yakın

def cut(path):
    a = np.asarray(Image.open(path).convert('RGB')).astype(float)
    L = a.mean(2)
    H, W = L.shape
    yy, xx = np.mgrid[0:H, 0:W] / np.array([H, W])[:, None, None]
    # 1. tur: kaba arka plan (koyu ve kenara bağlı)
    lab, n = nd.label(L < 62)
    border = set(np.unique(np.r_[lab[0], lab[-1], lab[:, 0], lab[:, -1]])) - {0}
    bg0 = nd.binary_erosion(np.isin(lab, list(border)), iterations=6)
    # 2. tur: arka plan parlaklığını konuma göre 2. derece yüzeyle modelle
    F = lambda x, y: np.stack([np.ones_like(x), x, y, x * x, y * y, x * y], -1)
    coef, *_ = np.linalg.lstsq(F(xx[bg0], yy[bg0]), L[bg0], rcond=None)
    bgm = F(xx, yy) @ coef
    lab, n = nd.label(L < bgm + 7)
    border = set(np.unique(np.r_[lab[0], lab[-1], lab[:, 0], lab[:, -1]])) - {0}
    bg = np.isin(lab, list(border))
    body = ~bg
    body = nd.binary_opening(body, iterations=1)
    body = nd.binary_closing(body, structure=nd.generate_binary_structure(2, 1), iterations=4) | body
    bg = ~body
    # dar boğazla arka plana bağlanan küçük gölge ceplerini (diz içi vb.) figüre kat
    bgo = nd.binary_opening(bg, iterations=2)
    lab, n = nd.label(bgo)
    border = set(np.unique(np.r_[lab[0], lab[-1], lab[:, 0], lab[:, -1]])) - {0}
    bg = bg & nd.binary_dilation(np.isin(lab, list(border)), iterations=3)
    body = ~bg
    # yumuşak kenar: arka plan sınırında parlaklığa göre alfa
    edge = nd.binary_dilation(bg, iterations=2) & body
    alpha = body.astype(float)
    alpha[edge] = np.clip((L[edge] - bgm[edge]) / 40, 0, 1)
    alpha = np.asarray(Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6))) / 255
    alpha[~nd.binary_dilation(body, iterations=1)] = 0
    # ton: eski figürün parlaklık dağılımına eşle (filtre sonrası aynı görünsün)
    m = alpha > .9
    p5, p50, p95 = np.percentile(L[m], [5, 50, 95])
    Ln = np.where(L < p50, o_p50 + (L - p50) * (o_p50 - o_p5) / (p50 - p5), o_p50 + (L - p50) * (o_p95 - o_p50) / (p95 - p50))
    Ln = np.clip(Ln, 0, 255)
    rgba = np.dstack([Ln, Ln, Ln, alpha * 255]).astype(np.uint8)
    ys, xs = np.where(alpha > .5)
    return Image.fromarray(rgba, 'RGBA'), (xs.min(), xs.max(), ys.min(), ys.max())

canvas = Image.new('RGBA', (1920, 1920), (0, 0, 0, 0))
# (görsel, hedef orta x, hedef üst y, hedef yükseklik) — eski figürün ölçüleri
for path, cx, top, h in [(sys.argv[1], 581, 253, 1406), (sys.argv[2], 1333, 259, 1402)]:
    im, (x0, x1, y0, y1) = cut(path)
    s = h / (y1 - y0)
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    ox = round(cx - (x0 + x1) / 2 * s)
    oy = round(top - y0 * s)
    print(path, 'scale', round(s, 3), 'body x', ox + x0 * s, ox + x1 * s)
    canvas.alpha_composite(im, (ox, oy))
canvas.save(sys.argv[3], 'WEBP', quality=88, method=6)
