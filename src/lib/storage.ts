/**
 * sessionStorage can throw on mere access (browsers with "block all
 * cookies", sandboxed webviews). The invitation must never depend on
 * storage succeeding — these helpers swallow every failure.
 */

export function safeSessionGet(key: string): string | null {
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

export function safeSessionSet(key: string, value: string): void {
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    // Storage unavailable — the guest simply replays the intro next time
  }
}

export function safeSessionRemove(key: string): void {
  try {
    window.sessionStorage.removeItem(key);
  } catch {
    // Nothing to forget
  }
}
