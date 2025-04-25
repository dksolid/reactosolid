import { transformers } from 'compSystem/transformers';
import { themes } from 'const';
import { TypeAction } from 'models';
import { setThemeToHTML } from 'utils';

type TypeParams = { theme: keyof typeof themes };

export const setTheme: TypeAction<TypeParams> = ({ store }, { theme }) => {
  if (!store.ui.themesList.includes(theme)) return Promise.resolve();

  const themeObject = themes[theme];

  transformers.batch(() => {
    store.ui.currentTheme = theme;
    store.ui.themeParams = themeObject;
  });

  if (IS_CLIENT) {
    // https://stackoverflow.com/questions/65940522/how-do-i-switch-to-chromes-dark-scrollbar-like-github-does

    document.documentElement.style.display = 'none';

    const extendedThemeObject = Object.assign(
      // eslint-disable-next-line @typescript-eslint/naming-convention
      { 'color-scheme': theme.includes('dark') ? 'dark' : 'light' },
      themeObject
    );

    // eslint-disable-next-line no-unused-expressions,@typescript-eslint/no-unused-expressions
    document.body.clientWidth;
    document.documentElement.style.display = '';

    setThemeToHTML(extendedThemeObject);
  }

  return Promise.resolve();
};
