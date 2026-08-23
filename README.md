# Daily Checklist

A clean, responsive personal checklist for managing everyday tasks. Tasks are stored locally in the browser, so the app stays private and remembers your list after a refresh.

## Features

- Add, edit, delete, and complete tasks
- Separate active and completed task sections
- High, medium, and low priority labels
- Live completion count and progress bar
- Current date in the header
- Persistent browser storage
- Responsive desktop and mobile layout
- Keyboard-friendly forms and accessible controls

## Tech stack

- **React 18** for the component UI and application state
- **TypeScript** for type-safe task data and component contracts
- **Tailwind CSS** for responsive styling and the visual system
- **Vite** for development and production builds
- **localStorage** for zero-setup browser persistence

## Project structure

```text
daily-checklist/
├── src/
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Icons.tsx
│   │   ├── ProgressCard.tsx
│   │   ├── TaskForm.tsx
│   │   ├── TaskItem.tsx
│   │   └── TaskSection.tsx
│   ├── hooks/
│   │   └── useLocalStorage.ts
│   ├── types/
│   │   └── task.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Run locally

You need Node.js 18 or newer.

```bash
npm install
npm run dev
```

Vite will print the local URL, usually `http://localhost:5173`.

## Quality checks

```bash
npm run lint
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Publish with GitHub Pages

This repository includes an automatic GitHub Pages workflow. After pushing the
project to the `main` branch, open **Settings → Pages** in GitHub and set
**Source** to **GitHub Actions**. The workflow will build and publish the site.

## Data persistence

Tasks are serialized to the `daily-checklist-tasks-v1` key in browser `localStorage`. Clearing site data for the app's origin will remove the saved tasks. No data is sent to a server.
