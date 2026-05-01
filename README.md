# gratify

An Electron application with React

## Features

### 1. Tasks
A task management system with priority levels, deadlines, recurring tasks, smart filtering and natural language quick-add.


#### Features

**Core**
- Create tasks with name, priority, deadline, recurrence and reminder
- Edit all task fields via the edit button on each task card
- Mark tasks complete with a checkbox — completed tasks show strikethrough
- Delete tasks
- Progress bar showing completion percentage

**Quick-add with natural language parsing**
- Type in plain English and the app fills in the fields automatically
- `"Call doctor tomorrow urgent"` → deadline: tomorrow, priority: urgent
- `"Submit report 25/12/2024 high"` → deadline: 25 Dec 2024, priority: high
- `"Meeting next Friday at 3pm remind me 1 hour before"` → deadline: next Friday 3pm, reminder: 60 mins
- `"Buy groceries remind me in 30 mins"` → reminder: 30 minutes from now
- Supports: today, tomorrow, next week, next [weekday], dd/MM/YYYY, and natural dates

**Recurring tasks**
- One-time, daily, weekly, monthly
- Custom frequency — every N days/weeks/months

**Reminders**
- Set via modal (preset or custom amount + unit)
- Set via quick-add (`"remind me 2 hours before"`, `"remind me in 45 mins"`)
- Checks every minute and fires a desktop notification when reminder time is reached
- Reminder shown as a badge on the task card

**Filters & Sort**
- Filter by status (all / active / completed)
- Filter by priority — multi-select (low, medium, high, urgent)
- Filter by frequency — multi-select (daily, weekly, monthly, custom)
- Sort by: newest, oldest, deadline (earliest/latest), priority (asc/desc)
- Active filter count badge — shows how many filters are on
- One-click clear all filters

## 🔔 Notifications (`useNotifications`)

A reusable hook that provides in-app toasts, desktop notifications and a sound alert. Used across Tasks, Calendar and any other feature that needs reminders.

### Usage
```js
const { notify } = useNotifications()

notify({
  title: 'Reminder: Buy groceries',
  message: 'Due in 30 minutes',
  color: 'pink',   // optional, defaults to pink
  sound: true      // optional, defaults to true
})
```

### What it does
- Requests desktop notification permission on mount
- Shows a Mantine toast (in-app) with `autoClose: 8000`
- Fires a native desktop notification via the Web Notifications API — works when the app is minimized
- Plays a short synthesized tone via the Web Audio API — no audio file needed

### How reminders work in Tasks
- A `setInterval` runs every 60 seconds
- For each incomplete task with a deadline and reminder set, it calculates minutes until the deadline
- When `minutesUntilDeadline` falls within the reminder window it calls `notify()`
- Reminder time is stored in minutes as a string on the task object

### Storage
Notification permission state is managed by the browser — no localStorage needed.


#### Data structure
```js
{
  id: number,                   // timestamp used as unique id
  text: string,                 // task name
  priority: 'low' | 'medium' | 'high' | 'urgent',
  deadline: Date | null,
  completed: boolean,
  recurring: boolean,
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom' | null,
  customInterval: number | null, // e.g. every 3 (days/weeks/months)
  customUnit: 'days' | 'weeks' | 'months' | null,
  reminder: string | null        // minutes before deadline as a string
}
```

### Storage
All tasks are saved to `localStorage` under the key `tasks` and persist across app restarts.



## 2. Notes

A note-taking system with rich text, color coding, tags, search, filtering and pinning.

### Features

**Core**
- Create notes with a title, body, and tags
- Edit and delete notes
- Pin important notes — pinned notes always appear first
- Color code notes with 13 Mantine color options
- Delete individual tags directly from the note card

**Search & Filter**
- Search notes by title or body (case insensitive)
- Filter by color — multi-select via color swatches
- Filter by tags — derived from all existing tags, shows 5 at a time with expand toggle
- Sort by: newest, oldest, recently edited, least recently edited, title A→Z, title Z→A
- Full note view via a side drawer on card click
- Markdown compatibility

**Note card**
- Shows title, body preview (2 lines), tags and color accent border
- Pin/unpin button visible on hover, always visible when pinned
- Edit and delete actions
- Click card to open full note in drawer

**Note drawer**
- Slides in from the right on card click
- Color accent bar at top matching note color
- Subtle tinted background matching note color
- Click title or body to edit inline — no modal needed
- Save/cancel buttons appear when editing
- Shows created and last edited timestamps
- Tag management with delete per tag

**Rich text (via react-markdown)**
- User writes in markdown syntax in the body
- Preview renders formatted output
- Supports: bold, italic, headings, bullet lists, numbered lists, inline code, code blocks, blockquotes, links, strikethrough


### Planned
- Rich text editor (TipTap) with: bold, italic, headings, bullet lists, numbered lists, inline code, code blocks, checkboxes, links

### Data structure
```js
{
  id: number,           // timestamp
  title: string,
  body: string,
  tags: string[],       // e.g. ['work', 'ideas']
  color: string,        // mantine color string e.g. 'pink', 'teal', 'violet'
  pinned: boolean,
  createdAt: number,    // timestamp
  updatedAt: number     // timestamp
}
```

### Storage
All notes saved to `localStorage` under the key `notes`.

<!-- // useNotes.js       ← CRUD logic
//     ↓
// NoteCard.jsx      ← single note card
//     ↓
// NoteModal.jsx     ← create/edit modal
//     ↓
// Notes/index.jsx   ← puts it all together
 -->
### Storage
All notes saved to `localStorage` under the key `notes` and persist across app restarts.



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
