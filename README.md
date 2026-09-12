# Daily — Personal Productivity OS

Daily is a responsive, browser-private productivity dashboard built with React and TypeScript. It combines daily tasks, an Eisenhower Matrix, calendar planning, long-term goals, productivity history, and custom tags in one application.

The interface is organized into five focused pages: Dashboard, Calendar, Goals, Tags, and History. Dashboard contains only the Eisenhower Matrix; there is no separate Today tasks panel.

## Features

### Dashboard

- Eisenhower Matrix as the primary command center
- Direct task input inside every quadrant
- Visible importance and urgency axes
- Quick capture in every quadrant plus a detailed task editor
- Goal and tag creation is centralized in the task Set window
- Complete, edit, and delete tasks

### Task model

Every task supports a title, description, status, importance, urgency, priority, multiple tags, creation date, due date, completion date, task type, and an optional linked goal.

Tasks can be one-time or repeat every day, week, or month within a selected start and end date. Recurring occurrences are generated on the calendar and can be completed independently.

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

- Display long-term goals with descriptions and deadlines on a dedicated page
- Create a goal while setting a task, then link that task immediately
- Link tasks to goals as actionable milestones
- Automatic task count and completion percentage
- A persistent manual count of how many times each long-term goal has been completed

### Productivity history

- Automatic daily snapshots of completed and unfinished tasks
- Completion rate and productivity score
- Select previous dates to review activity
- Seven-day summary
- Repeatedly postponed task detection

### Tags

- Create color-coded tags while setting a task
- Assign multiple tags to each task
- Review tag usage on a dedicated display page

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
├── pages/               Dashboard, Calendar, Goals, Tags, and History pages
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
