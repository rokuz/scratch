/**
 * Platform detection utilities for cross-platform shortcut labels.
 * On macOS: ⌘, ⌥, ⇧
 * On Windows/Linux: Ctrl, Alt, Shift
 */

export const isMac =
  typeof navigator !== "undefined" &&
  /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);

export const isWindows =
  typeof navigator !== "undefined" && /Windows/.test(navigator.userAgent);

/**
 * Android/iOS builds have no folder picker, git, AI CLIs, or updater.
 * Those features are compiled out of the backend and hidden in the UI.
 */
export const isMobile =
  typeof navigator !== "undefined" &&
  /Android|iPhone|iPad|iPod/.test(navigator.userAgent);

/** Modifier key symbol/label */
export const mod = isMac ? "⌘" : "Ctrl";
export const alt = isMac ? "⌥" : "Alt";
export const shift = isMac ? "⇧" : "Shift";

/**
 * Build a shortcut label string.
 * e.g. shortcut("B") => "⌘B" on Mac, "Ctrl+B" on Windows
 */
export function shortcut(...parts: string[]): string {
  if (isMac) {
    return parts.join("");
  }
  return parts.join("+");
}
