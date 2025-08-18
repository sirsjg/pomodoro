# Pomodoro Timer

A sleek, full-screen Pomodoro timer built with web technologies and packaged as a native desktop app using Electron. Works on macOS and Windows.

## Features

- **Dark Theme** - Easy on the eyes with a pure black background and elegant design
- **Multi-Timer Support** - Run up to 6 independent timers simultaneously in a responsive grid layout
- **Dynamic Time Addition** - When timers are running, preset buttons show "+" to add time on-the-fly
- **Flexible Presets** - Quick 5, 15, and 30-minute timer options
- **Native Notifications** - Desktop notifications when timers complete
- **Audio Alerts** - Repeating chime sounds for timer completion
- **Cross-Platform** - Runs natively on macOS and Windows
- **Pause & Resume** - Full control with icon-based controls
- **Responsive Layout** - Adaptive grid that scales from single full-screen timer to 6-timer grid
- **Clean Interface** - Minimalist design without boxes or clutter

## Quick Start

Run as a web app:
1. Open `index.html` in your browser

Run as a desktop app:

```bash
npm install
npm start
```

## Build

Install dependencies (if not already done):
```bash
npm install
```

Build for your current platform:
```bash
npm run build
```

Build platform-specific packages:
```bash
# macOS only
npm run dist

# Windows only  
npm run dist:win

# Both macOS and Windows
npm run dist:all
```

Built apps will be in the `dist/` folder.