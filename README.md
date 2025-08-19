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

## Releases

This project uses [semantic-release](https://github.com/semantic-release/semantic-release) for automated releases. 

### Commit Message Format

To trigger releases, use conventional commit messages:

- `feat: add new feature` - triggers a minor release
- `fix: fix a bug` - triggers a patch release  
- `feat!: breaking change` or `BREAKING CHANGE:` in commit body - triggers a major release

### Release Process

1. Push commits to the `main` branch
2. GitHub Actions automatically builds for macOS and Windows
3. If semantic-release detects releasable changes, it creates a new release with:
   - Automated version bump
   - Generated changelog
   - macOS .dmg installer
   - Windows .exe installer
   - Portable .zip archives

Releases are published to GitHub Releases with all platform binaries attached.