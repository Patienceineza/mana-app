// Minimal pub-sub so the notifications screen can tell the floating
// NotificationBell (which persists across navigation, so it can't rely on
// screen focus events) to refresh its unread count immediately after a
// read/read-all action, instead of waiting for the next poll tick.
type Listener = () => void;
const listeners = new Set<Listener>();

export function onNotificationsChanged(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function emitNotificationsChanged(): void {
  listeners.forEach((listener) => listener());
}
