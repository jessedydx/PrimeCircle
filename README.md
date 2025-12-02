# PrimeCircle

**Farcaster Follow Quality Analytics**

PrimeCircle, Farcaster kullanıcılarının takip ettikleri kişilerin kalitesini Neynar skorlarına göre analiz eden bir miniapp'dir.

## Özellikler

- ✅ **Follow Quality Score**: 0-100 arası toplam kalite skoru
- 📊 **Tier Sistemi**: S, A, B, C, D tier sınıflandırması
- 📉 **Low Score List**: Düşük skorlu takipler
- 🔄 **One-way Follows**: Karşılıklı takip edilmeyenler
- ⭐ **Opportunities**: Yüksek skorlu fırsatlar

## Kurulum

```bash
# Dependencies yükle
npm install

# .env.local dosyası oluştur
cp .env.example .env.local

# Neynar API anahtarını ekle
# .env.local dosyasını aç ve NEYNAR_API_KEY'i gir
```

## Geliştirme

```bash
# Development server
npm run dev

# Build
npm run build

# Production start
npm start
```

## Neynar API Anahtarı

1. [dev.neynar.com](https://dev.neynar.com) adresine git
2. Ücretsiz hesap oluştur
3. API anahtarını al
4. `.env.local` dosyasına ekle

## Farcaster Miniapp

Bu uygulama Farcaster miniapp olarak çalışmak üzere tasarlandı:

1. Warpcast içinde açılır
2. Kullanıcı bilgileri SDK'dan alınır
3. Neynar API ile takip verileri çekilir

## Deploy (Vercel)

```bash
# Vercel CLI ile deploy
vercel

# Environment variables ekle:
# - NEYNAR_API_KEY
```

## Teknolojiler

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Farcaster Frame SDK
- Neynar API SDK
- React Query
