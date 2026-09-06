# Scratch - Development Guide

## Project Overview

Scratch is a cross-platform markdown note-taking app for macOS, Windows, and Linux, built with Tauri v2 (Rust backend) + React/TypeScript/Tailwind (frontend) + TipTap (WYSIWYG editor) + Tantivy (full-text search).

## Commands

```bash
npm run dev          # Start Vite dev server only
npm run build        # Build frontend (tsc + vite)
npm run tauri dev    # Run full app in development mode
npm run tauri build  # Build production app
npm run tauri android dev    # Run on an Android device/emulator (needs ANDROID_HOME, NDK_HOME, JAVA_HOME with JDK 17-21)
npm run tauri android build  # Build Android APK/AAB
```

## CI

Runs on every push to `main` and on PRs. Validates frontend build (`tsc` + Vite) and Rust compilation (`cargo check` + `cargo clippy`) on an Ubuntu runner.

## Key Patterns

- All backend operations go through Tauri commands in `src-tauri/src/lib.rs`. Frontend calls them via `invoke()` from `@tauri-apps/api/core`.
- `NotesContext` uses a dual context pattern (data/actions separated) for performance.
- Settings live in two places: app config at `{APP_DATA}/config.json`, per-folder settings at `{NOTES_FOLDER}/.scratch/settings.json`.
- Tauri v2 permissions go in `src-tauri/capabilities/default.json`; permissions for desktop-only plugins (updater) go in `capabilities/desktop.json`.
- Android: desktop-only backend features (git, AI CLIs, terminal CLI, folder dialog, preview windows, updater, single-instance) are gated with `#[cfg(desktop)]`; the frontend hides them via `isMobile` from `src/lib/platform.ts`. On mobile the notes folder defaults to the app's Documents dir. The Android Studio project is committed at `src-tauri/gen/android`; `MainActivity.kt` handles system-bar/keyboard insets and back navigation.

## Coding Conventions

- Clean, minimal code with low technical debt
- Proper React patterns (contexts, hooks, memoization)
- Type-safe with TypeScript throughout
- No commented-out code or TODOs in production code
- Use `React.memo` for expensive list-item components
- Use `useCallback`/`useMemo` for performance-critical paths
- Debounce user-triggered operations (auto-save 300ms, search 150ms, file watcher 500ms, git status 1000ms)
- All operations should be non-blocking (async)
- Error handling with user-friendly messages

## Releasing

1. Bump version in `package.json` and `src-tauri/tauri.conf.json`
2. Commit to `main`, then tag and push: `git tag v0.5.0 && git push origin v0.5.0`
3. The release workflow builds all platforms and creates a draft GitHub release
4. Update the description in `latest.json` from GitHub after the action finishes
5. Review, edit notes, and publish
