import { getTypedEntries } from './getTypedEntries';

export function setThemeToHTML(themeParams: Record<string, string>) {
  const root = document.documentElement;

  getTypedEntries(themeParams).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}
