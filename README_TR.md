# 💳 Taksit Takip Uygulaması

Kredi kartı taksitlerini görsel bir takvim üzerinde takip etmenizi sağlayan modern React + TypeScript uygulaması.

[🇬🇧 English](README.md) | [🇹🇷 Türkçe](#türkçe)

---

## 🌟 Özellikler

- 🎯 **Kredi Kartı Yönetimi** - Kredi kartlarınızı ekleyin, düzenleyin ve organize edin
- 📅 **Takvim Görünümü** - Tüm ödemeleri gösteren görsel aylık takvim
- 💰 **Taksit Takibi** - Detaylı bilgilerle taksit ödemelerini takip edin
- 🎨 **Renk Kodlama** - Her kartın kolay tanımlama için kendine özgü rengi
- 🔍 **Akıllı Filtreleme** - Belirli kartlara göre ödemeleri filtreleyin
- 💾 **Veri Kalıcılığı** - Tüm veriler tarayıcınızda yerel olarak saklanır
- 📱 **Duyarlı Tasarım** - Masaüstü ve mobilde mükemmel çalışır
- 🐳 **Docker Desteği** - Docker ile kolay dağıtım

## 🚀 Demo

![Taksit Takip Uygulaması Demo](https://via.placeholder.com/800x400?text=Demo+Ekran+Görüntüsü)

*Buraya uygulamanızın ekran görüntüsünü ekleyin*

## 🛠️ Teknoloji Yığını

- **Frontend**: React 18, TypeScript, Vite
- **Stil**: Tailwind CSS
- **Durum Yönetimi**: Zustand
- **Tarih İşlemleri**: date-fns
- **Test**: Vitest, fast-check (Property-based testing)
- **Dağıtım**: Docker, Nginx

## 📦 Kurulum

### Ön Koşullar

- Node.js 18+ 
- npm veya yarn

### Yerel Geliştirme

```bash
# Repository'yi klonlayın
git clone https://github.com/ekaraman89/installment-tracker.git
cd installment-tracker

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev

# Testleri çalıştırın
npm test

# Production için build alın
npm run build
```

### 🐳 Docker Dağıtımı

#### Geliştirme Ortamı

```bash
# Geliştirme container'ını başlatın
docker-compose up dev

# Uygulama http://localhost:5173 adresinde çalışacak
```

#### Production Build

```bash
# Production container'ını build edin ve başlatın
docker-compose up app

# Uygulama http://localhost:3000 adresinde çalışacak
```

## 📁 Proje Yapısı

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

## 🧪 Test Etme

```bash
# Tüm testleri çalıştır
npm test

# Watch modunda testleri çalıştır
npm run test:watch

# Coverage raporu oluştur
npm run test:coverage
```

## 🔧 Geliştirme

### Kod Kalitesi

```bash
# ESLint çalıştır
npm run lint

# Kodu formatla
npm run format
```

## 🤝 Katkıda Bulunma

Katkılar memnuniyetle karşılanır! Lütfen Pull Request göndermekten çekinmeyin.

1. Projeyi fork edin
2. Feature branch'inizi oluşturun (`git checkout -b feature/HarikaBirOzellik`)
3. Değişikliklerinizi commit edin (`git commit -m 'Harika bir özellik ekle'`)
4. Branch'inizi push edin (`git push origin feature/HarikaBirOzellik`)
5. Pull Request açın

## 📝 Lisans

Bu proje MIT Lisansı altında lisanslanmıştır - detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 🙏 Teşekkürler

- React ve TypeScript ile ❤️ ile geliştirildi
- Çeşitli emoji setlerinden ikonlar
- Daha iyi finansal takip araçlarına duyulan ihtiyaçtan ilham alındı

---

<div align="center">

**[⬆ Başa Dön](#-taksit-takip-uygulaması)**

❤️ ile [ekaraman89](https://github.com/ekaraman89) tarafından yapıldı

</div>