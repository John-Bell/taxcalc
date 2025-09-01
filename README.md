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
- Encrypted backups stored via IndexedDB with export/import to iCloud Drive

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

When the app first loads it requests persistent storage using `navigator.storage.persist()`. Use the **Export Backup**, **Import Backup**, and **Verify Backup** buttons in the UI to manage encrypted backups of your data.
