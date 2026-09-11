# Daily — Personal Productivity OS

Daily is a responsive, browser-private productivity dashboard built with React and TypeScript. It combines daily tasks, an Eisenhower Matrix, calendar planning, long-term goals, productivity history, and custom tags in one application.

## Features

### Dashboard

- Today's tasks plus overdue work
- Quick task capture and a detailed task editor
- Complete, edit, and delete tasks
- Live completion progress
- Filter today's work by custom tags

### Task model

Every task supports a title, description, status, importance, urgency, priority, multiple tags, creation date, due date, completion date, task type, and an optional linked goal.

### Eisenhower Matrix

- Q1: important and urgent
- Q2: important and not urgent
- Q3: not important and urgent
- Q4: not important and not urgent
- Drag tasks between quadrants to update importance and urgency

### Calendar

- FullCalendar month and week views
- Tasks appear on their due dates
- Click a date to inspect or create tasks
- Click an event to edit the task
- Drag events to change due dates

### Goals

- Create long-term goals with descriptions and deadlines
- Pause, activate, complete, or delete goals
- Link tasks to goals as actionable milestones
- Automatic task count and completion percentage

### Productivity history

- Automatic daily snapshots of completed and unfinished tasks
- Completion rate and productivity score
- Select previous dates to review activity
- Seven-day summary
- Repeatedly postponed task detection

### Tags

- Create, edit, and delete color-coded tags
- Assign multiple tags to each task
- Filter Dashboard tasks by tag

## Technology

- React 18
- TypeScript
- Vite
- Tailwind CSS
- FullCalendar React 6
- Browser localStorage

FullCalendar is used through its official React, DayGrid, TimeGrid, and Interaction packages. No calendar implementation is maintained inside this project.

## Project structure

```text
src/
├── components/          Shared navigation, task, progress, and form UI
├── hooks/               Productivity state coordination
├── pages/               Dashboard, Matrix, Calendar, Goals, History, Settings
├── services/            Storage migration and history snapshot logic
├── types/               Task and productivity data contracts
├── utils/               Local date helpers
├── App.tsx              Application shell and cross-page actions
└── main.tsx             React entry point
```

## Run locally

Node.js 18 or newer is required.

```bash
npm install
npm run dev
```

Vite prints a local URL, normally `http://localhost:5173`.

## Quality checks

```bash
npm run lint
npm run build
```

Preview the production build with:

```bash
npm run preview
```

## Data storage and migration

Data is separated into four browser storage collections:

- `daily-checklist-tasks`
- `daily-checklist-goals`
- `daily-checklist-tags`
- `daily-checklist-history`

Tasks from the original `daily-checklist-tasks-v1` collection are migrated automatically the first time the upgraded app opens. Data stays in the current browser and is not uploaded to GitHub or any server.

The storage implementation is isolated in `src/services/storage.ts`, so a future database adapter can replace localStorage without rebuilding the page components.

## GitHub Pages

The repository includes `.github/workflows/deploy.yml`. Every push to `main` installs dependencies, builds the app, and deploys `dist` to GitHub Pages.

## Future improvements

- Optional accounts and encrypted cloud synchronization
- Recurring task rules and reminders
- Explicit milestone entities under goals
- History export and richer analytics charts
- Keyboard shortcuts and command palette
- Automated component and end-to-end tests
