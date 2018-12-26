/* eslint-disable no-underscore-dangle */
import { grey, lightGreen } from '@material-ui/core/colors';
import { createGenerateClassName, createMuiTheme, Theme } from '@material-ui/core/styles';
import { GenerateClassName, SheetsRegistry } from 'jss';

export const logoColours = {
  primary: {
    // contrastText: '#383838',
    dark: '#00414b',
    light: '#4c9aa6',
    main: '#0f6c77'
  },
  // tslint:disable-next-line:object-literal-sort-keys
  darkBlue: {
    dark: '#002756',
    light: '#527ab3',
    main: '#1b4e83'
  },
  lightBlue: {
    dark: '#3994bb',
    light: '#a6f8ff',
    main: '#71c5ee'
  },
  orange: {
    dark: '#b56932',
    light: '#ffc98c',
    main: '#eb985e'
  },
  pink: {
    dark: '#a5296e',
    light: '#ff8fcd',
    main: 'da5d9c'
  }
};

// A theme with custom primary and secondary color.
// It's optional.
const theme = createMuiTheme({
  palette: {
    primary: logoColours.primary,
    secondary: {
      contrastText: grey[900],
      dark: lightGreen[700],
      light: lightGreen[300],
      main: lightGreen[500]
    }
  },
  typography: {
    useNextVariants: true
  }
});
export interface IMuiContext {
  theme: Theme;
  sheetsManager: Map<any, any>;
  sheetsRegistry: SheetsRegistry;
  generateClassName: GenerateClassName<any>;
}

function createPageContext(): IMuiContext {
  return {
    theme,
    // This is needed in order to deduplicate the injection of CSS in the page.
    // tslint:disable-next-line:object-literal-sort-keys
    sheetsManager: new Map(),
    // This is needed in order to inject the critical CSS.
    sheetsRegistry: new SheetsRegistry(),
    // The standard class name generator.
    generateClassName: createGenerateClassName()
  };
}

export default function getPageContext(): IMuiContext {
  // Make sure to create a new context for every server-side request so that data
  // isn't shared between connections (which would be bad).
  if (!(process as any).browser) {
    return createPageContext();
  }

  // Reuse context on the client-side.
  if (!(global as any).__INIT_MATERIAL_UI__) {
    (global as any).__INIT_MATERIAL_UI__ = createPageContext();
  }

  return (global as any).__INIT_MATERIAL_UI__;
}
