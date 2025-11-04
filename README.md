# UK Tax Calculator (Frontend)

This is the React + TypeScript frontend for the UK Tax Calculator. It provides a user-friendly interface to calculate personal income tax based on UK tax bands and allowances.

> 📦 This repo includes only the frontend. The original .NET backend has been excluded.

---

## 🚀 Features

- Built with **React**, **TypeScript**, and **Vite**
- Configured as a **Progressive Web App** with offline support
- Interactive form for entering income details
- Real-time calculation of tax liabilities
- Support for:
  - Salary
  - Rental income
  - Pension income
  - Dividends
  - Untaxed savings interest
- Visual breakdown of tax bands and allowances
- Designed for UK tax rules (up to the 2025/26 tax year)
- In-memory calculator that always starts with clean defaults

---

## 📦 Getting Started

### Install dependencies

```bash
pnpm install
```

### Run the app

```bash
pnpm dev
```

### Build for production

```bash
pnpm build
pnpm preview
```

### Install as a PWA

- Open the app in Safari on iOS or any modern browser.
- Tap the share button and choose **Add to Home Screen** to install.

## 🚀 Deployment

The site is published at [https://john-bell.github.io/taxcalc/](https://john-bell.github.io/taxcalc/). Deep links remain functional thanks to the GitHub Pages 404 fallback and client-side redirect restoration.

