# 🚀 PrimeCircle - Quick Start Guide

## 📋 Önkoşullar

- Node.js 18+ kurulu olmalı
- npm veya yarn kurulu olmalı
- Neynar API key (ücretsiz: https://dev.neynar.com)

---

## ⚡ Hızlı Başlangıç (5 Dakika)

### 1. Bağımlılıklar Zaten Kuruldu ✅
```bash
# Projeye git
cd /Users/karatasailesi/Desktop/PrimeCircle

# Dependencies zaten kuruldu (570 packages)
# Kontrol için: ls node_modules
```

### 2. Environment Variables Ayarla

**Seçenek A: Production (Gerçek Neynar API)**
```bash
# .env.local oluştur
cp .env.example .env.local

# .env.local dosyasını düzenle:
# NEYNAR_API_KEY=your_actual_api_key_here
# NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Seçenek B: Development (Mock Data)**
```bash
# .env.local oluştur
echo "NEXT_PUBLIC_USE_MOCK_DATA=true" > .env.local
echo "NEXT_PUBLIC_APP_URL=http://localhost:3000" >> .env.local
# NEYNAR_API_KEY gerekli değil (mock data kullanılıyor)
```

### 3. Development Server Başlat
```bash
npm run dev
```

### 4. Tarayıcıda Aç
```
http://localhost:3000
```

**✅ Hazır!** Dashboard'u göreceksin.

---

## 🔑 Neynar API Key Nasıl Alınır?

1. https://dev.neynar.com adresine git
2. "Sign Up" ile hesap oluştur (email ile)
3. Dashboard'da "API Keys" bölümüne git
4. "Create New Key" butonuna tıkla
5. Key'i kopyala
6. `.env.local` dosyasına yapıştır

**Plan Seçimi:**
- **Free Tier:** Test için yeterli (sınırlı)
- **Starter ($9/month):** 1M credits/month - **Önerilen**
- **Growth:** Daha fazla kullanım için

---

## 🧪 Mock Data ile Test (Neynar Key Olmadan)

Eğer Neynar API key'in yoksa, mock data ile test edebilirsin:

```bash
# .env.local dosyasını oluştur
echo "NEXT_PUBLIC_USE_MOCK_DATA=true" > .env.local
echo "NEXT_PUBLIC_APP_URL=http://localhost:3000" >> .env.local

# Server'ı başlat
npm run dev
```

**Mock data ne içerir?**
- 8 örnek kullanıcı (farklı skorlarda)
- S, A, B, C, D tier örnekleri
- One-way follows simülasyonu
- Opportunities simülasyonu

**⚠️ Not:** Mock data ile sadece UI'ı test edebilirsin, gerçek Farcaster verisi değil.

---

## 📱 Farcaster Miniapp Olarak Test

### Local Test (Sınırlı)
Farcaster SDK local'de tam çalışmaz. Mock data kullan veya direkt deploy et.

### Production Test (Önerilen)
1. Vercel'e deploy et
2. Farcaster manifest oluştur
3. Warpcast'te aç

---

## 🛠️ Komutlar

```bash
# Development server
npm run dev

# Production build
npm run build

# Production server başlat
npm start

# Linting
npm run lint
```

---

## 📂 Proje Yapısı

```
├── app/                    # Pages (Next.js App Router)
│   ├── page.tsx           # Dashboard
│   ├── low-score/         # Low Score List
│   ├── one-way/           # One-way Follows
│   └── opportunities/     # Opportunities
├── components/            # React components
├── hooks/                 # Custom hooks
├── lib/                   # Utilities & API
├── types/                 # TypeScript types
└── config/                # Constants
```

---

## 🐛 Sorun Giderme

### "Module not found" hatası
```bash
# node_modules'u sil ve yeniden kur
rm -rf node_modules package-lock.json
npm install
```

### "NEYNAR_API_KEY is required" hatası
```bash
# .env.local dosyası var mı kontrol et
ls -la .env.local

# Yoksa oluştur
cp .env.example .env.local
# Sonra API key ekle
```

### Port 3000 kullanımda
```bash
# Farklı port kullan
PORT=3001 npm run dev
```

### Farcaster SDK hatası (local)
Mock data kullan veya direkt deploy et. SDK sadece Warpcast içinde çalışır.

---

## 🚀 Deploy (Vercel)

```bash
# Vercel CLI kur (eğer yoksa)
npm i -g vercel

# Deploy
vercel

# Environment variables ekle (Vercel dashboard'dan):
# - NEYNAR_API_KEY
# - NEXT_PUBLIC_APP_URL (production URL)
```

**Deploy sonrası:**
1. Vercel URL'ini al (örn: `primecircle.vercel.app`)
2. Farcaster manifest güncelle (`public/.well-known/farcaster.json`)
3. Warpcast'te test et

---

## 📊 Özellikler

- ✅ Dashboard (Quality Score, Stats, Tier Distribution)
- ✅ Low Score List (D/C tier filter)
- ✅ One-way Follows (Karşılıklı takip edilmeyenler)
- ✅ Opportunities (Yüksek skorlu fırsatlar)
- ✅ Dark theme, responsive design
- ✅ React Query caching (5 dakika)

---

## 🎯 Sonraki Adımlar

1. ✅ Local test (mock data veya Neynar API)
2. ⏳ Vercel'e deploy
3. ⏳ Farcaster manifest oluştur
4. ⏳ Warpcast'te test et
5. ⏳ Production'a al

---

**Yardıma ihtiyacın varsa:** 
- Neynar Docs: https://docs.neynar.com
- Farcaster Miniapps: https://miniapps.farcaster.xyz

**Başarılar! 🎉**
