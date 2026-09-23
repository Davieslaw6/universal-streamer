/**
 * Blocking inline script that applies the persisted theme before first paint.
 * Lives in <head>, runs before React hydrates, and therefore prevents FOUC.
 * Kept tiny and dependency-free on purpose.
 */
const THEME_SCRIPT = `
(function () {
  try {
    var KEY = 'us:theme';
    var raw = localStorage.getItem(KEY);
    var mode = 'system';
    if (raw) {
      try { mode = JSON.parse(raw); } catch (e) { mode = raw; }
    }
    if (mode !== 'light' && mode !== 'dark' && mode !== 'system') mode = 'system';
    var resolved = mode;
    if (mode === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    document.documentElement.setAttribute('data-theme', resolved);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
`;

export function ThemeScript() {
  return (
    <script
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }}
    />
  );
}
