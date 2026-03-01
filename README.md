# Taksit Takip Uygulaması

Kredi kartı taksitlerini görsel bir takvim üzerinde takip etmenizi sağlayan React + TypeScript uygulaması.

## Özellikler

- 🎯 Kredi kartı yönetimi
- 📅 Aylık takvim görünümü
- 💰 Taksitli harcama takibi
- 🎨 Kart bazlı renk kodlama
- 🔍 Kart filtreleme
- 💾 LocalStorage ile veri kalıcılığı
- 🐳 Docker desteği

## Teknolojiler

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Zustand (State Management)
- date-fns (Tarih işlemleri)
- fast-check (Property-based testing)
- Vitest (Testing)

## Kurulum

### Yerel Geliştirme

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Testleri çalıştır
npm test

# Production build
npm run build
```

### Docker ile Çalıştırma

#### Geliştirme Ortamı

```bash
# Geliştirme container'ını başlat
docker-compose up dev

# Uygulama http://localhost:5173 adresinde çalışacak
```

#### Production Build

```bash
# Production container'ını build et ve başlat
docker-compose up app

# Uygulama http://localhost:3000 adresinde çalışacak
```

## Proje Yapısı

```
src/
├── components/
│   ├── Calendar/       # Takvim bileşenleri
│   ├── Cards/          # Kart yönetimi bileşenleri
│   ├── Installments/   # Taksit yönetimi bileşenleri
│   ├── Modals/         # Modal bileşenleri
│   └── Dashboard/      # Dashboard bileşenleri
├── store/              # Zustand store
├── utils/              # Yardımcı fonksiyonlar
├── test/               # Test yapılandırması
├── App.tsx             # Ana uygulama
└── main.tsx            # Giriş noktası
```

## Geliştirme

### Test Yazma

```bash
# Tüm testleri çalıştır
npm test

# Watch modunda testler
npm run test:watch

# Coverage raporu
npm run test:coverage
```

### Linting

```bash
# ESLint kontrolü
npm run lint
```

## Lisans

MIT
