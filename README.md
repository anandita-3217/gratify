# gratify

An Electron application with React



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
