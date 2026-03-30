# gratify

An Electron application with React

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

### New Folder Structure
```
src/
├── main/
│   └── index.ts          # Electron main process (tiny)
├── preload/
│   └── index.ts          # contextBridge IPC bridge
└── renderer/
    └── src/
        ├── App.tsx
        ├── components/
        │   ├── Layout/
        │   ├── Sidebar/
        │   └── shared/
        ├── features/
        │   ├── pomodoro/
        │   │   ├── PomodoroTimer.tsx
        │   │   ├── usePomodoroTimer.ts   ← all timer logic as a hook
        │   │   └── types.ts
        │   ├── tasks/
        │   │   ├── TaskList.tsx
        │   │   ├── TaskCard.tsx
        │   │   ├── useTaskManager.ts
        │   │   └── types.ts
        │   ├── notes/
        │   ├── calendar/
        │   └── stats/
        ├── store/
        │   └── index.ts  # Zustand store
        └── lib/
            └── storage.ts  # centralized localStorage wrapper

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
