# 💳 Installment Tracker

A modern React + TypeScript application for tracking credit card installments with a visual calendar interface.

[🇹🇷 Türkçe](README_TR.md) | [🇬🇧 English](#english)

---

## 🌟 Features

- 🎯 **Credit Card Management** - Add, edit, and organize your credit cards
- 📅 **Calendar View** - Visual monthly calendar showing all payments
- 💰 **Installment Tracking** - Track installment payments with detailed information
- 🎨 **Color Coding** - Each card has its unique color for easy identification
- 🔍 **Smart Filtering** - Filter payments by specific cards
- 💾 **Data Persistence** - All data saved locally in your browser
- 📱 **Responsive Design** - Works perfectly on desktop and mobile
- 🐳 **Docker Support** - Easy deployment with Docker

## 🚀 Demo

![Installment Tracker Demo](https://via.placeholder.com/800x400?text=Demo+Screenshot)

*Add a screenshot of your application here*

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Date Handling**: date-fns
- **Testing**: Vitest, fast-check (Property-based testing)
- **Deployment**: Docker, Nginx

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Local Development

```bash
# Clone the repository
git clone https://github.com/ekaraman89/installment-tracker.git
cd installment-tracker

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### 🐳 Docker Deployment

#### Development Environment

```bash
# Start development container
docker-compose up dev

# Application will be available at http://localhost:5173
```

#### Production Build

```bash
# Build and start production container
docker-compose up app

# Application will be available at http://localhost:3000
```

## 📁 Project Structure

```
src/
├── components/
│   ├── Calendar/       # Calendar components
│   ├── Cards/          # Card management components
│   ├── Installments/   # Installment management components
│   ├── Modals/         # Modal components
│   └── Dashboard/      # Dashboard components
├── store/              # Zustand store
├── utils/              # Utility functions
├── test/               # Test configuration
├── App.tsx             # Main application
└── main.tsx            # Entry point
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🔧 Development

### Code Quality

```bash
# Run ESLint
npm run lint

# Format code
npm run format
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ using React and TypeScript
- Icons from various emoji sets
- Inspired by the need for better financial tracking tools

---

<div align="center">

**[⬆ Back to Top](#-installment-tracker)**

Made with ❤️ by [ekaraman89](https://github.com/ekaraman89)

</div>