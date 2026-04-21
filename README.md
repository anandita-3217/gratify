# gratify

An Electron application with React

## Features

### 1. Tasks
A task management system with priority levels, deadlines, and recurring tasks.

### Features
- Create tasks with a name, priority, deadline, and recurrence
- Quick-add from the input bar with natural language parsing
  - `"Buy groceries tomorrow urgent"` → creates a task with deadline tomorrow and urgent priority
- Edit existing tasks via the edit button
- Mark tasks as complete with a checkbox
- Delete tasks
- Progress bar showing completion percentage

### Data structure
```js
{
  id: number,          // timestamp
  text: string,        // task name
  priority: 'low' | 'medium' | 'high' | 'urgent',
  deadline: Date | null,
  completed: boolean,
  recurring: boolean,
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom' | null
}
```

### Storage
All tasks are saved to `localStorage` under the key `tasks` and persist across app restarts.
## Project Setup
### Full file structure for Gratify
```
src/renderer/src/
├── main.jsx                  ← React root, MantineProvider goes here
├── App.jsx                   ← Layout: Sidebar + page router
│
├── components/
│   ├── Sidebar.jsx           ← Nav sidebar (built in prev message)
│   └── shared/
│       ├── ConfirmModal.jsx  ← Reusable confirm dialog
│       └── ToastProvider.jsx ← Mantine notifications setup
│
├── pages/
│   ├── Pomodoro/
│   │   ├── index.jsx         ← Main timer UI
│   │   ├── TimerRing.jsx     ← Animated SVG progress ring
│   │   ├── SessionControls.jsx
│   │   └── usePomodoro.js    ← All timer logic as a hook
│   │
│   ├── Tasks/
│   │   ├── index.jsx         ← Task list + stats bar
│   │   ├── TaskItem.jsx      ← Single task row
│   │   ├── TaskModal.jsx     ← Create/edit modal
│   │   └── useTasks.js       ← Task CRUD + recurrence logic
│   │
│   ├── Notes/
│   │   ├── index.jsx         ← Note grid
│   │   ├── NoteCard.jsx      ← Individual note card
│   │   ├── NoteModal.jsx     ← Create/edit modal
│   │   └── useNotes.js       ← Notes logic
│   │
│   ├── Calendar/
│   │   ├── index.jsx         ← Calendar shell + view switcher
│   │   ├── MonthView.jsx
│   │   ├── WeekView.jsx
│   │   ├── DayView.jsx
│   │   └── useCalendar.js    ← Event CRUD logic
│   │
│   ├── Stats/
│   │   └── index.jsx         ← Charts pulling from localStorage
│   │
│   └── Settings/
│       └── index.jsx         ← Preferences form
│
└── hooks/
    ├── useLocalStorage.js    ← Persistent state (replaces all manual LS calls)
    └── useNotifications.js   ← Browser notification permission + dispatch


### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```
