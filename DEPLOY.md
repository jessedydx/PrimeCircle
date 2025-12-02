# 🚀 Farcaster Miniapp Deploy Rehberi

## 📋 Deploy Öncesi Checklist

### 1. Domain Hazırlığı
- [ ] Vercel hesabı oluştur (https://vercel.com)
- [ ] PrimeCircle projesini deploy et
- [ ] Production URL'ini al (örn: `primecircle.vercel.app`)

### 2. Environment Variables (Vercel Dashboard)
```
NEYNAR_API_KEY=E72BCC93-3BD8-4295-87A3-4E5B104D29F6
NEXT_PUBLIC_APP_URL=https://primecircle.vercel.app
```
**⚠️ NOT:** `NEXT_PUBLIC_USE_MOCK_DATA` ekleme! Production'da gerçek API kullanılacak.

### 3. Farcaster Manifest Güncelle

**Deploy sonrası `public/.well-known/farcaster.json` dosyasını güncelle:**

```json
{
  "accountAssociation": {
    // Bu kısmı Farcaster Developer Tools ile oluşturacaksın
  },
  "miniapp": {
    "version": "1",
    "name": "PrimeCircle",
    "iconUrl": "https://YOUR-DOMAIN.vercel.app/icon.png",
    "homeUrl": "https://YOUR-DOMAIN.vercel.app",
    "imageUrl": "https://YOUR-DOMAIN.vercel.app/og-image.png",
    "buttonTitle": "Analyze Follow Quality",
    "splashImageUrl": "https://YOUR-DOMAIN.vercel.app/splash.png",
    "splashBackgroundColor": "#7c3aed",
    ...
  }
}
```

**`yourdomain.vercel.app` → gerçek domain'inle değiştir!**

---

## 🔐 Account Association Oluşturma

### Adım 1: Farcaster Developer Tools
1. https://farcaster.xyz/~/developers/mini-apps/manifest adresine git
2. Warpcast ile giriş yap
3. Domain'ini gir (örn: `primecircle.vercel.app`)
4. App detaylarını doldur

### Adım 2: Signature Al
Tool sana `accountAssociation` objesi verecek:
```json
{
  "header": "eyJ...",
  "payload": "eyJ...",
  "signature": "MHg..."
}
```

### Adım 3: Manifest'e Ekle
`public/.well-known/farcaster.json` dosyasına ekle:
```json
{
  "accountAssociation": {
    "header": "PASTE_HERE",
    "payload": "PASTE_HERE",
    "signature": "PASTE_HERE"
  },
  "miniapp": { ... }
}
```

### Adım 4: Yeniden Deploy
```bash
git add public/.well-known/farcaster.json
git commit -m "Add account association"
git push
# Vercel otomatik deploy edecek
```

---

## 📱 Miniapp Özellikleri (Mevcut Manifest)

### Zorunlu Alanlar ✅
- ✅ `version`: "1"
- ✅ `name`: "PrimeCircle"
- ✅ `iconUrl`: App ikonu
- ✅ `homeUrl`: Ana sayfa URL
- ✅ `splashImageUrl`: Splash ekran
- ✅ `splashBackgroundColor`: "#7c3aed"

### Önerilen Alanlar ✅
- ✅ `imageUrl`: Sosyal paylaşım görseli
- ✅ `buttonTitle`: "Analyze Follow Quality"
- ✅ `primaryCategory`: "social"
- ✅ `subtitle`: Kısa açıklama
- ✅ `description`: Detaylı açıklama
- ✅ `tags`: ["analytics", "social", "farcaster", ...]
- ✅ `tagline`: "Follow Quality Analytics for Farcaster"
- ✅ `ogTitle`: Open Graph title
- ✅ `ogDescription`: Open Graph description
- ✅ `ogImageUrl`: Open Graph image

### Opsiyonel Alanlar (Eklenebilir)
- ⏳ `webhookUrl`: Notification webhook (v2'de)
- ⏳ `screenshotUrls`: App içi ekran görüntüleri
- ⏳ `heroImageUrl`: Hero image
- ⏳ `requiredChains`: Blockchain requirement (yok)
- ⏳ `requiredCapabilities`: SDK capabilities (yok)

---

## 🎨 Görsel Gereksinimleri

### Icon (`/public/icon.png`)
- ✅ Mevcut: `icon.svg`
- ⚠️ TODO: PNG veya SVG (512x512 önerilen)
- Şu an SVG kullanıyoruz (uyumlu)

### Splash Image (`/public/splash.png`)
- ❌ Eksik! Oluşturulmalı
- Boyut: 1200x630 veya 512x512
- Format: PNG veya JPG

### OG Image (`/public/og-image.png`)
- ❌ Eksik! Oluşturulmalı
- Boyut: 1200x630 (Open Graph standardı)
- Format: PNG veya JPG
- İçerik: App adı + açıklama + branding

---

## 🚀 Deploy Komutları

### İlk Deploy
```bash
# Vercel CLI kur (eğer yoksa)
npm i -g vercel

# Deploy
cd /Users/karatasailesi/Desktop/PrimeCircle
vercel

# Sorular:
# - Set up and deploy? Y
# - Which scope? [hesabın]
# - Link to existing project? N
# - What's your project's name? primecircle
# - In which directory? ./
# - Override settings? N
```

### Environment Variables Ekle
```bash
# Vercel Dashboard'dan:
# Settings > Environment Variables

# Ekle:
NEYNAR_API_KEY = E72BCC93-3BD8-4295-87A3-4E5B104D29F6
NEXT_PUBLIC_APP_URL = https://primecircle.vercel.app (deploy sonrası URL)
```

### Yeniden Deploy
```bash
vercel --prod
```

---

## ✅ Deploy Sonrası Kontroller

### 1. Manifest Erişilebilir mi?
```bash
curl https://YOUR-DOMAIN.vercel.app/.well-known/farcaster.json
```
✅ JSON dönmeli

### 2. Domain Match
- Manifest'teki URL'ler = gerçek domain
- `iconUrl`, `homeUrl`, `splashImageUrl` kontrol et

### 3. Warpcast'te Test
1. Warpcast mobil app aç
2. URL'i paylaş veya direkt aç
3. Miniapp olarak açılmalı

---

## 🐛 Hata Giderme

### "Manifest not found"
- `.well-known/farcaster.json` path doğru mu?
- `public/` klasöründe mi?

### "Invalid account association"
- Domain manifest tool'dakiyle aynı mı?
- Signature doğru kopyalandı mı?

### "App doesn't load in Warpcast"
- SDK deprecated uyarısı: `@farcaster/frame-sdk` → `@farcaster/miniapp-sdk`
- Şimdilik çalışır ama güncelle

---

## 📝 TODO: Eksik Görseller

### Oluşturulması Gerekenler:
1. **splash.png** (512x512 veya 1200x630)
   - PrimeCircle logo
   - Purple gradient background
   
2. **og-image.png** (1200x630)
   - App adı: "PrimeCircle"
   - Tagline: "Follow Quality Analytics"
   - Örnek skor görseli (76/100)

### Geçici Çözüm:
`icon.svg` dosyasını PNG'ye çevir ve her ikisi için kullan:
```bash
# SVG → PNG dönüştürme (imagemagick ile)
convert -background none -resize 512x512 public/icon.svg public/splash.png
convert -background none -resize 1200x630 public/icon.svg public/og-image.png
```

---

## 🎯 Sonraki Adımlar

1. [ ] Vercel'e ilk deploy
2. [ ] Production URL al
3. [ ] Manifest URL'lerini güncelle
4. [ ] Account association oluştur
5. [ ] Splash & OG image'lari ekle
6. [ ] Yeniden deploy
7. [ ] Warpcast'te test et
8. [ ] (Opsiyonel) Notifications ekle

---

**Deploy için hazırsın! Vercel hesabın var mı?** 🚀
