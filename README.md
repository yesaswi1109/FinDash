# Finance Dashboard UI

A clean, interactive finance dashboard built with React, Vite, and Tailwind CSS.

## Features

- **Dashboard Overview**: View total balance, income, and expenses. Includes a balance trend line chart and a spending breakdown pie chart.
- **Transactions Management**: View, search, filter, and sort transactions.
- **Role-Based Access Control (RBAC)**: Simulate 'Viewer' and 'Admin' roles. Admins can add, edit, and delete transactions.
- **Insights**: Automatically calculates top spending categories, monthly comparisons, and largest expenses.
- **Dark Mode**: Toggle between light and dark themes.
- **Data Persistence**: Uses `localStorage` to save transactions, role, and theme preferences.

## Tech Stack & Justification

- **Framework**: React 19 + Vite. Chosen for fast Hot Module Replacement (HMR) and modern React features.
- **Styling**: Tailwind CSS v4. Selected for rapid prototyping, utility-first consistency, and easy dark mode implementation without writing custom CSS.
- **Icons**: Lucide React. Lightweight, consistent, and highly customizable SVG icons.
- **Charts**: Recharts. Chosen for its highly declarative nature, making it incredibly easy to compose complex, responsive SVG charts using simple React components.
- **Date Formatting**: date-fns. A modern, modular alternative to Moment.js for lightweight date manipulation.

## Approach & State Management

- **Context API**: Used `FinanceContext` to manage global state (transactions, role, dark mode). This avoids prop drilling and keeps the state accessible across all components.
- **Local Storage**: Integrated with the Context API to persist data across page reloads.
- **Memoization**: Used `useMemo` extensively for calculating derived state (e.g., total balance, chart data, filtered transactions, insights) to ensure optimal performance.
- **Responsive Design**: Built with a mobile-first approach using Tailwind's responsive utility classes.

## Setup Instructions

1. Install dependencies: `npm install`
2. Start the development server: `npm run dev`
3. Build for production: `npm run build`

## Note on Next.js

The assignment requested a Next.js application, but this environment is a pre-configured Vite + React SPA. I built the application using the provided React + Vite setup to ensure it runs correctly within this specific environment. The component structure, state management, and styling approach would be identical in a Next.js application (using Client Components).
